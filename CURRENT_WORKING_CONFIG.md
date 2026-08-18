# Growth Radar — актуальная рабочая конфигурация

**Версия:** 18.08.2026 08:00 MSK  
**Последний полностью завершённый RUN:** `N5K-20260818-293`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **186 / 186**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4814**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- physical canonical/contactable count: **186 / 186**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260818-293`.

## RUN 293 — завершён

Широкий discovery: **100 реальных разных raw-кандидатов/работодателей** из нескольких потоков: вакансии/job boards, актуальные публикации компаний и сигналы роста, официальные сайты, реестровые и отраслевые источники. FAST GATE выполнен до deep-check. После финальных гейтов и повторного физического dedup квалифицированы и интегрированы **3** новые компании: BLIFT.RU / ООО «ЭН-ЭЛ» (ИНН 7713566056), SECURITM / ООО «СЕКЪЮРИТМ» (ИНН 7820074059), РАТИБОР / ООО «РАТИБОР» (ИНН 6685207237).

Воронка RUN 293: discovered 100 → fast gate 8 → size 6 → legal 5 → signal 4 → LPR 3 → contact 3 → qualified 3 → physically integrated 3. Подтверждённых дублей: 7; excluded: 90. Active WIP: 0. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

Для решений использованы актуальные сведения 2025–2026. Устаревшие и конфликтующие записи исключены. Финальный физический integration guard подтвердил отсутствие дублей у трёх добавленных компаний.

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

## Latest verified run N5K-20260818-293
Canonical/contactable: 186/186. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest verified run N5K-20260818-294
Canonical/contactable: 187/187. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
