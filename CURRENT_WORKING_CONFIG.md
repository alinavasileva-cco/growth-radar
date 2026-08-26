# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-27T01:10:00+03:00  
**Последний полностью завершённый RUN:** `N5K-20260827-439`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **416 / 416**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4584**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- перед каждым RUN заново определять факт по свежему Git HEAD, `data/runtime/current_run_status.json`, `data/runtime/campaign_target.json`, физическим `leads_master/contactable_master`, contacts/evidence и pending;
- physical canonical/contactable count: **416 / 416**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260827-439`;
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

## Последний подтверждённый RUN — N5K-20260827-439

Baseline перед RUN: **412 / 412**.  
Глобально зафиксирован консервативный аудируемый минимум **120** разных raw-кандидатов: worker-пулы не суммировались без полного cross-worker raw identity index.  
Воронка RUN: discovered **120** → fast gate **11** → size **8** → legal **7** → signal **6** → LPR **5** → contact **4** → qualified **4** → physically integrated **4**.  
Duplicates: **0**. Excluded: **116**.

Добавлены:
- **ПРОФУД / Profood**, ООО ПК «ПРОФУД», ИНН `6679127590`, ОГРН `1196658060686`, Lead ID `N5K-0565`;
- **Полипласт Новомосковск / Polyplast Novomoskovsk**, ООО «ПОЛИПЛАСТ НОВОМОСКОВСК», ИНН `7116019123`, ОГРН `1037101673333`, Lead ID `N5K-0566`;
- **CALLISTO VISION / ГК Каллисто**, ООО «КАЛЛИСТО ВИЖН», ИНН `9725161234`, ОГРН `1247700424322`, Lead ID `N5K-0567`;
- **Металлстрой64 / Metallstroy64**, ООО «МЕТАЛЛСТРОЙ64», ИНН `6449095859`, ОГРН `1196451027255`, Lead ID `N5K-0568`.

Итог physical canonical/contactable: **416 / 416**.  
Integrity: **PASS**. Orphan contacts/evidence: **0 / 0**. Active WIP: **0**. Staged: **0**. Outreach: **0**.

### Discovery-lanes RUN 439

- jobs worker: raw **80**, duplicate/early reject **79**, qualified **1**;
- industry worker: raw **120**, duplicate/early reject **119**, qualified **1**;
- growth/news worker: raw **62**, duplicate/early reject **60**, qualified **2**;
- worker raw не суммировался между пакетами без полного cross-worker identity index; доказуемый глобальный минимум — **120**.

Узкое место RUN 439 — throughput аудируемого глобального raw-pool: цель 300–500 не достигнута. Следующий RUN должен продолжать ingestion свежих immutable workers и собственный low-overlap discovery, особенно industry/regional/growth/official/owner/rating/dealer/segment-expansion lanes, не пересканируя насыщенный jobs lane.

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
- `N5K-20260827-438`: 412/412, +3, PASS, orphan 0/0.
- `N5K-20260827-439`: 416/416, +4, PASS, orphan 0/0.
