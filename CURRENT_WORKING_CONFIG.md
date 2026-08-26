# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-26T05:08:00+03:00  
**Последний полностью завершённый RUN:** `N5K-20260826-420`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **373 / 373**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4627**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- перед каждым RUN заново определять факт по свежему Git HEAD, `data/runtime/current_run_status.json`, `data/runtime/campaign_target.json`, физическим `leads_master/contactable_master`, contacts/evidence и pending;
- physical canonical/contactable count: **373 / 373**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260826-420`;
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

## Последний подтверждённый RUN — N5K-20260826-420

Baseline перед RUN: **371 / 371**.  
Фактически обработано raw-кандидатов: **44**. Целевые 300–500 не достигнуты.  
Воронка: discovered **44** → fast gate **3** → size **2** → legal **2** → signal **2** → LPR **2** → contact **2** → qualified **2** → physically integrated **2**.  
Final pre-write duplicates среди двух qualified: **0**. Остальные **42** сохранены worker как combined duplicate+early reject, без надёжного отдельного split.

Добавлены:
- **Волжский крановый завод / ВКЗ**, ООО «ВОЛЖСКИЙ КРАНОВЫЙ ЗАВОД», ИНН `2130161683`, ОГРН `1152130013310`, Lead ID `N5K-0524`;
- **ОКАПОЛ / OKAPOL**, ООО «ОКАПОЛ», ИНН `5249144955`, ОГРН `1155249007462`, Lead ID `N5K-0525`.

Итог physical canonical/contactable: **373 / 373**.  
Integrity: **PASS**. Orphan contacts/evidence: **0 / 0**. Active WIP: **0**. Staged: **0**. Outreach: **0**.

### Discovery-lanes RUN 420

- HH/job-board worker: raw **44**, duplicate+early reject combined **42** (95.5%), qualified **2**;
- остальные 9 lanes: отдельного аудируемого raw-вклада в этот follow-up RUN не было, поэтому `raw=0` и объём не реконструируется.

Job-board lane насыщен (>70% duplicate+early reject), поэтому в следующем RUN приоритет переносится в low-overlap regional/industry/growth/official/owner/rating/dealer/segment-expansion lanes.

## Последние подтверждённые RUN

- `N5K-20260825-394`: 329/329, +1, PASS, orphan 0/0.
- `N5K-20260825-395`: 330/330, +1, PASS, orphan 0/0.
- `N5K-20260825-396`: 331/331, +1, PASS, orphan 0/0.
- `N5K-20260825-397`: 332/332, +1, PASS, orphan 0/0.
- `N5K-20260825-398`: 333/333, +1, PASS, orphan 0/0.
- `N5K-20260825-399`: 334/334, +1, PASS, orphan 0/0.
- `N5K-20260825-400`: 336/336, +2, PASS, orphan 0/0.
- `N5K-20260825-401`: 338/338, +2, PASS, orphan 0/0.
- `N5K-20260825-402`: 340/340, +2, PASS, orphan 0/0.
- `N5K-20260825-403`: 341/341, +1, PASS, orphan 0/0.
- `N5K-20260825-404`: 342/342, +1, PASS, orphan 0/0.
- `N5K-20260825-405`: 343/343, +1, PASS, orphan 0/0.
- `N5K-20260825-406`: 346/346, +3, PASS, orphan 0/0.
- `N5K-20260825-407`: 349/349, +3, PASS, orphan 0/0.
- `N5K-20260825-408`: 352/352, +3, PASS, orphan 0/0.
- `N5K-20260825-409`: 353/353, +1, PASS, orphan 0/0.
- `N5K-20260825-410`: 354/354, +1, PASS, orphan 0/0.
- `N5K-20260825-411`: 356/356, +2, PASS, orphan 0/0.
- `N5K-20260825-412`: 358/358, +2, PASS, orphan 0/0.
- `N5K-20260825-413`: 359/359, +1, PASS, orphan 0/0.
- `N5K-20260826-414`: 362/362, +3, PASS, orphan 0/0.
- `N5K-20260826-415`: 365/365, +3, PASS, orphan 0/0.
- `N5K-20260826-416`: 366/366, +1, PASS, orphan 0/0.
- `N5K-20260826-417`: 368/368, +2, PASS, orphan 0/0.
- `N5K-20260826-418`: 369/369, +1, PASS, orphan 0/0.
- `N5K-20260826-419`: 371/371, +2, PASS, orphan 0/0.
- `N5K-20260826-420`: 373/373, +2, PASS, orphan 0/0.
