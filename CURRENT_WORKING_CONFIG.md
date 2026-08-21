# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-22T02:02:00+05:00  
**Последний полностью завершённый RUN:** `N5K-20260822-306`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **208 / 208**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4792**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- physical canonical/contactable count: **208 / 208**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260822-306`.

## RUN 306 — завершён

Фактически индивидуально проверено **12 разных raw-кандидатов/работодателей** из свежих job-board результатов августа 2026 года и актуальных официальных/company/legal источников. Требуемый диапазон 150–200 raw в этом выполнении честно не достигнут и не заявляется. FAST GATE применялся до deep-check. После финальных гейтов и повторного физического dedup квалифицированы и интегрированы **2** новые компании: Дымов Керамика / ООО «ТД «ДЫМОВ КЕРАМИКА» (ИНН 7731377855) и Атлант Трейлерс / ООО «АТЛАНТ ТРЕЙЛЕРС» (ИНН 2543032249).

Воронка RUN 306: discovered 12 → fast gate 5 → size 3 → legal 3 → signal 2 → LPR 2 → contact 2 → qualified 2 → physically integrated 2. Duplicates: 1; excluded: 9. Physical canonical/contactable: 208/208. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

Для решений использованы актуальные сведения 2025–2026. По Дымов Керамика подтверждены действующее ООО, выручка 197,1 млн ₽ за 2025 год, 15 сотрудников, собственник/гендиректор Евгения Зеленская, официальный бренд→юрлицо и оптовый контактный маршрут; 14.08.2026 бренд искал Коммерческого директора / Директора по продажам для следующего этапа роста многоканального бизнеса. По Атлант Трейлерс подтверждены действующее ООО, выручка 264,449 млн ₽ за 2025 год, гендиректор/совладелец Максим Кондратюк, корпоративный маршрут связи и свежая вакансия августа 2026 на Руководителя отдела продаж B2B для развития стратегического направления. Устаревшие и конфликтующие записи не использованы.

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

## Latest verified run N5K-20260822-304
Canonical/contactable: 204/204. Added: 2. Raw 24; fast 6; qualified 2. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260822-305
Canonical/contactable: 206/206. Added: 2. Raw 31; fast 7; qualified 2. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260822-306
Canonical/contactable: 208/208. Added: 2. Raw 12; fast 5; qualified 2. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
