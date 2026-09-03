# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-09-03T13:32:24+03:00  
**Последний физически завершённый RUN:** `N5K-20260903-607`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **612 / 612**  
**Qualified staged not counted:** **0**  
**Ближайший операционный рубеж:** **1000** подтверждённых contactable компаний  
**Основная цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось до 1000:** **388**  
**Осталось до 5000:** **4388**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- перед каждым RUN заново определять факт по свежему Git HEAD, `data/runtime/current_run_status.json`, `data/runtime/campaign_target.json`, физическим campaign-local `leads_master/contactable_master`, contacts/evidence, pending и свежим worker-staging;
- physical canonical/contactable count: **612 / 612**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260903-607`;
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

## Последний RUN: N5K-20260902-587

- baseline: **600**;
- canonical/contactable after: **601 / 601**;
- net_new: **+1** — **ПП ВОСХОД**;
- authoritative raw: **120**;
- funnel: **120 raw → 1 fast gate → 1 SIZE → 1 LEGAL → 1 SIGNAL → 1 LPR → 1 CONTACT → 1 QUALIFIED**;
- duplicates: **0**; excluded: **119**;
- lanes: fresh official_owner staging **58 raw / 1 qualified**; supplemental fresh growth/expansion **62 raw / 0 qualified**;
- hard floor 120 met; preferred throughput 400–800 and preferred continue-until-300 threshold **не достигнуты**, поэтому следующий цикл обязан расширить/ротировать fresh low-overlap lanes, а не повторять насыщенную выборку;
- integrity PASS; orphan contacts/evidence **0 / 0**; staged **0**; active WIP **0**; outreach **0**.

Полная историческая детализация сохранена в `data/campaigns/new_5000/run_log.csv`, `data/campaigns/new_5000/run_logs/**`, `reports/**`, immutable worker-staging и Git history; она не дублируется здесь, чтобы устаревшие baseline не использовались как текущие.


## Latest attempted run N5K-20260902-588
Canonical/contactable: 601/601. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 16. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260902-588R1
Canonical/contactable: 601/601. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 30. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260902-588R1
Canonical/contactable: 601/601. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 31. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260902-588R1
Canonical/contactable: 601/601. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 32. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260902-588R1
Canonical/contactable: 602/602. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 33. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260902-588R1
Canonical/contactable: 604/604. Status: COMPLETED. Authoritative raw distinct: 305. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260902-589
Canonical/contactable: 604/604. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 53. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260902-589
Canonical/contactable: 604/604. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 54. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260902-590
Canonical/contactable: 604/604. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 38. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260902-591
Canonical/contactable: 605/605. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 34. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260902-592
Canonical/contactable: 605/605. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 50. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260902-593
Canonical/contactable: 605/605. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 32. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260903-594
Canonical/contactable: 605/605. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 40. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260903-595
Canonical/contactable: 605/605. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 45. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260903-596
Canonical/contactable: 605/605. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 56. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260903-597
Canonical/contactable: 605/605. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 24. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260903-598
Canonical/contactable: 606/606. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 26. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260903-599
Canonical/contactable: 606/606. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 30. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260903-600
Canonical/contactable: 607/607. Status: COMPLETED. Authoritative raw distinct: 147. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260903-601
Canonical/contactable: 608/608. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 47. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260903-602
Canonical/contactable: 609/609. Status: COMPLETED. Authoritative raw distinct: 120. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260903-603
Canonical/contactable: 609/609. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 46. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260903-604
Canonical/contactable: 610/610. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 64. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260903-605
Canonical/contactable: 611/611. Status: UNDERDONE_RECOVERY_REQUIRED. Authoritative raw distinct: 72. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260903-606
Canonical/contactable: 611/611. Status: COMPLETED. Authoritative raw distinct: 177. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest attempted run N5K-20260903-607
Canonical/contactable: 612/612. Status: COMPLETED. Authoritative raw distinct: 127. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
