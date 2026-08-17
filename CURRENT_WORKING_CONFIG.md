# Growth Radar — актуальная рабочая конфигурация

**Версия:** 17.08.2026 16:31 MSK  
**Последний полностью завершённый RUN:** `N5K-20260817-280`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **165 / 165**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4835**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- physical canonical/contactable count: **165 / 165**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260817-280`.

## RUN 280

Широкий discovery: **100 raw-кандидатов** из нескольких потоков — вакансии и свежие сигналы расширения/производства. FAST GATE до deep-check: 7. После актуальных scale/legal/signal/LPR/contact проверок физически интегрированы **2** новые компании:

1. Термопрофи — ООО «ТЕРМОПРОФИ», ИНН 2465162350.
2. Панова Тех / Panova Tech — ООО «ПАНОВА ТЕХ», ИНН 5410084483.

Воронка: discovered 100 → fast gate 7 → size 2 → legal 2 → signal 2 → LPR 2 → contact 2 → qualified 2. Финальный pre-write dedup по двум deep-кандидатам: 0; excluded 98. Первая интеграция остановилась до записи из-за отсутствующего необязательного поля `HH Contact` в pending-схеме; схема исправлена в том же RUN, повторная интеграция завершилась успешно. Physical master/contactable: 165/165, integrity PASS, orphan 0/0.

Для решений использованы актуальные данные 2025–2026 годов; устаревшие значения не использовались при наличии более свежих подтверждений. Например, Лалибела кофе исключена по свежему масштабу 2025 года, превышающему текущий scale gate.

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


## Latest verified run N5K-20260817-281
Canonical/contactable: 167/167. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
