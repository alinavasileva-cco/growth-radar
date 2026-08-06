import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { apiError } from "@/lib/http";
import { requireUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await requireUser();
    const [companies, noEmail, review, approved, scheduled, sent, replied, errors, activities] = await Promise.all([
      db.company.count({ where: { userId: user.id } }),
      db.company.count({ where: { userId: user.id, email: null } }),
      db.emailDraft.count({ where: { userId: user.id, status: "REVIEW" } }),
      db.emailDraft.count({ where: { userId: user.id, status: "APPROVED" } }),
      db.scheduledEmail.count({ where: { draft: { userId: user.id }, status: "PENDING" } }),
      db.sentEmail.count({ where: { userId: user.id } }),
      db.company.count({ where: { userId: user.id, status: "REPLIED" } }),
      db.emailDraft.count({ where: { userId: user.id, status: "ERROR" } }),
      db.activityLog.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 10 })
    ]);
    return NextResponse.json({ companies, noEmail, review, approved, scheduled, sent, replied, errors, activities });
  } catch (error) {
    return apiError(error);
  }
}
