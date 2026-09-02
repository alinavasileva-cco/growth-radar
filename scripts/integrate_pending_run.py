from __future__ import annotations

import csv
import json
from pathlib import Path

ROOT = Path('.')
CAMP = ROOT / 'data/campaigns/new_5000'
PENDING_PATH = ROOT / 'data/runtime/growth_radar_pending_run.json'
CURRENT_STATUS_PATH = ROOT / 'data/runtime/current_run_status.json'
TARGET_PATH = ROOT / 'data/runtime/campaign_target.json'
METRICS_PATH = ROOT / 'data/run_metrics.json'
RECOVERY_PATH = ROOT / 'data/runtime/recovery_required.json'
MIN_AUTHORITATIVE_RAW = 120
TOTAL_TARGET = 5000


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open('r', encoding='utf-8-sig', newline='') as f:
        return list(csv.DictReader(f))


def append_rows(path: Path, rows: list[dict]) -> None:
    if not rows:
        return
    existing = read_csv(path)
    fields = list(existing[0].keys()) if existing else list(rows[0].keys())
    with path.open('a', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction='ignore', lineterminator='\n')
        for row in rows:
            writer.writerow({k: row.get(k, '') for k in fields})


def write_csv(path: Path, rows: list[dict], fields: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction='ignore', lineterminator='\n')
        writer.writeheader()
        writer.writerows(rows)


