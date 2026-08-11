# Growth Radar — актуальная рабочая конфигурация

**Версия:** 11.08.2026  
**Последний запуск:** `N5K-20260811-193`  
**Статус:** `CANONICAL_INTEGRATED_RUN_LOG_PENDING` — канонические данные интегрированы, integrity PASS; общий campaign run_log.csv требует безопасного полного append/replace  
**Текущая цель:** 5000 уникальных компаний с baseline=0  
**Автоматический outreach:** запрещён

## Новый независимый цикл

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- baseline_count: **0**;
- текущий канонический итог: **191**;
- текущий contactable итог: **191**;
- осталось до цели: **4809**;
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
- последний отчёт: `reports/run_2026-08-11_193.md`.

## Последний RUN

- найдено сырых кандидатов: **30**;
- квалифицировано: **1**;
- добавлен: `N5K-0191 Нацтранс / ООО «НАЦТРАНС»`;
- подтверждённые дубли: **12**;
- исключено или не прошло полную квалификацию: **17**;
- ACTIVE WIP: **8**;
- integrity: **PASS**;
- orphan contacts: **0**;
- orphan evidence: **0**;
- blocker: общий `data/campaigns/new_5000/run_log.csv` ещё не дополнен RUN 193; blob прочитан полностью, discovery и каноническая интеграция не останавливались;
- критерии не снижались.