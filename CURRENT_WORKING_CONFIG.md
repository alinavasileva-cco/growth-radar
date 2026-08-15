# Growth Radar — актуальная рабочая конфигурация

**Версия:** 15.08.2026  
**Последний запуск:** `N5K-20260815-238`  
**Статус:** `COMPLETED` — integrity PASS; добавлены 3 новые квалифицированные компании  
**Текущая цель:** 5000 уникальных компаний с baseline=0; общий долгосрочный ориентир проекта — 50000  
**Автоматический outreach:** запрещён

## Новый независимый цикл

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- baseline_count: **0**;
- текущий канонический итог: **249**;
- текущий contactable итог: **249**;
- осталось до текущей цели 5000: **4751**;
- старые 70 компаний сохранены без изменений и не входят в прогресс нового цикла.

## Канонические файлы нового цикла

- базовый master компаний: `data/campaigns/new_5000/leads_master.csv`;
- базовый contactable master: `data/campaigns/new_5000/contactable_master.csv`;
- проверенные новые компании дополнительно фиксируются в `data/campaigns/new_5000/master_shards/` и `data/campaigns/new_5000/contactable_shards/`;
- контакты и доказательства: базовые CSV плюс проверенные RUN-increments;
- логический канонический набор компаний/contactable: объединение базовых master-файлов и всех проверенных RUN-shards кампании `new_5000` без повторов по Lead ID/ИНН/ОГРН;
- increments: `data/campaigns/new_5000/increments/`;
- legacy campaign run log through RUN 197: `data/campaigns/new_5000/run_log.csv`;
- verified aggregate tail RUN 198 onward: `data/campaigns/new_5000/run_log_tail_198_onward.csv`;
- канонический run-log: логическое объединение legacy `run_log.csv` + verified tail без пересечения RUN ID;
- RUN-логи: `data/campaigns/new_5000/run_logs/`;
- runtime: `data/runtime/current_run_status.json` и `data/runtime/campaign_target.json`;
- последний отчёт: `reports/run_2026-08-15_238.md`.

## Последний RUN — N5K-20260815-238

- найдено сырых кандидатов: **50**;
- size check passed: **3**;
- legal match passed: **3**;
- signal confirmed: **3**;
- LPR identified: **3**;
- contact route found: **3**;
- квалифицировано и добавлено: **3**;
- подтверждённые дубли: **0**;
- исключено / не прошло обязательные гейты: **47**;
- добавленные компании: **Единый центр TRADE-IN / ФРЕШ 69**, **Группа МЕТТАТРОН**, **РТК Автоматика**;
- новый итог: **249 canonical / 249 contactable**;
- integrity: **PASS**;
- orphan contacts: **0**;
- orphan evidence: **0**;
- outreach sent: **0**;
- критерии не снижались.

## Правило следующих RUN

1. Всегда сначала определять последний фактически подтверждённый RUN по run_logs/master_shards/commits, а не доверять устаревшему runtime автоматически.
2. При рассинхронизации сразу выполнять REPAIR в том же цикле и затем продолжать discovery; не отключать поиск молча.
3. Каждый RUN: 50–60 сырых кандидатов, ACTIVE WIP <=50, воронка DISCOVERED → SIZE CHECK → LEGAL MATCH → SIGNAL CONFIRMED → LPR IDENTIFIED → CONTACT ROUTE FOUND → QUALIFIED.
4. Целевой выход: 8–15 новых квалифицированных компаний, когда источники позволяют; критерии ради количества не снижать.
5. Дедупликация: Lead ID, ИНН, ОГРН/ОГРНИП, точное юрлицо, подтверждённая связка бренд+домен.
6. Новые contactable компании должны в том же RUN иметь master/contactable запись, контакты, evidence, отдельный RUN-log, отчёт и обновлённый runtime.
7. RUN считается завершённым только при integrity PASS, orphan contacts/evidence=0 и фактической записи в main.
8. Автоматический outreach запрещён.
