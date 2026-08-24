# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-24T19:55:00+05:00  
**Последний полностью завершённый RUN:** `N5K-20260824-382`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **313 / 313**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4687**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- physical canonical/contactable count: **313 / 313**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260824-382`;
- physical master/integration guard является финальным источником дедупликации;
- устаревшие данные не использовать в решениях, если доступны более свежие подтверждённые сведения.

## Правила продолжения

1. Перед каждым RUN проверять свежий HEAD, `data/runtime/current_run_status.json`, `data/runtime/campaign_target.json`, pending и физические master/contactable.
2. Discovery: целевой throughput 150–200 реальных разных raw-кандидатов за RUN; не засчитывать строки поисковой выдачи как обработанные компании.
3. Использовать несколько независимых discovery-потоков: вакансии/job boards, новости роста/филиалов/новых направлений, отраслевые источники, официальные сайты и публичные публикации собственников/компаний.
4. FAST GATE до deep-check: частная компания/ИП → ориентир масштаба → быстрый dedup → вероятный S1–S3 сигнал.
5. ACTIVE WIP <=50; после завершения пачки продолжать следующую в том же RUN.
6. Deep funnel: SIZE → LEGAL → SIGNAL → LPR → CONTACT → QUALIFIED.
7. QUALIFIED только при подтверждённых: действующее юрлицо/ИП, ИНН, актуальный масштаб, S1–S3 бизнес-сигнал, собственник/ЛПР и практический маршрут связи.
8. Дедуп дважды: до deep-check и непосредственно перед записью по Lead ID, ИНН, ОГРН/ОГРНИП, точному юрлицу и подтверждённой связке бренд+домен.
9. Новая компания засчитывается только после физической записи в leads_master/contactable_master, contacts, evidence, increments/shards, run logs/report/runtime/campaign/config.
10. Qualified не должен оставаться только в pending после завершения RUN.
11. При integrity/dedup/write/metadata проблеме — REPAIR в том же RUN, без обнуления базы и без остановки поиска.
12. RUN завершён только после integrity PASS, orphan contacts=0, orphan evidence=0, физической записи в main и повторной проверки HEAD SHA.
13. Не выполнять outreach, не готовить письма и не тратить RUN на задачи вне поиска/квалификации/интеграции.
14. Технические записи делать пакетно и не создавать отдельный commit на каждый stage/candidate, если это не требуется доступным GitHub-интерфейсом.

## Последний подробный RUN — N5K-20260824-382

Baseline перед RUN: **312 / 312**.  
Фактически индивидуально обработано raw-кандидатов: **20**. Целевые 150–200 в этом RUN не достигнуты и не заявляются.  
Воронка: discovered **20** → fast gate **5** → size **2** → legal **1** → signal **1** → LPR **1** → contact **1** → qualified **1** → physically integrated **1**.  
Duplicates: **5**. Excluded: **14**.  
Добавлена:
- **Камит-Экспорт / Орловский кабельный завод — ООО «КАМИТ-ЭКСПОРТ»**, ИНН `5752050222`, ОГРН `1095752001421`, Lead ID `N5K-0462`.

Ключевые причины отсева: слабый/неподтверждённый масштаб, крупные компании вне рабочего ICP, неоднозначный brand→legal match, отсутствие достаточно свежего S1–S3 сигнала, дубли. Отдельно **Калининградская фабрика упаковки** исключена после legal/quality check: актуальные источники указывают на процедуру банкротства, поэтому активная вакансия не стала основанием для квалификации.

Итог physical canonical/contactable: **313 / 313**.  
Integrity: **PASS**. Orphan contacts/evidence: **0 / 0**. Active WIP: **0**. Outreach: **0**.  
После физической интеграции исправлен stale runtime baseline `294` → фактический `312`; canonical data не пострадали.

История предыдущих RUN сохранена в `run_logs`, `reports`, shards/increments и Git history.

## Последние подтверждённые RUN

- `N5K-20260824-376`: 306/306, +1, PASS, orphan 0/0.
- `N5K-20260824-377`: 308/308, +2, PASS, orphan 0/0.
- `N5K-20260824-378`: 309/309, +1, PASS, orphan 0/0.
- `N5K-20260824-379`: 310/310, +1, PASS, orphan 0/0.
- `N5K-20260824-380`: 311/311, +1, PASS, orphan 0/0.
- `N5K-20260824-381`: 312/312, +1, PASS, orphan 0/0.
- `N5K-20260824-382`: 313/313, +1, PASS, orphan 0/0.

## Latest verified run N5K-20260824-382
Canonical/contactable: 313/313. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest verified run N5K-20260824-383
Canonical/contactable: 314/314. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest verified run N5K-20260824-383
Canonical/contactable: 314/314. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
