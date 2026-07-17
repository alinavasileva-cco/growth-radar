from datetime import datetime

from core.models import GrowthEvent
from core.opportunities import build_opportunities


def make_event(signal_type: str, score: int) -> GrowthEvent:
    return GrowthEvent(
        source_name="test",
        source_type="news",
        title="Компания Альфа открыла филиал",
        url=f"https://example.com/{signal_type}",
        published_at=datetime(2026, 7, 17),
        summary="",
        company_name="Альфа",
        signal_type=signal_type,
        score=score,
        rationale="test",
    )


def test_combined_signals_raise_score():
    opportunities = build_opportunities([
        make_event("expansion", 25),
        make_event("marketing_hire", 30),
    ])

    assert len(opportunities) == 1
    assert opportunities[0]["company"] == "Альфа"
    assert opportunities[0]["score"] == 60
    assert opportunities[0]["events_count"] == 2
