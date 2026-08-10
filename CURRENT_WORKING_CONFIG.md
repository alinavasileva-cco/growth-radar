# Growth Radar — актуальная рабочая конфигурация

**Версия:** 10.08.2026  
**Последний запуск:** `N5K-20260810-175`  
**Статус:** `PENDING_MAIN_RUN_LOG_APPEND` — данные интегрированы, integrity PASS; общий campaign run_log требует безопасного append  
**Текущая цель:** 5000 уникальных компаний с baseline=0  
**Автоматический outreach:** запрещён

## Новый независимый цикл

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- baseline_count: **0**;
- текущий канонический итог: **170**;
- текущий contactable итог: **170**;
- осталось до цели: **4830**;
- старые 70 компаний сохранены без изменений и не входят в прогресс нового цикла.

## Канонические файлы нового цикла

- базовый master компаний: `data/campaigns/new_5000/leads_master.csv`;
- базовый contactable master: `data/campaigns/new_5000/contactable_master.csv`;
- контакты и доказательства: базовые CSV плюс проверенные RUN-shards;
- логический канонический набор: объединение базовых master-файлов и всех проверенных RUN-shards кампании `new_5000`;
- increments: `data/campaigns/new_5000/increments/`;
- общий campaign run log: `data/campaigns/new_5000/run_log.csv`;
- RUN-логи: `data/campaigns/new_5000/run_logs/`;
- runtime: `data/runtime/current_run_status.json` и `data/runtime/campaign_target.json`;
- последний отчёт: `reports/run_2026-08-10_175.md`.

## Последний RUN

- найдено сырых кандидатов: **30**;
- квалифицировано: **2**;
- добавленные компании: `N5K-0169 Hugency / ИП Валеева Луиза Альфиковна`; `N5K-0170 Kepo Ortho / ИП Подобед Иннокентий Владиславович`;
- подтверждённые дубли: **7**;
- исключено или не прошло полную квалификацию: **21**;
- ACTIVE WIP: **8**;
- integrity: **PASS**;
- orphan contacts: **0**;
- orphan evidence: **0**;
- blocker: campaign-level `data/campaigns/new_5000/run_log.csv` ещё не дополнен строкой RUN 175; исходный blob прочитан полностью, файл не усекался и не перезаписывался частично;
- критерии не снижались.