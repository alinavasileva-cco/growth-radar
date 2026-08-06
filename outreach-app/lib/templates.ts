import type { ApplicationSettings, Company } from "@prisma/client";

function cleanText(value?: string | null): string | null {
  const clean = value?.replace(/\s+/g, " ").trim();
  return clean || null;
}

function withoutFinalPunctuation(value?: string | null): string | null {
  const clean = cleanText(value);
  return clean ? clean.replace(/[.!?]+$/, "") : null;
}

function asSentence(value?: string | null): string | null {
  const clean = cleanText(value);
  if (!clean) return null;
  return /[.!?]$/.test(clean) ? clean : `${clean}.`;
}

function lowerFirst(value: string): string {
  return value.charAt(0).toLocaleLowerCase("ru-RU") + value.slice(1);
}

function contactAddress(value?: string | null): string | null {
  const clean = cleanText(value)?.split(/[—;,]/)[0]?.trim();
  if (!clean) return null;
  const parts = clean.split(/\s+/);
  if (parts.length >= 3) return parts.slice(1, 3).join(" ");
  return clean;
}

export function hasUnfilledVariables(value: string): boolean {
  return /\[[^\]]+\]|{{[^}]+}}/.test(value);
}

export function generatePersonalizedDraft(company: Company, settings: ApplicationSettings | null) {
  const addressee = contactAddress(company.contactName);
  const greeting = addressee ? `${addressee}, добрый день.` : "Добрый день.";

  const signal = withoutFinalPunctuation(company.signalSummary)
    ?? withoutFinalPunctuation(company.businessTasks);
  const scale = withoutFinalPunctuation(company.scale);
  const hypothesis = asSentence(company.growthPoints)
    ?? asSentence(company.businessTasks)
    ?? "Вижу смысл начать с короткой диагностики коммерческой модели, воронки, клиентских сегментов и управленческой аналитики.";

  const hook = signal
    ? `Обратила внимание на один из текущих сигналов развития ${company.name}: ${lowerFirst(signal)}.`
    : `Обращаюсь именно в ${company.name}: по открытым данным компания находится в точке, где коммерческая система может стать отдельным источником роста.`;

  const implication = scale
    ? `На фоне масштаба компании — ${lowerFirst(scale)} — это выглядит не как локальная задача, а как переход к следующему этапу управляемого роста.`
    : "Это выглядит не как локальная задача, а как переход к следующему этапу управляемого роста.";

  const managementView = "В таких переходах ключевой риск — масштабировать активность быстрее, чем управляемость: без прозрачной экономики, сегментации, единой воронки и правил работы с ключевыми клиентами результат начинает зависеть от ручного управления.";

  const experience = asSentence(company.relevantExperience)
    ?? "Я работаю с такими задачами как коммерческий директор и консультант: отвечала за P&L всей компании, развитие новых направлений, продажи, тендеры, автоматизацию и рентабельность. В одном из периодов выручка выросла на 71%, в отдельных проектах оборот — в 4,7 раза, маржинальная прибыль — в 8,3 раза.";

  const relevance = asSentence(company.relevance)
    ?? (company.industry
      ? `Мой опыт может быть полезен в коммерческих задачах сегмента ${company.industry}.`
      : "Мой опыт может быть полезен при пересборке коммерческой модели и подготовке конкретного плана действий.");

  const name = cleanText(settings?.fullName) || "Алина Васильева";
  const role = cleanText(settings?.role) || "Коммерческий директор / Business Development";
  const contacts = [
    cleanText(settings?.phone),
    cleanText(settings?.telegram),
    cleanText(settings?.websiteUrl)
  ].filter(Boolean) as string[];

  const paragraphs = [
    greeting,
    hook,
    `${implication} ${managementView}`,
    `Поэтому вижу практическую точку входа: ${hypothesis}`,
    `${experience} ${relevance}`,
    "Предлагаю короткий 20-минутный разговор: задам несколько вопросов по текущей коммерческой модели и обозначу 2–3 зоны, которые стоит проверить в первую очередь. Без обязательств и без попытки продать готовое решение заочно.",
    settings?.websiteUrl ? "К письму приложила короткую презентацию; дополнительные кейсы есть на сайте." : "К письму приложила короткую презентацию с релевантными кейсами.",
    ["С уважением,", name, role, ...contacts].join("\n")
  ];

  return {
    subject: `${company.name}: коммерческая система под следующий этап роста`,
    body: paragraphs.join("\n\n")
  };
}
