# Growth Radar — актуальная рабочая конфигурация

**Версия:** 11.08.2026  
**Последний запуск:** `N5K-20260811-183`  
**Статус:** `PENDING_MAIN_RUN_LOG_APPEND` — данные интегрированы, integrity PASS, требуется безопасно дополнить общий campaign run_log за RUN 182 и RUN 183  
**Текущая цель:** 5000 уникальных компаний с baseline=0  
**Автоматический outreach:** запрещён

## Новый независимый цикл

- campaign_id: `new_5000`;
- namespace: `data/campaigns/new_5000`;
- baseline_count: **0**;
- текущий канонический итог: **180**;
- текущий contactable итог: **180**;
- осталось до цели: **4820**;
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
- последний отчёт: `reports/run_2026-08-11_183.md`.

## Последний RUN

- найдено сырых кандидатов: **30**;
- квалифицировано: **2**;
- добавленные компании: `N5K-0179 Chacha’s Club / ИП Кожомин Кирилл Павлович`; `N5K-0180 Торг-Лайт / ООО «ТОРГ-ЛАЙТ»`;
- подтверждённые дубли: **7**;
- исключено или не прошло полную квалификацию: **21**;
- ACTIVE WIP: **8**;
- integrity: **PASS**;
- orphan contacts: **0**;
- orphan evidence: **0**;
- blocker: общий `data/campaigns/new_5000/run_log.csv` требует безопасного full-file append за RUN 182 и RUN 183; отдельные RUN-логи созданы;
- критерии не снижались.
