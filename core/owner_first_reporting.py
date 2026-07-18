import csv
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from core.company_eligibility import PROFILE_FIELDS, classify_company


READY_FIELDS = PROFILE_FIELDS + [
    "market_segment",
    "market_subsegment",
    "selection_segment",
    "revenue_change_pct",
    "identity_verified",
    "direct_contact_found",
    "outreach_ready",
]


def _unique_profiles(profiles: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
    unique: dict[str, dict[str, Any]] = {}
    for profile in profiles.values():
        key = profile.get("inn") or profile.get("ogrn") or profile.get("legal_name")
        if key:
            unique[str(key).casefold()] = profile
    return list(unique.values())


def build_owner_first_ready(profiles: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
    ready: list[dict[str, Any]] = []
    for profile in _unique_profiles(profiles):
        assessment = classify_company(profile)
        if not assessment.get("outreach_ready"):
            continue
        row = {field: profile.get(field, "") for field in PROFILE_FIELDS}
        row.update(
            {
                "market_segment": assessment.get("market_segment", ""),
                "market_subsegment": assessment.get("market_subsegment", ""),
                "selection_segment": assessment.get("selection_segment", ""),
                "revenue_change_pct": assessment.get("revenue_change_pct", ""),
                "identity_verified": assessment.get("identity_verified", False),
                "direct_contact_found": assessment.get("direct_contact_found", False),
                "outreach_ready": True,
            }
        )
        ready.append(row)
    return sorted(ready, key=lambda row: (str(row.get("priority", "")), str(row.get("company", ""))))


def export_owner_first_ready(rows: list[dict[str, Any]], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with output_path.open("w", encoding="utf-8-sig", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=READY_FIELDS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def build_run_metrics(opportunities: list[dict[str, Any]], ready_rows: list[dict[str, Any]]) -> dict[str, Any]:
    statuses = [str(item.get("status") or "") for item in opportunities]
    personal_contacts = sum(
        1
        for item in opportunities
        if item.get("direct_contact_name")
        and any(item.get(field) for field in ("direct_email", "direct_phone", "telegram", "vk_url", "linkedin_url"))
    )
    corporate_contacts = sum(
        1 for item in opportunities if item.get("general_email") or item.get("general_phone")
    )
    return {
        "generated_at_utc": datetime.now(timezone.utc).isoformat(),
        "total_checked": len(opportunities),
        "fully_passed": len(ready_rows),
        "excluded": statuses.count("excluded"),
        "remaining_in_review": sum(
            status in {"needs_enrichment", "needs_identity_check", "needs_direct_contact"}
            for status in statuses
        ),
        "personal_contacts_found": personal_contacts,
        "corporate_contacts_found": corporate_contacts,
    }


def export_run_metrics(metrics: dict[str, Any], output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(
        json.dumps(metrics, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
