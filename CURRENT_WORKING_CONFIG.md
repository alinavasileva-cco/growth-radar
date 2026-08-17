# Growth Radar — актуальная рабочая конфигурация

**Версия:** 17.08.2026 14:00 MSK  
**Последний полностью завершённый RUN:** `N5K-20260817-278`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **162 / 162**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4838**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- physical canonical/contactable count: **162 / 162**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260817-278`.

## RUN 278

Широкий discovery: **100 реально разных raw-кандидатов**. После дешёвого FAST GATE и deep-check физически интегрированы **3** новые уникальные компании:

1. ТД Микс-Трейд / Mix Trade — ООО «ТД МИКС-ТРЕЙД», ИНН 3443140563.
2. FinFort — ООО «ФИНФОРТ РИСЕРЧ ЭНД ДЕВЕЛОПМЕНТ», ИНН 9715361386.
3. КОРСУНЬ — ООО «КОРСУНЬ», ИНН 2308261947.

Воронка: discovered 100 → fast gate 3 → size 3 → legal 3 → signal 3 → LPR 3 → contact 3 → qualified 3. Second pre-write dedup among deep candidates: 0; excluded 97. Все три прошли физический integration guard и добавлены в master/contactable, contacts/evidence и RUN-shards.

Для решений использованы актуальные данные 2025–2026 годов; устаревшие значения не использовались при наличии более свежих подтверждений.

## Правила продолжения

1. Перед каждым RUN проверять свежий HEAD, runtime, campaign_target и физические master/contactable.
2. Discovery: минимум 100 реальных разных raw; быстрый FAST GATE до deep-check.
3. FAST GATE: частная компания/ИП → масштаб → быстрый dedup → вероятный S1–S3 сигнал.
4. ACTIVE WIP <=50; глубоко проверять лучших прошедших кандидатов.
5. Дедуп дважды: до deep-check и непосредственно перед записью.
6. QUALIFIED только при подтверждённых юрлице/ИП, ИНН, масштабе, S1–S3, собственнике/ЛПР и практическом маршруте связи.
7. Новая компания засчитывается только после физической записи в master/contactable и связанных contact/evidence слоях.
8. При integrity/dedup/write проблеме — REPAIR в том же RUN, без обнуления базы.
9. RUN завершён только после integrity PASS, orphan contacts=0, orphan evidence=0 и повторной проверки HEAD SHA.
10. Устаревшие данные не использовать в решениях, если доступны более свежие подтверждённые сведения.
11. Outreach не выполнять.

История предыдущих RUN хранится в `run_logs`, `reports`, shards и Git history.
