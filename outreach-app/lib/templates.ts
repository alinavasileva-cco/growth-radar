import type { ApplicationSettings, Company } from "@prisma/client";

function cleanText(value?: string | null): string | null {
  const clean = value?.replace(/\s+/g, " ").trim();
  return clean || null;
}

function withoutFinalPunctuation(value?: string | null): string | null {
  const clean = cleanText(value);
  return clean ? clean.replace(/[.!?]+$/, "") : null;
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

function focusFor(company: Company): string {
  const text = [company.industry, company.signalSummary, company.growthPoints]
    .filter(Boolean).join(" ").toLocaleLowerCase("ru-RU");
  if (text.includes("новое направление") || text.includes("запуск направления")) return "новое направление и коммерческая модель роста";
  if (text.includes("saas") || text.includes("ai") || text.includes("ит /")) return "B2B-продажи, unit-экономика и масштабирование";
  if (text.includes("fmcg") || text.includes("пищев") || text.includes("продукт")) return "ассортимент, каналы и маржинальный рост";
  if (text.includes("юрид") || text.includes("консалт")) return "B2B-воронка и прибыльный рост";
  if (text.includes("логист") || text.includes("вэд")) return "B2B-продажи и экономика каналов";
  if (text.includes("edtech") || text.includes("образован")) return "воронки, CAC/LTV и масштабирование";
  if (text.includes("производ")) return "коммерческая система и рост B2B";
  return "коммерческая система и точки роста";
}

function diagnosticPoints(company: Company): string[] {
  const source = cleanText(company.growthPoints) || cleanText(company.businessTasks) || cleanText(company.signalSummary);
  if (!source) return [
    "экономику ключевых направлений и каналов",
    "структуру клиентских сегментов и воронки",
    "KPI и управленческую прозрачность",
    "точки роста на горизонте ближайших 90 дней"
  ];
  const parts = source.split(/[;•]/).map((item) => item.trim()).filter(Boolean).slice(0, 4);
  if (parts.length >= 3) return parts;
  return [
    ...parts,
    "экономику ключевых направлений и каналов",
    "KPI и управленческую прозрачность",
    "точки роста на горизонте ближайших 90 дней"
  ].slice(0, 4);
}

export function hasUnfilledVariables(value: string): boolean {
  return /\[[^\]]+\]|{{[^}]+}}/.test(value);
}

export function generatePersonalizedDraft(company: Company, settings: ApplicationSettings | null) {
  const addressee = contactAddress(company.contactName);
  const greeting = addressee ? `${addressee}, добрый день.` : "Добрый день.";
  const signal = withoutFinalPunctuation(company.signalSummary) ?? withoutFinalPunctuation(company.businessTasks);
  const scale = withoutFinalPunctuation(company.scale);
  const hook = signal
    ? `Обратила внимание на текущий этап развития ${company.name}: ${lowerFirst(signal)}.`
    : `Обратила внимание на ${company.name}: по открытым данным компания сейчас находится в точке, где особенно важно связать рост с управляемой коммерческой моделью.`;
  const context = scale
    ? `На фоне масштаба компании — ${lowerFirst(scale)} — это уже не локальная задача отдела продаж, а вопрос экономики роста, каналов, приоритетов и управленческой прозрачности.`
    : "Это выглядит не как локальная задача отдела продаж, а как вопрос экономики роста, каналов, приоритетов и управленческой прозрачности.";

  const points = diagnosticPoints(company).map((point) => `— ${point.replace(/[.!?]+$/, "")};`);
  points[points.length - 1] = points[points.length - 1].replace(/;$/, ".");

  const name = cleanText(settings?.fullName) || "Алина Васильева";
  const role = cleanText(settings?.role) || "Коммерческий директор / бизнес-консультант";
  const website = cleanText(settings?.websiteUrl) || "https://alinavasileva-cco.github.io/alina-business-tracker/";
  const telegram = cleanText(settings?.telegram) || "@AlinaVasileva";
  const telegramUrl = telegram.startsWith("http") ? telegram : `https://t.me/${telegram.replace(/^@/, "")}`;

  const paragraphs = [
    greeting,
    hook,
    context,
    "Поэтому решила написать вам напрямую.",
    "Я занимаюсь коммерческим консалтингом и работаю с собственниками и руководителями в формате бизнес-трекинга: помогаю разобрать текущую ситуацию, определить реальные точки роста, сформулировать и проверить коммерческие гипотезы, а затем довести выбранные решения до конкретного плана действий и измеримого результата.",
    `Для ${company.name} я бы в первую очередь посмотрела на несколько зон:\n\n${points.join("\n")}`,
    "Кроме бизнес-трекинга я могу подготовить для компании отдельный обзор рынка по вашей нише и конкурентный анализ: ключевые игроки, изменения спроса, продуктовые и ценовые модели, каналы продаж, позиционирование конкурентов и возможные свободные зоны для роста.",
    "В качестве первого материала прикладываю мой обзор рыночных и управленческих трендов 2026. Он собран на основе исследований разных источников и посвящён изменениям в стратегии, клиентском поведении, AI, процессах и управлении растущими компаниями.",
    `Подробнее обо мне и опыте:\n${website}`,
    "Готова коротко обсудить вашу текущую задачу и понять, где именно могу быть полезна — в формате трекинга либо отдельного исследования рынка и конкурентов.",
    `Для связи удобнее всего написать мне напрямую в Telegram: ${telegram}\n${telegramUrl}\nЯ отвечаю сама.`,
    ["С уважением,", name, role, `Telegram: ${telegram}`].join("\n")
  ];

  return {
    subject: `Тренды 2026 для ${company.name}: ${focusFor(company)}`,
    body: paragraphs.join("\n\n")
  };
}
