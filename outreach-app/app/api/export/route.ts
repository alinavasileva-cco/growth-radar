import { NextResponse } from "next/server";
import Papa from "papaparse";
import { db } from "@/lib/db";
import { apiError } from "@/lib/http";
import { requireUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await requireUser();
    const companies = await db.company.findMany({ where: { userId: user.id }, orderBy: { name: "asc" } });
    const csv = Papa.unparse(companies.map((company) => ({
      "Lead ID": company.leadId,
      "Компания": company.name,
      "Юридическое лицо": company.legalName,
      "ИНН": company.inn,
      "Отрасль": company.industry,
      "Контакт": company.contactName,
      "Должность": company.contactPosition,
      "Email": company.email,
      "Телефон": company.phone,
      "Сигнал": company.signalSummary,
      "Гипотеза": company.growthPoints,
      "Статус": company.status,
      "Источник": company.sourceUrl
    })));
    return new NextResponse(`\uFEFF${csv}`, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="growth-radar-outreach.csv"'
      }
    });
  } catch (error) {
    return apiError(error);
  }
}
