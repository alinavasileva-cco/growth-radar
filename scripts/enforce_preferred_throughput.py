from __future__ import annotations

import json
from pathlib import Path

RUNTIME = Path('data/runtime/current_run_status.json')
TARGET = Path('data/runtime/campaign_target.json')
RECOVERY = Path('data/runtime/recovery_required.json')
PREFERRED_MIN_RAW = 300
HARD_MIN_RAW = 120


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding='utf-8'))


def write(path: Path, obj: dict) -> None:
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def main() -> None:
    runtime = load(RUNTIME)
    target = load(TARGET)
    run_id = runtime.get('run_id')
    raw = int((runtime.get('funnel') or {}).get('raw_distinct', (runtime.get('funnel') or {}).get('discovered', 0)) or 0)
    external_proven = bool((runtime.get('completion_gate') or {}).get('external_technical_limitation_proven'))

    hard_passed = raw >= HARD_MIN_RAW or external_proven
    preferred_passed = raw >= PREFERRED_MIN_RAW or external_proven

    gate = runtime.setdefault('completion_gate', {})
    gate['minimum_authoritative_raw'] = HARD_MIN_RAW
    gate['preferred_continue_until_raw'] = PREFERRED_MIN_RAW
    gate['raw_distinct'] = raw
    gate['hard_floor_passed'] = hard_passed
    gate['preferred_throughput_passed'] = preferred_passed
    gate['passed'] = preferred_passed

    if not preferred_passed:
        runtime['status'] = 'UNDERDONE_RECOVERY_REQUIRED' if not hard_passed else 'RECOVERY_REQUIRED'
        runtime['stage'] = 'RECOVERY_REQUIRED'
        runtime['blocker'] = 'RAW_BELOW_120_RECOVERY_REQUIRED' if not hard_passed else 'RAW_BELOW_300_SUPPLEMENTAL_DISCOVERY_REQUIRED'
        target['recovery_required'] = True
        target['repair_required'] = 'RAW_BELOW_300_CONTINUE_FRESH_LOW_OVERLAP_SAME_CYCLE'
        target['latest_attempted_run'] = run_id
        target['latest_attempted_run_id'] = run_id
        target['latest_attempted_run_status'] = runtime['status']
        target['current_run_id'] = run_id
        target['last_run_id'] = run_id
        target['note'] = (
            f'{run_id} requires recovery: raw_distinct {raw}<{PREFERRED_MIN_RAW}; '
            f'hard_floor_passed={hard_passed}; canonical/contactable '
            f"{target.get('current_canonical_count')}/{target.get('current_contactable_count')}; "
            'criteria unchanged; supplemental fresh low-overlap discovery required; outreach 0.'
        )
        write(RECOVERY, {
            'run_id': run_id,
            'status': 'RECOVERY_REQUIRED',
            'reason': 'AUTHORITATIVE_RAW_BELOW_PREFERRED_CONTINUE_THRESHOLD',
            'raw_distinct': raw,
            'hard_minimum_raw_distinct': HARD_MIN_RAW,
            'preferred_continue_until_raw_distinct': PREFERRED_MIN_RAW,
            'hard_floor_passed': hard_passed,
            'external_technical_limitation_proven': external_proven,
            'instruction': 'Continue supplemental discovery in the same cycle across fresh low-overlap lanes until raw>=300 or a proven external technical limitation is recorded. Do not weaken quality gates. Do not perform outreach.',
            'minimum_independent_lanes': 10,
            'quality_criteria_may_be_relaxed': False,
            'outreach_allowed': False,
        })
    else:
        target['latest_attempted_run'] = run_id
        target['latest_attempted_run_id'] = run_id
        target['latest_attempted_run_status'] = runtime.get('status')
        if runtime.get('status') == 'COMPLETED':
            target['recovery_required'] = False
            target['repair_required'] = None
            if RECOVERY.exists():
                RECOVERY.unlink()

    write(RUNTIME, runtime)
    write(TARGET, target)
    print(f'PREFERRED_THROUGHPUT_GATE run={run_id} raw={raw} hard_passed={hard_passed} preferred_passed={preferred_passed} status={runtime.get("status")}')


if __name__ == '__main__':
    main()
