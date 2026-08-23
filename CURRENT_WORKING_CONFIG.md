# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-24T00:12:00+05:00  
**Последний полностью завершённый RUN:** `N5K-20260824-362`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **289 / 289**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4711**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- physical canonical/contactable count: **288 / 288**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260823-361`;
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

## Последний подробный RUN — N5K-20260823-361

Baseline перед RUN: **286 / 286**.  
Фактически индивидуально обработано raw-кандидатов: **24**. Целевые 150–200 в этом RUN не достигнуты и не заявляются.  
Воронка: discovered **24** → fast gate **6** → size **3** → legal **3** → signal **2** → LPR **2** → contact **2** → qualified **2** → physically integrated **2**.  
Duplicates: **4**. Excluded: **18**.  
Добавлены:
- **Galala Brand — ИП Стародуб Галина Николаевна**, ИНН `237001939023`, ОГРНИП `320237500110018`, Lead ID `N5K-0433`.
- **RadiantMove — ИП Алихел Даниил Ахтарович**, ИНН `470423659713`, ОГРНИП `321470400075685`, Lead ID `N5K-0434`.

Итог physical canonical/contactable: **288 / 288**.  
Integrity: **PASS**. Orphan contacts/evidence: **0 / 0**. Active WIP: **0**. Outreach: **0**.

Galala Brand: действующий ИП; текущий employer profile указывает размер команды 20–100 человек, собственную разработку и производство одежды, топ-50 продавцов Wildberries по итогам 2025 года, 250 активных SKU и более 1,3 млн реализованных изделий. Свежий сигнал 17–18.08.2026 — вакансия Head of Sales/РОП marketplace-продаж с прямым подчинением собственнику.

RadiantMove: действующий ИП; правообладатель товарного знака — Даниил Алихел. Свежая вакансия 16–18.08.2026 указывает сезонный оборот 50–70 млн ₽ в месяц на Ozon и поиск РОП по нескольким marketplace-каналам; ранее прямой employer profile фиксировал 106 млн ₽ продаж за 2024 год.

История предыдущих RUN сохранена в `run_logs`, `reports`, shards/increments и Git history.

## Latest verified run N5K-20260823-352
Canonical/contactable: 274/274. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260823-353
Canonical/contactable: 276/276. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260823-354
Canonical/contactable: 278/278. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260823-355
Canonical/contactable: 280/280. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260823-356
Canonical/contactable: 281/281. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260823-357
Canonical/contactable: 282/282. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260823-358
Canonical/contactable: 283/283. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260823-359
Canonical/contactable: 285/285. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260823-360
Canonical/contactable: 286/286. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260823-361
Canonical/contactable: 288/288. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest verified run N5K-20260824-362
Canonical/contactable: 289/289. Added: 1. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest verified run N5K-20260824-363
Canonical/contactable: 290/290. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
