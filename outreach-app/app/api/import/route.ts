import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { db } from "@/lib/db";
import { apiError, assertSameOrigin } from "@/lib/http";
import { requireUser } from "@/lib/session";

function value(row: Record<string, unknown>, ...keys: string[]): string | null {
  for (const key of keys) {
    const current = row[key];
    if (current !== undefined && current !== null && String(current).trim()) return String(current).trim();
  }
  return null;
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    const user = await requireUser();
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new Error("Файл не выбран");
    if (file.size > 10 * 1024 * 1024) throw new Error("Файл должен быть не больше 10 МБ");
    const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) throw new Error("В файле нет листов");
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[sheetName], { defval: "" });

    let created = 0;
    let skipped = 0;
    for (const row of rows) {
      const name = value(row, "Название компании", "Компания", "Brand", "Company", "name");
      const email = value(row, "Email", "Primary Email", "email")?.toLowerCase() ?? null;
      if (!name) { skipped += 1; continue; }
      const duplicate = email ? await db.company.findFirst({ where: { userId: user.id, email } }) : null;
      if (duplicate) { skipped += 1; continue; }
      await db.company.create({
        data: {
          userId: user.id,
          name,
          legalName: value(row, "Юридическое лицо", "Legal Name"),
          inn: value(row, "ИНН", "INN"),
          website: value(row, "Сайт", "Website"),
          industry: value(row, "Отрасль", "Segment", "Industry"),
          region: value(row, "Регион", "Region"),
          contactName: value(row, "Контактное лицо", "LPR", "Person Name"),
          contactPosition: value(row, "Должность", "LPR Role", "Person Role"),
          email,
          phone: value(row, "Телефон", "Primary Phone"),
          signalSummary: value(row, "Сигнал", "Signal Summary", "Актуальная задача"),
          growthPoints: value(row, "Гипотеза", "Consulting Hypothesis", "Точка роста"),
          sourceUrl: value(row, "Источник", "Source URL"),
          status: email ? "READY" : "NO_CONTACT"
        }
      });
      created += 1;
    }
    await db.activityLog.create({ data: { userId: user.id, action: "COMPANIES_IMPORTED", entity: "Company", details: { created, skipped } } });
    return NextResponse.json({ created, skipped, total: rows.length });
  } catch (error) {
    return apiError(error);
  }
}
