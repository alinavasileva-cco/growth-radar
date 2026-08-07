# Growth Radar — актуальная рабочая конфигурация

**Версия:** 07.08.2026  
**Последний подтверждённый запуск:** `N5K-20260807-094`  
**Статус:** `READY` — новый цикл `new_5000` прошёл проверку целостности  
**Текущая цель:** 5000 уникальных компаний с baseline=0  
**Автоматический outreach:** запрещён

## Новый независимый цикл

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- baseline_count: **0**;
- текущий канонический итог: **58**;
- текущий contactable итог: **58**;
- осталось до цели: **4942**;
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
- последний отчёт: `reports/run_2026-08-07_094.md`.

## Последний RUN

- найдено сырых кандидатов: **30**;
- квалифицировано: **1**;
- добавленная компания: **AI-UP / ООО «НЕЙРОЛИД»**;
- подтверждённые дубли: **0**;
- исключено или не прошло полную квалификацию: **29**;
- ACTIVE WIP: **8**;
- integrity: **PASS**;
- orphan contacts: **0**;
- orphan evidence: **0**;
- repair: не требовался;
- blocker: отсутствует; квалифицированная компания прошла legal → scale → LPR → signal → contact и записана во все канонические RUN-shards.