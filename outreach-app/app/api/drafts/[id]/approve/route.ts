import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiError, assertSameOrigin } from "@/lib/http";
import { requireUser } from "@/lib/session";
import { hasUnfilledVariables } from "@/lib/templates";

type Context = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await context.params;
    const draft = await db.emailDraft.findFirst({ where: { id, userId: user.id }, include: { company: true } });
    if (!draft) throw new Error("Черновик не найден");
    if (!draft.company.email) throw new Error("У компании нет email");
    if (hasUnfilledVariables(draft.subject) || hasUnfilledVariables(draft.body)) throw new Error("В письме остались незаполненные переменные");
    const [attachment, settings] = await Promise.all([
      db.attachment.findFirst({ where: { userId: user.id, isDefault: true } }),
      db.applicationSettings.findUnique({ where: { userId: user.id } })
    ]);
    if (!attachment) throw new Error("Сначала загрузите PDF-презентацию");
    if (!settings?.websiteUrl) throw new Error("Сначала укажите ссылку на сайт");
    const updated = await db.emailDraft.update({ where: { id }, data: { status: "APPROVED", approvedAt: new Date() } });
    await db.company.update({ where: { id: draft.companyId }, data: { status: "APPROVED" } });
    await db.activityLog.create({ data: { userId: user.id, action: "DRAFT_APPROVED", entity: "EmailDraft", entityId: id } });
    return NextResponse.json(updated);
  } catch (error) {
    return apiError(error);
  }
}
