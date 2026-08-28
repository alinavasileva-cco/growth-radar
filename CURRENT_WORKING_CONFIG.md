# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-28T08:18:00+03:00  
**Последний полностью завершённый RUN:** `N5K-20260828-469`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **484 / 484**  
**Qualified staged not counted:** **0**  
**Ближайший операционный рубеж:** **1000** подтверждённых contactable компаний  
**Основная цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось до 1000:** **516**  
**Осталось до 5000:** **4516**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- перед каждым RUN заново определять факт по свежему Git HEAD, `data/runtime/current_run_status.json`, `data/runtime/campaign_target.json`, физическим `leads_master/contactable_master`, campaign-local contacts/evidence, pending и свежим worker-staging;
- physical canonical/contactable count: **484 / 484**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260828-469`;
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

- `N5K-20260827-454R1`: 469/469, +1 repair, PASS, orphan 0/0.
- `N5K-20260827-455`: 471/471, +2, PASS, orphan 0/0.
- `N5K-20260827-456`: 473/473, +2, PASS, orphan 0/0.
- `N5K-20260827-457`: 476/476, +3, PASS, orphan 0/0.
- `N5K-20260827-458`: 476/476, +0, PASS, orphan 0/0.
- `N5K-20260827-459`: 476/476, +0, PASS, orphan 0/0.
- `N5K-20260827-460`: 477/477, +1, PASS, orphan 0/0.
- `N5K-20260827-461`: 478/478, +1, PASS, orphan 0/0.
- `N5K-20260828-462`: 479/479, +1, PASS, orphan 0/0.
- `N5K-20260828-463`: 480/480, +1, PASS, orphan 0/0.
- `N5K-20260828-464`: 481/481, +1, PASS, orphan 0/0.
- `N5K-20260828-465`: 481/481, +0, PASS, orphan 0/0.
- `N5K-20260828-466`: 481/481, +0, PASS, orphan 0/0.
- `N5K-20260828-467`: 482/482, +1, PASS, orphan 0/0.
- `N5K-20260828-468`: 482/482, +0, PASS, orphan 0/0.
- `N5K-20260828-469`: 484/484, +2, PASS, orphan 0/0.

Полная история и доказательства предыдущих RUN сохранены в `data/campaigns/new_5000/run_log.csv`, `data/campaigns/new_5000/run_logs/**`, `reports/**`, `data/runtime/worker_consumed_indexes/**` и immutable worker-staging. Сокращение исторического текста в этом файле не удаляет audit-артефакты.

## RUN 469 — canonical integration

Fresh worker pool: jobs `80 raw / 2 worker-qualified`; industry `100 raw / 1 worker-qualified`. Physical master guard обнаружил **АФ «Перспектива» ОМЗ** как существующий `N5K-0509` по ИНН `6318035951` и ОГРН `1186313049823`, поэтому повторная запись заблокирована. Собственный low-overlap discovery добавил 120 named source identities из официального каталога `МЕТАЛЛООБРАБОТКА-2026`; участие в выставке само по себе SIGNAL не считается.

Финальная воронка: **300 source-level raw → 6 fast gate → 3 SIZE → 3 LEGAL → 3 SIGNAL → 3 LPR → 3 CONTACT → 2 net QUALIFIED → 2 physically integrated**. Physical duplicates: **1**; excluded: **297**. 300 не заявляется как 300 глобально legal-key-proven distinct компаний, поскольку worker early rejects не все сохраняют полный набор INN/OGRN/domain keys. Целевые 400–800 глобально доказанных distinct raw не достигнуты; критерии не снижались.

Интегрированы:
- **Малтат / Руслов**, ООО «МАЛТАТ», ИНН `2403007482`, ОГРН `1072439000149`, Lead ID `N5K-0640`;
- **НПК АВТОПРИБОР**, ООО «НАУЧНО-ПРОИЗВОДСТВЕННЫЙ КОМПЛЕКС «АВТОПРИБОР»`, ИНН `3329093967`, ОГРН `1183328008820`, Lead ID `N5K-0641`.

Canonical/contactable: **484/484**. Integrity PASS. Orphan contacts/evidence: **0/0**. Staged: **0**. Pending: cleared. Worker staging: consumed-index recorded. Outreach: **0**.


## Latest verified run N5K-20260828-470
Canonical/contactable: 484/484. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
