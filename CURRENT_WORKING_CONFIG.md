# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-26T08:22:00+03:00  
**Последний полностью завершённый RUN:** `N5K-20260826-423`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **380 / 380**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4620**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- перед каждым RUN заново определять факт по свежему Git HEAD, `data/runtime/current_run_status.json`, `data/runtime/campaign_target.json`, физическим `leads_master/contactable_master`, contacts/evidence и pending;
- physical canonical/contactable count: **380 / 380**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260826-423`;
- physical master/integration guard является финальным источником дедупликации;
- исторические RUN/count нельзя использовать как зашитый baseline;
- устаревшие данные исключать из решений, если доступны более свежие подтверждённые сведения.

## Правила продолжения

1. Целевой discovery throughput — **300–500 реально разных raw-кандидатов за RUN, если источники позволяют**. Это не квота и не основание снижать критерии. Не засчитывать строки выдачи как обработанные компании.
2. Использовать и ротировать **не менее 10 независимых discovery-lanes**: HH; SuperJob/Работа.ру/другие job boards; отраслевые каталоги; региональные бизнес-каталоги; новости роста/экспансии/филиалов/инвестиций; официальные сайты и разделы вакансий/новостей; Telegram/VK/YouTube/интервью собственников; рейтинги/премии/акселераторы/деловые клубы; франшизные и дилерские каталоги; expansion-поиск по сильным сегментам уже найденных компаний.
3. Для каждого lane сохранять фактические `raw`, `duplicates+early rejects`, duplicate/reject rate и `qualified`. Если duplicate+early reject >70% на первых 20 кандидатах, останавливать этот lane на текущем RUN и перераспределять время в менее насыщенные источники.
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

## Последний подтверждённый RUN — N5K-20260826-423

Baseline перед RUN: **377 / 377**.  
Фактически обработано **30** разных raw-кандидатов; целевые 300–500 не достигнуты.  
Воронка: discovered **30** → fast gate **6** → size **4** → legal **3** → signal **3** → LPR **3** → contact **3** → qualified **3** → physically integrated **3**.  
Duplicates: **0** по финальному physical pre-write dedup. Excluded: **27**.

Добавлены:
- **Маламут Ленд**, ООО «МАЛАМУТ ЛЕНД», ИНН `6313561005`, ОГРН `1226300020022`, Lead ID `N5K-0530`;
- **Аксис / ГК Инструмент**, ООО «АКСИС», ИНН `5257164240`, ОГРН `1165275041876`, Lead ID `N5K-0531`;
- **Негабарит-Транс**, ООО «НЕГАБАРИТ-ТРАНС», ИНН `3257009226`, ОГРН `1133256013967`, Lead ID `N5K-0532`.

Итог physical canonical/contactable: **380 / 380**.  
Integrity: **PASS**. Orphan contacts/evidence: **0 / 0**. Active WIP: **0**. Staged: **0**. Outreach: **0**.

### Discovery-lanes RUN 423

- HH/job-board: raw **8**, duplicate/early reject **7**, qualified **1**;
- other job boards: raw **5**, duplicate/early reject **4**, qualified **1**;
- industry catalogs: raw **3**, duplicate/early reject **2**, qualified **1**;
- regional business catalogs/news: raw **3**, duplicate/early reject **3**, qualified **0**;
- growth/expansion/investment news: raw **4**, duplicate/early reject **3**, qualified **1**; AXIS возник здесь и считается один раз в общей воронке;
- official company sites/news: raw **2**, duplicate/early reject **2**, qualified **0**;
- Telegram/VK/YouTube/owner publications: raw **1**, duplicate/early reject **1**, qualified **0**;
- ratings/awards/accelerators/clubs: raw **1**, duplicate/early reject **1**, qualified **0**;
- franchise/dealer catalogs: raw **1**, duplicate/early reject **1**, qualified **0**;
- segment expansion search: raw **2**, duplicate/early reject **2**, qualified **0**.

Job-board worker 016 отдельно предложил `3D Torg / ЦКРИА`, ИНН `9714038951`, но это уже существующая canonical запись из более раннего RUN; повторно не интегрирована и в прирост RUN 423 не засчитана.

Фактическое узкое место RUN 423 — объём аудируемого low-overlap discovery. Job-board поток быстро насыщается повторами, поэтому дальнейший приоритет сохраняется за industry/regional/growth/official/owner/rating/dealer/segment-expansion источниками.

## Последние подтверждённые RUN

- `N5K-20260826-414`: 362/362, +3, PASS, orphan 0/0.
- `N5K-20260826-415`: 365/365, +3, PASS, orphan 0/0.
- `N5K-20260826-416`: 366/366, +1, PASS, orphan 0/0.
- `N5K-20260826-417`: 368/368, +2, PASS, orphan 0/0.
- `N5K-20260826-418`: 369/369, +1, PASS, orphan 0/0.
- `N5K-20260826-419`: 371/371, +2, PASS, orphan 0/0.
- `N5K-20260826-420`: 373/373, +2, PASS, orphan 0/0.
- `N5K-20260826-421`: 375/375, +2, PASS, orphan 0/0.
- `N5K-20260826-422`: 377/377, +2, PASS, orphan 0/0.
- `N5K-20260826-423`: 380/380, +3, PASS, orphan 0/0.
