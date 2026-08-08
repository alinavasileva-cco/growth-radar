# Growth Radar — актуальная рабочая конфигурация

**Версия:** 08.08.2026  
**Последний подтверждённый запуск:** `N5K-20260808-124`  
**Статус:** `READY` — новый цикл `new_5000` прошёл проверку целостности  
**Текущая цель:** 5000 уникальных компаний с baseline=0  
**Автоматический outreach:** запрещён

## Новый независимый цикл

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- baseline_count: **0**;
- текущий канонический итог: **94**;
- текущий contactable итог: **94**;
- осталось до цели: **4906**;
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
- последний отчёт: `reports/run_2026-08-08_124.md`.

## Последний RUN

- найдено сырых кандидатов: **30**;
- квалифицировано: **2**;
- добавленные компании: **19LAB / ООО «СУРИН»; Chacha’s Club / ИП Кожомин Кирилл Павлович**;
- подтверждённые дубли: **6**;
- исключено или не прошло полную квалификацию: **22**;
- ACTIVE WIP: **8**;
- integrity: **PASS**;
- orphan contacts: **0**;
- orphan evidence: **0**;
- repair: не требовался;
- blocker: отсутствует; критерии не снижались.