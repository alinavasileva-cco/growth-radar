import Papa from "papaparse";
import { Company, CompanyStatus } from "@prisma/client";
import { db } from "@/lib/db";
import savedCompanies from "@/data/growth-radar-companies-saved.json";
import { discoverGrowthRadarSources } from "@/lib/growth-radar-sources";

type Row = Record<string, string>;

// Historical migration source only. Once a company has delivery fields in Postgres,
// this CSV is ignored for that company and can never override database state.
const LEGACY_SEND_LEDGER_URL = "https://raw.githubusercontent.com/alinavasileva-cco/growth-radar/feature/outreach-app/outreach-app/data/send_ledger.csv";

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

function normalizedName(value: string): string {
  return value.toLowerCase().replace(/[«»"'`]/g, "").replace(/\s+/g, " ").trim();
}

function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function statusFromRow(row: Row, email: string | null): CompanyStatus {
  const quick = clean(row["Final Quick Status"])?.toUpperCase() ?? "";
  if (quick === "RESERVE" || quick.includes("РЕЗЕРВ")) return CompanyStatus.EXCLUDED;
  if (quick.includes("ДОПРОВЕР")) return CompanyStatus.RESEARCH_REQUIRED;
  return email ? CompanyStatus.READY : CompanyStatus.NO_CONTACT;
}

async function fetchCsv(url: string): Promise<Row[]> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Не удалось прочитать Growth Radar (${response.status}): ${url}`);
  const text = (await response.text()).replace(/\r\n?/g, "\n");
  const parsed = Papa.parse<Row>(text, { header: true, skipEmptyLines: true });
  const fatal = parsed.errors.find((error) => error.type === "Quotes" || error.type === "Delimiter");
  if (fatal) throw new Error(`Ошибка CSV ${url}: ${fatal.message}`);
  return parsed.data.filter((row) => Object.keys(row).length > 1);
}

function mergeDefined(base: Row | undefined, incoming: Row): Row {
  const result: Row = { ...(base ?? {}) };
  for (const [key, value] of Object.entries(incoming)) if (clean(value)) result[key] = value;
  return result;
}

function contactIndex(rows: Row[]) {
  const index = new Map<string, Row[]>();
  for (const row of rows) {
    const leadId = clean(row["Lead ID"]);
    if (!leadId) continue;
    index.set(leadId, [...(index.get(leadId) ?? []), row]);
  }
  return index;
}

function legacyDeliveryIndexes(rows: Row[]) {
  const byLead = new Map<string, Row>();
  const byEmail = new Map<string, Row>();
  for (const row of rows) {
    const leadId = clean(row.lead_id);
    const email = clean(row.email)?.toLowerCase();
    if (leadId) byLead.set(leadId, row);
    if (email) byEmail.set(email, row);
  }
  return { byLead, byEmail };
}

function bestContact(rows: Row[] | undefined, channel: string): Row | undefined {
  const rank = (value?: string | null) => value === "HIGH" ? 3 : value === "MEDIUM" ? 2 : value === "LOW" ? 1 : 0;
  return rows
    ?.filter((row) => clean(row["Contact Channel"])?.toLowerCase() === channel)
    .sort((a, b) => rank(clean(b.Reliability)?.toUpperCase()) - rank(clean(a.Reliability)?.toUpperCase()))[0];
}

function enrich(row: Row, contacts: Row[] | undefined): Row {
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

function addToMaps(company: Company, maps: {
  lead: Map<string, Company>;
  inn: Map<string, Company>;
  email: Map<string, Company>;
  name: Map<string, Company>;
}) {
  if (company.leadId) maps.lead.set(company.leadId, company);
  if (company.inn) maps.inn.set(company.inn, company);
  if (company.email) maps.email.set(company.email.toLowerCase(), company);
  maps.name.set(normalizedName(company.name), company);
}

function hasDatabaseDelivery(company?: Company): boolean {
  return Boolean(
    company?.lastGmailMessageId ||
    company?.lastSentAt ||
    company?.bouncedAt ||
    company?.status === CompanyStatus.SENT ||
    company?.status === CompanyStatus.REPLIED ||
    company?.status === CompanyStatus.DECLINED
  );
}

export async function syncAllGrowthRadar(userId: string) {
  const sources = await discoverGrowthRadarSources();
  const [leadGroups, contactGroups, legacyLedgerRows] = await Promise.all([
    Promise.all(sources.leadUrls.map(fetchCsv)),
    Promise.all(sources.contactUrls.map(fetchCsv)),
    fetchCsv(LEGACY_SEND_LEDGER_URL).catch(() => [] as Row[])
  ]);
  const repositoryRows = leadGroups.flat();
  const contacts = contactIndex(contactGroups.flat());
  const legacyDeliveries = legacyDeliveryIndexes(legacyLedgerRows);
  const rowsByLead = new Map<string, Row>();
  const archiveRows = savedCompanies as Row[];

  for (const row of [...archiveRows, ...repositoryRows]) {
    const leadId = clean(row["Lead ID"]);
    if (leadId) rowsByLead.set(leadId, mergeDefined(rowsByLead.get(leadId), row));
  }

  const rows = [...rowsByLead].map(([leadId, row]) => enrich({ ...row, "Lead ID": leadId }, contacts.get(leadId)));
  const maps = {
    lead: new Map<string, Company>(),
    inn: new Map<string, Company>(),
    email: new Map<string, Company>(),
    name: new Map<string, Company>()
  };
  (await db.company.findMany({ where: { userId } })).forEach((company) => addToMaps(company, maps));

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let deduplicated = 0;
  let legacyDeliveriesImported = 0;

  for (const row of rows) {
    const leadId = clean(row["Lead ID"]);
    const name = clean(row.Brand);
    if (!leadId || !name) {
      skipped += 1;
      continue;
    }

    const inn = clean(row.INN);
    const sourceEmail = clean(row["Primary Email"])?.toLowerCase() ?? null;
    const existing = maps.lead.get(leadId)
      ?? (inn ? maps.inn.get(inn) : undefined)
      ?? (sourceEmail ? maps.email.get(sourceEmail) : undefined)
      ?? maps.name.get(normalizedName(name));

    const legacyDelivery = hasDatabaseDelivery(existing)
      ? undefined
      : legacyDeliveries.byLead.get(leadId) ?? (sourceEmail ? legacyDeliveries.byEmail.get(sourceEmail) : undefined);
    const legacyStatus = clean(legacyDelivery?.status)?.toUpperCase();
    const legacyEmail = clean(legacyDelivery?.email)?.toLowerCase() ?? null;
    const email = existing?.lastSentEmail ?? legacyEmail ?? sourceEmail;

    const sourceStatus = statusFromRow(row, email);
    const importedStatus = legacyStatus === "SENT"
      ? CompanyStatus.SENT
      : legacyStatus === "BOUNCED"
        ? CompanyStatus.BOUNCED
        : null;

    const sourceEmailChangedAfterBounce = existing?.status === CompanyStatus.BOUNCED
      && Boolean(sourceEmail)
      && sourceEmail !== existing.lastSentEmail;

    const nextStatus = importedStatus
      ?? (sourceEmailChangedAfterBounce ? CompanyStatus.READY : sourceStatus);

    const growthRadarNote = clean(row["Final Quick Status"]) ? `Статус Growth Radar: ${clean(row["Final Quick Status"])}` : null;
    const legacyDeliveryNote = legacyDelivery
      ? `Историческая доставка импортирована в БД: ${legacyStatus}; ${clean(legacyDelivery.email) ?? "email не указан"}; ${clean(legacyDelivery.sent_at) ?? "дата не указана"}; ${clean(legacyDelivery.subject) ?? "тема не указана"}`
      : null;
    const notes = [growthRadarNote, legacyDeliveryNote].filter(Boolean).join(" | ") || null;

    const legacySentAt = legacyDelivery ? parseDate(legacyDelivery.sent_at) : null;
    const legacyMessageId = clean(legacyDelivery?.gmail_message_id);
    const legacySubject = clean(legacyDelivery?.subject);
    const legacyError = legacyStatus === "BOUNCED" ? clean(legacyDelivery?.note) ?? "Delivery failed" : null;

    const data = {
      campaignId: clean(row["Campaign ID"]) || clean(row["Run ID"]) || (leadId.startsWith("GRM-") ? "saved_archive" : null),
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
      sourceUrl: clean(row["Signal Source"]) || clean(row["HH Contact"]) || clean(row["Contact Form"]) || clean(row.Website),
      verifiedAt: parseDate(row["Updated At"]) || parseDate(row["Signal Date"]),
      notes
    };

    if (!existing) {
      const company = await db.company.create({
        data: {
          userId,
          leadId,
          ...data,
          status: nextStatus,
          lastSentAt: legacyStatus === "SENT" ? legacySentAt : null,
          lastSentEmail: legacyDelivery ? legacyEmail : null,
          lastSentSubject: legacySubject,
          lastGmailMessageId: legacyMessageId,
          bouncedAt: legacyStatus === "BOUNCED" ? legacySentAt : null,
          lastDeliveryError: legacyError
        }
      });
      addToMaps(company, maps);
      created += 1;
      if (legacyDelivery) legacyDeliveriesImported += 1;
      continue;
    }

    const matchedByLead = existing.leadId === leadId;
    const archiveRow = leadId.startsWith("GRM-");
    let status = nextStatus;
    if (terminalStatuses.has(existing.status)) status = existing.status;
    else if (existing.status === CompanyStatus.BOUNCED && !sourceEmailChangedAfterBounce) status = CompanyStatus.BOUNCED;
    else if (existing.email && !email && nextStatus === CompanyStatus.NO_CONTACT) status = existing.status;

    const company = await db.company.update({
      where: { id: existing.id },
      data: {
        leadId: archiveRow && existing.leadId && !existing.leadId.startsWith("GRM-") ? existing.leadId : existing.leadId || leadId,
        campaignId: data.campaignId ?? existing.campaignId,
        name,
        legalName: data.legalName ?? existing.legalName,
        inn: data.inn ?? existing.inn,
        ogrn: data.ogrn ?? existing.ogrn,
        website: data.website ?? existing.website,
        industry: data.industry ?? existing.industry,
        region: data.region ?? existing.region,
        city: data.city ?? existing.city,
        scale: data.scale ?? existing.scale,
        contactName: data.contactName ?? existing.contactName,
        contactPosition: data.contactPosition ?? existing.contactPosition,
        email: data.email ?? existing.email,
        phone: data.phone ?? existing.phone,
        telegram: data.telegram ?? existing.telegram,
        hhUrl: data.hhUrl ?? existing.hhUrl,
        contactForm: data.contactForm ?? existing.contactForm,
        contactType: data.contactType ?? existing.contactType,
        contactSource: data.contactSource ?? existing.contactSource,
        signalLevel: data.signalLevel ?? existing.signalLevel,
        signalSummary: data.signalSummary ?? existing.signalSummary,
        businessTasks: data.businessTasks ?? existing.businessTasks,
        growthPoints: data.growthPoints ?? existing.growthPoints,
        sourceUrl: data.sourceUrl ?? existing.sourceUrl,
        verifiedAt: data.verifiedAt ?? existing.verifiedAt,
        status,
        notes: data.notes ?? existing.notes,
        lastSentAt: existing.lastSentAt ?? (legacyStatus === "SENT" ? legacySentAt : null),
        lastSentEmail: existing.lastSentEmail ?? (legacyDelivery ? legacyEmail : null),
        lastSentSubject: existing.lastSentSubject ?? legacySubject,
        lastGmailMessageId: existing.lastGmailMessageId ?? legacyMessageId,
        bouncedAt: existing.bouncedAt ?? (legacyStatus === "BOUNCED" ? legacySentAt : null),
        lastDeliveryError: existing.lastDeliveryError ?? legacyError
      }
    });
    addToMaps(company, maps);
    updated += 1;
    if (!matchedByLead) deduplicated += 1;
    if (legacyDelivery) legacyDeliveriesImported += 1;
  }

  const details = {
    created,
    updated,
    skipped,
    deduplicated,
    total: rows.length,
    archiveRows: archiveRows.length,
    repositoryRows: repositoryRows.length,
    contacts: contactGroups.flat().length,
    campaigns: sources.campaignCount,
    leadSources: sources.leadUrls.length,
    contactSources: sources.contactUrls.length,
    legacyLedgerRows: legacyLedgerRows.length,
    legacyDeliveriesImported,
    deliverySourceOfTruth: "postgres"
  };
  await db.activityLog.create({ data: { userId, action: "GROWTH_RADAR_SYNC", entity: "Company", details } });
  return details;
}
