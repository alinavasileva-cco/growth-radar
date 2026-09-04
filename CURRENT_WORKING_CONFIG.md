# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-09-04T01:28:27+03:00  
**Последний физически завершённый RUN:** `N5K-20260903-609`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **613 / 613**  
**Qualified staged not counted:** **0**  
**Ближайший операционный рубеж:** **1000** подтверждённых contactable компаний  
**Основная цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось до 1000:** **387**  
**Осталось до 5000:** **4387**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- перед каждым RUN заново определять факт по свежему Git HEAD, `data/runtime/current_run_status.json`, `data/runtime/campaign_target.json`, физическим campaign-local `leads_master/contactable_master`, contacts/evidence, pending и свежим worker-staging;
- physical canonical/contactable count: **613 / 613**;
- orphan contacts/evidence: **0 / 0**;
- последний физически обработанный RUN: `N5K-20260903-609`;
- physical master/integration guard — финальный источник дедупликации;
- исторические RUN/count нельзя использовать как зашитый baseline;
- устаревшие данные исключать из решений при наличии более свежих подтверждённых сведений;
- старые root-level `data/leads_master.csv`, `data/contact_routes_master.csv`, `data/evidence_master.csv` не являются валидатором кампании `new_5000`.

## Правила продолжения

1. Целевой discovery throughput — **400–800 реально разных raw-кандидатов за RUN, если источники позволяют**. Это не квота и не основание снижать критерии. Если raw <300, не завершать discovery сразу: переключаться на другие fresh low-overlap источники и добирать партии в том же цикле, пока не исчерпаны разумно доступные источники/лимит выполнения. Жёсткий completion floor — **120 authoritative employer-level raw** без доказанного внешнего технического ограничения.
2. Использовать и ротировать **не менее 10 независимых discovery-lanes**, отдавая приоритет fresh growth/business-change, regional investment/new production, official owner/CEO/company, export/dealer/franchise/partner expansion, management/commercial transformation; jobs — probe-only.
3. Для каждого lane сохранять фактические raw, duplicates+early rejects, duplicate/reject rate и qualified. Если duplicate+early reject >70% на первых 20 кандидатах, останавливать lane на текущем RUN и перераспределять время.
4. В начале каждого RUN обрабатывать все свежие immutable staging-файлы из `data/pending_workers/**`; worker только поставляет кандидатов, canonical writer один.
5. FAST GATE для всех raw до deep-check: российская частная компания/ИП → актуальный масштаб → быстрый dedup по in-memory canonical keys → вероятный S1–S3 сигнал.
6. Перед discovery строить актуальный in-memory набор canonical keys: Lead ID, ИНН, ОГРН/ОГРНИП, точное юрлицо, подтверждённая связка бренд+домен.
7. ACTIVE WIP <=50; после PASS/REJECT освобождать слот.
8. Deep funnel не ослаблять: SIZE → LEGAL → SIGNAL → LPR → CONTACT → QUALIFIED.
9. QUALIFIED только при подтверждённых: действующее юрлицо/ИП, ИНН, актуальный соответствующий масштаб, реальный датированный S1–S3 сигнал с источником, собственник/ЛПР и практический опубликованный маршрут связи. Никаких догадок или сгенерированных контактов.
10. Приоритет S1/S2 и сильным S3 с быстро доступными доказательствами; слабого кандидата отклонять рано.
11. Дедуп выполнять дважды: до deep-check и непосредственно перед записью по Lead ID, ИНН, ОГРН/ОГРНИП, точному юрлицу и brand+domain.
12. Целевой выход — максимально возможное число реальных уникальных qualified; ориентир **20–40 за RUN**, только если источники позволяют без снижения качества.
13. Discovery/deep-check выполнять пакетно по lanes/batches; canonical writer должен оставаться один.
14. Qualified интегрировать атомарным пакетом в campaign-local `leads_master/contactable_master`, contacts, evidence, shards, run logs/report/runtime/campaign/config.
15. Qualified не должен оставаться только в pending после завершения RUN.
16. При integrity/dedup/write/metadata/BLOCKED/zero-result/частичном RUN — REPAIR в том же цикле, без обнуления базы и без остановки поиска.
17. RUN завершён только после физической записи в main, canonical=contactable, staged/pending=0, integrity PASS, orphan contacts=0, orphan evidence=0, active WIP=0 и повторно проверенного HEAD SHA.
18. После RUN фиксировать общую воронку и фактическую статистику discovery-lanes. Не реконструировать отсутствующие метрики задним числом.
19. После интеграции worker-staging помечать consumed по существующей безопасной схеме; доказательства истории не удалять.
20. Не выполнять outreach, письма, сообщения, отклики или подготовку рассылки.

## Последний RUN: N5K-20260903-609

- baseline: **613**;
- canonical/contactable after: **613 / 613**;
- net_new: **0**;
- authoritative raw distinct/discovered: **121 / 121**;
- funnel: **121 raw → 3 FAST GATE → 3 SIZE → 3 LEGAL → 3 SIGNAL → 3 LPR → 2 CONTACT → 0 QUALIFIED**;
- physical duplicates: **2**; excluded: **119**;
- lanes: **12**; saturation rotations: **0** recorded;
- both deep-check candidates were rejected by the physical canonical writer as existing duplicates: Ивановская Текстильная Компания (INN, OGRN, BRAND_DOMAIN) and Лалибела Кофе (INN, OGRN, LEGAL_NAME);
- hard floor **120 passed**, but preferred continue-until-300 threshold **not reached**; no external technical limitation claimed;
- final status/stage: **RECOVERY_REQUIRED / RECOVERY_REQUIRED**;
- integrity PASS; orphan contacts/evidence **0 / 0**; staged **0**; active WIP **0**; outreach **0**.

Полная историческая детализация сохранена в `data/campaigns/new_5000/run_log.csv`, `data/campaigns/new_5000/run_logs/**`, `data/campaigns/new_5000/run_log_corrections/**`, `reports/**`, immutable worker-staging и Git history. Устаревшие исторические baseline/status не дублируются здесь как текущая конфигурация.


## Latest attempted run N5K-20260903-610
Canonical/contactable: 613/613. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 34. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260903-611
Canonical/contactable: 613/613. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 11. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260903-612
Canonical/contactable: 613/613. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 48. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260903-613
Canonical/contactable: 613/613. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 20. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260903-614
Canonical/contactable: 613/613. Status: RECOVERY_REQUIRED. Authoritative raw distinct: 127. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260903-615
Canonical/contactable: 613/613. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 50. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260903-616
Canonical/contactable: 613/613. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 60. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260903-617
Canonical/contactable: 613/613. Status: RECOVERY_REQUIRED. Authoritative raw distinct: 120. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260904-618
Canonical/contactable: 613/613. Status: RECOVERY_REQUIRED. Authoritative raw distinct: 120. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260904-619
Canonical/contactable: 613/613. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 45. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260904-620
Canonical/contactable: 613/613. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 86. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260904-621
Canonical/contactable: 613/613. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 80. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260904-622
Canonical/contactable: 613/613. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 60. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
