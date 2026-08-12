# Growth Radar — актуальная рабочая конфигурация

**Версия:** 12.08.2026  
**Последний запуск:** `N5K-20260812-226`  
**Статус:** `COMPLETED` — integrity PASS, verified run-log tail продлён через RUN 226; новых квалифицированных компаний в этом RUN нет  
**Текущая цель:** 5000 уникальных компаний с baseline=0  
**Автоматический outreach:** запрещён

## Новый независимый цикл

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- baseline_count: **0**;
- текущий канонический итог: **228**;
- текущий contactable итог: **228**;
- осталось до цели: **4772**;
- старые 70 компаний сохранены без изменений и не входят в прогресс нового цикла.

## Канонические файлы нового цикла

- базовый master компаний: `data/campaigns/new_5000/leads_master.csv`;
- базовый contactable master: `data/campaigns/new_5000/contactable_master.csv`;
- контакты и доказательства: базовые CSV плюс проверенные RUN-shards;
- логический канонический набор компаний: объединение базовых master-файлов и всех проверенных RUN-shards кампании `new_5000`;
- increments: `data/campaigns/new_5000/increments/`;
- legacy campaign run log through RUN 197: `data/campaigns/new_5000/run_log.csv`;
- verified aggregate tail RUN 198 onward: `data/campaigns/new_5000/run_log_tail_198_onward.csv`;
- канонический run-log: логическое объединение legacy `run_log.csv` + verified tail без пересечения RUN ID;
- RUN-логи: `data/campaigns/new_5000/run_logs/`;
- runtime: `data/runtime/current_run_status.json` и `data/runtime/campaign_target.json`;
- последний отчёт: `reports/run_2026-08-12_226.md`.

## Последний RUN

- найдено сырых кандидатов: **30**;
- квалифицировано: **0**;
- подтверждённые дубли: **7**;
- исключено или не прошло полную квалификацию: **23**;
- добавленных компаний: **нет**;
- ACTIVE WIP: **8**;
- integrity: **PASS**;
- orphan contacts: **0**;
- orphan evidence: **0**;
- verified tail дополнен RUN 226;
- критерии не снижались.

## Правило следующих RUN

До безопасной консолидации физического монолитного `run_log.csv` новые строки campaign run-log добавлять в `run_log_tail_198_onward.csv` и отдельный `run_logs/<RUN>.csv`. Канонический run-log считать объединением legacy-файла (до RUN 197 включительно) и verified tail (с RUN 198). Не считать это blocker discovery или integrity, если оба диапазона присутствуют, не пересекаются и отдельные RUN-логи PASS.