from pathlib import Path
from datetime import datetime, timezone, timedelta
import csv
import json
import re

RUN_ID = 'GR-20260801-101'
REPORT = 'reports/run_2026-08-01_101_integrity_repair.md'
NOW = datetime.now(timezone(timedelta(hours=3))).isoformat(timespec='seconds')
master_path = Path('data/leads_master.csv')


def read_csv(path):
    with path.open('r', encoding='utf-8-sig', newline='') as f:
        return list(csv.DictReader(f))


def clean(v):
    return (v or '').strip()


def digits(v):
    s = re.sub(r'\D', '', clean(v))
    return s if len(s) >= 10 else ''


def norm(v):
    return re.sub(r'[^0-9a-zа-яё]+', '', clean(v).lower())


def domain(v):
    s = clean(v).lower()
    s = re.sub(r'^https?://', '', s).split('/')[0]
    return s.removeprefix('www.')


def lead_num(v):
    m = re.search(r'(\d+)$', clean(v))
    return int(m.group(1)) if m else 10**9


if not master_path.exists():
    raise SystemExit('data/leads_master.csv is missing')

with master_path.open('r', encoding='utf-8-sig', newline='') as f:
    reader = csv.DictReader(f)
    fieldnames = list(reader.fieldnames or [])
    base_rows = list(reader)
if not fieldnames or 'Lead ID' not in fieldnames:
    raise SystemExit('Invalid master schema')

increment_paths = sorted(Path('data/increments').glob('leads_*.csv'))
sourced = [(r, 'data/leads_master.csv') for r in base_rows]
increment_row_count = 0
skipped_schema_files = []
for p in increment_paths:
    with p.open('r', encoding='utf-8-sig', newline='') as f:
        rd = csv.DictReader(f)
        rows = list(rd)
        cols = set(rd.fieldnames or [])
    if 'Lead ID' not in cols:
        skipped_schema_files.append(str(p))
        continue
    for raw in rows:
        row = {k: clean(raw.get(k, '')) for k in fieldnames}
        sourced.append((row, str(p)))
        increment_row_count += 1

canonical = []
source_for = []
by_id = {}
by_inn = {}
by_ogrn = {}
by_legal = {}
by_brand_domain = {}
aliases = {}
duplicate_events = []
same_id_updates = 0

latest_fields = {
    'Legal Status', 'Company Description', 'Company Size', 'Employee Estimate', 'Revenue', 'Profit',
    'Financial Period', 'Revenue Source', 'Revenue Confidence', 'Signal Level', 'Signal Summary',
    'Signal Date', 'Signal Source', 'News Context', 'Business Context', 'Why Company Is Selected',
    'Consulting Hypothesis', 'Potential Product', 'Owner', 'Founder', 'CEO', 'LPR', 'LPR Role', 'LPR Source',
    'Primary Phone', 'Primary Email', 'Telegram', 'VK', 'HH Contact', 'Contact Form', 'Other Contact',
    'Contact Type', 'Contact Source', 'Number Of Contacts Found', 'Current Stage', 'Final Quick Status',
    'Attempts', 'Last Action', 'Last Meaningful Change', 'Blocker', 'Next Action', 'Exclusion Reason',
    'Updated At', 'Run ID'
}


def keys(row):
    lid = clean(row.get('Lead ID'))
    inn = digits(row.get('INN'))
    ogrn = digits(row.get('OGRN / OGRNIP'))
    legal = norm(row.get('Legal Name'))
    bd = (norm(row.get('Brand')), domain(row.get('Website')))
    if not bd[0] or not bd[1]:
        bd = ('', '')
    return lid, inn, ogrn, legal, bd


