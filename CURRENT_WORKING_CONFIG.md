# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-31T03:58:19+03:00  
**Последний полностью завершённый RUN:** `N5K-20260831-534`  
**Статус:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **550 / 550**  
**Qualified staged not counted:** **0**  
**Осталось до 1000:** **450**  
**Осталось до 5000:** **4450**  
**Outreach:** запрещён

## Неприкосновенные правила
- Campaign: `new_5000`; namespace `data/campaigns/new_5000`.
- Перед каждым RUN читать свежий HEAD, runtime/current_run_status, runtime/campaign_target, физические leads_master/contactable_master/contacts/evidence, все свежие immutable `data/pending_workers/**` и минимум 3 последних RUN.
- Единственный canonical writer. Worker только staging/discovery; worker PASS не считается приростом до physical final dedup.
- Критерии качества не ослаблять. Устаревшие записи исключать из решений при наличии более свежих подтверждённых данных.
- До deep-check и непосредственно перед записью выполнять global dedup по Lead ID, ИНН, ОГРН/ОГРНИП, точному юрлицу, подтверждённому brand+domain.
- Строгая воронка: SIZE -> LEGAL -> SIGNAL -> LPR -> CONTACT -> QUALIFIED. Не угадывать контакты, ЛПР, юрлицо, масштаб или сигнал.
- QUALIFIED только при подтверждённых действующем юрлице/ИП, идентификаторах, актуальном масштабе, реальном свежем S1-S3 с датой/источником, ЛПР/собственнике и практическом опубликованном маршруте связи.
- Выставочное/каталожное присутствие само по себе НИКОГДА не SIGNAL.
- Целевой raw 400–800 реально разных кандидатов только если источники продуктивны; raw не добивать каталогами/строками выдачи. После первых 100 raw при qualified=0 или fast_gate/raw<2% менять источники в том же RUN.
- Главная метрика — число НОВЫХ физически net-qualified при неизменном качестве.
- Целевой качественный выход 10–30 за RUN, когда рынок/источники позволяют; это не квота.
- Для каждого lane считать raw, fast_gate, size, signal, qualified, duplicate+early_reject, q/raw и fast/raw; сравнивать текущий RUN и последние 3.
- Если lane два RUN подряд q/raw<0.3% ИЛИ fast/raw<2% ИЛИ duplicate+early_reject>70% — максимум 5% на следующие 3 RUN. Если два RUN подряд 0 qualified — без обычного deep-check. Возврат после 3 RUN только пробной пачкой 20. Если q/raw>=1% либо явно выше медианы последних 3 RUN — увеличить долю следующего RUN, максимум 60% на lane.
- ACTIVE WIP <=50; освобождать слот после PASS/REJECT.
- Qualified интегрировать одним пакетным canonical write в master/contactable, contacts, evidence, increments/shards, run logs/report/runtime/campaign/config. При +0 master/contactable/contacts/evidence не переписывать без необходимости.
- RUN завершён только после записи в main, canonical/contactable sync, integrity PASS, orphan contacts=0, orphan evidence=0, staged/pending закрыты безопасным consumed-index и свежий HEAD повторно проверен.
- Ошибка/desync/partial => REPAIR в том же цикле. Никакого outreach, писем, откликов или рассылок.
- История и доказательства не удаляются: `data/campaigns/new_5000/run_log.csv`, `data/campaigns/new_5000/run_logs/**`, `data/campaigns/new_5000/run_log_corrections/**`, `reports/**`, `data/runtime/worker_consumed_indexes/**`, immutable worker staging.

## RUN 534
Fresh jobs worker: 30 raw / 3 fast_gate / 1 pre-write QUALIFIED. Финальный physical dedup подтвердил, что «Семейные традиции» уже существует как `N5K-0387` (ИНН `6663033058`, ОГРН `1026605619083`, то же юрлицо/domain), поэтому net-qualified = 0 и повторная запись запрещена.

Собственный fresh non-jobs probe: 4 source-level observations; ни один не был протолкнут без полной доказательной цепочки. Итоговая воронка RUN: 34 raw -> 3 fast_gate -> 1 SIZE -> 1 LEGAL -> 1 SIGNAL -> 1 LPR -> 1 CONTACT -> 0 QUALIFIED; duplicates 1; excluded 33. q/raw 0%; fast/raw 8.8235%. К RUN 533R1: q/raw 0 п.п.; fast/raw +2.7011 п.п.; net 0 -> 0.

Jobs остаётся 5% probe-only на следующие 3 RUN. Следующее распределение: **jobs 5% / growth-news 25% / official owner-CEO 35% / industry catalogs probe-only 5% / regional investment 20% / partner-business-change 10%**. Прежнее распределение не повторяется, потому что qualified <5.
