# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-21T19:00:00+05:00  
**Последний полностью завершённый RUN:** `N5K-20260821-299`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **195 / 195**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4805**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- physical canonical/contactable count: **195 / 195**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260821-299`.

## RUN 299 — завершён

Фактически индивидуально проверено **14 разных raw-кандидатов/работодателей** из актуальных job-board, официальных сайтов и company/legal источников. Требуемый диапазон 150–200 raw в этом выполнении честно не достигнут и не заявляется. FAST GATE применялся до deep-check. После финальных гейтов и повторного физического dedup квалифицированы и интегрированы **2** новые компании: СоюзХимТранс-Авто / ООО «СОЮЗХИМТРАНС-АВТО» (ИНН 7805564299) и Well Fitness / ООО «ОПТИМА ИМПОРТ» (ИНН 7734728519).

Воронка RUN 299: discovered 14 → fast gate 5 → size 3 → legal 3 → signal 2 → LPR 2 → contact 2 → qualified 2 → physically integrated 2. Duplicates: 0; excluded: 12. Physical canonical/contactable: 195/195. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

Для решения использованы актуальные сведения 2025–2026. Устаревшие и конфликтующие записи исключены. Финальный physical integration guard подтвердил отсутствие дублей у двух добавленных компаний.

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
Canonical/contactable: 197/197. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
