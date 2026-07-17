import csv
from collections import defaultdict
from pathlib import Path
from typing import Any, Iterable

from core.company_eligibility import classify_company
from core.models import GrowthEvent


COMBINATION_BONUS = {
    frozenset({"expansion", "marketing_hire"}): 20,
    frozenset({"expansion", "management_hire"}): 20,
    frozenset({"funding", "marketing_hire"}): 20,
    frozenset({"funding", "management_hire"}): 20,
    frozenset({"product_launch", "marketing_hire"}): 15,
    frozenset({"franchise", "management_hire"}): 15,
}


OPPORTUNITY_FIELDS = [
    "company",
    "legal_name",
    "inn",
    "ogrn",
    "city",
    "region",
    "okved_main",
    "okved_name",
    "market_segment",
    "market_subsegment",
    "selection_segment",
    "revenue_latest",
    "revenue_previous",
    "revenue_change_pct",
    "profit_latest",
    "registration_date",
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
    "score",
    "signals",
    "events_count",
    "trigger",
    "consulting_reason",
    "reason",
    "latest_title",
    "latest_url",
    "source_name",
    "source_url",
    "priority",
    "verification_status",
    "identity_verified",
    "direct_contact_found",
    "outreach_ready",
    "status",
]


def _unique_profiles(profiles: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
    unique: dict[str, dict[str, Any]] = {}
    for profile in profiles.values():
        key = profile.get("inn") or profile.get("legal_name") or profile.get("company")
        if key:
            unique[str(key).casefold()] = profile
    return list(unique.values())


def _status_for(assessment: dict[str, Any], profile: dict[str, Any] | None) -> str:
    if assessment.get("outreach_ready"):
        return "outreach_ready"
    if assessment.get("eligible") and assessment.get("identity_verified"):
        return "needs_direct_contact"
    if assessment.get("eligible"):
        return "needs_identity_check"
    if profile:
        return "excluded"
    return "needs_enrichment"


def build_opportunities(
    events: Iterable[GrowthEvent],
    profiles: dict[str, dict[str, Any]] | None = None,
) -> list[dict]:
    profiles = profiles or {}
    grouped: dict[str, list[GrowthEvent]] = defaultdict(list)

    for event in events:
        if event.company_name:
            grouped[event.company_name.strip()].append(event)

    # Verified profiles are included even if no fresh news was found today.
    for profile in _unique_profiles(profiles):
        company = profile.get("company") or profile.get("legal_name")
        if company:
            grouped.setdefault(str(company).strip(), [])

    opportunities: list[dict[str, Any]] = []
    for company, company_events in grouped.items():
        profile = profiles.get(company.casefold())
        assessment = classify_company(profile)

        if company_events:
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
            latest_title = latest.title
            latest_url = latest.url
        else:
            signals = set()
            total_score = 0
            latest_title = ""
            latest_url = ""

        signal_reason = (
            f"Обнаружено событий: {len(company_events)}; сигналы: {', '.join(sorted(signals))}."
            if company_events
            else "Проверенная карточка без свежего публичного сигнала."
        )
        profile = profile or {}

        opportunities.append(
            {
                "company": profile.get("company") or company,
                "legal_name": profile.get("legal_name", ""),
                "inn": profile.get("inn", ""),
                "ogrn": profile.get("ogrn", ""),
                "city": profile.get("city", ""),
                "region": profile.get("region", ""),
                "okved_main": profile.get("okved_main", ""),
                "okved_name": profile.get("okved_name", ""),
                "market_segment": assessment.get("market_segment", "Unknown"),
                "market_subsegment": assessment.get("market_subsegment", ""),
                "selection_segment": assessment.get("selection_segment", "needs_financial_check"),
                "revenue_latest": assessment.get("revenue_latest"),
                "revenue_previous": assessment.get("revenue_previous"),
                "revenue_change_pct": assessment.get("revenue_change_pct"),
                "profit_latest": profile.get("profit_latest", ""),
                "registration_date": profile.get("registration_date", ""),
                "owner_name": profile.get("owner_name", ""),
                "director_name": profile.get("director_name", ""),
                "website": profile.get("website", ""),
                "general_phone": profile.get("general_phone", ""),
                "general_email": profile.get("general_email", ""),
                "direct_contact_name": profile.get("direct_contact_name", ""),
                "direct_contact_role": profile.get("direct_contact_role", ""),
                "direct_email": profile.get("direct_email", ""),
                "direct_phone": profile.get("direct_phone", ""),
                "telegram": profile.get("telegram", ""),
                "vk_url": profile.get("vk_url", ""),
                "linkedin_url": profile.get("linkedin_url", ""),
                "score": total_score,
                "signals": ", ".join(sorted(signals)),
                "events_count": len(company_events),
                "trigger": profile.get("trigger", ""),
                "consulting_reason": profile.get("consulting_reason", ""),
                "reason": f"{assessment.get('reason', '')} {signal_reason}".strip(),
                "latest_title": latest_title,
                "latest_url": latest_url,
                "source_name": profile.get("source_name", ""),
                "source_url": profile.get("source_url", ""),
                "priority": profile.get("priority", ""),
                "verification_status": profile.get("verification_status", ""),
                "identity_verified": assessment.get("identity_verified", False),
                "direct_contact_found": assessment.get("direct_contact_found", False),
                "outreach_ready": assessment.get("outreach_ready", False),
                "status": _status_for(assessment, profile or None),
            }
        )

    priority_rank = {"high": 0, "medium": 1, "low": 2, "": 3}
    status_rank = {
        "outreach_ready": 0,
        "needs_direct_contact": 1,
        "needs_identity_check": 2,
        "needs_enrichment": 3,
        "excluded": 4,
    }
    return sorted(
        opportunities,
        key=lambda item: (
            status_rank.get(item["status"], 9),
            priority_rank.get(str(item.get("priority", "")).lower(), 3),
            -int(item.get("score") or 0),
            str(item.get("company", "")),
        ),
    )


def export_opportunities_csv(opportunities: list[dict], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8-sig", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=OPPORTUNITY_FIELDS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(opportunities)


def export_outreach_ready_csv(opportunities: list[dict], output_path: Path) -> None:
    export_opportunities_csv(
        [item for item in opportunities if item.get("outreach_ready")],
        output_path,
    )
