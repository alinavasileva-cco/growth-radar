import csv
from collections import defaultdict
from pathlib import Path
from typing import Iterable

from core.models import GrowthEvent


COMBINATION_BONUS = {
    frozenset({"expansion", "marketing_hire"}): 20,
    frozenset({"expansion", "management_hire"}): 20,
    frozenset({"funding", "marketing_hire"}): 20,
    frozenset({"funding", "management_hire"}): 20,
    frozenset({"product_launch", "marketing_hire"}): 15,
    frozenset({"franchise", "management_hire"}): 15,
}


def build_opportunities(events: Iterable[GrowthEvent]) -> list[dict]:
    grouped: dict[str, list[GrowthEvent]] = defaultdict(list)

    for event in events:
        if event.company_name:
            grouped[event.company_name.strip()].append(event)

    opportunities = []
    for company, company_events in grouped.items():
        signals = {event.signal_type for event in company_events}
        base_score = max(event.score for event in company_events)
        repeat_bonus = min(25, max(0, len(company_events) - 1) * 10)
        combination_bonus = max(
            (bonus for pair, bonus in COMBINATION_BONUS.items() if pair.issubset(signals)),
            default=0,
        )
        total_score = min(100, base_score + repeat_bonus + combination_bonus)
        latest = max(
            company_events,
            key=lambda event: event.published_at.isoformat() if event.published_at else "",
        )

        opportunities.append(
            {
                "company": company,
                "score": total_score,
                "signals": ", ".join(sorted(signals)),
                "events_count": len(company_events),
                "reason": (
                    f"Обнаружено событий: {len(company_events)}; "
                    f"сигналы: {', '.join(sorted(signals))}."
                ),
                "latest_title": latest.title,
                "latest_url": latest.url,
                "status": "new",
            }
        )

    return sorted(opportunities, key=lambda item: item["score"], reverse=True)


def export_opportunities_csv(opportunities: list[dict], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8-sig", newline="") as file:
        writer = csv.DictWriter(
            file,
            fieldnames=[
                "company", "score", "signals", "events_count", "reason",
                "latest_title", "latest_url", "status",
            ],
        )
        writer.writerow()
        writer.writerows(opportunities)
