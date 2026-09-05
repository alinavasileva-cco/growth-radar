import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendApprovedDraft } from "@/lib/send";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const due = await db.scheduledEmail.findMany({
    where: { status: "PENDING", scheduledAt: { lte: new Date() } },
    include: { draft: { include: { user: { include: { settings: true } } } } },
    orderBy: { scheduledAt: "asc" },
    take: 20
  });

  const results = [];
  const handledUsers = new Set<string>();
  for (const item of due) {
    const userId = item.draft.userId;
    if (handledUsers.has(userId) || item.draft.user.settings?.queuePaused) continue;
    handledUsers.add(userId);
    await db.scheduledEmail.update({ where: { id: item.id }, data: { status: "PROCESSING", attempts: { increment: 1 } } });
    try {
      await sendApprovedDraft(item.draftId, userId);
      await db.scheduledEmail.update({ where: { id: item.id }, data: { status: "SENT" } });
      results.push({ id: item.id, status: "SENT" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Неизвестная ошибка";
      await db.$transaction([
        db.scheduledEmail.update({ where: { id: item.id }, data: { status: "ERROR", lastError: message } }),
        db.emailDraft.update({ where: { id: item.draftId }, data: { status: "ERROR", lastError: message } }),
        db.applicationSettings.update({ where: { userId }, data: { queuePaused: true } })
      ]);
      results.push({ id: item.id, status: "ERROR", error: message });
    }
  }
  return NextResponse.json({ processed: results.length, results });
}
