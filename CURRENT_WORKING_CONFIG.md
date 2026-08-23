# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-08-23T05:58:00+05:00  
**Последний полностью завершённый RUN:** `N5K-20260823-339`  
**Статус канонической базы:** ACTIVE / integrity PASS  
**Физически подтверждённый canonical/contactable:** **260 / 260**  
**Qualified staged not counted:** **0**  
**Цель:** **5000** уникальных contactable компаний кампании `new_5000`  
**Осталось:** **4740**  
**Outreach:** запрещён

## Источник истины

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- physical canonical/contactable count: **260 / 260**;
- orphan contacts/evidence: **0 / 0**;
- последний завершённый RUN: `N5K-20260823-339`;
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

## Последний проверенный RUN — N5K-20260823-339

Baseline перед RUN: **259 / 259**.  
Фактически обработано raw: **16**. Целевые 150–200 в этом RUN не достигнуты и не заявляются.  
Воронка: discovered **16** → fast gate **4** → size **2** → legal **2** → signal **2** → LPR **2** → contact **2** → qualified **1** → physically integrated **1**.  
Duplicates: **1**. Excluded: **14**.  
Добавлена: **Norke / Norke Group / ООО «СИЯНИЕ»**, ИНН `7801689265`, Lead ID `N5K-0406`.  
Итог physical canonical/contactable: **260 / 260**.  
Integrity: **PASS**. Orphan contacts/evidence: **0 / 0**. Active WIP: **0**. Outreach: **0**.

В RUN 339 устранён подтверждённый дубль UNIONDELTA / ООО «ПРОФ-ТОН ГРУПП», уже присутствующий в physical master как `N5K-0351`; повторно компания не засчитана. Для Norke использованы актуальные сведения: официальный сайт подтверждает ООО «СИЯНИЕ» и ИНН `7801689265`, официальный Norke Group публикует прямой маршрут к Александру Маслову, а вакансия от 06.08.2026 подтверждает S1-сигнал на подключение новых гостиничных объектов и построение воронки собственников.

История предыдущих RUN сохранена в `run_logs`, `reports`, shards/increments и Git history; этот файл содержит актуальное каноническое состояние и правила продолжения.

## Latest verified run N5K-20260823-339
Canonical/contactable: 260/260. Integrity PASS. Orphan contacts/evidence: 0/0. Outreach: 0.