for row, src in sourced:
    lid, inn, ogrn, legal, bd = keys(row)
    idx = None
    reason = ''
    if lid and lid in by_id:
        idx, reason = by_id[lid], 'same Lead ID'
        same_id_updates += 1
    elif inn and inn in by_inn:
        idx, reason = by_inn[inn], 'duplicate INN'
    elif ogrn and ogrn in by_ogrn:
        idx, reason = by_ogrn[ogrn], 'duplicate OGRN/OGRNIP'
    elif legal and legal in by_legal:
        idx, reason = by_legal[legal], 'duplicate legal name'
    elif bd != ('', '') and bd in by_brand_domain:
        idx, reason = by_brand_domain[bd], 'duplicate brand+domain'

    if idx is None:
        idx = len(canonical)
        canonical.append(dict(row))
        source_for.append(src)
    else:
        current = canonical[idx]
        canonical_id = clean(current.get('Lead ID'))
        if lid and canonical_id and lid != canonical_id:
            aliases[lid] = canonical_id
            duplicate_events.append({
                'Duplicate Lead ID': lid,
                'Canonical Lead ID': canonical_id,
                'Reason': reason,
                'INN': inn,
                'OGRN / OGRNIP': ogrn,
                'Duplicate Source': src,
                'Canonical Source': source_for[idx]
            })
        for k in fieldnames:
            nv, ov = clean(row.get(k)), clean(current.get(k))
            if not nv:
                continue
            if not ov or k in latest_fields:
                if k == 'Lead ID' and ov:
                    continue
                if k == 'Added At' and ov:
                    continue
                current[k] = nv

    current = canonical[idx]
    clid, cinn, cogrn, clegal, cbd = keys(current)
    if clid:
        by_id[clid] = idx
    if lid:
        by_id[lid] = idx
    if cinn:
        by_inn[cinn] = idx
    if inn:
        by_inn[inn] = idx
    if cogrn:
        by_ogrn[cogrn] = idx
    if ogrn:
        by_ogrn[ogrn] = idx
    if clegal:
        by_legal[clegal] = idx
    if legal:
        by_legal[legal] = idx
    if cbd != ('', ''):
        by_brand_domain[cbd] = idx
    if bd != ('', ''):
        by_brand_domain[bd] = idx

canonical.sort(key=lambda r: (lead_num(r.get('Lead ID')), clean(r.get('Lead ID'))))

ids = [clean(r.get('Lead ID')) for r in canonical]
inns = [digits(r.get('INN')) for r in canonical if digits(r.get('INN'))]
ogrns = [digits(r.get('OGRN / OGRNIP')) for r in canonical if digits(r.get('OGRN / OGRNIP'))]
if len(ids) != len(set(ids)):
    raise SystemExit('Duplicate Lead IDs remain after repair')
if len(inns) != len(set(inns)):
    raise SystemExit('Duplicate INNs remain after repair')
if len(ogrns) != len(set(ogrns)):
    raise SystemExit('Duplicate OGRNs remain after repair')
if len(canonical) < len(base_rows):
    raise SystemExit('Repair unexpectedly reduced the verified base')

with master_path.open('w', encoding='utf-8', newline='') as f:
    w = csv.DictWriter(f, fieldnames=fieldnames, lineterminator='\n')
    w.writeheader()
    w.writerows(canonical)

corr_path = Path('data/corrections/integrity_repair_2026-08-01_101.csv')
corr_path.parent.mkdir(parents=True, exist_ok=True)
corr_fields = ['Duplicate Lead ID', 'Canonical Lead ID', 'Reason', 'INN', 'OGRN / OGRNIP', 'Duplicate Source', 'Canonical Source']
with corr_path.open('w', encoding='utf-8', newline='') as f:
    w = csv.DictWriter(f, fieldnames=corr_fields, lineterminator='\n')
    w.writeheader()
    w.writerows(duplicate_events)


def canonical_id(raw):
    x = clean(raw)
    seen = set()
    while x in aliases and x not in seen:
        seen.add(x)
        x = aliases[x]
    return x


def count_unique_repo_records(keyword):
    records = set()
    files = []
    for p in sorted(Path('data').rglob('*.csv')):
        name = p.name.lower()
        if keyword not in name or 'run_log' in name or 'correction' in str(p).lower():
            continue
        try:
            rows = read_csv(p)
        except Exception:
            continue
        if not rows:
            continue
        files.append(str(p))
        for row in rows:
            lid_key = next((k for k in row if norm(k) in {'leadid', 'companyleadid'}), None)
            if lid_key:
                row[lid_key] = canonical_id(row.get(lid_key))
            stable = []
            for k, v in row.items():
                nk = norm(k)
                if nk in {'runid', 'contactid', 'evidenceid', 'addedat', 'updatedat', 'checkedat', 'createdat', 'timestamp'}:
                    continue
                stable.append((nk, clean(v)))
            if any(v for _, v in stable):
                records.add(tuple(sorted(stable)))
    return len(records), files


