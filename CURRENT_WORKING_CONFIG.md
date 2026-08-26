# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-26T23:08:00+03:00  
**Последний полностью завершённый RUN:** `N5K-20260826-437`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **409 / 409**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4591**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- перед каждым RUN заново определять факт по свежему Git HEAD, `data/runtime/current_run_status.json`, `data/runtime/campaign_target.json`, физическим `leads_master/contactable_master`, contacts/evidence и pending;
- physical canonical/contactable count: **409 / 409**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260826-437`;
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

## Последний подтверждённый RUN — N5K-20260826-437

Baseline перед RUN: **406 / 406**.  
Глобально зафиксирован консервативный аудируемый минимум **108** разных raw-кандидатов: worker-пулы не суммировались без полного cross-worker raw index.  
Воронка RUN: discovered **108** → fast gate **7** → size **5** → legal **4** → signal **4** → LPR **3** → contact **3** → qualified **3** → physically integrated **3**.  
Duplicates: **0**. Excluded: **105**.

Добавлены:
- **А9 Системс / A9 Systems**, ООО «А9 СИСТЕМС», ИНН `3808224840`, ОГРН `1123850027806`, Lead ID `N5K-0559`;
- **VICI / ВИЧИ-РУСЬ**, ООО «ВИЧИ-РУСЬ», ИНН `3911008930`, ОГРН `1023902001947`, Lead ID `N5K-0560`;
- **Аэрофьюэлз / Aerofuels**, ООО «АЭРОФЬЮЭЛЗ ГРУПП», ИНН `7710380617`, ОГРН `1027739283274`, Lead ID `N5K-0561`.

Итог physical canonical/contactable: **409 / 409**.  
Integrity: **PASS**. Orphan contacts/evidence: **0 / 0**. Active WIP: **0**. Staged: **0**. Outreach: **0**.

### Discovery-lanes RUN 437

- jobs worker: raw **50**, duplicate/early reject **50**, qualified **0**;
- industry worker: raw **108**, duplicate/early reject **107**, qualified **1**;
- growth/news worker: raw **31**, duplicate/early reject **29**, qualified **2**;
- worker raw не суммировался между пакетами без полного cross-worker index; доказуемый глобальный минимум — **108**.

Узкое место RUN 437 — throughput аудируемого глобального raw-pool: цель 300–500 не достигнута. Следующий RUN должен продолжать ingestion свежих immutable workers и собственный low-overlap discovery, особенно industry/regional/growth/official/owner/rating/dealer/segment-expansion lanes, не пересканируя насыщенный jobs lane.

## Последние подтверждённые RUN

- `N5K-20260826-423`: 380/380, +3, PASS, orphan 0/0.
- `N5K-20260826-424`: 381/381, +1, PASS, orphan 0/0.
- `N5K-20260826-425`: 382/382, +1, PASS, orphan 0/0.
- `N5K-20260826-426`: 383/383, +1, PASS, orphan 0/0.
- `N5K-20260826-427`: 384/384, +1, PASS, orphan 0/0.
- `N5K-20260826-428`: 385/385, +1, PASS, orphan 0/0.
- `N5K-20260826-429`: 386/386, +1, PASS, orphan 0/0.
- `N5K-20260826-430`: 388/388, +2, PASS, orphan 0/0.
- `N5K-20260826-431`: 390/390, +2, PASS, orphan 0/0.
- `N5K-20260826-432`: 392/392, +2, PASS, orphan 0/0.
- `N5K-20260826-433`: 394/394, +2, PASS, orphan 0/0.
- `N5K-20260826-434`: 401/401, +7, PASS, orphan 0/0.
- `N5K-20260826-435`: 404/404, +3, PASS, orphan 0/0.
- `N5K-20260826-436`: 406/406, +2, PASS, orphan 0/0.
- `N5K-20260826-437`: 409/409, +3, PASS, orphan 0/0.
