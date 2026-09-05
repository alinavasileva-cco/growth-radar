import { CompanyStatus } from "@prisma/client";
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

function normalizedName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[«»"'`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function importedStatus(rawStatus: string | null, email: string | null): CompanyStatus {
  const status = rawStatus?.trim().toUpperCase() ?? "";
  if (status.includes("ДОПРОВЕР")) return CompanyStatus.RESEARCH_REQUIRED;
  if (status === "RESERVE" || status.includes("РЕЗЕРВ")) return CompanyStatus.EXCLUDED;
  return email ? CompanyStatus.READY : CompanyStatus.NO_CONTACT;
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

    const existing = await db.company.findMany({ where: { userId: user.id } });
    const byLeadId = new Map(existing.filter((item) => item.leadId).map((item) => [item.leadId!, item]));
    const byInn = new Map(existing.filter((item) => item.inn).map((item) => [item.inn!, item]));
    const byEmail = new Map(existing.filter((item) => item.email).map((item) => [item.email!.toLowerCase(), item]));
    const byName = new Map(existing.map((item) => [normalizedName(item.name), item]));

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const row of rows) {
      const name = value(row, "Название компании", "Компания", "Brand", "Company", "name");
      if (!name) {
        skipped += 1;
        continue;
      }

      const leadId = value(row, "Lead ID", "LeadID", "leadId");
      const inn = value(row, "ИНН", "INN");
      const email = value(row, "Email", "Primary Email", "email")?.toLowerCase() ?? null;
      const quickStatus = value(row, "Final Quick Status", "Quick Status", "Статус");

      const duplicate =
        (leadId ? byLeadId.get(leadId) : undefined) ??
        (inn ? byInn.get(inn) : undefined) ??
        (email ? byEmail.get(email) : undefined) ??
        byName.get(normalizedName(name));

      const data = {
        leadId,
        name,
        legalName: value(row, "Юридическое лицо", "Legal Name"),
        inn,
        ogrn: value(row, "ОГРН", "OGRN", "OGRN/OGRNIP"),
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
        status: importedStatus(quickStatus, email),
        notes: quickStatus ? `Архивный статус: ${quickStatus}` : null
      };

      if (duplicate) {
        await db.company.update({
          where: { id: duplicate.id },
          data: {
            leadId: duplicate.leadId ?? data.leadId,
            name: data.name,
            legalName: data.legalName ?? duplicate.legalName,
            inn: data.inn ?? duplicate.inn,
            ogrn: data.ogrn ?? duplicate.ogrn,
            website: data.website ?? duplicate.website,
            industry: data.industry ?? duplicate.industry,
            region: data.region ?? duplicate.region,
            contactName: data.contactName ?? duplicate.contactName,
            contactPosition: data.contactPosition ?? duplicate.contactPosition,
            email: data.email ?? duplicate.email,
            phone: data.phone ?? duplicate.phone,
            signalSummary: data.signalSummary ?? duplicate.signalSummary,
            growthPoints: data.growthPoints ?? duplicate.growthPoints,
            sourceUrl: data.sourceUrl ?? duplicate.sourceUrl,
            status: duplicate.email && data.status === CompanyStatus.NO_CONTACT ? duplicate.status : data.status,
            notes: data.notes ?? duplicate.notes
          }
        });
        updated += 1;
        continue;
      }

      const company = await db.company.create({ data: { userId: user.id, ...data } });
      if (company.leadId) byLeadId.set(company.leadId, company);
      if (company.inn) byInn.set(company.inn, company);
      if (company.email) byEmail.set(company.email.toLowerCase(), company);
      byName.set(normalizedName(company.name), company);
      created += 1;
    }

    await db.activityLog.create({
      data: {
        userId: user.id,
        action: "COMPANIES_IMPORTED",
        entity: "Company",
        details: { created, updated, skipped, total: rows.length }
      }
    });

    return NextResponse.json({ created, updated, skipped, total: rows.length });
  } catch (error) {
    return apiError(error);
  }
}
