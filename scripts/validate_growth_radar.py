#!/usr/bin/env python3
"""Strict integrity validator for Growth Radar canonical data."""
from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from collections import Counter
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
MASTER = DATA / "leads_master.csv"
METRICS = DATA / "run_metrics.json"
CONFIG = ROOT / "CURRENT_WORKING_CONFIG.md"
VALIDATION = DATA / "recovery" / "integrity_validation.json"

EMPTY_TOKENS = {"", "unknown", "none", "null", "n/a", "na", "-", "—", "неизвестно"}
ALLOWED_STATUSES = {
    "МОЖНО СВЯЗЫВАТЬСЯ",
    "НУЖНА ДОПРОВЕРКА",
    "RESERVE",
    "РЕЗЕРВ",
    "BLOCKED",
    "EXCLUDED",
    "ИСКЛЮЧЕНА",
}


def clean(value: object) -> str:
    return str(value or "").strip()


def usable(value: object) -> bool:
    return clean(value).casefold() not in EMPTY_TOKENS


def digits(value: object) -> str:
    return re.sub(r"\D", "", clean(value))


def valid_inn(value: object) -> str:
    value = digits(value)
    return value if len(value) in {10, 12} else ""


def valid_ogrn(value: object) -> str:
    value = digits(value)
    return value if len(value) in {13, 15} else ""


def read_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    if not path.exists():
        raise FileNotFoundError(path)
    with path.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        if not reader.fieldnames:
            raise ValueError(f"CSV has no header: {path}")
        rows = []
        expected = len(reader.fieldnames)
        for line_no, row in enumerate(reader, 2):
            if None in row:
                raise ValueError(f"CSV column overflow at {path}:{line_no}")
            if len(row) != expected:
                raise ValueError(f"CSV column mismatch at {path}:{line_no}")
            if any(clean(v) for v in row.values()):
                rows.append({k: clean(v) for k, v in row.items()})
    return list(reader.fieldnames), rows


def duplicate_values(values: Iterable[str]) -> list[str]:
    counts = Counter(v for v in values if usable(v))
    return sorted(v for v, count in counts.items() if count > 1)


def detect_lead_field(fields: Iterable[str]) -> str | None:
    aliases = {"leadid", "lead_id", "lead id", "companyid", "company_id"}
    for field in fields:
        normalized = re.sub(r"\s+", " ", field.strip().casefold())
        compact = re.sub(r"[^a-zа-я0-9_]", "", normalized)
        if normalized in aliases or compact in {"leadid", "lead_id", "companyid", "company_id"}:
            return field
    return None


