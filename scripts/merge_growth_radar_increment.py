#!/usr/bin/env python3
import argparse
import csv
import json
import os
import re
import sys
from pathlib import Path
from tempfile import NamedTemporaryFile

BASE = Path("data/campaigns/new_5000")
INCREMENTS = BASE / "increments"
RUNTIME = Path("data/runtime")
RECEIPTS = RUNTIME / "merge_receipts"
TARGETS = {
    "leads": BASE / "leads_master.csv",
    "contactable": BASE / "contactable_master.csv",
    "contacts": BASE / "contacts.csv",
    "evidence": BASE / "evidence.csv",
}
SUFFIXES = {
    "leads": "_leads.csv",
    "contactable": "_contactable.csv",
    "contacts": "_contacts.csv",
    "evidence": "_evidence.csv",
}


def read_csv(path: Path):
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        if reader.fieldnames is None:
            raise RuntimeError(f"CSV without header: {path}")
        rows = list(reader)
        return reader.fieldnames, rows


def write_csv_atomic(path: Path, header, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    with NamedTemporaryFile("w", encoding="utf-8", newline="", delete=False, dir=path.parent) as tf:
        writer = csv.DictWriter(tf, fieldnames=header, extrasaction="raise", lineterminator="\n")
        writer.writeheader()
        writer.writerows(rows)
        tmp = Path(tf.name)
    os.replace(tmp, path)


def normalize(value):
    return (value or "").strip().casefold()


def nonempty(value):
    v = (value or "").strip()
    return v if v else None


def id_columns(header):
    aliases = {
        "lead": ["Lead ID"],
        "inn": ["INN", "ИНН"],
        "ogrn": ["OGRN/OGRNIP", "OGRN", "OGRNIP", "ОГРН", "ОГРНИП"],
    }
    result = {}
    for key, names in aliases.items():
        result[key] = next((n for n in names if n in header), None)
    if not result["lead"]:
        raise RuntimeError("Target master has no Lead ID column")
    return result


def build_index(rows, cols):
    idx = {"lead": set(), "inn": set(), "ogrn": set()}
    for row in rows:
        for key, col in cols.items():
            if not col:
                continue
            v = nonempty(row.get(col))
            if v:
                idx[key].add(normalize(v))
    return idx


def row_is_duplicate(row, cols, idx):
    matches = []
    for key, col in cols.items():
        if not col:
            continue
        v = nonempty(row.get(col))
        if v and normalize(v) in idx[key]:
            matches.append(f"{key}:{v}")
    return matches


def validate_relational_integrity(leads, contactable, contacts, evidence):
    lead_ids = [normalize(r.get("Lead ID")) for r in leads if nonempty(r.get("Lead ID"))]
    contactable_ids = [normalize(r.get("Lead ID")) for r in contactable if nonempty(r.get("Lead ID"))]
    if len(lead_ids) != len(set(lead_ids)):
        raise RuntimeError("Integrity failure: duplicate Lead ID in leads_master")
    if len(contactable_ids) != len(set(contactable_ids)):
        raise RuntimeError("Integrity failure: duplicate Lead ID in contactable_master")
    if set(lead_ids) != set(contactable_ids):
        raise RuntimeError("Integrity failure: canonical/contactable Lead ID sets differ")
    known = set(lead_ids)
    orphan_contacts = [r.get("Lead ID") for r in contacts if normalize(r.get("Lead ID")) not in known]
    orphan_evidence = [r.get("Lead ID") for r in evidence if normalize(r.get("Lead ID")) not in known]
    if orphan_contacts:
        raise RuntimeError(f"Integrity failure: orphan contacts={len(orphan_contacts)}")
    if orphan_evidence:
        raise RuntimeError(f"Integrity failure: orphan evidence={len(orphan_evidence)}")
    return {
        "canonical_count": len(lead_ids),
        "contactable_count": len(contactable_ids),
        "orphan_contacts": 0,
        "orphan_evidence": 0,
    }


def candidate_prefixes_from_changed_file_list(path: Path):
    prefixes = set()
    if not path.exists():
        return prefixes
    pattern = re.compile(r"^data/campaigns/new_5000/increments/(.+)_(leads|contactable|contacts|evidence)\.csv$")
    for raw in path.read_text(encoding="utf-8").splitlines():
        m = pattern.match(raw.strip())
        if m:
            prefixes.add(m.group(1))
    return prefixes


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--changed-file-list", type=Path, required=True)
    args = parser.parse_args()

    prefixes = candidate_prefixes_from_changed_file_list(args.changed_file_list)
    if not prefixes:
        print("No Growth Radar increment groups in this push; nothing to merge.")
        return 0

    master_headers = {}
    master_rows = {}
    for kind, path in TARGETS.items():
        header, rows = read_csv(path)
        master_headers[kind] = header
        master_rows[kind] = rows

    validate_relational_integrity(
        master_rows["leads"], master_rows["contactable"], master_rows["contacts"], master_rows["evidence"]
    )

    lead_cols = id_columns(master_headers["leads"])
    lead_index = build_index(master_rows["leads"], lead_cols)
    RECEIPTS.mkdir(parents=True, exist_ok=True)
    receipts = []
    total_added = 0

    for prefix in sorted(prefixes):
        paths = {kind: INCREMENTS / f"{prefix}{suffix}" for kind, suffix in SUFFIXES.items()}
        missing = [str(p) for p in paths.values() if not p.exists()]
        if missing:
            print(f"Increment group {prefix} incomplete; skip until all four files exist: {missing}")
            continue

        receipt_path = RECEIPTS / f"{prefix}.json"
        if receipt_path.exists():
            print(f"Increment group {prefix} already has receipt; skip.")
            continue

        inc_rows = {}
        for kind, path in paths.items():
            header, rows = read_csv(path)
            if header != master_headers[kind]:
                raise RuntimeError(
                    f"Header mismatch for {path}: increment header must exactly match {TARGETS[kind]}"
                )
            inc_rows[kind] = rows

        inc_lead_ids = [normalize(r.get("Lead ID")) for r in inc_rows["leads"] if nonempty(r.get("Lead ID"))]
        if not inc_lead_ids:
            raise RuntimeError(f"Increment group {prefix} contains no lead rows")
        if len(inc_lead_ids) != len(set(inc_lead_ids)):
            raise RuntimeError(f"Increment group {prefix} has duplicate Lead ID rows")

        inc_contactable_ids = [normalize(r.get("Lead ID")) for r in inc_rows["contactable"] if nonempty(r.get("Lead ID"))]
        if set(inc_lead_ids) != set(inc_contactable_ids) or len(inc_lead_ids) != len(inc_contactable_ids):
            raise RuntimeError(f"Increment group {prefix} leads/contactable mismatch")

        incoming_known = set(inc_lead_ids)
        for kind in ("contacts", "evidence"):
            bad = [r.get("Lead ID") for r in inc_rows[kind] if normalize(r.get("Lead ID")) not in incoming_known]
            if bad:
                raise RuntimeError(f"Increment group {prefix} has orphan {kind}: {bad[:5]}")

        duplicate_ids = set()
        duplicate_reasons = {}
        new_ids = set()
        new_lead_rows = []
        for row in inc_rows["leads"]:
            lid = normalize(row.get("Lead ID"))
            matches = row_is_duplicate(row, lead_cols, lead_index)
            if matches:
                duplicate_ids.add(lid)
                duplicate_reasons[row.get("Lead ID", lid)] = matches
            else:
                new_ids.add(lid)
                new_lead_rows.append(row)
                for key, col in lead_cols.items():
                    if col and nonempty(row.get(col)):
                        lead_index[key].add(normalize(row.get(col)))

        new_contactable = [r for r in inc_rows["contactable"] if normalize(r.get("Lead ID")) in new_ids]
        new_contacts = [r for r in inc_rows["contacts"] if normalize(r.get("Lead ID")) in new_ids]
        new_evidence = [r for r in inc_rows["evidence"] if normalize(r.get("Lead ID")) in new_ids]

        if len(new_lead_rows) != len(new_contactable):
            raise RuntimeError(f"Increment group {prefix} new leads/contactable row count mismatch")
        if new_ids and not new_contacts:
            raise RuntimeError(f"Increment group {prefix} has new leads but no contacts")
        if new_ids and not new_evidence:
            raise RuntimeError(f"Increment group {prefix} has new leads but no evidence")

        master_rows["leads"].extend(new_lead_rows)
        master_rows["contactable"].extend(new_contactable)
        master_rows["contacts"].extend(new_contacts)
        master_rows["evidence"].extend(new_evidence)

        integrity = validate_relational_integrity(
            master_rows["leads"], master_rows["contactable"], master_rows["contacts"], master_rows["evidence"]
        )

        receipt = {
            "increment": prefix,
            "status": "MERGED" if new_ids else "DEDUP_NOOP",
            "added_count": len(new_ids),
            "added_lead_ids": sorted(new_ids),
            "duplicate_count": len(duplicate_ids),
            "duplicate_reasons": duplicate_reasons,
            "integrity": integrity,
        }
        receipts.append((receipt_path, receipt))
        total_added += len(new_ids)

    if not receipts:
        print("No complete unprocessed increment groups; nothing to commit.")
        return 0

    final_integrity = validate_relational_integrity(
        master_rows["leads"], master_rows["contactable"], master_rows["contacts"], master_rows["evidence"]
    )

    for kind, path in TARGETS.items():
        write_csv_atomic(path, master_headers[kind], master_rows[kind])
    for receipt_path, receipt in receipts:
        receipt_path.write_text(json.dumps(receipt, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(json.dumps({"status": "PASS", "added": total_added, **final_integrity}, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as exc:
        print(f"MERGE_ABORTED: {exc}", file=sys.stderr)
        sys.exit(1)
