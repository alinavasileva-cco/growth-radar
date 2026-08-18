# Growth Radar — актуальная рабочая конфигурация

**Версия:** 18.08.2026 07:02 MSK  
**Последний полностью завершённый RUN:** `N5K-20260818-292`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **183 / 183**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4817**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- physical canonical/contactable count: **183 / 183**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260818-292`.

## RUN 292 — завершён

Широкий discovery: **100 реальных разных raw-кандидатов** из нескольких потоков: вакансии/job boards, актуальные публикации компаний и сигналы роста, официальные сайты, реестровые и отраслевые источники. FAST GATE выполнен до deep-check. После финальных гейтов и повторного физического dedup квалифицирована и интегрирована **1** новая компания: Котельный завод БТС / Группа БТС, ООО «КОТЕЛЬНЫЙ ЗАВОД БИЙСКТЕПЛОСТРОЙ», ИНН 2204077407.

Воронка RUN 292: discovered 100 → fast gate 9 → size 4 → legal 3 → signal 2 → LPR 1 → contact 1 → qualified 1 → physically integrated 1. Duplicates: 21; excluded: 78. Active WIP: 0. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

Для решений использованы актуальные сведения 2025–2026. Устаревшие и конфликтующие записи не использовались. По Котельному заводу БТС подтверждены действующее юрлицо, масштаб, два сильных актуальных S2-сигнала роста/расширения сервисного контура, собственник/директор и официальный практический маршрут связи.

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

## Latest verified run N5K-20260818-292
Canonical/contactable: 183/183. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