def validate() -> dict[str, object]:
    errors: list[str] = []
    try:
        master_fields, master_rows = read_csv(MASTER)
    except Exception as exc:  # noqa: BLE001
        return {"integrity_status": "FAIL", "errors": [str(exc)]}

    lead_field = "Lead ID" if "Lead ID" in master_fields else detect_lead_field(master_fields)
    inn_field = "INN" if "INN" in master_fields else None
    ogrn_field = next((f for f in master_fields if f.strip().casefold() in {"ogrn / ogrnip", "ogrn/ogrnip", "ogrn", "ogrnip"}), None)
    status_field = "Final Quick Status" if "Final Quick Status" in master_fields else next((f for f in master_fields if "status" in f.casefold()), None)

    if not lead_field:
        errors.append("Lead ID column is absent")
    if not inn_field:
        errors.append("INN column is absent")
    if not ogrn_field:
        errors.append("OGRN/OGRNIP column is absent")
    if not status_field:
        errors.append("Status column is absent")

    lead_ids = [row.get(lead_field or "", "") for row in master_rows]
    raw_inns = [row.get(inn_field or "", "") for row in master_rows]
    raw_ogrns = [row.get(ogrn_field or "", "") for row in master_rows]
    inns = [valid_inn(v) for v in raw_inns]
    ogrns = [valid_ogrn(v) for v in raw_ogrns]
    statuses = [row.get(status_field or "", "") or "UNSET" for row in master_rows]

    duplicate_lead_ids = duplicate_values(lead_ids)
    duplicate_inns = duplicate_values(inns)
    duplicate_ogrns = duplicate_values(ogrns)
    invalid_statuses = sorted({status for status in statuses if status not in ALLOWED_STATUSES})
    if duplicate_lead_ids:
        errors.append(f"Duplicate Lead IDs: {duplicate_lead_ids}")
    if duplicate_inns:
        errors.append(f"Duplicate INNs: {duplicate_inns}")
    if duplicate_ogrns:
        errors.append(f"Duplicate OGRNs/OGRNIPs: {duplicate_ogrns}")
    if invalid_statuses:
        errors.append(f"Invalid final statuses: {invalid_statuses}")
    if any(not usable(v) for v in lead_ids):
        errors.append("At least one master row has an empty Lead ID")

    metrics: dict[str, object] = {}
    try:
        metrics = json.loads(METRICS.read_text(encoding="utf-8"))
    except Exception as exc:  # noqa: BLE001
        errors.append(f"Cannot read metrics: {exc}")

    contacts_path = ROOT / str(metrics.get("contacts_file", "data/contact_routes_master.csv"))
    evidence_path = ROOT / str(metrics.get("evidence_file", "data/evidence_master.csv"))

    canonical_ids = set(lead_ids)
    orphan_contacts: list[str] = []
    orphan_evidence: list[str] = []
    contacts_count = 0
    evidence_count = 0

    for kind, path in (("contacts", contacts_path), ("evidence", evidence_path)):
        try:
            fields, rows = read_csv(path)
            ref_field = detect_lead_field(fields)
            if not ref_field:
                errors.append(f"{kind} file has no Lead ID column: {path}")
                continue
            orphans = sorted({row.get(ref_field, "") for row in rows if row.get(ref_field, "") not in canonical_ids})
            if kind == "contacts":
                orphan_contacts = orphans
                contacts_count = len(rows)
            else:
                orphan_evidence = orphans
                evidence_count = len(rows)
            if orphans:
                errors.append(f"Orphan {kind}: {orphans}")
        except Exception as exc:  # noqa: BLE001
            errors.append(f"Cannot validate {kind}: {exc}")

    config_text = CONFIG.read_text(encoding="utf-8") if CONFIG.exists() else ""
    status_line = next((line for line in config_text.splitlines() if line.strip().startswith("**Статус:**")), "")
    if "`READY`" not in status_line:
        errors.append("CURRENT_WORKING_CONFIG.md status line is not READY")

    expected_pool = metrics.get("canonical_pool_verified")
    if expected_pool != len(master_rows):
        errors.append(f"Metrics/master mismatch: {expected_pool!r} != {len(master_rows)}")
    if metrics.get("unique_lead_ids") != len(set(lead_ids)):
        errors.append("unique_lead_ids does not match master")
    if metrics.get("unique_inns") != len({v for v in inns if v}):
        errors.append("unique_inns does not match valid INNs in master")
    if metrics.get("unique_ogrns") != len({v for v in ogrns if v}):
        errors.append("unique_ogrns does not match valid OGRNs/OGRNIPs in master")
    if metrics.get("contacts_verified") != contacts_count:
        errors.append("contacts_verified does not match canonical contacts")
    if metrics.get("evidence_records_verified") != evidence_count:
        errors.append("evidence_records_verified does not match canonical evidence")
    if metrics.get("orphan_records") != len(orphan_contacts) + len(orphan_evidence):
        errors.append("orphan_records does not match canonical files")
    if metrics.get("integrity_status") != "READY":
        errors.append("Metrics integrity_status is not READY")

    status_counts = dict(Counter(statuses))
    if metrics.get("status_counts") != status_counts:
        errors.append("status_counts does not match master")
    if sum(status_counts.values()) != len(master_rows):
        errors.append("Status count sum does not match master")

    grm117_present = "GRM-117" in canonical_ids
    if metrics.get("grm_117_required", False) and not grm117_present:
        errors.append("GRM-117 is required but absent")

    return {
        "master_rows": len(master_rows),
        "unique_lead_ids": len(set(lead_ids)),
        "unique_inns": len({v for v in inns if v}),
        "unique_ogrns": len({v for v in ogrns if v}),
        "duplicate_lead_ids": duplicate_lead_ids,
        "duplicate_inns": duplicate_inns,
        "duplicate_ogrns": duplicate_ogrns,
        "invalid_statuses": invalid_statuses,
        "orphan_contacts": orphan_contacts,
        "orphan_evidence": orphan_evidence,
        "status_counts": status_counts,
        "contacts_verified": contacts_count,
        "evidence_records_verified": evidence_count,
        "grm_117_present": grm117_present,
        "errors": errors,
        "integrity_status": "PASS" if not errors else "FAIL",
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--write", action="store_true")
    args = parser.parse_args()
    result = validate()
    if args.write:
        VALIDATION.parent.mkdir(parents=True, exist_ok=True)
        VALIDATION.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result.get("integrity_status") == "PASS" else 1


if __name__ == "__main__":
    sys.exit(main())
