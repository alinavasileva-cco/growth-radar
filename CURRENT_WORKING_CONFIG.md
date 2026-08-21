# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-21T14:08:00+03:00  
**Последний полностью завершённый RUN:** `N5K-20260821-296`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **190 / 190**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4810**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- physical canonical/contactable count: **189 / 189**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260818-295`.

## RUN 295 — восстановлен и завершён

Финальный physical dedup выявил, что PanelTEK / ПанельТЭК (ИНН 5009130780) уже находился в master как N5K-0213, поэтому повторно не добавлен. Из pending интегрированы только 2 уникальные компании: Погружение / Альфа Квест и Huntsman.

Воронка RUN 295: discovered 100 → fast gate 10 → size 5 → legal 4 → signal 3 → LPR 3 → contact 3 → unique qualified/integrated 2. Duplicates: 15; excluded: 83. Physical canonical/contactable: 189/189. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## RUN 294 — завершён

Фактически индивидуально проверено **35 разных raw-кандидатов/работодателей** из job-board и актуальных официальных/legal/company источников. Требуемый порог 100 разных raw в этом выполнении честно не достигнут и не заявляется. FAST GATE применялся до deep-check. После финальных гейтов и повторного физического dedup квалифицирована и интегрирована **1** новая компания: TRAFT / ООО «ТРАФТ» (ИНН 7720522660).

Воронка RUN 294: discovered 35 → fast gate 5 → size 2 → legal 2 → signal 2 → LPR 1 → contact 1 → qualified 1 → physically integrated 1. Подтверждённых дублей: 5; excluded: 29. Active WIP: 0. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

Для решения использованы актуальные сведения 2025–2026. Устаревшие и конфликтующие записи исключены. Финальный physical integration guard подтвердил отсутствие дубля у добавленной компании.

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

## Latest verified run N5K-20260818-295
Canonical/contactable: 189/189. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest verified run N5K-20260821-296
Canonical/contactable: 190/190. Added: 1. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.


## Latest verified run N5K-20260821-297
Canonical/contactable: 192/192. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.




## RUN 297 — verified final
Physical canonical/contactable: 192/192. Added 2. Raw 40; fast 8; qualified 2. Integrity PASS. Orphan 0/0. Outreach 0.
