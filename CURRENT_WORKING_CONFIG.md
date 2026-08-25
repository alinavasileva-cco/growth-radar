# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-25T12:58:00+03:00  
**Последний полностью завершённый RUN:** `N5K-20260825-401`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **338 / 338**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4662**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- physical canonical/contactable count: **338 / 338**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260825-401`;
- physical master/integration guard является финальным источником дедупликации;
- устаревшие данные не использовать в решениях, если доступны более свежие подтверждённые сведения.

## Правила продолжения

1. Перед каждым RUN проверять свежий HEAD, `data/runtime/current_run_status.json`, `data/runtime/campaign_target.json`, pending и физические master/contactable/contacts/evidence.
2. Discovery: целевой throughput **200–300 реальных разных raw-кандидатов за RUN**; не засчитывать строки поисковой выдачи как обработанные компании.
3. Использовать минимум шесть независимых discovery-потоков: вакансии/job boards; новости роста/филиалов/новых направлений/инвестиций/экспорта; отраслевые каталоги и рейтинги; официальные сайты/вакансии/новости; Telegram/VK/YouTube/интервью/публикации собственников; expansion-поиск по сильным сегментам.
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

## Последний подробный RUN — N5K-20260825-401

Baseline перед RUN: **336 / 336**.  
Фактически индивидуально обработано raw-кандидатов: **58**. Целевые 200–300 в этом RUN не достигнуты и не заявляются.  
Воронка после authoritative physical dedup и REPAIR: discovered **58** → fast gate **9** → size **5** → legal **4** → signal **3** → LPR **2** → contact **2** → qualified unique **2** → physically integrated **2**.  
Duplicates: **17**. Excluded: **39**.  
Добавлены:
- **SelSup / СелСап / ООО «СЕЛСАП»**, ИНН `9731090493`, ОГРН `1227700169180`, Lead ID `N5K-0489`.
- **Сибэлкон / Sibelkon — промышленная фильтрация / ООО «СИБЭЛКОН»**, ИНН `2417004040`, ОГРН `1132454001525`, Lead ID `N5K-0490`.

Итог physical canonical/contactable: **338 / 338**.  
Integrity: **PASS**. Orphan contacts/evidence: **0 / 0**. Active WIP: **0**. Outreach: **0**.  
Штатный integration workflow завершился `success` и физически добавил обе компании. После интеграции обнаружен stale baseline `294` вместо фактического pre-run baseline `336`, а `campaign_target` и `run_metrics` частично оставались на RUN 400. Runtime, campaign target, metrics и эта конфигурация восстановлены по физическому master/contactable и RUN 401 log. Повторной интеграции и повторного прироста не выполнялось.

### Реальное узкое место RUN 401

Фактически обработано 58 разных raw-кандидатов вместо целевых 200–300. Основная потеря throughput — высокая повторяемость уже известных работодателей в текущих job-board/aggregator выдачах и большой ранний отсев кандидатов с неоднозначным юрлицом, неподтверждённым актуальным масштабом или слабым сигналом. Число raw не завышалось количеством поисковых строк.

История предыдущих RUN сохранена в `run_logs`, reports, shards/increments и Git history.

## Последние подтверждённые RUN

- `N5K-20260825-392`: 325/325, +2, PASS, orphan 0/0.
- `N5K-20260825-393`: 328/328, +3, PASS, orphan 0/0.
- `N5K-20260825-394`: 329/329, +1, PASS, orphan 0/0.
- `N5K-20260825-395`: 330/330, +1, PASS, orphan 0/0.
- `N5K-20260825-396`: 331/331, +1, PASS, orphan 0/0.
- `N5K-20260825-397`: 332/332, +1, PASS, orphan 0/0.
- `N5K-20260825-398`: 333/333, +1, PASS, orphan 0/0.
- `N5K-20260825-399`: 334/334, +1, PASS, orphan 0/0.
- `N5K-20260825-400`: 336/336, +2, PASS, orphan 0/0.
- `N5K-20260825-401`: 338/338, +2, PASS, orphan 0/0.
