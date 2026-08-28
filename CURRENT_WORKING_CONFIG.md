# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-28T11:05:00+03:00  
**Последний полностью завершённый RUN:** `N5K-20260828-472`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **487 / 487**  
**Qualified staged not counted:** **0**  
**Ближайший операционный рубеж:** **1000** подтверждённых contactable компаний  
**Основная цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось до 1000:** **513**  
**Осталось до 5000:** **4513**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- перед каждым RUN заново определять факт по свежему Git HEAD, `data/runtime/current_run_status.json`, `data/runtime/campaign_target.json`, физическим `leads_master/contactable_master`, campaign-local contacts/evidence, pending и свежим worker-staging;
- physical canonical/contactable count: **487 / 487**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260828-472`;
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

- `N5K-20260828-468`: 482/482, +0, PASS, orphan 0/0.
- `N5K-20260828-469`: 484/484, +2, PASS, orphan 0/0.
- `N5K-20260828-470`: 484/484, +0, PASS, orphan 0/0; physical duplicate `N5K-0593`.
- `N5K-20260828-471`: 485/485, +1, PASS, orphan 0/0.
- `N5K-20260828-472`: 487/487, +2, PASS, orphan 0/0.

Полная история и доказательства предыдущих RUN сохранены в `data/campaigns/new_5000/run_log.csv`, `data/campaigns/new_5000/run_logs/**`, `reports/**`, `data/runtime/worker_consumed_indexes/**` и immutable worker-staging.

## RUN 471 — canonical integration

Fresh worker pool: jobs `80 raw / 1 worker-qualified`; industry `100 raw / 0 qualified`. Jobs-кандидат **Аргус-ЛКМ / ООО «АРГУС ЛКМ»** прошёл повторный canonical deep-check и physical pre-write dedup по Lead ID, ИНН `6164306239`, ОГРН `1126164000115`, точному юрлицу и brand+domain. Worker-provided показатель выручки за 2025 год не использован, поскольку указанный worker URL относился к другому ИНН; canonical qualification опирается на независимо подтверждённую выручку 250,185 млн ₽ за 2024 год, действующий статус в 2026 году и свежий S1 job-сигнал 06.07.2026.

Собственный low-overlap discovery добавил **120 named source identities** из нескольких независимых реестров участников 2026 года: CTT Expo, CTO Expo, Logistika Expo, MINING CTT, COMvex, SobMaExpo, NAIS, Wire Russia и AGRAVIA. Иностранные компании, федеральные/слишком крупные группы, нерелевантные сущности и компании без независимого вероятного S1–S3 сигнала отсекались на FAST GATE; участие в выставке само по себе SIGNAL не считалось.

Финальная воронка: **300 source-level raw → 7 fast gate → 1 SIZE → 1 LEGAL → 1 SIGNAL → 1 LPR → 1 CONTACT → 1 QUALIFIED → 1 physically integrated**. Duplicates: **0**; excluded: **299**. 300 не заявляется как 300 глобально legal-key-proven distinct компаний, поскольку worker early rejects не все сохраняют полный набор INN/OGRN/domain keys. Целевые 400–800 globally proven distinct raw не достигнуты; критерии не снижались.

Canonical/contactable: **485/485**. Integrity PASS. Orphan contacts/evidence: **0/0**. Active WIP: **0**. Pending: cleared. Worker staging: consumed-index recorded. Outreach: **0**.

## RUN 472 — canonical integration

Fresh worker pool: jobs `80 raw / 2 worker-qualified`; industry `100 raw / 0 qualified`. Оба jobs-кандидата — **БИЗОРЮК / ООО «СОЛНЦЕ»** и **НЗЭТК / ООО «НИЖЕГОРОДСКИЙ ЗАВОД ЭЛЕКТРОТЕХНИЧЕСКОГО КРЕПЕЖА»** — прошли свежий canonical recheck и финальный physical dedup guard. Для БИЗОРЮК worker-email `d.efimenko@ooo-sun.ru` не использован: свежий официальный сайт подтверждает `a.gorchakov@ooo-sun.ru` и `manager-14@ooo-sun.ru`. Выручка ООО «СОЛНЦЕ» за 2025 год независимо подтверждена на уровне 226,981 млн ₽; актуальный S2 job-сигнал датирован 07.08.2026. Для НЗЭТК подтверждены выручка 245,45 млн ₽ за 2025 год, директор/учредитель Давыдов Денис Александрович, официальные контакты и свежий S2 job-сигнал 25.08.2026.

Собственный low-overlap discovery добавил **120 source-level identities**: по 20 из TransRussia/SkladTech, Aquaflame, RosUpack, AIRVent, WorldFood Moscow и MiningWorld Russia 2026. Каждый lane был остановлен после первых 20 на cheap gate при duplicate+early reject >70%; участие в выставке само по себе SIGNAL не считалось. Эти source-level identities не заявляются как globally legal-key-proven distinct.

Финальная воронка: **300 source-level raw → 6 fast gate → 3 SIZE → 3 LEGAL → 2 SIGNAL → 2 LPR → 2 CONTACT → 2 QUALIFIED → 2 physically integrated**. Duplicates: **0**; excluded: **298**. Целевые 400–800 globally proven distinct raw не достигнуты; критерии не снижались.

Canonical/contactable: **487/487**. Integrity PASS. Orphan contacts/evidence: **0/0**. Active WIP: **0**. Pending: cleared. Worker staging: consumed-index recorded. Outreach: **0**.

## Latest verified run N5K-20260828-472
Canonical/contactable: 487/487. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