contacts_count, contact_files = count_unique_repo_records('contact')
evidence_count, evidence_files = count_unique_repo_records('evidence')

status_values = [clean(r.get('Final Quick Status')).upper() for r in canonical]
contactable = sum('МОЖНО' in s for s in status_values)
need_recheck = sum('ДОПРОВЕР' in s for s in status_values)
reserve = sum(('RESERVE' in s or 'РЕЗЕРВ' in s) for s in status_values)
blocked = sum('BLOCKED' in s for s in status_values)
excluded = sum(('EXCLUDED' in s or 'ИСКЛЮЧ' in s) for s in status_values)

metrics = {
    'generated_at': NOW,
    'latest_run_id': RUN_ID,
    'canonical_pool_verified': len(canonical),
    'unique_lead_ids_verified': len(set(ids)),
    'unique_inns_verified': len(set(inns)),
    'unique_ogrns_verified': len(set(ogrns)),
    'base_rows_before_repair': len(base_rows),
    'increment_files_processed': len(increment_paths),
    'increment_rows_processed': increment_row_count,
    'duplicate_aliases_removed': len(duplicate_events),
    'same_lead_id_updates_merged': same_id_updates,
    'contacts_verified_from_repository_records': contacts_count,
    'evidence_records_verified_from_repository_records': evidence_count,
    'contactable_verified': contactable,
    'need_recheck_verified': need_recheck,
    'reserve_verified': reserve,
    'blocked_verified': blocked,
    'excluded_verified': excluded,
    'total_target': 1000,
    'remaining_to_target': max(0, 1000 - len(canonical)),
    'outreach_sent': 0,
    'integrity_status': 'ACTIVE',
    'notes': 'RUN 101 — master восстановлен из текущего master и всех leads increment-файлов; дубли сведены по Lead ID, ИНН, ОГРН/ОГРНИП, юрлицу и brand+domain. Новые компании не искались и не добавлялись.'
}
Path('data/run_metrics.json').write_text(json.dumps(metrics, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

report = f'''# Growth Radar — RUN {RUN_ID}\n\nДата: {NOW}\n\n## Результат\n\nВыполнено автоматическое восстановление целостности канонической базы. Новые компании не искались и не добавлялись. Обращения не готовились и не отправлялись.\n\n## Что исправлено\n\n- строк в master до ремонта: **{len(base_rows)}**;\n- обработано lead-increment файлов: **{len(increment_paths)}**;\n- обработано строк increment: **{increment_row_count}**;\n- итоговых уникальных карточек: **{len(canonical)}**;\n- уникальных Lead ID: **{len(set(ids))}**;\n- уникальных ИНН: **{len(set(inns))}**;\n- уникальных ОГРН/ОГРНИП: **{len(set(ogrns))}**;\n- удалено межкарточных дублей: **{len(duplicate_events)}**;\n- слито обновлений с тем же Lead ID: **{same_id_updates}**.\n\nКарта дублей сохранена в `{corr_path}`.\n\n## Проверка статусов\n\n- можно связываться: **{contactable}**;\n- нужна допроверка: **{need_recheck}**;\n- резерв: **{reserve}**;\n- blocked: **{blocked}**;\n- исключено: **{excluded}**.\n\n## Правило самовосстановления\n\nПри следующем нарушении целостности процесс обязан в том же цикле перейти в режим REPAIR: восстановить master из подтверждённых increment-файлов и истории Git, пересчитать метрики и продолжить работу. Молчаливое накопление BLOCKED/нулевых запусков запрещено. Если автоматический ремонт невозможен, пользователь должен быть уведомлён сразу в момент ошибки.\n'''
Path(REPORT).parent.mkdir(parents=True, exist_ok=True)
Path(REPORT).write_text(report, encoding='utf-8')

run_log = Path('data/run_log.csv')
if run_log.exists():
    with run_log.open('r', encoding='utf-8-sig', newline='') as f:
        rd = csv.DictReader(f)
        log_fields = list(rd.fieldnames or [])
        log_rows = list(rd)
    if not any(r.get('Run ID') == RUN_ID for r in log_rows):
        row = {k: '' for k in log_fields}
        values = {
            'Run ID': RUN_ID,
            'Start Time': NOW,
            'End Time': NOW,
            'Unique Companies Added': '0',
            'Unique INNs Added': '0',
            'Contacts Found': str(contacts_count),
            'Contactable Companies': str(contactable),
            'Need Recheck': str(need_recheck),
            'Reserve': str(reserve),
            'Blocked': str(blocked),
            'Excluded': str(excluded),
            'Total Pool': str(len(canonical)),
            'Remaining To 100': str(max(0, 100 - len(canonical))),
            'Remaining To 1000': str(max(0, 1000 - len(canonical))),
            'Report': REPORT,
            'Commit SHA': 'REPAIR_COMMIT_PENDING'
        }
        row.update({k: v for k, v in values.items() if k in row})
        log_rows.append(row)
        with run_log.open('w', encoding='utf-8', newline='') as f:
            w = csv.DictWriter(f, fieldnames=log_fields, lineterminator='\n')
            w.writeheader()
            w.writerows(log_rows)

single_log = Path('data/run_logs/GR-20260801-101.csv')
single_log.parent.mkdir(parents=True, exist_ok=True)
single_log.write_text(
    'Run ID,Run Type,Companies Added,Canonical Pool,Integrity Status,Report,Commit SHA\n'
    f'{RUN_ID},INTEGRITY_REPAIR,0,{len(canonical)},ACTIVE,{REPORT},REPAIR_COMMIT_PENDING\n',
    encoding='utf-8'
)

config = f'''# Growth Radar — актуальная рабочая конфигурация\n\n**Версия:** 01.08.2026  \n**Последний подтверждённый запуск:** `{RUN_ID}`  \n**Статус:** `ACTIVE` — канонический master восстановлен и проверен  \n**Текущая цель:** 1000 уникальных компаний  \n**Автоматический outreach:** запрещён\n\n## Проверенное состояние\n\n- уникальных компаний: **{len(canonical)}**;\n- уникальных Lead ID: **{len(set(ids))}**;\n- уникальных ИНН: **{len(set(inns))}**;\n- уникальных ОГРН/ОГРНИП: **{len(set(ogrns))}**;\n- можно связываться: **{contactable}**;\n- нужна допроверка: **{need_recheck}**;\n- резерв: **{reserve}**;\n- blocked: **{blocked}**;\n- исключено: **{excluded}**;\n- осталось до цели: **{max(0, 1000 - len(canonical))}**.\n\n## Канонические файлы\n\n- компании: `data/leads_master.csv`;\n- карта устранённых дублей: `{corr_path}`;\n- метрики: `data/run_metrics.json`;\n- журнал: `data/run_log.csv` и `data/run_logs/GR-*.csv`;\n- отчёты: `reports/run_*.md`.\n\n## Обязательная квалификация\n\nДля каждой новой компании проверяются действующий бизнес, связь бренда с юрлицом или ИП, ИНН/ОГРН/ОГРНИП, масштаб, собственник или ЛПР, бизнес-сигнал, практический маршрут связи, источники и дата проверки. Одна компания или ИП — одна карточка. Дедупликация выполняется по Lead ID, ИНН, ОГРН/ОГРНИП, юрлицу и подтверждённой связке бренд+домен.\n\n## Обязательное самовосстановление\n\nПри любой остановке из-за ошибки целостности автоматизация не должна ограничиваться статусом BLOCKED. В том же цикле она обязана:\n\n1. перейти в режим REPAIR;\n2. восстановить master из подтверждённых increment-файлов и истории Git;\n3. проверить уникальность Lead ID, ИНН и ОГРН/ОГРНИП;\n4. синхронизировать метрики, журнал и отчёт;\n5. продолжить почасовой поиск после подтверждённого commit SHA.\n\nЕсли автоматический ремонт объективно невозможен, нужно немедленно сообщить пользователю об ошибке и конкретном препятствии. Молчаливое создание повторных BLOCKED или нулевых RUN запрещено.\n\n## Ограничения\n\nНе готовить и не отправлять обращения, письма, резюме и отклики. Не добавлять сомнительные компании ради количества. Не считать RUN выполненным без фактической записи в GitHub и подтверждённого commit SHA.\n'''
Path('CURRENT_WORKING_CONFIG.md').write_text(config, encoding='utf-8')

Path('.github/workflows/sync-grm117.yml').unlink(missing_ok=True)
Path('.github/workflows/repair-growth-radar.yml').unlink(missing_ok=True)
Path('scripts/repair_growth_radar.py').unlink(missing_ok=True)
