# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-21T23:18:00+05:00  
**Последний полностью завершённый RUN:** `N5K-20260821-303`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **202 / 202**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4798**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- physical canonical/contactable count: **202 / 202**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260821-303`.

## RUN 303 — завершён

Фактически индивидуально проверено **28 разных raw-кандидатов/работодателей** из свежих job-board результатов августа 2026, официальных сайтов и company/legal источников. Требуемый диапазон 150–200 raw в этом выполнении честно не достигнут и не заявляется. FAST GATE применялся до deep-check. После финальных гейтов и повторного физического dedup квалифицированы и интегрированы **2** новые компании: Рэмос-Альфа / ООО «РЭМОС-АЛЬФА» (ИНН 7816162760) и Селект / ООО «СЕЛЕКТ» (ИНН 1657251098).

Воронка RUN 303: discovered 28 → fast gate 6 → size 4 → legal 3 → signal 2 → LPR 2 → contact 2 → qualified 2 → physically integrated 2. Duplicates: 3; excluded: 23. Physical canonical/contactable: 202/202. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

Для решений использованы актуальные сведения 2025–2026. По Рэмос-Альфа подтверждены действующее ООО, выручка 3,072 млрд ₽ за 2025 год, 216 сотрудников, текущий директор/совладелец Алексей Чистокин, официальный контактный маршрут и свежая вакансия Head of B2B Growth от 17.08.2026 на фоне развития новых коммерческих направлений. По Селект подтверждены действующее ООО, выручка 1,719805 млрд ₽ за 2025 год, текущий собственник/гендиректор Артур Хасанов, официальный сайт/контакты и вакансия руководителя отдела продаж B2B от 19.08.2026 на этапе активного роста и развития новых коммерческих направлений. Устаревшие и конфликтующие записи не использованы.

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

## Latest verified run N5K-20260821-299
Canonical/contactable: 195/195. Added: 2. Raw 14; fast 5; qualified 2. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260821-300
Canonical/contactable: 197/197. Added: 2. Raw 23; fast 6; qualified 2. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260821-301
Canonical/contactable: 198/198. Added: 1. Raw 24; fast 5; qualified 1. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260821-302
Canonical/contactable: 200/200. Added: 2. Raw 22; fast 5; qualified 2. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260821-303
Canonical/contactable: 202/202. Added: 2. Raw 28; fast 6; qualified 2. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
