import { NextResponse } from "next/server";
import { CompanyStatus } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { apiError, assertSameOrigin } from "@/lib/http";
import { requireUser } from "@/lib/session";

const patchSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  legalName: z.string().max(300).nullable().optional(),
  inn: z.string().max(20).nullable().optional(),
  ogrn: z.string().max(30).nullable().optional(),
  website: z.string().max(500).nullable().optional(),
  industry: z.string().max(300).nullable().optional(),
  region: z.string().max(200).nullable().optional(),
  city: z.string().max(200).nullable().optional(),
  scale: z.string().max(1000).nullable().optional(),
  contactName: z.string().max(200).nullable().optional(),
  contactPosition: z.string().max(300).nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().max(100).nullable().optional(),
  telegram: z.string().max(300).nullable().optional(),
  hhUrl: z.string().max(1000).nullable().optional(),
  contactForm: z.string().max(1000).nullable().optional(),
  signalLevel: z.string().max(30).nullable().optional(),
  signalSummary: z.string().max(3000).nullable().optional(),
  businessTasks: z.string().max(3000).nullable().optional(),
  growthPoints: z.string().max(3000).nullable().optional(),
  relevance: z.string().max(3000).nullable().optional(),
  relevantExperience: z.string().max(3000).nullable().optional(),
  sourceUrl: z.string().max(1000).nullable().optional(),
  notes: z.string().max(5000).nullable().optional(),
  status: z.nativeEnum(CompanyStatus).optional()
});

type Context = { params: Promise<{ id: string }> };

export async function GET(_: Request, context: Context) {
  try {
    const user = await requireUser();
    const { id } = await context.params;
    const company = await db.company.findFirst({ where: { id, userId: user.id }, include: { drafts: { orderBy: { createdAt: "desc" } } } });
    if (!company) throw new Error("Компания не найдена");
    return NextResponse.json(company);
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await context.params;
    const input = patchSchema.parse(await request.json());
    const current = await db.company.findFirst({ where: { id, userId: user.id } });
    if (!current) throw new Error("Компания не найдена");
    const company = await db.company.update({
      where: { id },
      data: { ...input, email: input.email === undefined ? undefined : input.email?.toLowerCase() ?? null }
    });
    return NextResponse.json(company);
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: Request, context: Context) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await context.params;
    const current = await db.company.findFirst({ where: { id, userId: user.id } });
    if (!current) throw new Error("Компания не найдена");
    await db.company.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
