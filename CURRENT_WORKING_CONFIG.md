# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-28T06:08:00+03:00  
**Последний полностью завершённый RUN:** `N5K-20260828-467`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **482 / 482**  
**Qualified staged not counted:** **0**  
**Ближайший операционный рубеж:** **1000** подтверждённых contactable компаний  
**Основная цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось до 1000:** **518**  
**Осталось до 5000:** **4518**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- перед каждым RUN заново определять факт по свежему Git HEAD, `data/runtime/current_run_status.json`, `data/runtime/campaign_target.json`, физическим `leads_master/contactable_master`, campaign-local contacts/evidence и pending;
- physical canonical/contactable count: **482 / 482**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260828-467`;
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

- `N5K-20260827-449`: 455/455, +3, PASS, orphan 0/0.
- `N5K-20260827-450`: 456/456, +1, PASS, orphan 0/0.
- `N5K-20260827-451`: 457/457, +1, PASS, orphan 0/0.
- `N5K-20260827-452`: 461/461, +4, PASS, orphan 0/0.
- `N5K-20260827-453`: 464/464, +3, PASS, orphan 0/0.
- `N5K-20260827-454`: 468/468, +4, PASS, orphan 0/0.
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

Полная история и доказательства предыдущих RUN сохранены в `data/campaigns/new_5000/run_log.csv`, `data/campaigns/new_5000/run_logs/**`, `reports/**`, `data/runtime/worker_consumed_indexes/**` и immutable worker-staging. Сокращение исторического текста в этом файле не удаляет audit-артефакты.

## RUN 467 — canonical integration

Fresh worker pool: jobs `80 raw / 1 worker-qualified`; industry `118 raw / 1 worker-qualified`, но ППГК был заблокирован physical guard как существующий `N5K-0591` по ИНН `5035040606`, ОГРН `1115035000410`, юрлицу и brand+domain. Собственный low-overlap discovery по официальным публикациям участников TransRussia/SkladTech 2026 и MiningWorld Russia 2026 добавил 114 source-level identities, которые не были повышены выше FAST GATE без независимого вероятного S1–S3 сигнала; само участие в выставке SIGNAL не считается.

Финальная воронка: **312 source-level raw → 9 fast gate → 4 SIZE → 4 LEGAL → 2 SIGNAL → 2 LPR → 2 CONTACT → 1 net QUALIFIED → 1 physically integrated**. Physical duplicates: **1**; excluded: **310**. 312 не заявляется как 312 глобально legal-key-proven distinct компаний, поскольку для jobs early rejects нет полного набора INN/OGRN/domain identity keys. Целевые 400–800 глобально доказанных distinct raw не достигнуты; критерии не снижались.

Интегрирована **Первая Чайная Группа / Первая Чайная Компания (ПЧК)**, ООО «ТОРГОВЫЙ ДОМ «ПЕРВАЯ ЧАЙНАЯ КОМПАНИЯ», ИНН `9725116023`, ОГРН `1237700149060`, Lead ID `N5K-0639`.

Canonical/contactable: **482/482**. Integrity PASS. Orphan contacts/evidence: **0/0**. Staged: **0**. Pending: cleared. Outreach: **0**.


## Latest verified run N5K-20260828-468
Canonical/contactable: 482/482. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