def write_json(path: Path, obj: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def norm(value: str | None) -> str:
    return ' '.join((value or '').strip().casefold().split())


def as_int(value, default: int = 0) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def external_limit_is_proven(pending: dict) -> tuple[bool, str]:
    proof = pending.get('external_technical_limitation')
    if not isinstance(proof, dict):
        return False, ''
    proven = proof.get('proven') is True
    evidence = str(proof.get('evidence') or '').strip()
    return bool(proven and evidence), evidence


def main() -> None:
    pending = json.loads(PENDING_PATH.read_text(encoding='utf-8'))
    if pending.get('status') != 'READY_FOR_INTEGRATION':
        print('Pending is not READY_FOR_INTEGRATION; nothing to integrate.')
        return

    run_id = pending['run_id']
    now = pending['updated_at']
    leads = pending.get('qualified_companies', [])
    funnel = pending.get('funnel') or {}

    raw_distinct = as_int(funnel.get('raw_distinct', funnel.get('discovered', 0)))
    external_limit_proven, external_limit_evidence = external_limit_is_proven(pending)
    underdone_raw = raw_distinct < MIN_AUTHORITATIVE_RAW and not external_limit_proven

    master = read_csv(CAMP / 'leads_master.csv')
    baseline_before = len(master)
    existing_ids = {r.get('Lead ID', '').strip() for r in master if r.get('Lead ID', '').strip()}
    existing_inn = {r.get('INN', '').strip() for r in master if r.get('INN', '').strip()}
    existing_ogrn = {r.get('OGRN/OGRNIP', '').strip() for r in master if r.get('OGRN/OGRNIP', '').strip()}
    existing_legal = {norm(r.get('Legal Name')) for r in master if r.get('Legal Name', '').strip()}
    existing_brand_domain = {
        (norm(r.get('Brand')), norm(r.get('Website')))
        for r in master
        if r.get('Brand', '').strip() and r.get('Website', '').strip()
    }

    added: list[dict] = []
    skipped: list[tuple[str, str]] = []
    for company in leads:
        reasons: list[str] = []
        cid = str(company.get('Lead ID') or '').strip()
        inn = str(company.get('INN') or '').strip()
        ogrn = str(company.get('OGRN/OGRNIP') or '').strip()
        legal = norm(company.get('Legal Name'))
        brand_domain = (norm(company.get('Brand')), norm(company.get('Website')))
        if cid and cid in existing_ids:
            reasons.append('Lead ID')
        if inn and inn in existing_inn:
            reasons.append('INN')
        if ogrn and ogrn in existing_ogrn:
            reasons.append('OGRN')
        if legal and legal in existing_legal:
            reasons.append('LEGAL_NAME')
        if brand_domain[0] and brand_domain[1] and brand_domain in existing_brand_domain:
            reasons.append('BRAND_DOMAIN')
        if reasons:
            skipped.append((str(company.get('Brand') or ''), ','.join(reasons)))
            continue
        added.append(company)
        if cid:
            existing_ids.add(cid)
        if inn:
            existing_inn.add(inn)
        if ogrn:
            existing_ogrn.add(ogrn)
        if legal:
            existing_legal.add(legal)
        if brand_domain[0] and brand_domain[1]:
            existing_brand_domain.add(brand_domain)

    master_rows: list[dict] = []
    contactable_rows: list[dict] = []
    contact_rows: list[dict] = []
    evidence_rows: list[dict] = []

    for company in added:
        contacts = company.get('contacts') or []
        evidence = company.get('evidence') or []
        master_rows.append({
            'Lead ID': company['Lead ID'], 'Brand': company['Brand'], 'Legal Name': company['Legal Name'],
            'INN': company['INN'], 'OGRN/OGRNIP': company['OGRN/OGRNIP'], 'Legal Status': 'Действует',
            'Region': company['Region'], 'City': company['City'], 'Segment': company['Segment'],
            'Website': company['Website'], 'Revenue/Scale': company['Revenue/Scale'],
            'Signal Level': company['Signal Level'], 'Signal Summary': company['Signal Summary'],
            'Signal Date': company['Signal Date'], 'Signal Source': company['Signal Source'],
            'Owner': company['Owner'], 'CEO': company['CEO'], 'LPR': company['LPR'],
            'LPR Role': company['LPR Role'], 'Primary Phone': company['Primary Phone'],
            'Primary Email': company['Primary Email'], 'HH Contact': company.get('HH Contact', ''),
            'Contact Form': company['Contact Form'], 'Contact Type': company['Contact Type'],
            'Contact Source': company['Contact Source'], 'Number Of Contacts Found': str(len(contacts)),
            'Consulting Hypothesis': company['Consulting Hypothesis'], 'Final Quick Status': 'МОЖНО СВЯЗЫВАТЬСЯ',
            'Added At': now, 'Updated At': now, 'Run ID': run_id, 'Campaign ID': 'new_5000'
        })
        contactable_rows.append({
            'Lead ID': company['Lead ID'], 'Brand': company['Brand'], 'Legal Name': company['Legal Name'],
            'INN': company['INN'], 'OGRN/OGRNIP': company['OGRN/OGRNIP'], 'Region': company['Region'],
            'Segment': company['Segment'], 'Revenue/Scale': company['Revenue/Scale'],
            'Signal Level': company['Signal Level'], 'Signal Summary': company['Signal Summary'],
            'Owner': company['Owner'], 'CEO': company['CEO'], 'LPR': company['LPR'], 'LPR Role': company['LPR Role'],
            'Primary Phone': company['Primary Phone'], 'Primary Email': company['Primary Email'],
            'Telegram': '', 'VK': '', 'HH Contact': company.get('HH Contact', ''),
            'Contact Form': company['Contact Form'], 'Other Contact': '', 'Contact Type': company['Contact Type'],
            'Contact Source': company['Contact Source'], 'Number Of Contacts Found': str(len(contacts)),
            'Consulting Hypothesis': company['Consulting Hypothesis'], 'Final Quick Status': 'МОЖНО СВЯЗЫВАТЬСЯ',
            'Added At': now, 'Updated At': now, 'Run ID': run_id, 'Campaign ID': 'new_5000'
        })
        for index, contact in enumerate(contacts, 1):
            contact_rows.append({
                'Lead ID': company['Lead ID'], 'Contact ID': f"{company['Lead ID']}-C{index:02d}",
                'Brand': company['Brand'], 'INN': company['INN'],
                'Person Name': company['LPR'] if contact.get('is_lpr') else '',
                'Person Role': company['LPR Role'] if contact.get('is_lpr') else 'Корпоративный маршрут',
                'Contact Value': contact['value'], 'Contact Channel': contact['channel'],
                'Contact Type': contact['type'], 'Contact Source': contact['source'], 'Source URL': contact['url'],
                'Is LPR': 'YES' if contact.get('is_lpr') else 'NO', 'Reliability': 'HIGH',
                'Date Checked': now[:10], 'Notes': contact.get('notes', ''), 'Run ID': run_id,
                'Campaign ID': 'new_5000'
            })
        for index, item in enumerate(evidence, 1):
            evidence_rows.append({
                'Lead ID': company['Lead ID'], 'Evidence ID': f"{company['Lead ID']}-E{index:02d}",
                'Evidence Type': item['type'], 'Claim': item['claim'], 'Source URL': item['url'],
                'Source Name': item['source'], 'Checked At': now, 'Reliability': 'HIGH',
                'Run ID': run_id, 'Campaign ID': 'new_5000'
            })

    append_rows(CAMP / 'leads_master.csv', master_rows)
    append_rows(CAMP / 'contactable_master.csv', contactable_rows)
    append_rows(CAMP / 'contacts.csv', contact_rows)
    append_rows(CAMP / 'evidence.csv', evidence_rows)

    if master_rows:
        write_csv(CAMP / 'master_shards' / f'{run_id}.csv', master_rows, list(master_rows[0].keys()))
        write_csv(CAMP / 'contactable_shards' / f'{run_id}.csv', contactable_rows, list(contactable_rows[0].keys()))
        if contact_rows:
            write_csv(CAMP / 'contact_shards' / f'{run_id}.csv', contact_rows, list(contact_rows[0].keys()))
        if evidence_rows:
            write_csv(CAMP / 'evidence_shards' / f'{run_id}.csv', evidence_rows, list(evidence_rows[0].keys()))

    master_after = read_csv(CAMP / 'leads_master.csv')
    contactable_after = read_csv(CAMP / 'contactable_master.csv')
    contacts_after = read_csv(CAMP / 'contacts.csv')
    evidence_after = read_csv(CAMP / 'evidence.csv')
    new_count = len(master_after)
    contactable_count = len(contactable_after)
    master_ids = {r['Lead ID'] for r in master_after}
    contactable_ids = {r['Lead ID'] for r in contactable_after}

    nonempty_inn = [r['INN'] for r in master_after if r.get('INN')]
    nonempty_ogrn = [r['OGRN/OGRNIP'] for r in master_after if r.get('OGRN/OGRNIP')]
    assert len(nonempty_inn) == len(set(nonempty_inn)), 'Duplicate INN after integration'
    assert len(nonempty_ogrn) == len(set(nonempty_ogrn)), 'Duplicate OGRN after integration'
    assert master_ids == contactable_ids, 'Canonical/contactable Lead ID mismatch'
    assert not ({r['Lead ID'] for r in contacts_after} - master_ids), 'Orphan contacts detected'
    assert not ({r['Lead ID'] for r in evidence_after} - master_ids), 'Orphan evidence detected'

    final_status = 'UNDERDONE_RECOVERY_REQUIRED' if underdone_raw else 'COMPLETED'
    final_stage = 'RECOVERY_REQUIRED' if underdone_raw else 'COMPLETE'
    duplicate_count = as_int(funnel.get('duplicates')) + len(skipped)
    notes = str(pending.get('notes') or '')
    notes = (notes + '; physical dedup skipped=' + str(skipped)).strip('; ')
    if underdone_raw:
        notes += f'; HARD_GATE raw_distinct={raw_distinct}<{MIN_AUTHORITATIVE_RAW}; supplemental discovery required in same cycle'
    elif external_limit_proven and raw_distinct < MIN_AUTHORITATIVE_RAW:
        notes += f'; raw below threshold accepted only because external technical limitation was proven: {external_limit_evidence}'

    run_fields = ['Run ID','Campaign ID','Status','Discovered','Size Check Passed','Legal Match Passed','Signal Confirmed','LPR Identified','Contact Route Found','Qualified','Duplicates','Excluded','Canonical Count','Contactable Count','Integrity','Orphan Contacts','Orphan Evidence','Outreach Sent','Notes']
    run_row = {
        'Run ID': run_id, 'Campaign ID': 'new_5000', 'Status': final_status,
        'Discovered': raw_distinct, 'Size Check Passed': funnel.get('size_check_passed', 0),
        'Legal Match Passed': funnel.get('legal_match_passed', 0), 'Signal Confirmed': funnel.get('signal_confirmed', 0),
        'LPR Identified': funnel.get('lpr_identified', 0), 'Contact Route Found': funnel.get('contact_route_found', 0),
        'Qualified': len(added), 'Duplicates': duplicate_count, 'Excluded': funnel.get('excluded', 0),
        'Canonical Count': new_count, 'Contactable Count': contactable_count, 'Integrity': 'PASS',
        'Orphan Contacts': 0, 'Orphan Evidence': 0, 'Outreach Sent': 0, 'Notes': notes
    }
    write_csv(CAMP / 'run_logs' / f'{run_id}.csv', [run_row], run_fields)
    append_rows(CAMP / 'run_log.csv', [run_row])
    append_rows(CAMP / 'run_log_tail_198_onward.csv', [run_row])

    runtime = {
        'run_id': run_id, 'campaign_id': 'new_5000', 'status': final_status, 'updated_at': now, 'stage': final_stage,
        'new_cycle': {
            'baseline_count': baseline_before, 'target_count': TOTAL_TARGET,
            'current_canonical_count': new_count, 'current_contactable_count': contactable_count,
            'progress_added': len(added), 'remaining': TOTAL_TARGET - new_count
        },
        'funnel': {**funnel, 'raw_distinct': raw_distinct, 'qualified': len(added), 'duplicates': duplicate_count},
        'completion_gate': {
            'minimum_authoritative_raw': MIN_AUTHORITATIVE_RAW,
            'raw_distinct': raw_distinct,
            'external_technical_limitation_proven': external_limit_proven,
            'passed': not underdone_raw
        },
        'lane_metrics': pending.get('lane_metrics', []),
        'qualified_companies': [company['Brand'] for company in added],
        'integrity_status': 'PASS', 'orphan_contacts': 0, 'orphan_evidence': 0, 'active_wip': 0,
        'physical_master_state': f'{new_count}_DATA_ROWS_PLUS_HEADER_CONFIRMED',
        'physical_contactable_state': f'{contactable_count}_DATA_ROWS_PLUS_HEADER_CONFIRMED',
        'outreach_sent': 0,
        'blocker': 'RAW_BELOW_120_RECOVERY_REQUIRED' if underdone_raw else None
    }
    write_json(CURRENT_STATUS_PATH, runtime)

    target = json.loads(TARGET_PATH.read_text(encoding='utf-8'))
    target.update({
        'current_canonical_count': new_count, 'current_contactable_count': contactable_count,
        'progress_added': new_count, 'remaining_to_total_target': TOTAL_TARGET - new_count,
        'remaining': TOTAL_TARGET - new_count, 'qualified_staged_not_counted': 0,
        'integrity_status': 'PASS', 'campaign_status': 'ACTIVE', 'updated_at': now,
        'current_run_id': run_id, 'last_run_id': run_id, 'latest_attempted_run_id': run_id,
        'orphan_contacts': 0, 'orphan_evidence': 0, 'recovery_required': underdone_raw,
        'note': (
            f'{run_id} UNDERDONE: raw_distinct {raw_distinct}<{MIN_AUTHORITATIVE_RAW}; '
            f'+{len(added)} physically integrated; canonical/contactable {new_count}/{contactable_count}; '
            'integrity PASS; supplemental discovery required; outreach 0.'
            if underdone_raw else
            f'{run_id} completed after physical integration: +{len(added)} net new; '
            f'canonical/contactable {new_count}/{contactable_count}; integrity PASS; orphan 0/0; staged 0; outreach 0.'
        )
    })
    if not underdone_raw:
        target.update({
            'last_completed_run_id': run_id,
            'latest_completed_run': run_id,
            'canonical_integration_run_id': run_id
        })
    write_json(TARGET_PATH, target)

    metrics = {
        'generated_at': now, 'campaign_id': 'new_5000',
        'latest_completed_run_id': target.get('last_completed_run_id'), 'current_run_id': run_id,
        'current_run_status': final_status, 'canonical_pool_verified': new_count,
        'contactable_verified': contactable_count, 'qualified_staged_not_counted': 0,
        'total_target': TOTAL_TARGET, 'remaining_to_target': TOTAL_TARGET - new_count,
        'orphan_contacts': 0, 'orphan_evidence': 0, 'integrity_status': 'PASS', 'outreach_sent': 0,
        'blocker': 'RAW_BELOW_120_RECOVERY_REQUIRED' if underdone_raw else None,
        'completion_gate': runtime['completion_gate'],
        f"run_{run_id.split('-')[-1]}": {
            'raw_discovered': raw_distinct, 'fast_gate_passed': funnel.get('fast_gate_passed', 0),
            'size_check_passed': funnel.get('size_check_passed', 0),
            'legal_match_passed': funnel.get('legal_match_passed', 0),
            'signal_confirmed': funnel.get('signal_confirmed', 0), 'lpr_identified': funnel.get('lpr_identified', 0),
            'contact_route_found': funnel.get('contact_route_found', 0), 'qualified': len(added),
            'physically_integrated': len(added), 'duplicates': duplicate_count,
            'excluded': funnel.get('excluded', 0), 'lane_metrics': pending.get('lane_metrics', [])
        }
    }
    write_json(METRICS_PATH, metrics)

    report_lines = [
        f'# Growth Radar RUN {run_id}', '', f'- Status: {final_status}', f'- Added: {len(added)}',
        f'- Baseline: {baseline_before}', f'- Canonical/contactable: {new_count}/{contactable_count}',
        f'- Authoritative raw distinct: {raw_distinct}', f'- Minimum raw gate: {MIN_AUTHORITATIVE_RAW}',
        f'- Completion gate passed: {not underdone_raw}', f'- Qualified: {len(added)}',
        f'- Duplicates: {duplicate_count}', f"- Excluded: {funnel.get('excluded', 0)}",
        '- Integrity: PASS', '- Orphan contacts/evidence: 0/0', '- Outreach: 0', '', '## Added companies'
    ]
    report_lines.extend(f"- {company['Brand']} — INN {company['INN']}" for company in added)
    report_path = ROOT / 'reports' / f"run_{run_id.replace('N5K-', '').replace('-', '_')}.md"
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text('\n'.join(report_lines) + '\n', encoding='utf-8')

    config_path = ROOT / 'CURRENT_WORKING_CONFIG.md'
    config_path.write_text(
        config_path.read_text(encoding='utf-8') +
        f"\n\n## Latest attempted run {run_id}\nCanonical/contactable: {new_count}/{contactable_count}. "
        f"Status: {final_status}. Authoritative raw distinct: {raw_distinct}. Integrity PASS. "
        "Orphan contacts/evidence: 0/0. Outreach: 0.\n",
        encoding='utf-8'
    )

    if underdone_raw:
        recovery = {
            'run_id': run_id, 'status': 'RECOVERY_REQUIRED', 'created_at': now,
            'reason': 'AUTHORITATIVE_RAW_BELOW_MINIMUM',
            'raw_distinct': raw_distinct, 'minimum_raw_distinct': MIN_AUTHORITATIVE_RAW,
            'instruction': 'Continue supplemental discovery in the same cycle using fresh low-overlap sources. Do not weaken quality gates. Do not perform outreach.',
            'priority_source_families': [
                'fresh_growth_business_change', 'official_owner_ceo', 'regional_investment_new_production',
                'export_dealer_franchise', 'management_commercial_transformation', 'partner_business_change'
            ],
            'quality_criteria_may_be_relaxed': False, 'outreach_allowed': False
        }
        write_json(RECOVERY_PATH, recovery)
        write_json(PENDING_PATH, {
            'run_id': run_id, 'updated_at': now, 'status': 'RECOVERY_REQUIRED',
            'qualified_companies': [], 'qualified_staged_not_counted': 0,
            'raw_distinct': raw_distinct,
            'note': f'{run_id} integrated verified rows but cannot be COMPLETED: raw_distinct={raw_distinct}<{MIN_AUTHORITATIVE_RAW}. Supplemental discovery required.'
        })
    else:
        if RECOVERY_PATH.exists():
            RECOVERY_PATH.unlink()
        write_json(PENDING_PATH, {
            'run_id': run_id, 'updated_at': now, 'status': 'CLEARED_AFTER_INTEGRATION',
            'qualified_companies': [], 'qualified_staged_not_counted': 0,
            'note': f'{run_id} integrated physically; canonical/contactable {new_count}/{contactable_count}; integrity PASS; orphan 0/0; outreach 0.'
        })

    print(f'{run_id}: status={final_status} raw={raw_distinct} added={len(added)} canonical={new_count}')


if __name__ == '__main__':
    main()
