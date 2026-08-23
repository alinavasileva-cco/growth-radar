# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-23T22:12:00+05:00  
**Последний полностью завершённый RUN:** `N5K-20260823-360`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **286 / 286**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4714**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- physical canonical/contactable count: **286 / 286**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260823-360`;
- physical master/integration guard является финальным источником дедупликации;
- устаревшие данные не использовать в решениях, если доступны более свежие подтверждённые сведения.

## Правила продолжения

1. Перед каждым RUN проверять свежий HEAD, `data/runtime/current_run_status.json`, `data/runtime/campaign_target.json`, pending и физические master/contactable.
2. Discovery: целевой throughput 150–200 реальных разных raw-кандидатов за RUN; не засчитывать строки поисковой выдачи как обработанные компании.
3. Использовать несколько независимых discovery-потоков: вакансии/job boards, новости роста/филиалов/новых направлений, отраслевые источники, официальные сайты и публичные публикации собственников/компаний.
4. FAST GATE до deep-check: частная компания/ИП → ориентир масштаба → быстрый dedup → вероятный S1–S3 сигнал.
5. ACTIVE WIP <=50; после завершения пачки продолжать следующую в том же RUN.
6. Deep funnel: SIZE → LEGAL → SIGNAL → LPR → CONTACT → QUALIFIED.
7. QUALIFIED только при подтверждённых: действующее юрлицо/ИП, ИНН, актуальный масштаб, S1–S3 бизнес-сигнал, собственник/ЛПР и практический маршрут связи.
8. Дедуп дважды: до deep-check и непосредственно перед записью по Lead ID, ИНН, ОГРН/ОГРНИП, точному юрлицу и подтверждённой связке бренд+домен.
9. Новая компания засчитывается только после физической записи в leads_master/contactable_master, contacts, evidence, increments/shards, run logs/report/runtime/campaign/config.
10. Qualified не должен оставаться только в pending после завершения RUN.
11. При integrity/dedup/write/metadata проблеме — REPAIR в том же RUN, без обнуления базы и без остановки поиска.
12. RUN завершён только после integrity PASS, orphan contacts=0, orphan evidence=0, физической записи в main и повторной проверки HEAD SHA.
13. Не выполнять outreach, не готовить письма и не тратить RUN на задачи вне поиска/квалификации/интеграции.
14. Технические записи делать пакетно и не создавать отдельный commit на каждый stage/candidate, если это не требуется доступным GitHub-интерфейсом.

## Сохранённый подробный RUN — N5K-20260823-355

Baseline перед RUN: **278 / 278**.  
Фактически индивидуально обработано raw-кандидатов: **14**. Целевые 150–200 в этом RUN не достигнуты и не заявляются.  
Воронка: discovered **14** → fast gate **5** → size **3** → legal **2** → signal **2** → LPR **2** → contact **2** → qualified **2** → physically integrated **2**.  
Duplicates: **2**. Excluded: **10**.  
Добавлены:
- **Бытовки в Дом / Комфорт Групп — ООО «КОМФОРТ ГРУПП»**, ИНН `5018202511`, ОГРН `1195081093679`, Lead ID `N5K-0425`.
- **ЭКОТАР — ООО «ЭКОТАР»**, ИНН `0554005758`, ОГРН `1190571011927`, Lead ID `N5K-0426`.

Итог physical canonical/contactable: **280 / 280**.  
Integrity: **PASS**. Orphan contacts/evidence: **0 / 0**. Active WIP: **0**. Outreach: **0**.

Для ООО «КОМФОРТ ГРУПП» использованы свежие 2025–2026 сведения: действующее частное ООО; выручка за 2025 год **115,147 млн ₽**, при этом официальный производственный контур подтверждает цех 1500 м², 17 сборочных бригад, 20 производственных участков, >250 заказов в месяц и >3000 м² продукции в месяц. Генеральный директор и 100% участник — **Трошин Дмитрий Владимирович**. Свежий сигнал **13.08.2026** — вакансия Руководителя отдела продаж B2B производства модульных зданий и строительных городков. Официальный сайт подтверждает бренд→юрлицо и корпоративные маршруты связи.

Для ООО «ЭКОТАР» подтверждены действующее юрлицо, выручка за 2025 год **101,168 млн ₽**, текущий производственный профиль и действующая фабрика гофротары; генеральный директор — **Хасаев Осман Арабиевич**, контролирующий собственник 95% — **Кушиев Рамазан Гаджиевич**. Сигнал 2026 года — поиск руководителя B2B-продаж для систематизации отдела, усиления команды и кратного роста оборота на этапе масштабирования. Официальный сайт подтверждает телефон и branded-domain email.

История предыдущих RUN сохранена в `run_logs`, `reports`, shards/increments и Git history; этот файл содержит актуальное каноническое состояние и обязательные правила продолжения.

## Latest verified run N5K-20260823-352
Canonical/contactable: 274/274. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260823-353
Canonical/contactable: 276/276. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260823-354
Canonical/contactable: 278/278. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260823-355
Canonical/contactable: 280/280. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260823-356
Canonical/contactable: 281/281. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260823-357
Canonical/contactable: 282/282. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260823-358
Canonical/contactable: 283/283. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260823-359
Canonical/contactable: 285/285. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.

## Latest verified run N5K-20260823-360
Canonical/contactable: 286/286. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
