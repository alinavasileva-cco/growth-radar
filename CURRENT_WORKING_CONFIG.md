# Growth Radar — актуальная рабочая конфигурация

**Версия:** 16.08.2026 03:04 MSK  
**Последний завершённый запуск:** `N5K-20260816-243`  
**Статус:** ACTIVE / integrity PASS  
**Текущий подтверждённый canonical/contactable:** **111 / 111**  
**Текущая цель:** 5000 уникальных contactable компаний текущей кампании `new_5000`  
**Автоматический outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- baseline_count: **0**;
- physical `leads_master.csv`: **111 data rows + header**;
- physical `contactable_master.csv`: **111 data rows + header**;
- physical `contacts.csv`: **643 data rows + header**;
- physical `evidence.csv`: **1152 data rows + header**;
- orphan contacts: **0**;
- orphan evidence: **0**;
- осталось до 5000: **4889**.

## Canonical dedup repair

Исторические карточки были дедуплицированы по Lead ID, ИНН, ОГРН/ОГРНИП, точному юрлицу и подтверждённой связке бренд+домен. После удаления повторных карточек и применения contact/evidence coverage gate подтверждённый уникальный physical pool составляет **111** компаний.

В RUN `N5K-20260816-243` прежний blocker `STALE_DUPLICATED_255_ROW_HISTORY_PRESENT` был перепроверен прямым чтением физических файлов и признан ложным: оба master-файла фактически заканчиваются после 111 data rows + header. Поэтому кампания возвращена в ACTIVE / PASS без изменения счётчика.

## Последний RUN — N5K-20260816-243

- raw discovered: **50**;
- size check passed: **2**;
- legal match passed: **2**;
- signal confirmed: **2**;
- LPR identified: **2**;
- contact route found: **2**;
- qualified и физически добавлено: **0**;
- duplicates: **1**;
- excluded: **47**;
- canonical/contactable: **111 / 111**;
- integrity: **PASS**;
- orphan contacts/evidence: **0 / 0**;
- outreach: **0**.

`Прайд Групп / PRAID` подтверждён как уже существующая запись `N5K-0221` и повторно не добавляется. `ООО АКЦЕПТУМ-ИНЖИНИРИНГ`, ИНН `2465135283`, прошло содержательные гейты и не найдено по ИНН в репозитории, но не засчитывается до физической интеграции во все обязательные слои.

## Правила следующих RUN

1. Перед каждым RUN определить самый свежий фактический RUN по Git commits, run_logs, master/contactable и runtime.
2. Не обнулять подтверждённый результат.
3. Каждый discovery RUN: 50–60 raw, ACTIVE WIP <=50, воронка `DISCOVERED → SIZE CHECK → LEGAL MATCH → SIGNAL CONFIRMED → LPR IDENTIFIED → CONTACT ROUTE FOUND → QUALIFIED`.
4. Целевой выход 8–15 новых квалифицированных компаний, если источники позволяют; критерии не снижать.
5. Дедупликация обязательна по Lead ID, ИНН, ОГРН/ОГРНИП, точному юрлицу и brand+domain.
6. Для qualified обязательно подтвердить действующее юрлицо/ИП, ИНН, масштаб, S1–S3 сигнал, собственника/ЛПР и практический маршрут связи.
7. Новая компания засчитывается только после физической записи в master, contactable, contacts, evidence, increments/shards, run_log, отдельный RUN-log, report, runtime и campaign_target.
8. RUN завершён только после `integrity PASS`, orphan contacts=0, orphan evidence=0, записи в `main` и повторной проверки HEAD.
9. Устаревшие записи и сведения не использовать в решениях, если доступны более свежие подтверждённые данные.
10. Outreach не выполнять.


## Latest verified run N5K-20260816-244
Canonical/contactable: 112/112. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest verified run N5K-20260816-245
Canonical/contactable: 115/115. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest verified run N5K-20260816-246
Canonical/contactable: 118/118. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
