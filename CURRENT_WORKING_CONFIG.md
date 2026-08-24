# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-24T09:20:00+05:00  
**Последний полностью завершённый RUN:** `N5K-20260824-371`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **300 / 300**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4700**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- physical canonical/contactable count: **300 / 300**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260824-371`;
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

## Последний подробный RUN — N5K-20260824-371

Baseline перед RUN: **298 / 298**.  
Фактически индивидуально обработано raw-кандидатов: **32**. Целевые 150–200 в этом RUN не достигнуты и не заявляются.  
Воронка: discovered **32** → fast gate **5** → size **3** → legal **2** → signal **2** → LPR **2** → contact **2** → qualified **2** → physically integrated **2**.  
Duplicates: **7**. Excluded: **23**.  
Добавлены:
- **БлескСервис Регион / Блеск — ООО «БЛЕСКСЕРВИС РЕГИОН»**, ИНН `1657096815`, ОГРН `1101690046105`, Lead ID `N5K-0447`.
- **СтандартПродМаш / ГК СтандартПродМаш — ООО ГК «СТАНДАРТПРОДМАШ»**, ИНН `7716918242`, ОГРН `1187746722932`, Lead ID `N5K-0448`.

Итог physical canonical/contactable: **300 / 300**.  
Integrity: **PASS**. Orphan contacts/evidence: **0 / 0**. Active WIP: **0**. Outreach: **0**.

История предыдущих RUN сохранена в `run_logs`, `reports`, shards/increments и Git history.

## Последние подтверждённые RUN

- `N5K-20260824-366`: 294/294, +1, PASS, orphan 0/0.
- `N5K-20260824-367`: 295/295, +1, PASS, orphan 0/0.
- `N5K-20260824-368`: 296/296, +1, PASS, orphan 0/0.
- `N5K-20260824-369`: 297/297, +1, PASS, orphan 0/0.
- `N5K-20260824-370`: 298/298, +1, PASS, orphan 0/0.
- `N5K-20260824-371`: 300/300, +2, PASS, orphan 0/0.
