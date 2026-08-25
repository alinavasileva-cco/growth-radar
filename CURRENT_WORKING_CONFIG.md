# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-25T13:21:00+03:00  
**Последний полностью завершённый RUN:** `N5K-20260825-402`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **340 / 340**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4660**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- перед каждым RUN заново определять факт по свежему Git HEAD, `data/runtime/current_run_status.json`, `data/runtime/campaign_target.json`, физическим `leads_master/contactable_master`, contacts/evidence и pending;
- physical canonical/contactable count: **340 / 340**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260825-402`;
- physical master/integration guard является финальным источником дедупликации;
- исторические RUN/count нельзя использовать как зашитый baseline;
- устаревшие данные исключать из решений, если доступны более свежие подтверждённые сведения.

## Правила продолжения

1. Целевой discovery throughput — **300–500 реально разных raw-кандидатов за RUN, если источники позволяют**. Это не квота и не основание снижать критерии. Не засчитывать строки выдачи как обработанные компании.
2. Использовать и ротировать **не менее 10 независимых discovery-lanes**: HH; SuperJob/Работа.ру/другие job boards; отраслевые каталоги; региональные бизнес-каталоги; новости роста/экспансии/филиалов/инвестиций; официальные сайты и разделы вакансий/новостей; Telegram/VK/YouTube/интервью собственников; рейтинги/премии/акселераторы/деловые клубы; франшизные и дилерские каталоги; expansion-поиск по сильным сегментам уже найденных компаний.
3. Для каждого lane сохранять фактические `raw`, `duplicates+early rejects`, duplicate/reject rate и `qualified`. Если duplicate+early reject >70% на первых 20 кандидатах, останавливать этот lane на текущий RUN и перераспределять время в менее насыщенные источники.
4. FAST GATE для всех raw до deep-check: российская частная компания/ИП → ориентир актуального масштаба → быстрый dedup по in-memory canonical keys → вероятный S1–S3 сигнал.
5. Перед discovery строить актуальный in-memory набор canonical keys: Lead ID, ИНН, ОГРН/ОГРНИП, точное юрлицо, подтверждённая связка бренд+домен.
6. ACTIVE WIP <=50; обрабатывать пачками, после PASS/REJECT сразу освобождать слот и брать следующего raw-кандидата.
7. Deep funnel не ослаблять: SIZE → LEGAL → SIGNAL → LPR → CONTACT → QUALIFIED.
8. QUALIFIED только при подтверждённых: действующее юрлицо/ИП, ИНН, актуальный соответствующий масштаб, реальный S1–S3 сигнал с источником/датой, собственник/ЛПР и практический маршрут связи. Никаких догадок и восстановленных по шаблону контактов.
9. Приоритет S1/S2 и сильным S3 с быстро доступными доказательствами. Слабого кандидата отклонять на раннем этапе.
10. Дедуп выполнять дважды: до deep-check и непосредственно перед записью по Lead ID, ИНН, ОГРН/ОГРНИП, точному юрлицу и brand+domain.
11. Целевой выход — максимально возможное число реальных уникальных qualified; ориентир **20–40 за RUN**, только если источники позволяют без снижения качества.
12. Discovery/deep-check выполнять пакетно по lanes/batches; canonical writer должен оставаться один.
13. Qualified интегрировать атомарным пакетом в `leads_master/contactable_master`, contacts, evidence, increments/shards, run logs/report/runtime/campaign/config. Не делать отдельный commit на каждый stage/candidate без необходимости.
14. Qualified не должен оставаться только в pending после завершения RUN.
15. При integrity/dedup/write/metadata/BLOCKED/zero-result/частичном RUN — REPAIR в том же цикле, без обнуления базы и без остановки поиска.
16. RUN завершён только после физической записи в main, синхронизации canonical/contactable, закрытого staged/pending, integrity PASS, orphan contacts=0, orphan evidence=0 и повторно проверенного HEAD SHA.
17. После RUN фиксировать общую воронку и фактическую статистику discovery-lanes. Если lane-level метрики не были сохранены, их не реконструировать и не придумывать; исправить инструментацию на следующем RUN.
18. Не выполнять outreach, письма, отклики, подготовку рассылок или отправку сообщений.

## Последний подробный RUN — N5K-20260825-402

Baseline перед RUN: **338 / 338**.  
Фактически индивидуально обработано raw-кандидатов: **31**. Целевые 300–500 в этом RUN не достигнуты и не заявляются.  
Воронка после authoritative physical dedup и REPAIR: discovered **31** → fast gate **7** → size **4** → legal **4** → signal **4** → LPR **2** → contact **2** → qualified unique **2** → physically integrated **2**.  
Duplicates: **8**. Excluded: **21**.  
Добавлены:
- **МИАР / M.I.A.R. / ООО «МИАР»**, ИНН `6230100057`, ОГРН `1166234074050`, Lead ID `N5K-0491`.
- **ERA Group / ЭРА / ООО «ЭРА»**, ИНН `6230054957`, ОГРН `1066230045001`, Lead ID `N5K-0492`.

Итог physical canonical/contactable: **340 / 340**.  
Integrity: **PASS**. Orphan contacts/evidence: **0 / 0**. Active WIP: **0**. Staged: **0**. Outreach: **0**.  
Штатный integration workflow физически добавил обе компании. После интеграции обнаружен stale baseline `294` вместо фактического pre-run baseline `338`, а `campaign_target` и `run_metrics` частично оставались на RUN 401. Runtime, campaign target, metrics и эта конфигурация восстановлены по физическому master/contactable и RUN 402 integration commit без повторной интеграции.

### Discovery-lanes RUN 402

В RUN использовались несколько независимых потоков: текущие job-board выдачи, альтернативные job boards, региональный поиск, промышленный/B2B segment expansion, официальные сайты, актуальные registry/financial profiles и growth/expansion signals. **Точные raw/duplicate/qualified счётчики по каждому lane в RUN 402 отдельно не были персистентно сохранены, поэтому они не реконструируются задним числом.** Это обязательная инструментационная правка для следующего RUN.

### Реальное узкое место RUN 402

Фактически обработан только **31** разный raw-кандидат вместо целевых 300–500. Job-board потоки быстро дают высокий overlap с canonical base: например, INBRIG и АЗ АТОМ были выявлены как уже существующие записи до интеграции. Следующий RUN должен раньше переключать насыщенные job-board lanes и отдавать больше времени региональным каталогам, официальным growth/news потокам, отраслевым каталогам, рейтингам/премиям, дилерским/франшизным каталогам и segment expansion.

История предыдущих RUN сохранена в `run_logs`, reports, shards/increments и Git history.

## Последние подтверждённые RUN

- `N5K-20260825-393`: 328/328, +3, PASS, orphan 0/0.
- `N5K-20260825-394`: 329/329, +1, PASS, orphan 0/0.
- `N5K-20260825-395`: 330/330, +1, PASS, orphan 0/0.
- `N5K-20260825-396`: 331/331, +1, PASS, orphan 0/0.
- `N5K-20260825-397`: 332/332, +1, PASS, orphan 0/0.
- `N5K-20260825-398`: 333/333, +1, PASS, orphan 0/0.
- `N5K-20260825-399`: 334/334, +1, PASS, orphan 0/0.
- `N5K-20260825-400`: 336/336, +2, PASS, orphan 0/0.
- `N5K-20260825-401`: 338/338, +2, PASS, orphan 0/0.
- `N5K-20260825-402`: 340/340, +2, PASS, orphan 0/0.
