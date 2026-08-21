# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-21T18:28:00+05:00  
**Последний полностью завершённый RUN:** `N5K-20260821-298`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **193 / 193**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4807**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- physical canonical/contactable count: **193 / 193**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260821-298`.

## RUN 298 — завершён

Фактически индивидуально проверено **28 разных raw-кандидатов/работодателей** из актуальных job-board и company/legal источников. Требуемый диапазон 150–200 raw в этом выполнении честно не достигнут и не заявляется. FAST GATE применялся до deep-check. После финальных гейтов и повторного физического dedup квалифицирована и интегрирована **1** новая компания: КМ-Сити / ООО «КМ-СИТИ» (ИНН 2224153871).

Воронка RUN 298: discovered 28 → fast gate 5 → size 2 → legal 1 → signal 1 → LPR 1 → contact 1 → qualified 1 → physically integrated 1. Duplicates: 3; excluded: 24. Physical canonical/contactable: 193/193. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

Для решения использованы актуальные сведения 2025–2026. Устаревшие и конфликтующие записи исключены. Финальный physical integration guard подтвердил отсутствие дубля у добавленной компании.

## Правила продолжения

1. Перед каждым RUN проверять свежий HEAD, runtime, campaign_target и физические master/contactable.
2. Discovery: целевой throughput 150–200 реальных разных raw; быстрый FAST GATE до deep-check.
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

## Latest verified run N5K-20260818-295
Canonical/contactable: 189/189. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260821-296
Canonical/contactable: 190/190. Added: 1. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260821-297
Canonical/contactable: 192/192. Added: 2. Raw 40; fast 8; qualified 2. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260821-298
Canonical/contactable: 193/193. Added: 1. Raw 28; fast 5; qualified 1. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
