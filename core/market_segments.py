from dataclasses import dataclass
import re


@dataclass(frozen=True)
class MarketSegment:
    segment: str
    subsegment: str


def normalize_okved(value: str | None) -> str:
    """Return a clean OKVED code without spaces or non-numeric separators."""
    if not value:
        return ""
    match = re.search(r"\d{2}(?:\.\d{1,2}){0,2}", str(value))
    return match.group(0) if match else ""


# Specific prefixes must be placed before broad two-digit sections.
_OKVED_RULES: tuple[tuple[tuple[str, ...], MarketSegment], ...] = (
    (("20.42", "46.45", "47.75", "96.02"), MarketSegment("Fashion & Beauty", "Косметика и beauty")),
    (("21", "46.46", "47.73", "86"), MarketSegment("Healthcare", "Медицина и фармацевтика")),
    (("29", "45"), MarketSegment("Auto", "Автомобили, запчасти и сервис")),
    (("26.2", "26.3", "46.51", "46.52", "58.2", "61", "62", "63"), MarketSegment("IT & Telecom", "IT, ПО, электроника и телеком")),
    (("47.91",), MarketSegment("E-commerce & Retail", "Интернет-торговля")),
    (("10", "11", "12", "46.3", "47.11", "47.2"), MarketSegment("FMCG", "Продукты питания, напитки и товары повседневного спроса")),
    (("13", "14", "15", "46.41", "46.42", "47.71", "47.72"), MarketSegment("Fashion & Beauty", "Одежда, обувь и текстиль")),
    (("46.43", "46.44", "46.47", "46.48", "46.49", "47"), MarketSegment("E-commerce & Retail", "Розничная и оптовая торговля непродовольственными товарами")),
    (("55", "56", "79"), MarketSegment("HoReCa & Travel", "Гостиницы, общепит и туризм")),
    (("49", "50", "51", "52", "53"), MarketSegment("Logistics & Transport", "Перевозки, логистика и доставка")),
    (("41", "42", "43", "68"), MarketSegment("Construction & Real Estate", "Строительство, девелопмент и недвижимость")),
    (("64", "65", "66"), MarketSegment("Finance", "Финансовые и страховые услуги")),
    (("85",), MarketSegment("Education", "Образование и EdTech")),
    (("59", "60", "90", "91", "92", "93"), MarketSegment("Media & Entertainment", "Медиа, развлечения и спорт")),
    (("69", "70", "71", "72", "73", "74", "75", "77", "78", "80", "81", "82"), MarketSegment("B2B Services", "Профессиональные и корпоративные услуги")),
    (("01", "02", "03"), MarketSegment("Agriculture", "Сельское хозяйство и рыболовство")),
    (("35", "36", "37", "38", "39"), MarketSegment("Energy & Utilities", "Энергетика, ЖКХ и экология")),
    (("05", "06", "07", "08", "09"), MarketSegment("Industrial & Manufacturing", "Добыча сырья")),
    (("16", "17", "18", "19", "20", "22", "23", "24", "25", "26", "27", "28", "30", "31", "32", "33"), MarketSegment("Industrial & Manufacturing", "Производство и промышленное оборудование")),
    (("46",), MarketSegment("B2B Services", "Оптовая торговля и дистрибуция")),
    (("95", "96"), MarketSegment("B2C Services", "Потребительские услуги")),
)


def classify_okved(okved: str | None, okved_name: str | None = None) -> MarketSegment:
    """Map the main OKVED code to a practical market segment for outreach."""
    code = normalize_okved(okved)
    if code:
        for prefixes, result in _OKVED_RULES:
            if any(code.startswith(prefix) for prefix in prefixes):
                return result

    name = (okved_name or "").casefold()
    keyword_fallbacks = (
        (("программ", "информацион", "телеком"), MarketSegment("IT & Telecom", "IT, ПО и телеком")),
        (("автомоб", "автозапчаст", "транспортных средств"), MarketSegment("Auto", "Автомобили, запчасти и сервис")),
        (("продукт", "напит", "пищев"), MarketSegment("FMCG", "Продукты питания и напитки")),
        (("недвиж", "строитель"), MarketSegment("Construction & Real Estate", "Строительство и недвижимость")),
        (("медицин", "фармацев"), MarketSegment("Healthcare", "Медицина и фармацевтика")),
    )
    for keywords, result in keyword_fallbacks:
        if any(keyword in name for keyword in keywords):
            return result

    return MarketSegment("Other", "Требуется ручная классификация")
