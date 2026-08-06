import Papa from "papaparse";
import { CompanyStatus } from "@prisma/client";
import { db } from "@/lib/db";

type RadarRow = Record<string, string>;

const DEFAULT_GROWTH_RADAR_CSV_URL =
  "https://raw.githubusercontent.com/alinavasileva-cco/growth-radar/main/data/campaigns/new_5000/contactable_master.csv";

const terminalStatuses = new Set<CompanyStatus>([
  CompanyStatus.SENT,
  CompanyStatus.REPLIED,
  CompanyStatus.DECLINED,
  CompanyStatus.EXCLUDED
]);

function clean(value?: string): string | null {
  const result = value?.trim();
  return result ? result : null;
}

function parseDate(value?: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function syncGrowthRadar(userId: string) {
  const url = process.env.GROWTH_RADAR_CSV_URL || DEFAULT_GROWTH_RADAR_CSV_URL;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Не удалось прочитать Growth Radar: ${response.status}`);
  const csv = await response.text();
  const parsed = Papa.parse<RadarRow>(csv, { header: true, skipEmptyLines: true });
  if (parsed.errors.length) throw new Error(`Ошибка CSV: ${parsed.errors[0]?.message}`);

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const row of parsed.data) {
    const leadId = clean(row["Lead ID"]);
    const name = clean(row.Brand);
    if (!leadId || !name) {
      skipped += 1;
      continue;
    }

    const data = {
      campaignId: clean(row["Campaign ID"]),
      name,
      legalName: clean(row["Legal Name"]),
      inn: clean(row.INN),
      ogrn: clean(row["OGRN/OGRNIP"]),
      industry: clean(row.Segment),
      region: clean(row.Region),
      scale: clean(row["Revenue/Scale"]),
      contactName: clean(row.LPR) || clean(row.CEO),
      contactPosition: clean(row["LPR Role"]),
      email: clean(row["Primary Email"])?.toLowerCase() ?? null,
      phone: clean(row["Primary Phone"]),
      telegram: clean(row.Telegram),
      hhUrl: clean(row["HH Contact"]),
      contactForm: clean(row["Contact Form"]),
      contactType: clean(row["Contact Type"]),
      contactSource: clean(row["Contact Source"]),
      signalLevel: clean(row["Signal Level"]),
      signalSummary: clean(row["Signal Summary"]),
      businessTasks: clean(row["Signal Summary"]),
      growthPoints: clean(row["Consulting Hypothesis"]),
      sourceUrl: clean(row["HH Contact"]) || clean(row["Contact Form"]),
      verifiedAt: parseDate(row["Updated At"]),
      status: clean(row["Primary Email"]) ? CompanyStatus.READY : CompanyStatus.NO_CONTACT
    };

    const existing = await db.company.findUnique({ where: { userId_leadId: { userId, leadId } } });
    if (existing) {
      await db.company.update({
        where: { id: existing.id },
        data: {
          ...data,
          status: terminalStatuses.has(existing.status) ? existing.status : data.status
        }
      });
      updated += 1;
    } else {
      await db.company.create({ data: { userId, leadId, ...data } });
      created += 1;
    }
  }

  await db.activityLog.create({
    data: { userId, action: "GROWTH_RADAR_SYNC", entity: "Company", details: { created, updated, skipped } }
  });
  return { created, updated, skipped, total: parsed.data.length };
}
