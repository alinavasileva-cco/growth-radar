# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-28T21:09:18+03:00  
**Последний полностью завершённый RUN:** `N5K-20260828-482`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **497 / 497**  
**Qualified staged not counted:** **0**  
**Ближайший операционный рубеж:** **1000** подтверждённых contactable компаний  
**Основная цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось до 1000:** **503**  
**Осталось до 5000:** **4503**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- перед каждым RUN заново определять факт по свежему Git HEAD, `data/runtime/current_run_status.json`, `data/runtime/campaign_target.json`, физическим `leads_master/contactable_master`, campaign-local contacts/evidence, pending и свежим worker-staging;
- physical canonical/contactable count: **497 / 497**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260828-482`;
- physical master/integration guard является финальным источником дедупликации;
- исторические RUN/count нельзя использовать как зашитый baseline;
- устаревшие данные исключать из решений, если доступны более свежие подтверждённые сведения.

## Правила продолжения

1. Целевой discovery throughput — **400–800 реально разных raw-кандидатов за RUN, если источники позволяют**. Это не квота и не основание снижать критерии. Если raw <300, не завершать RUN сразу: переключаться на другие low-overlap источники и добирать партии в том же цикле, пока не исчерпаны разумно доступные источники/лимит выполнения. Не засчитывать строки выдачи как обработанные компании.
2. Использовать и ротировать **не менее 10 независимых discovery-lanes**: HH; SuperJob/Работа.ру/другие job boards; отраслевые каталоги; региональные бизнес-каталоги; новости роста/экспансии/филиалов/инвестиций; официальные сайты и разделы вакансий/новостей; Telegram/VK/YouTube/интервью собственников; рейтинги/премии/акселераторы/деловые клубы; франшизные и дилерские каталоги; expansion-поиск по сильным сегментам уже найденных компаний.
3. Для каждого lane сохранять фактические `raw`, `duplicates+early rejects`, duplicate/reject rate и `qualified`. Если duplicate+early reject >70% на первых 20 кандидатах, останавливать этот lane на текущем RUN и перераспределять время в менее насыщенные источники.
4. В начале каждого RUN обрабатывать все свежие immutable staging-файлы из `data/pending_workers/**`; worker только поставляет кандидатов, canonical writer один.
5. FAST GATE для всех raw до deep-check: российская частная компания/ИП → ориентир актуального масштаба → быстрый dedup по in-memory canonical keys → вероятный S1–S3 сигнал.
6. Перед discovery строить актуальный in-memory набор canonical keys: Lead ID, ИНН, ОГРН/ОГРНИП, точное юрлицо, подтверждённая связка бренд+домен.
7. ACTIVE WIP <=50; обрабатывать пачками, после PASS/REJECT сразу освобождать слот и брать следующего raw-кандидата.
8. Deep funnel не ослаблять: SIZE → LEGAL → SIGNAL → LPR → CONTACT → QUALIFIED.
9. QUALIFIED только при подтверждённых: действующее юрлицо/ИП, ИНН, актуальный соответствующий масштаб, реальный S1–S3 сигнал с источником/датой, собственник/ЛПР и практический маршрут связи. Никаких догадок и восстановленных по шаблону контактов.
10. Приоритет S1/S2 и сильным S3 с быстро доступными доказательствами. Слабого кандидата отклонять на раннем этапе.
11. Дедуп выполнять дважды: до deep-check и непосредственно перед записью по Lead ID, ИНН, ОГРН/ОГРНИП, точному юрлицу и brand+domain.
12. Целевой выход — максимально возможное число реальных уникальных qualified; ориентир **20–40 за RUN**, только если источники позволяют без снижения качества.
13. Discovery/deep-check выполнять пакетно по lanes/batches; canonical writer должен оставаться один.
14. Qualified интегрировать атомарным пакетом в `leads_master/contactable_master`, contacts, evidence, increments/shards, run logs/report/runtime/campaign/config. Не делать отдельный commit на каждый stage/candidate без необходимости.
15. Qualified не должен оставаться только в pending после завершения RUN.
16. При integrity/dedup/write/metadata/BLOCKED/zero-result/частичном RUN — REPAIR в том же цикле, без обнуления базы и без остановки поиска.
17. RUN завершён только после физической записи в main, синхронизации canonical/contactable, закрытого staged/pending, integrity PASS, orphan contacts=0, orphan evidence=0 и повторно проверенного HEAD SHA.
18. После RUN фиксировать общую воронку и фактическую статистику discovery-lanes. Если lane-level метрики не были сохранены, их не реконструировать и не придумывать; исправить инструментацию на следующем RUN.
19. После интеграции worker-staging помечать consumed по существующей безопасной схеме репозитория; доказательства истории не удалять.
20. Не выполнять outreach, письма, отклики, подготовку рассылок или отправку сообщений.

## Последние подтверждённые RUN

- `N5K-20260828-469`: 484/484, +2, PASS, orphan 0/0.
- `N5K-20260828-470`: 484/484, +0, PASS, orphan 0/0; physical duplicate `N5K-0593`.
- `N5K-20260828-471`: 485/485, +1, PASS, orphan 0/0.
- `N5K-20260828-472`: 487/487, +2, PASS, orphan 0/0.
- `N5K-20260828-473`: 487/487, +0, PASS, orphan 0/0; physical duplicate `N5K-0353`.
- `N5K-20260828-474`: 488/488, +1, PASS, orphan 0/0.
- `N5K-20260828-475`: 492/492, +4, PASS, orphan 0/0.
- `N5K-20260828-476`: 493/493, +1, PASS, orphan 0/0.
- `N5K-20260828-477`: 493/493, +0, PASS, orphan 0/0; physical duplicate `N5K-0473`.
- `N5K-20260828-478`: 494/494, +1, PASS, orphan 0/0; physical duplicate `N5K-0509`.
- `N5K-20260828-479`: 495/495, +1, PASS, orphan 0/0.
- `N5K-20260828-480`: 496/496, +1, PASS, orphan 0/0.

Полная история и доказательства предыдущих RUN сохранены в `data/campaigns/new_5000/run_log.csv`, `data/campaigns/new_5000/run_logs/**`, `reports/**`, `data/runtime/worker_consumed_indexes/**` и immutable worker-staging.

## RUN 478 — canonical integration

Fresh immutable worker pool: jobs `80 raw / 2 worker-qualified`; industry `100 raw / 0 qualified`. Jobs-worker передал **ТС ГРУПП / ООО «ТС ГРУПП»** и **АФ «Перспектива» ОМЗ**. Финальный physical dedup подтвердил, что **АФ «Перспектива» ОМЗ** уже существует как `N5K-0509` по ИНН `6318035951` и ОГРН `1186313049823`; повторная запись заблокирована. **ТС ГРУПП** прошла canonical recheck и интегрирована как `N5K-0651`, ИНН `5407266860`, ОГРН `1045403206200`.

Для ТС ГРУПП использованы свежие подтверждённые сведения: актуальные данные ФНС/Фирмотеки по состоянию на 27.08.2026, выручка 2025 года 128,8 млн ₽, 61 сотрудник, действующее юрлицо, свежий S1-сигнал 06.08.2026 — вакансия коммерческого директора как архитектора коммерческой стратегии всей группы, текущий собственник/руководство и официальный корпоративный маршрут связи. Более старые финансовые сведения не использовались в решении при наличии свежих данных 2025/2026.

Собственный low-overlap discovery добавил **120 source-level observations**: первые 20 из шести текущих каталогов/материалов 2026 года — MIMS Automobility Saint Petersburg, InterFood Krasnodar, WorldFood Moscow, Textile Collection Moscow, APTEKA и Woodex. Каждый lane остановлен после первых 20 при duplicate+early reject >70%; участие в выставке/каталоге само по себе SIGNAL не считалось. Эти observations не заявляются как globally legal-key-proven distinct компании, поскольку cheap rejects не все разрешались до INN/OGRN/domain.

Финальная воронка: **300 source-level raw → 6 fast gate → 2 SIZE → 2 LEGAL → 2 SIGNAL → 2 LPR → 2 CONTACT → 1 net QUALIFIED → 1 physically integrated**. Physical duplicates: **1**; excluded: **298**. Целевые 400–800 globally legal-key-proven distinct raw не достигнуты; критерии не снижались.

Canonical/contactable: **494/494**. Integrity PASS. Orphan contacts/evidence: **0/0**. Active WIP: **0**. Pending: cleared. Worker staging: consumed-index recorded. Outreach: **0**.

## RUN 479 — canonical integration

Fresh immutable worker pool: jobs `80 raw / 1 worker-qualified`; industry `100 raw / 0 qualified`. Jobs-worker передал **ЮгСпецМебель / ООО «ЮГСПЕЦМЕБЕЛЬ»**. Canonical recheck подтвердил действующее юрлицо, ИНН `2312199280`, ОГРН `1132312000622`, актуальный масштаб по выручке 2025 года, свежий S2-сигнал от 10.08.2026, собственника/ЛПР Харина Георгия Олеговича и официальный практический маршрут связи. Финальный physical integration guard не обнаружил совпадений по Lead ID, ИНН, ОГРН, точному юрлицу или brand+domain; компания интегрирована как `N5K-0652`.

Собственный low-overlap discovery добавил **120 source-level observations**: по 20 из Testing&Control, MiningWorld Russia, Heat&Power, NDT Russia, KHIMIA и CeMAT RUSSIA 2026. Каждый lane остановлен после первых 20 при duplicate+early reject >70%; участие в выставке/каталоге само по себе SIGNAL не считалось. Эти observations не заявляются как globally legal-key-proven distinct компании, поскольку cheap rejects не все разрешялись до полного набора ИНН/ОГРН/domain.

Финальная воронка: **300 source-level raw → 6 fast gate → 2 SIZE → 1 LEGAL → 1 SIGNAL → 1 LPR → 1 CONTACT → 1 QUALIFIED → 1 physically integrated**. Physical duplicates: **0**; excluded: **299**. Целевые 400–800 globally legal-key-proven distinct raw не достигнуты; критерии не снижались.

Canonical/contactable: **495/495**. Integrity PASS. Orphan contacts/evidence: **0/0**. Active WIP: **0**. Pending: cleared. Worker staging: consumed-index recorded. Outreach: **0**.

## RUN 480 — canonical integration

Fresh immutable worker pool: jobs `80 raw / 1 worker-qualified`; industry `100 raw / 0 qualified`. Jobs-worker передал **Тулс / ООО «ТУЛС»**. Canonical recheck подтвердил действующее юрлицо, ИНН `5249172462`, ОГРН `1205200031398`, актуальный масштаб — выручка **80 159 000 ₽ за 2025 год**, 14 сотрудников, собственника/ЛПР Суходеева Михаила Владимировича и свежий S1-сигнал от **13.08.2026** — вакансию директора по продукту и развитию с прямой ответственностью за продуктовую стратегию и рост компании, новые функции, партнёрства и коммерческие показатели. Практический CONTACT подтверждён активным публичным маршрутом «Откликнуться» на текущей вакансии; персональный контакт не заявляется. Финальный physical integration guard не обнаружил совпадений по Lead ID, ИНН, ОГРН, точному юрлицу или brand+domain; компания интегрирована как `N5K-0653`.

Собственный low-overlap discovery добавил **120 source-level observations**: по первым 20 из Beauty Show Krasnodar, InterStroyExpo, Wasma, FoodTech Krasnodar, Global Ingredients Show и Dentima Krasnodar 2026. Каждый lane остановлен после первых 20 при duplicate+early reject >70%; само участие в выставке/каталоге SIGNAL не считалось. Эти observations не заявляются как globally legal-key-proven distinct компании, поскольку cheap rejects не все разрешялись до полного набора ИНН/ОГРН/domain.

Финальная воронка: **300 source-level raw → 8 fast gate → 1 SIZE → 1 LEGAL → 1 SIGNAL → 1 LPR → 1 CONTACT → 1 QUALIFIED → 1 physically integrated**. Physical duplicates: **0**; excluded: **299**. Целевые 400–800 globally legal-key-proven distinct raw не достигнуты; критерии не снижались.

Canonical/contactable: **496/496**. Integrity PASS. Orphan contacts/evidence: **0/0**. Active WIP: **0**. Pending: cleared. Worker staging: consumed-index recorded. Outreach: **0**.


## Latest verified run N5K-20260828-482
Canonical/contactable: 497/497. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
