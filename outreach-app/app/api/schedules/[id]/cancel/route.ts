import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiError, assertSameOrigin } from "@/lib/http";
import { requireUser } from "@/lib/session";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await context.params;
    const scheduled = await db.scheduledEmail.findFirst({ where: { id, draft: { userId: user.id } }, include: { draft: true } });
    if (!scheduled) throw new Error("Запланированное письмо не найдено");
    if (scheduled.status !== "PENDING") throw new Error("Эту отправку уже нельзя отменить");
    await db.$transaction([
      db.scheduledEmail.update({ where: { id }, data: { status: "CANCELLED" } }),
      db.emailDraft.update({ where: { id: scheduled.draftId }, data: { status: "APPROVED" } }),
      db.company.update({ where: { id: scheduled.draft.companyId }, data: { status: "APPROVED" } })
    ]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
