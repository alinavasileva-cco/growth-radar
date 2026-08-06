import Papa from "papaparse";
import { CompanyStatus } from "@prisma/client";
import { db } from "@/lib/db";

type RadarRow = Record<string, string>;
type ContactRow = Record<string, string>;

type SourceSet = {
  legacyLeads: string;
  campaignLeads: string;
  campaignContactable: string;
  legacyContacts: string;
  campaignContacts: string;
};

const RAW_BASE = "https://raw.githubusercontent.com/alinavasileva-cco/growth-radar/main/data";

const DEFAULT_SOURCES: SourceSet = {
  legacyLeads: `${RAW_BASE}/leads_master.csv`,
  campaignLeads: `${RAW_BASE}/campaigns/new_5000/leads_master.csv`,
  campaignContactable: `${RAW_BASE}/campaigns/new_5000/contactable_master.csv`,
  legacyContacts: `${RAW_BASE}/contacts.csv`,
  campaignContacts: `${RAW_BASE}/campaigns/new_5000/contacts.csv`
};

const terminalStatuses = new Set<CompanyStatus>([
  CompanyStatus.SENT,
  CompanyStatus.REPLIED,
  CompanyStatus.DECLINED,
  CompanyStatus.EXCLUDED
]);

function clean(value?: string | null): string | null {
  const result = value?.trim();
  return result ? result : null;
}

function parseDate(value?: string): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function statusFromRow(row: RadarRow, hasEmail: boolean): CompanyStatus {
  const quickStatus = clean(row["Final Quick Status"])?.toUpperCase();
  if (quickStatus?.includes("ДОПРОВЕР")) return CompanyStatus.RESEARCH_REQUIRED;
  if (quickStatus === "RESERVE") return CompanyStatus.RESEARCH_REQUIRED;
  return hasEmail ? CompanyStatus.READY : CompanyStatus.NO_CONTACT;
}

