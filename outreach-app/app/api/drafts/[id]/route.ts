import { NextResponse } from "next/server";
import { z } from "zod";
import { DraftStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { apiError, assertSameOrigin } from "@/lib/http";
import { requireUser } from "@/lib/session";

const schema = z.object({
  subject: z.string().min(2).max(300),
  body: z.string().min(50).max(10000)
});

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, context: Context) {
  try {
    const user = await requireUser();
    const { id } = await context.params;
    const draft = await db.emailDraft.findFirst({
      where: { id, userId: user.id },
      include: { company: true, schedules: { orderBy: { createdAt: "desc" } } }
    });
    if (!draft) throw new Error("Черновик не найден");
    return NextResponse.json(draft);
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await context.params;
    const input = schema.parse(await request.json());
    const current = await db.emailDraft.findFirst({ where: { id, userId: user.id } });
    if (!current) throw new Error("Черновик не найден");
    if (current.status === DraftStatus.SENT) throw new Error("Отправленное письмо нельзя изменить");
    const draft = await db.emailDraft.update({
      where: { id },
      data: { ...input, status: DraftStatus.REVIEW, approvedAt: null }
    });
    await db.company.update({ where: { id: current.companyId }, data: { status: "REVIEW" } });
    return NextResponse.json(draft);
  } catch (error) {
    return apiError(error);
  }
}
