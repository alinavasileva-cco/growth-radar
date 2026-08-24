# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-25T03:16:00+05:00  
**Последний полностью завершённый RUN:** `N5K-20260825-391`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **323 / 323**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4677**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- physical canonical/contactable count: **323 / 323**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260825-391`;
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

## Последний подробный RUN — N5K-20260825-391

Baseline перед RUN: **321 / 321**.  
Фактически индивидуально обработано raw-кандидатов: **24**. Целевые 150–200 в этом RUN не достигнуты и не заявляются.  
Воронка: discovered **24** → fast gate **6** → size **3** → legal **2** → signal **2** → LPR **2** → contact **2** → qualified **2** → physically integrated **2**.  
Duplicates: **5**. Excluded: **17**.  
Добавлены:
- **PANELOK / ПанелОК — ООО «ТЕРМОЛОГИСТИКА»**, ИНН `6319233160`, ОГРН `1186313090270`, Lead ID `N5K-0473`.
- **БИКОМ / BIKOM — ООО «БИКОМ»**, ИНН `5262101750`, ОГРН `1025203734302`, Lead ID `N5K-0474`.

Итог physical canonical/contactable: **323 / 323**.  
Integrity: **PASS**. Orphan contacts/evidence: **0 / 0**. Active WIP: **0**. Outreach: **0**.  
Integration физически добавила обе компании. Повторный trigger после первой успешной интеграции временно переписал funnel как qualified=0/duplicates=7; фактический результат восстановлен по physical master. Автоматический stale baseline `294` исправлен на фактический baseline `321`; campaign target и run metrics синхронизированы на RUN 391.

История предыдущих RUN сохранена в `run_logs`, `reports`, shards/increments и Git history.

## Последние подтверждённые RUN

- `N5K-20260824-383`: 314/314, +1, PASS, orphan 0/0.
- `N5K-20260824-384`: 316/316, +2, PASS, orphan 0/0.
- `N5K-20260824-385`: 317/317, +1, PASS, orphan 0/0.
- `N5K-20260824-386`: 318/318, +1, PASS, orphan 0/0.
- `N5K-20260824-387`: 319/319, +1, PASS, orphan 0/0.
- `N5K-20260825-388`: 319/319, +0, PASS, orphan 0/0.
- `N5K-20260825-389`: 320/320, +1, PASS, orphan 0/0.
- `N5K-20260825-390`: 321/321, +1, PASS, orphan 0/0.
- `N5K-20260825-391`: 323/323, +2, PASS, orphan 0/0.

## Latest verified run N5K-20260825-391
Canonical/contactable: 323/323. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest verified run N5K-20260825-392
Canonical/contactable: 325/325. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
