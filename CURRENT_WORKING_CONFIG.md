# Growth Radar — актуальная рабочая конфигурация

**Версия:** 18.08.2026 03:02 MSK  
**Последний полностью завершённый RUN:** `N5K-20260818-289`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **178 / 178**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4822**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- physical canonical/contactable count: **178 / 178**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260818-289`.

## RUN 289 — завершён

Широкий discovery: **100 реальных разных raw-сигналов** из нескольких поисковых потоков. После FAST GATE и deep-check квалифицированы и физически интегрированы **2** новые компании: Zerobit / ООО «ЗЕРОБИТ», ИНН 7724741091; INVISILINE / ООО «НЕВИДИМЫЕ РЕШЕТКИ», ИНН 7727442780. Для обеих выполнен физический pre-write dedup по master/contactable.

Воронка RUN 289: discovered 100 → fast gate 6 → size 4 → legal 3 → signal 2 → LPR 2 → contact 2 → qualified 2 → physically integrated 2. Duplicates: 14; excluded: 84. Active WIP: 0. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

Для решений использованы актуальные сведения 2025–2026. По INVISILINE устаревшая запись одного агрегатора о прежнем генеральном директоре не использовалась: актуальные ЕГРЮЛ-данные фиксируют генерального директора Майкла Мирошкина с 15.10.2025.

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
