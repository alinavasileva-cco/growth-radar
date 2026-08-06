import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CompanyStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { apiError, assertSameOrigin } from "@/lib/http";
import { requireUser } from "@/lib/session";

const companySchema = z.object({
  name: z.string().min(2).max(200),
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

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    const q = request.nextUrl.searchParams.get("q")?.trim();
    const statusRaw = request.nextUrl.searchParams.get("status");
    const status = statusRaw && Object.values(CompanyStatus).includes(statusRaw as CompanyStatus)
      ? statusRaw as CompanyStatus
      : undefined;
    const companies = await db.company.findMany({
      where: {
        userId: user.id,
        status,
        ...(q ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { legalName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { inn: { contains: q } }
          ]
        } : {})
      },
      orderBy: [{ status: "asc" }, { updatedAt: "desc" }]
    });
    return NextResponse.json(companies);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const input = companySchema.parse(await request.json());
    const company = await db.company.create({
      data: {
        userId: user.id,
        ...input,
        email: input.email?.toLowerCase() ?? null,
        status: input.status ?? (input.email ? CompanyStatus.READY : CompanyStatus.NO_CONTACT)
      }
    });
    await db.activityLog.create({ data: { userId: user.id, action: "COMPANY_CREATED", entity: "Company", entityId: company.id } });
    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
