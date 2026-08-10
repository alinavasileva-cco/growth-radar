# Growth Radar — актуальная рабочая конфигурация

**Версия:** 10.08.2026  
**Последний запуск:** `N5K-20260810-170`  
**Статус:** `COMPLETED` — integrity PASS, campaign run_log синхронизирован  
**Текущая цель:** 5000 уникальных компаний с baseline=0  
**Автоматический outreach:** запрещён

## Новый независимый цикл

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- baseline_count: **0**;
- текущий канонический итог: **161**;
- текущий contactable итог: **161**;
- осталось до цели: **4839**;
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
- последний отчёт: `reports/run_2026-08-10_170.md`.

## Последний RUN

- найдено сырых кандидатов: **30**;
- квалифицировано: **3**;
- добавленные компании: `N5K-0159 Торг-Лайт`, `N5K-0160 MORE METIZOV`, `N5K-0161 Logos-LTD`;
- подтверждённые дубли: **7**;
- исключено или не прошло полную квалификацию: **20**;
- ACTIVE WIP: **8**;
- integrity: **PASS**;
- orphan contacts: **0**;
- orphan evidence: **0**;
- blocker: нет;
- перед discovery безопасно исправлен пропуск RUN 169 в общем campaign run_log через полный blob-read;
- критерии не снижались.