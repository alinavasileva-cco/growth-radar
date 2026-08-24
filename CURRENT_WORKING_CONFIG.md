# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-24T21:22:00+05:00  
**Последний полностью завершённый RUN:** `N5K-20260824-384`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **316 / 316**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4684**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- physical canonical/contactable count: **316 / 316**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260824-384`;
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

## Последний подробный RUN — N5K-20260824-384

Baseline перед RUN: **314 / 314**.  
Фактически индивидуально обработано raw-кандидатов: **24**. Целевые 150–200 в этом RUN не достигнуты и не заявляются.  
Воронка: discovered **24** → fast gate **6** → size **3** → legal **2** → signal **2** → LPR **2** → contact **2** → qualified **2** → physically integrated **2**.  
Duplicates: **5**. Excluded: **17**.  
Добавлены:
- **Brand Lovers — ИП Саркисян Иоланта Сергеевна**, ИНН `616507782077`, ОГРНИП `319619600041106`, Lead ID `N5K-0464`.
- **Vzlet Agency / Сила Ума — ИП Мельников Виктор Юрьевич**, ИНН `330801191308`, ОГРНИП `32430000019156`, Lead ID `N5K-0465`.

Итог physical canonical/contactable: **316 / 316**.  
Integrity: **PASS**. Orphan contacts/evidence: **0 / 0**. Active WIP: **0**. Outreach: **0**.  
Автоматический integration runtime записал stale baseline `294`; в этом же RUN baseline восстановлен на фактический `314` по physical master. Campaign target и metrics синхронизированы на RUN 384.

История предыдущих RUN сохранена в `run_logs`, `reports`, shards/increments и Git history.

## Последние подтверждённые RUN

- `N5K-20260824-378`: 309/309, +1, PASS, orphan 0/0.
- `N5K-20260824-379`: 310/310, +1, PASS, orphan 0/0.
- `N5K-20260824-380`: 311/311, +1, PASS, orphan 0/0.
- `N5K-20260824-381`: 312/312, +1, PASS, orphan 0/0.
- `N5K-20260824-382`: 313/313, +1, PASS, orphan 0/0.
- `N5K-20260824-383`: 314/314, +1, PASS, orphan 0/0.
- `N5K-20260824-384`: 316/316, +2, PASS, orphan 0/0.

## Latest verified run N5K-20260824-384
Canonical/contactable: 316/316. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260824-385
Canonical/contactable: 317/317. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest verified run N5K-20260824-385
Canonical/contactable: 317/317. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
