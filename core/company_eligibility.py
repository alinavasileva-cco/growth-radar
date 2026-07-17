import csv
from datetime import date, datetime
from pathlib import Path
from typing import Any

MIN_REVENUE = 30_000_000
MAX_REVENUE = 150_000_000
DECLINE_THRESHOLD = -15.0
NEW_BUSINESS_YEARS = 2


def load_company_profiles(path: Path) -> dict[str, dict[str, Any]]:
    """Load manually or automatically enriched company data.

    Expected columns:
    company, inn, revenue_latest, revenue_previous, revenue_year,
    registration_date, source_name, source_url
    """
    if not path.exists():
        return {}

    profiles: dict[str, dict[str, Any]] = {}
    with path.open("r", encoding="utf-8-sig", newline="") as file:
        for row in csv.DictReader(file):
            company = (row.get("company") or "").strip()
            if company:
                profiles[company.casefold()] = row
    return profiles


def _to_float(value: Any) -> float | None:
    if value in (None, ""):
        return None
    try:
        return float(str(value).replace(" ", "").replace(",", "."))
    except ValueError:
        return None


def _company_age_years(value: Any) -> float | None:
    if not value:
        return None
    try:
        registered = datetime.fromisoformat(str(value)).date()
    except ValueError:
        return None
    return (date.today() - registered).days / 365.25


def classify_company(profile: dict[str, Any] | None) -> dict[str, Any]:
    if not profile:
        return {
            "eligible": False,
            "segment": "needs_financial_check",
            "revenue_latest": None,
            "revenue_previous": None,
            "revenue_change_pct": None,
            "reason": "Нет подтверждённых финансовых данных.",
        }

    latest = _to_float(profile.get("revenue_latest"))
    previous = _to_float(profile.get("revenue_previous"))
    change_pct = None
    if latest is not None and previous not in (None, 0):
        change_pct = round((latest - previous) / previous * 100, 1)

    age_years = _company_age_years(profile.get("registration_date"))

    if latest is not None and MIN_REVENUE <= latest <= MAX_REVENUE:
        segment = "target_revenue"
        eligible = True
        reason = "Выручка находится в целевом диапазоне 30–150 млн ₽."
    elif change_pct is not None and change_pct <= DECLINE_THRESHOLD:
        segment = "revenue_decline"
        eligible = True
        reason = f"Выручка снизилась на {abs(change_pct):.1f}%."
    elif age_years is not None and age_years <= NEW_BUSINESS_YEARS:
        segment = "new_business"
        eligible = True
        reason = "Компания зарегистрирована не более двух лет назад."
    else:
        segment = "outside_target"
        eligible = False
        reason = "Компания не соответствует текущим критериям MVP."

    return {
        "eligible": eligible,
        "segment": segment,
        "revenue_latest": latest,
        "revenue_previous": previous,
        "revenue_change_pct": change_pct,
        "reason": reason,
    }
