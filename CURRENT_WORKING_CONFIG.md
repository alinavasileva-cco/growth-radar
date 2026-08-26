# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-26T02:24:00+03:00  
**Последний полностью завершённый RUN:** `N5K-20260826-416`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **366 / 366**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4634**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- перед каждым RUN заново определять факт по свежему Git HEAD, `data/runtime/current_run_status.json`, `data/runtime/campaign_target.json`, физическим `leads_master/contactable_master`, contacts/evidence и pending;
- physical canonical/contactable count: **366 / 366**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260826-416`;
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

## Подробный сохранённый RUN — N5K-20260825-406

Baseline перед RUN: **343 / 343**.  
Фактически индивидуально обработано raw-кандидатов: **25**. Целевые 300–500 в этом RUN не достигнуты и не заявляются.  
Воронка: discovered **25** → fast gate **3** → size **3** → legal **3** → signal **3** → LPR **3** → contact **3** → qualified unique **3** → physically integrated **3**.  
Duplicates: **0**. Excluded: **22**.

Добавлены:
- **НПП Тепловодохран / Пульсар**, ООО НПП ТЕПЛОВОДОХРАН, ИНН `6230028315`, ОГРН `1026201107800`, Lead ID `N5K-0496`;
- **EUROCLIMA RUS / Евроклима Рус**, ООО ЕВРОКЛИМА РУС, ИНН `7716871139`, Lead ID `N5K-0497`;
- **VITUAL / Витуаль**, ООО ВИТУАЛЬ, ИНН `9725020314`, Lead ID `N5K-0498`.

Итог physical canonical/contactable: **346 / 346**.  
Integrity: **PASS**. Orphan contacts/evidence: **0 / 0**. Active WIP: **0**. Staged: **0**. Outreach: **0**.

### Discovery-lanes RUN 406

Фактически аудируемый raw-пул: **25**. Jobs worker дал отдельный verified staging; два его кандидата были независимо перепроверены перед canonical integration. Третий qualified найден и deep-checked в основном multi-lane RUN. Для исключения двойного счёта overlap raw не суммировался без доказательства уникальности.

- HH/current job-board mirrors + jobs worker: raw 25, duplicate+early rejects 22, qualified 2;
- other job boards: qualified 1;
- остальные lanes были запрошены/семплированы, но отдельный уникальный raw-вклад в этом коротком execution window не доказан и не завышается.

### Реальное узкое место RUN 406

Фактически обработано **25** разных raw-кандидатов вместо целевых 300–500. Качество deep funnel сохранено: все три прошедших FAST GATE дошли до LEGAL/SIGNAL/LPR/CONTACT и были физически интегрированы. Следующий RUN должен увеличивать low-overlap discovery через отраслевые и региональные каталоги, fresh growth/expansion news, official-site news, owner/publication, ratings и dealer/franchise lanes, не ослабляя deep-gates.

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

## Latest verified run N5K-20260826-416
Canonical/contactable: 366/366. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest verified run N5K-20260826-417
Canonical/contactable: 368/368. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
