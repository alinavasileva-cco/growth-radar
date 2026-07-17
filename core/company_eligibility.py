import csv
import re
from datetime import date, datetime
from pathlib import Path
from typing import Any

from core.market_segments import classify_okved

MIN_REVENUE = 30_000_000
MAX_REVENUE = 150_000_000
DECLINE_THRESHOLD = -15.0
NEW_BUSINESS_YEARS = 2


PROFILE_FIELDS = [
    "company",
    "legal_name",
    "inn",
    "ogrn",
    "city",
    "region",
    "okved_main",
    "okved_name",
    "registration_date",
    "revenue_latest",
    "revenue_previous",
    "revenue_year",
    "profit_latest",
    "owner_name",
    "director_name",
    "website",
    "general_phone",
    "general_email",
    "direct_contact_name",
    "direct_contact_role",
    "direct_email",
    "direct_phone",
    "telegram",
    "vk_url",
    "linkedin_url",
    "source_name",
    "source_url",
    "trigger",
    "consulting_reason",
    "priority",
    "verification_status",
]


def normalize_company_key(value: str | None) -> str:
    """Normalize commercial and legal names for reliable joining."""
    if not value:
        return ""
    normalized = str(value).casefold().replace("ё", "е")
    normalized = re.sub(r"\b(ооо|ао|пао|зао|оао|ип|компания|группа компаний|гк)\b", " ", normalized)
    normalized = re.sub(r"[«»\"'`()]", " ", normalized)
    normalized = re.sub(r"[^a-zа-я0-9]+", " ", normalized)
    return " ".join(normalized.split())


def load_company_profiles(path: Path) -> dict[str, dict[str, Any]]:
    """Load verified company data used for selection and outreach.

    A company can be indexed by commercial name, legal name, aliases separated
    by a slash, normalized name or INN. This makes signals easier to join with
    the verified registry record.
    """
    if not path.exists():
        return {}

    profiles: dict[str, dict[str, Any]] = {}
    with path.open("r", encoding="utf-8-sig", newline="") as file:
        for raw_row in csv.DictReader(file):
            row = {field: (raw_row.get(field) or "").strip() for field in PROFILE_FIELDS}
            names = [row.get("company", ""), row.get("legal_name", "")]
            aliases: list[str] = []
            for name in names:
                aliases.extend(part.strip() for part in name.split("/") if part.strip())

            keys = {row.get("inn", "").casefold()}
            for name in names + aliases:
                keys.add(name.casefold())
                keys.add(normalize_company_key(name))

            for key in keys:
                if key:
                    profiles[key] = row
    return profiles


def find_company_profile(
    profiles: dict[str, dict[str, Any]],
    company_name: str | None,
) -> dict[str, Any] | None:
    if not company_name:
        return None
    return profiles.get(company_name.casefold()) or profiles.get(normalize_company_key(company_name))


def _to_float(value: Any) -> float | None:
    if value in (None, ""):
        return None
    try:
        return float(str(value).replace(" ", "").replace("\u00a0", "").replace(",", "."))
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


def _has_direct_contact(profile: dict[str, Any]) -> bool:
    """General sales mailboxes do not count as a decision-maker contact."""
    return any(
        (profile.get(field) or "").strip()
        for field in ("direct_email", "direct_phone", "telegram", "vk_url", "linkedin_url")
    )


def classify_company(profile: dict[str, Any] | None) -> dict[str, Any]:
    if not profile:
        return {
            "eligible": False,
            "selection_segment": "needs_financial_check",
            "market_segment": "Unknown",
            "market_subsegment": "Нет ОКВЭД",
            "revenue_latest": None,
            "revenue_previous": None,
            "revenue_change_pct": None,
            "identity_verified": False,
            "direct_contact_found": False,
            "outreach_ready": False,
            "reason": "Нет подтверждённой карточки компании.",
        }

    latest = _to_float(profile.get("revenue_latest"))
    previous = _to_float(profile.get("revenue_previous"))
    change_pct = None
    if latest is not None and previous not in (None, 0):
        change_pct = round((latest - previous) / previous * 100, 1)

    age_years = _company_age_years(profile.get("registration_date"))
    market = classify_okved(profile.get("okved_main"), profile.get("okved_name"))

    if latest is not None and MIN_REVENUE <= latest <= MAX_REVENUE:
        selection_segment = "target_revenue"
        eligible = True
        reason = "Выручка находится в целевом диапазоне 30–150 млн ₽."
    elif change_pct is not None and change_pct <= DECLINE_THRESHOLD:
        selection_segment = "revenue_decline"
        eligible = True
        reason = f"Выручка снизилась на {abs(change_pct):.1f}%."
    elif age_years is not None and age_years <= NEW_BUSINESS_YEARS:
        selection_segment = "new_business"
        eligible = True
        reason = "Компания зарегистрирована не более двух лет назад."
    else:
        selection_segment = "outside_target"
        eligible = False
        reason = "Компания не соответствует текущим критериям отбора."

    identity_verified = bool(
        profile.get("inn")
        and (profile.get("legal_name") or profile.get("company"))
        and (profile.get("owner_name") or profile.get("director_name"))
    )
    direct_contact_found = _has_direct_contact(profile)
    outreach_ready = eligible and identity_verified and direct_contact_found

    return {
        "eligible": eligible,
        "selection_segment": selection_segment,
        "market_segment": market.segment,
        "market_subsegment": market.subsegment,
        "revenue_latest": latest,
        "revenue_previous": previous,
        "revenue_change_pct": change_pct,
        "identity_verified": identity_verified,
        "direct_contact_found": direct_contact_found,
        "outreach_ready": outreach_ready,
        "reason": reason,
    }
