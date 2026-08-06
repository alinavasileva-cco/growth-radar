import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiError, assertSameOrigin } from "@/lib/http";
import { requireUser } from "@/lib/session";

type Context = { params: Promise<{ id: string }> };
const schema = z.object({ scheduledAt: z.string().datetime() });

export async function POST(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await context.params;
    const { scheduledAt } = schema.parse(await request.json());
    const date = new Date(scheduledAt);
    if (date.getTime() <= Date.now()) throw new Error("Время отправки должно быть в будущем");
    const draft = await db.emailDraft.findFirst({ where: { id, userId: user.id } });
    if (!draft) throw new Error("Черновик не найден");
    if (draft.status !== "APPROVED") throw new Error("Сначала одобрите письмо");
    const scheduled = await db.$transaction(async (tx) => {
      const item = await tx.scheduledEmail.create({ data: { draftId: id, scheduledAt: date } });
      await tx.emailDraft.update({ where: { id }, data: { status: "SCHEDULED" } });
      await tx.company.update({ where: { id: draft.companyId }, data: { status: "SCHEDULED" } });
      return item;
    });
    return NextResponse.json(scheduled);
  } catch (error) {
    return apiError(error);
  }
}
