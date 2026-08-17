# Growth Radar — актуальная рабочая конфигурация

**Версия:** 18.08.2026 02:04 MSK  
**Последний полностью завершённый RUN:** `N5K-20260818-288`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **176 / 176**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4824**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- physical canonical/contactable count: **176 / 176**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260818-288`.

## RUN 288 — завершён

Широкий discovery: **100 реальных разных raw-сигналов** из нескольких поисковых потоков. После FAST GATE и deep-check квалифицирована и физически интегрирована **1** новая компания: Принт-Хаус / ООО «ПРИНТ-ХАУС», ИНН 5260325240. Физический pre-write dedup по master/contactable не выявил дубля.

Воронка RUN 288: discovered 100 → fast gate 1 → size 1 → legal 1 → signal 1 → LPR 1 → contact 1 → qualified 1 → physically integrated 1. Final pre-write duplicates: 0; excluded: 99. Active WIP: 0. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

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
