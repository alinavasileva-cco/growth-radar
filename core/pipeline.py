import re
from typing import Iterable, List, Optional

from core.classifier import classify_signal
from core.models import GrowthEvent, RawItem


COMPANY_PATTERNS = [
    re.compile(r"[«\"]([^»\"]{2,80})[»\"]"),
    re.compile(r"\bООО\s+[«\"]?([^»\",.]{2,80})"),
    re.compile(r"\bИП\s+([А-ЯЁ][а-яё]+(?:\s+[А-ЯЁ][а-яё]+){1,2})"),
]


def extract_company_name(text: str) -> Optional[str]:
    for pattern in COMPANY_PATTERNS:
        match = pattern.search(text)
        if match:
            return match.group(1).strip()
    return None


def process_raw_items(items: Iterable[RawItem]) -> List[GrowthEvent]:
    events: List[GrowthEvent] = []

    for item in items:
        combined = f"{item.title}. {item.summary}".strip()
        signal_type, score, rationale = classify_signal(combined)
        company_name = extract_company_name(combined)

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
