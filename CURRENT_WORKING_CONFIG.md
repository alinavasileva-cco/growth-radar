# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-25T10:00:00+03:00  
**Последний полностью завершённый RUN:** `N5K-20260825-399`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **334 / 334**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4666**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- physical canonical/contactable count: **334 / 334**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260825-399`;
- physical master/integration guard является финальным источником дедупликации;
- устаревшие данные не использовать в решениях, если доступны более свежие подтверждённые сведения.

## Правила продолжения

1. Перед каждым RUN проверять свежий HEAD, `data/runtime/current_run_status.json`, `data/runtime/campaign_target.json`, pending и физические master/contactable.
2. Discovery: целевой throughput 200–300 реальных разных raw-кандидатов за RUN; не засчитывать строки поисковой выдачи как обработанные компании.
3. Использовать минимум шесть независимых discovery-потоков: вакансии/job boards, новости роста/филиалов/новых направлений/инвестиций/экспорта, отраслевые каталоги и рейтинги, официальные сайты/вакансии/новости, Telegram/VK/YouTube/интервью/публикации собственников, expansion-поиск по сильным сегментам.
4. FAST GATE до deep-check: российская частная компания/ИП → ориентир масштаба → быстрый dedup → вероятный S1–S3 сигнал.
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

## Последний подробный RUN — N5K-20260825-399

Baseline перед RUN: **333 / 333**.  
Фактически индивидуально обработано raw-кандидатов: **64**. Целевые 200–300 в этом RUN не достигнуты и не заявляются.  
Воронка после authoritative physical dedup и REPAIR: discovered **64** → fast gate **10** → size **5** → legal **4** → signal **3** → LPR **2** → contact **2** → qualified unique **1** → physically integrated **1**.  
Duplicates: **19**. Excluded: **44**.  
Добавлена:
- **НЗВИ / Некрасовский Завод Вентиляционных Изделий / ООО «НЗВИ»**, ИНН `7627056823`, ОГРН `1227600012078`, Lead ID `N5K-0486`.

Итог physical canonical/contactable: **334 / 334**.  
Integrity: **PASS**. Orphan contacts/evidence: **0 / 0**. Active WIP: **0**. Outreach: **0**.  
Alpine Floor первоначально прошёл содержательные гейты, но физический integration guard выявил существующий дубль, поэтому компания повторно не засчитана. Discovery продолжен в том же RUN. Для НЗВИ использованы актуальные данные 2025–2026: действующее юрлицо, 7 сотрудников, выручка около 20,6 млн ₽ за 2025 год, собственник/гендиректор Анна Румянцева, свежий августовский сигнал на усиление отдела продаж и официальный маршрут `mail@nzvi.ru`. Автоматический stale runtime baseline `294` после интеграции исправлен на фактический baseline `333`; campaign target, run metrics и рабочая конфигурация синхронизированы на RUN 399.

История предыдущих RUN сохранена в `run_logs`, `reports`, shards/increments и Git history.

## Последние подтверждённые RUN

- `N5K-20260825-390`: 321/321, +1, PASS, orphan 0/0.
- `N5K-20260825-391`: 323/323, +2, PASS, orphan 0/0.
- `N5K-20260825-392`: 325/325, +2, PASS, orphan 0/0.
- `N5K-20260825-393`: 328/328, +3, PASS, orphan 0/0.
- `N5K-20260825-394`: 329/329, +1, PASS, orphan 0/0.
- `N5K-20260825-395`: 330/330, +1, PASS, orphan 0/0.
- `N5K-20260825-396`: 331/331, +1, PASS, orphan 0/0.
- `N5K-20260825-397`: 332/332, +1, PASS, orphan 0/0.
- `N5K-20260825-398`: 333/333, +1, PASS, orphan 0/0.
- `N5K-20260825-399`: 334/334, +1, PASS, orphan 0/0.

## Latest verified run N5K-20260825-399
Canonical/contactable: 334/334. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest verified run N5K-20260825-400
Canonical/contactable: 336/336. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest verified run N5K-20260825-400
Canonical/contactable: 336/336. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
