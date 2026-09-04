from __future__ import annotations

import csv
import json
from pathlib import Path

CAMP = Path('data/campaigns/new_5000')
OUT = Path('data/runtime/canonical_dedup_index.json')


def norm(value: str | None) -> str:
    return ' '.join((value or '').strip().casefold().split())


def rows(path: Path) -> list[dict[str, str]]:
    with path.open('r', encoding='utf-8-sig', newline='') as f:
        return list(csv.DictReader(f))


def main() -> None:
    master = rows(CAMP / 'leads_master.csv')
    contactable = rows(CAMP / 'contactable_master.csv')
    master_ids = {r.get('Lead ID','').strip() for r in master if r.get('Lead ID','').strip()}
    contactable_ids = {r.get('Lead ID','').strip() for r in contactable if r.get('Lead ID','').strip()}
    if master_ids != contactable_ids or len(master) != len(contactable):
        raise SystemExit('canonical/contactable desync; refusing to build dedup index')

    payload = {
        'campaign_id': 'new_5000',
        'canonical_count': len(master),
        'contactable_count': len(contactable),
        'lead_ids': sorted(master_ids),
        'inns': sorted({r.get('INN','').strip() for r in master if r.get('INN','').strip()}),
        'ogrns': sorted({r.get('OGRN/OGRNIP','').strip() for r in master if r.get('OGRN/OGRNIP','').strip()}),
        'legal_names_normalized': sorted({norm(r.get('Legal Name')) for r in master if r.get('Legal Name','').strip()}),
        'brand_domain_normalized': sorted({norm(r.get('Brand')) + '|' + norm(r.get('Website')) for r in master if r.get('Brand','').strip() and r.get('Website','').strip()}),
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(payload, ensure_ascii=False, separators=(',', ':')) + '\n', encoding='utf-8')
    print(f"DEDUP_INDEX_READY canonical={len(master)} lead_ids={len(payload['lead_ids'])} inns={len(payload['inns'])} ogrns={len(payload['ogrns'])}")


if __name__ == '__main__':
    main()
