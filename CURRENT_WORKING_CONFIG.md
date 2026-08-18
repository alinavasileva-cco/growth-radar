# Growth Radar — актуальная рабочая конфигурация

**Версия:** 18.08.2026 06:00 MSK  
**Последний полностью завершённый RUN:** `N5K-20260818-291`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **182 / 182**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4818**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- physical canonical/contactable count: **182 / 182**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260818-291`.

## RUN 291 — завершён

Широкий discovery: **100 реальных разных raw-сигналов** из нескольких потоков: вакансии/job boards, актуальные публикации компаний, официальные сайты и реестровые/отраслевые источники. После FAST GATE и deep-check квалифицированы и физически интегрированы **2** новые компании: ANNA GALE / ИП Галевко Анна Владимировна, ИНН 773417347854; Савицкая и партнёры / ООО «САВИЦКАЯ И ПАРТНЁРЫ», ИНН 7722852617. Для обеих выполнен повторный dedup непосредственно перед физической записью.

Воронка RUN 291: discovered 100 → fast gate 8 → size 4 → legal 3 → signal 2 → LPR 2 → contact 2 → qualified 2 → physically integrated 2. Duplicates: 19; excluded: 79. Active WIP: 0. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

Для решений использованы актуальные сведения 2025–2026. Устаревшие и конфликтующие записи не использовались. По ANNA GALE корректный ОГРНИП подтверждён реестровым источником отдельно от опечатки на официальном сайте; по Савицкая и партнёры подтверждены актуальные 2025 финансовые данные, собственник/CEO и публичные прямые маршруты к ЛПР.

## Правила продолжения

1. Перед каждым RUN проверять свежий HEAD, runtime, campaign_target и физические master/contactable.
2. Discovery: минимум 100 реальных разных raw; быстрый FAST GATE до deep-check.
3. FAST GATE: частная компания/ИП → масштаб → быстрый dedup → вероятный S1–S3 сигнал.
4. ACTIVE WIP <=50; глубоко проверять лучших прошедших кандидатов.
5. Дедуп дважды: до deep-check и непосредственно перед записью; физический master/integration guard является финальным источником истины.
6. QUALIFIED только при подтверждённых юрлице/ИП, ИНН, масштабе, S1–S3, собственнике/ЛПР и практическом маршруте связи.
7. Новая компания засчитывается только после физической записи в master/contactable и связанных contact/evidence слоях.
8. При integrity/dedup/write проблеме — REPAIR в том же RUN, без обнуления базы.
9. RUN завершён только после integrity PASS, orphan contacts=0, orphan evidence=0 и повторной проверки HEAD SHA.
10. Устаревшие данные не использовать в решениях, если доступны более свежие подтверждённые сведения.
11. Outreach не выполнять.

История предыдущих RUN хранится в `run_logs`, `reports`, shards и Git history.

## Latest verified run N5K-20260818-291
Canonical/contactable: 182/182. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest verified run N5K-20260818-292
Canonical/contactable: 183/183. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
