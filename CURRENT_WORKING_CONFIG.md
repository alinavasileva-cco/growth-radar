# Growth Radar — актуальная рабочая конфигурация

**Версия:** 11.08.2026  
**Последний запуск:** `N5K-20260811-180`  
**Статус:** `COMPLETED` — данные интегрированы, integrity PASS, общий campaign run_log восстановлен и дополнен RUN 180  
**Текущая цель:** 5000 уникальных компаний с baseline=0  
**Автоматический outreach:** запрещён

## Новый независимый цикл

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- baseline_count: **0**;
- текущий канонический итог: **175**;
- текущий contactable итог: **175**;
- осталось до цели: **4825**;
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
- последний отчёт: `reports/run_2026-08-11_180.md`.

## Последний RUN

- найдено сырых кандидатов: **30**;
- квалифицировано: **1**;
- добавленная компания: `N5K-0175 Т2 / ООО «Т2»`;
- подтверждённые дубли: **9**;
- исключено или не прошло полную квалификацию: **20**;
- ACTIVE WIP: **8**;
- integrity: **PASS**;
- orphan contacts: **0**;
- orphan evidence: **0**;
- blocker: отсутствует;
- repair: общий `data/campaigns/new_5000/run_log.csv` безопасно восстановлен через полный blob для RUN 175–179 и затем дополнен RUN 180;
- критерии не снижались.