import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { CompanyStatus, DraftStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { apiError, assertSameOrigin } from "@/lib/http";
import { requireUser } from "@/lib/session";
import { generatePersonalizedDraft } from "@/lib/templates";

const generateSchema = z.object({ companyIds: z.array(z.string()).min(1).max(100) });

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser();
    const statusRaw = request.nextUrl.searchParams.get("status");
    const status = statusRaw && Object.values(DraftStatus).includes(statusRaw as DraftStatus)
      ? statusRaw as DraftStatus
      : undefined;
    const drafts = await db.emailDraft.findMany({
      where: { userId: user.id, status },
      include: { company: true, schedules: { where: { status: "PENDING" }, orderBy: { scheduledAt: "asc" }, take: 1 } },
      orderBy: { updatedAt: "desc" }
    });
    return NextResponse.json(drafts);
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const { companyIds } = generateSchema.parse(await request.json());
    const [companies, settings] = await Promise.all([
      db.company.findMany({ where: { userId: user.id, id: { in: companyIds } } }),
      db.applicationSettings.findUnique({ where: { userId: user.id } })
    ]);
    const result = [];
    for (const company of companies) {
      const generated = generatePersonalizedDraft(company, settings);
      const draft = await db.emailDraft.create({
        data: { userId: user.id, companyId: company.id, subject: generated.subject, body: generated.body }
      });
      await db.company.update({ where: { id: company.id }, data: { status: CompanyStatus.REVIEW } });
      result.push(draft);
    }
    await db.activityLog.create({ data: { userId: user.id, action: "DRAFTS_GENERATED", entity: "EmailDraft", details: { count: result.length } } });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
