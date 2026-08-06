import type { ApplicationSettings, Company } from "@prisma/client";

function asSentence(value?: string | null): string | null {
  const clean = value?.trim();
  if (!clean) return null;
  return /[.!?]$/.test(clean) ? clean : `${clean}.`;
}

export function hasUnfilledVariables(value: string): boolean {
  return /\[[^\]]+\]|{{[^}]+}}/.test(value);
}

export function generatePersonalizedDraft(company: Company, settings: ApplicationSettings | null) {
  const greeting = company.contactName?.trim()
    ? `Здравствуйте, ${company.contactName.trim()}.`
    : "Здравствуйте.";

  const reason = asSentence(company.signalSummary)
    ?? asSentence(company.businessTasks)
    ?? `Обращаюсь именно в ${company.name}, поскольку вижу связь между задачами компании и моим опытом коммерческого управления.`;

  const task = asSentence(company.growthPoints)
    ?? asSentence(company.businessTasks)
    ?? "В таких задачах особенно важна связка коммерческой стратегии, продаж, маркетинга, операционных процессов и контроля P&L.";

  const experience = asSentence(company.relevantExperience)
    ?? "Последние 12 лет я работаю на стыке коммерческого управления, business development и маркетинга. В SETEVIE отвечала за P&L всей компании, развитие новых направлений, тендеры, продажи и повышение рентабельности. За один из периодов выручка выросла на 71%, а в отдельных проектах оборот увеличивался в 4,7 раза, маржинальная прибыль — в 8,3 раза.";

  const relevance = asSentence(company.relevance)
    ?? asSentence(company.industry ? `Мой опыт может быть полезен для коммерческих задач в сегменте ${company.industry}` : null)
    ?? "Мой опыт может быть полезен при диагностике коммерческой модели и подготовке конкретного плана роста.";

  const website = settings?.websiteUrl?.trim() || "[ссылка на сайт]";
  const phone = settings?.phone?.trim() || "[телефон]";
  const telegram = settings?.telegram?.trim() || "[Telegram]";
  const email = settings?.userId ? "" : "";
  const name = settings?.fullName || "Алина Васильева";
  const role = settings?.role || "Коммерческий директор / Business Development";

  const body = [
    greeting,
    "",
    reason,
    "",
    task,
    "",
    experience,
    "",
    relevance,
    "",
    "Подробнее о моём опыте и проектах:",
    website,
    "",
    "К письму приложила короткую презентацию.",
    "",
    "Буду рада познакомиться и обсудить, могут ли мой опыт и компетенции быть полезны вашей команде.",
    "",
    "С уважением,",
    name,
    role,
    phone,
    telegram,
    email
  ].filter((line) => line !== "").join("\n");

  return {
    subject: `Коммерческое развитие ${company.name}`,
    body
  };
}
