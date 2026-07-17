import re
from typing import Iterable, List, Optional

from core.classifier import classify_signal
from core.models import GrowthEvent, RawItem


COMPANY_PATTERNS = [
    re.compile(r"[«\"]([^»\"]{2,80})[»\"]"),
    re.compile(r"\bООО\s+[«\"]?([^»\",.]{2,80})"),
    re.compile(r"\bИП\s+([А-ЯЁ][а-яё]+(?:\s+[А-ЯЁ][а-яё]+){1,2})"),
]

GROWTH_VERBS = (
    "открыла", "открыл", "открывает", "запустила", "запустил",
    "запускает", "расширяет", "получила", "получил", "привлекла",
    "привлек", "ищет", "ищут", "вышла", "вышел", "масштабируется",
)

NOISE_MARKERS = (
    "гороскоп", "курс валют", "погода", "матч", "турнир", "кино",
    "рецепт", "происшествие", "криминал",
)


def extract_company_name(text: str) -> Optional[str]:
    for pattern in COMPANY_PATTERNS:
        match = pattern.search(text)
        if match:
            return match.group(1).strip(" .,:;—-")

    lowered = text.lower()
    positions = [lowered.find(verb) for verb in GROWTH_VERBS if lowered.find(verb) > 1]
    if positions:
        candidate = text[: min(positions)].strip(" .,:;—-")
        candidate = re.sub(r"^(компания|сеть|бренд|стартап|производитель)\s+", "", candidate, flags=re.I)
        if 2 <= len(candidate) <= 80 and len(candidate.split()) <= 8:
            return candidate
    return None


def is_noise(text: str) -> bool:
    normalized = text.lower()
    return any(marker in normalized for marker in NOISE_MARKERS)


def process_raw_items(items: Iterable[RawItem]) -> List[GrowthEvent]:
    events: List[GrowthEvent] = []

    for item in items:
        combined = f"{item.title}. {item.summary}".strip()
        if is_noise(combined):
            continue

        signal_type, score, rationale = classify_signal(combined)
        company_name = extract_company_name(item.title) or extract_company_name(combined)

        events.append(
            GrowthEvent(
                source_name=item.source_name,
                source_type=item.source_type,
                title=item.title,
                url=item.url,
                published_at=item.published_at,
                summary=item.summary,
                company_name=company_name,
                signal_type=signal_type,
                score=score,
                rationale=rationale,
            )
        )

    return events
