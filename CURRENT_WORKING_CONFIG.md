# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-26T22:01:30+03:00  
**Последний полностью завершённый RUN:** `N5K-20260826-436`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **406 / 406**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4594**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- перед каждым RUN заново определять факт по свежему Git HEAD, `data/runtime/current_run_status.json`, `data/runtime/campaign_target.json`, физическим `leads_master/contactable_master`, contacts/evidence и pending;
- physical canonical/contactable count: **406 / 406**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260826-436`;
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

## Последний подтверждённый RUN — N5K-20260826-436

Baseline перед RUN: **404 / 404**.  
Глобально зафиксирован консервативный аудируемый минимум **149** разных raw-кандидатов: worker-пулы не суммировались без полного cross-worker raw index.  
Воронка RUN: discovered **149** → fast gate **9** → size **6** → legal **5** → signal **4** → LPR **3** → contact **2** → qualified **2** → physically integrated **2**.  
Duplicates: **1**. Excluded: **146**.

Добавлены:
- **Группа Теплолюкс / Teploluxe**, ООО «ГРУППА ТЕПЛОЛЮКС», ИНН `5029052258`, ОГРН `1025003531420`, Lead ID `N5K-0557`;
- **Лакокрасочный завод OZON**, ООО «ФАРБЕН ГРУПП», ИНН `6671458061`, ОГРН `1146671020671`, Lead ID `N5K-0558`.

Физический дубль:
- **Фабрика Вентиляции ГалВент / GalVent**, ИНН `7720605108`, уже присутствует в canonical как `N5K-0499`; повторно не интегрирована.

Итог physical canonical/contactable: **406 / 406**.  
Integrity: **PASS**. Orphan contacts/evidence: **0 / 0**. Active WIP: **0**. Staged: **0**. Outreach: **0**.

### Discovery-lanes RUN 436

- jobs worker: raw **50**, duplicate/early reject **49**, qualified **1**;
- industry worker: raw **149**, deep-evaluated **4**, qualified **0**; 145 собранных raw не выдаются за deep-checked;
- growth/news worker: raw **30**, duplicate/early reject **28**, canonical qualified **1**, один worker-qualified отклонён как physical duplicate;
- остальные lanes: отдельный новый аудируемый worker-пул в этом execution window не был получен, поэтому фиктивный raw не начислялся.

Worker raw не суммировался между пакетами без полного cross-worker index. Узкое место RUN 436 — throughput аудируемого глобального raw-pool: цель 400–800 не достигнута, подтверждённый консервативный минимум 149. Следующий RUN должен продолжать ingestion свежих worker-файлов и low-overlap discovery без пересканирования насыщенных каналов.

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


## Latest verified run N5K-20260826-437
Canonical/contactable: 409/409. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
