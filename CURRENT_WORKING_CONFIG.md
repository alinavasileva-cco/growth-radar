# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-22T05:58:35+05:00  
**Последний полностью завершённый RUN:** `N5K-20260822-310`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **222 / 222**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4778**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- physical canonical/contactable count: **222 / 222**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260822-310`.

## RUN 307 — завершён

Фактически индивидуально проверен **31 разный raw-кандидат/работодатель** по свежим job-board сигналам 2026 года, актуальным company/legal профилям и официальным сайтам. Требуемый диапазон 150–200 raw в этом выполнении честно не достигнут и не заявляется. FAST GATE применялся до deep-check. После финальных гейтов и повторного физического dedup квалифицированы и интегрированы **3** новые компании: IBMM Technology / ООО «ИБММ ТЕХНОЛОГИИ» (ИНН 5032334982), Рива Групп / ООО «РИВА ГРУПП» (ИНН 9715417198), Universum Project / ООО «УНИВЕРСУМ ПРОДЖЕКТ» (ИНН 7701885298).

Воронка RUN 307: discovered 31 → fast gate 7 → size 5 → legal 4 → signal 3 → LPR 3 → contact 3 → qualified 3 → physically integrated 3. Duplicates: 2; excluded: 26. Physical canonical/contactable: 211/211. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

Для решений использованы актуальные сведения 2025–2026. По IBMM подтверждены действующее ООО, выручка около 2,90 млрд ₽ за 2025 год, 39 сотрудников, собственник/гендиректор Дмитрий Гузенко, официальный бренд→юрлицо и коммерческий маршрут; сигнал 15.06.2026 — Head of Sales B2B с ответственностью за коммерческие показатели, команду и воронку. По Рива Групп подтверждены действующее ООО, выручка 19,849 млн ₽ за 2025 год, собственник/гендиректор Даниил Шагинян, официальный сайт и клиентский маршрут; сигнал июня 2026 — директор по развитию и продажам консалтинговых услуг. По Universum Project подтверждены действующее ООО, 9 сотрудников по текущему профилю, актуальная публичная финансовая выборка около 12,6 млн ₽, совладельцы Борис и Вячеслав Рыжков, официальный корпоративный маршрут и прямой публичный рабочий контакт управляющего партнёра; 16.08.2026 компания искала директора по продажам и развитию бизнеса. LS-Lighting исключён из-за актуального конфликта brand→legal на официальном сайте (ООО и ИП одновременно); устаревшие или противоречивые данные для закрытия гейтов не использовались.

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

## Latest verified run N5K-20260822-307
Canonical/contactable: 211/211. Added: 3. Raw 31; fast 7; qualified 3. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260822-308
Canonical/contactable: 214/214. Added: 3. Raw 38; fast 8; size 5; legal 4; signal 3; LPR 3; contact 3; qualified 3. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260822-309
Canonical/contactable: 216/216. Added: 2. Raw 25; fast 5; size 3; legal 3; signal 2; LPR 2; contact 2; qualified 2. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260822-310
Canonical/contactable: 222/222. Added: 6. Raw 31; fast 8; size 6; legal 6; signal 6; LPR 6; contact 6; qualified 6. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