async function fetchCsv<T extends Record<string, string>>(url: string): Promise<T[]> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Не удалось прочитать Growth Radar (${response.status}): ${url}`);
  const csv = await response.text();
  const parsed = Papa.parse<T>(csv, { header: true, skipEmptyLines: true });
  if (parsed.errors.length) throw new Error(`Ошибка CSV ${url}: ${parsed.errors[0]?.message}`);
  return parsed.data;
}

function mergeDefined(base: RadarRow | undefined, incoming: RadarRow): RadarRow {
  const result: RadarRow = { ...(base ?? {}) };
  for (const [key, value] of Object.entries(incoming)) {
    if (clean(value)) result[key] = value;
  }
  return result;
}

function buildContactIndex(rows: ContactRow[]) {
  const byLeadId = new Map<string, ContactRow[]>();
  for (const row of rows) {
    const leadId = clean(row["Lead ID"]);
    if (!leadId) continue;
    const list = byLeadId.get(leadId) ?? [];
    list.push(row);
    byLeadId.set(leadId, list);
  }
  return byLeadId;
}

function bestContact(rows: ContactRow[] | undefined, channel: string): ContactRow | undefined {
  if (!rows?.length) return undefined;
  const candidates = rows.filter((row) => clean(row["Contact Channel"])?.toLowerCase() === channel);
  return candidates.sort((a, b) => {
    const rank = (value?: string) => (value === "HIGH" ? 3 : value === "MEDIUM" ? 2 : value === "LOW" ? 1 : 0);
    return rank(clean(b.Reliability)?.toUpperCase()) - rank(clean(a.Reliability)?.toUpperCase());
  })[0];
}

function enrichWithContacts(row: RadarRow, contacts: ContactRow[] | undefined): RadarRow {
  const email = bestContact(contacts, "email");
  const phone = bestContact(contacts, "phone");
  const telegram = bestContact(contacts, "telegram");
  const hh = bestContact(contacts, "hh");
  const form = bestContact(contacts, "contact_form");
  const preferred = email ?? phone ?? telegram ?? hh ?? form;

  return mergeDefined(row, {
    "Primary Email": email?.["Contact Value"] ?? "",
    "Primary Phone": phone?.["Contact Value"] ?? "",
    Telegram: telegram?.["Contact Value"] ?? "",
    "HH Contact": hh?.["Contact Value"] ?? "",
    "Contact Form": form?.["Contact Value"] ?? "",
    LPR: preferred?.["Person Name"] ?? "",
    "LPR Role": preferred?.["Person Role"] ?? "",
    "Contact Type": preferred?.["Contact Type"] ?? "",
    "Contact Source": preferred?.["Contact Source"] ?? ""
  });
}

function sourceSet(): SourceSet {
  return {
    legacyLeads: process.env.GROWTH_RADAR_LEGACY_LEADS_URL || DEFAULT_SOURCES.legacyLeads,
    campaignLeads: process.env.GROWTH_RADAR_CAMPAIGN_LEADS_URL || DEFAULT_SOURCES.campaignLeads,
    campaignContactable:
      process.env.GROWTH_RADAR_CONTACTABLE_URL || process.env.GROWTH_RADAR_CSV_URL || DEFAULT_SOURCES.campaignContactable,
    legacyContacts: process.env.GROWTH_RADAR_LEGACY_CONTACTS_URL || DEFAULT_SOURCES.legacyContacts,
    campaignContacts: process.env.GROWTH_RADAR_CAMPAIGN_CONTACTS_URL || DEFAULT_SOURCES.campaignContacts
  };
}

export async function syncGrowthRadar(userId: string) {
  const sources = sourceSet();
  const [legacyLeads, campaignLeads, campaignContactable, legacyContacts, campaignContacts] = await Promise.all([
    fetchCsv<RadarRow>(sources.legacyLeads),
    fetchCsv<RadarRow>(sources.campaignLeads),
    fetchCsv<RadarRow>(sources.campaignContactable),
    fetchCsv<ContactRow>(sources.legacyContacts),
    fetchCsv<ContactRow>(sources.campaignContacts)
  ]);

  const contacts = buildContactIndex([...legacyContacts, ...campaignContacts]);
  const byLeadId = new Map<string, RadarRow>();

  // Priority: archive → all new leads → verified contactable rows → best contact records.
  for (const row of [...legacyLeads, ...campaignLeads, ...campaignContactable]) {
    const leadId = clean(row["Lead ID"]);
    if (!leadId) continue;
    byLeadId.set(leadId, mergeDefined(byLeadId.get(leadId), row));
  }

  const mergedRows = [...byLeadId.entries()].map(([leadId, row]) =>
    enrichWithContacts({ ...row, "Lead ID": leadId }, contacts.get(leadId))
  );

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let mergedByInn = 0;

  for (const row of mergedRows) {
    const leadId = clean(row["Lead ID"]);
    const name = clean(row.Brand);
    if (!leadId || !name) {
      skipped += 1;
      continue;
    }

    const inn = clean(row.INN);
    const email = clean(row["Primary Email"])?.toLowerCase() ?? null;
    const data = {
      campaignId: clean(row["Campaign ID"]) || clean(row["Run ID"]),
      name,
      legalName: clean(row["Legal Name"]),
      inn,
      ogrn: clean(row["OGRN/OGRNIP"]) || clean(row["OGRN / OGRNIP"]),
      website: clean(row.Website),
      industry: clean(row.Segment),
      region: clean(row.Region),
      city: clean(row.City),
      scale: clean(row["Revenue/Scale"]) || clean(row.Revenue) || clean(row["Company Size"]),
      contactName: clean(row.LPR) || clean(row.CEO) || clean(row.Owner),
      contactPosition: clean(row["LPR Role"]),
      email,
      phone: clean(row["Primary Phone"]),
      telegram: clean(row.Telegram),
      hhUrl: clean(row["HH Contact"]),
      contactForm: clean(row["Contact Form"]),
      contactType: clean(row["Contact Type"]),
      contactSource: clean(row["Contact Source"]),
      signalLevel: clean(row["Signal Level"]),
      signalSummary: clean(row["Signal Summary"]),
      businessTasks: clean(row["Business Context"]) || clean(row["Signal Summary"]),
      growthPoints: clean(row["Consulting Hypothesis"]),
      sourceUrl:
        clean(row["Signal Source"]) || clean(row["HH Contact"]) || clean(row["Contact Form"]) || clean(row.Website),
      verifiedAt: parseDate(row["Updated At"]) || parseDate(row["Signal Date"]),
      status: statusFromRow(row, Boolean(email))
    };

    const byLead = await db.company.findUnique({ where: { userId_leadId: { userId, leadId } } });
    const byInn = !byLead && inn ? await db.company.findFirst({ where: { userId, inn } }) : null;
    const existing = byLead ?? byInn;

    if (existing) {
      await db.company.update({
        where: { id: existing.id },
        data: {
          ...data,
          // Keep the original Lead ID when the same legal entity appears in another campaign.
          leadId: existing.leadId || leadId,
          status: terminalStatuses.has(existing.status) ? existing.status : data.status
        }
      });
      updated += 1;
      if (byInn) mergedByInn += 1;
    } else {
      await db.company.create({ data: { userId, leadId, ...data } });
      created += 1;
    }
  }

  const details = {
    created,
    updated,
    skipped,
    mergedByInn,
    total: mergedRows.length,
    sources: {
      legacy: legacyLeads.length,
      newCampaigns: campaignLeads.length,
      contactable: campaignContactable.length,
      contacts: legacyContacts.length + campaignContacts.length
    }
  };

  await db.activityLog.create({
    data: { userId, action: "GROWTH_RADAR_SYNC", entity: "Company", details }
  });

  return details;
}
