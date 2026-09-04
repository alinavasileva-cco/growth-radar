# Growth Radar — актуальная рабочая конфигурация

**Версия:** 2026-09-04 — RUN-144 sequential qualification + accumulated jobs replay  
**Кампания:** `new_5000`  
**Источник истины:** физические `data/campaigns/new_5000/leads_master.csv` и `contactable_master.csv` + contacts/evidence/runtime  
**Физический baseline перед replay:** 614 / 614  
**Цель:** 5000 contactable компаний  
**Outreach:** запрещён

## Единственный рабочий маршрут

Работает один canonical writer. Маршрут восстановлен по исторически лучшему сопоставимому RUN `N5K-20260809-144` (30 raw → 5 fully-qualified, integrity PASS), с обязательной sequential qualification и запретом batch-WIP.

## Критическое правило: qualification-first / sequential

1. Если `data/runtime/current_run_status.json` показывает `active_wip > 0`, новый discovery запрещён.
2. Сначала довести каждый активный кандидат текущего run_id до финального `duplicate`, `excluded` с конкретной причиной или `qualified`.
3. Fully-qualified кандидат записывается физически сразу после прохождения всех gates; он не ждёт окончания обработки всей пачки.
4. После `active_wip = 0` работать по одному кандидату end-to-end: replay candidate → dedup → legal → scale → signal → LPR → contact → final dedup → physical write/exclude.
5. Норма `active_wip`: 0; временно максимум 1.
6. Запрещено сначала собирать пачку и оставлять десятки компаний на будущий запуск.
7. При missing evidence перед `EXCLUDED` обязательны минимум две независимые targeted попытки найти недостающий факт.

## Discovery — HH/job-intent first

После завершения текущего replay основной источник — свежие русскоязычные вакансии российских работодателей, прежде всего HH, при необходимости другие российские job boards. Вакансия — бизнес-сигнал. Анализировать полный текст, а не title/ключевые слова.

Приоритет сигналам: построить/перезапустить отдел продаж; CRM/воронка/KPI/скрипты/регламенты/аналитика; рост выручки/прибыли/маржинальности; лидогенерация/outbound B2B; дилерские/партнёрские/проектные продажи; построение коммерческой команды/функции; вывод собственника из операционки.

Англоязычные лиды и вакансии исключать. Каталоги, реестры, индустриальные парки, массовые investment lists не использовать как основной discovery.

## Строгая квалификация — не ослаблять

Для каждого кандидата обязательны:
1. targeted global dedup по Lead ID / ИНН / ОГРН / exact legal entity / brand+domain;
2. точное действующее российское частное юрлицо/ИП + ИНН/ОГРН;
3. строгий текущий scale gate;
4. датированный S1–S3 сигнал с URL;
5. реальный собственник / CEO / ЛПР;
6. опубликованный практический контакт: phone/email/Telegram/VK/HH/form;
7. повторный targeted global dedup;
8. только затем `QUALIFIED`.

Предпочтительная доказательная связка: **вакансия/сигнал → официальный сайт → надёжный открытый источник по юрлицу/финансам/владельцу → официальный опубликованный контакт**.

Никаких придуманных email, неподтверждённых фактов или связок бренда с юрлицом. Неполный ответ большого tree/list вызова не является основанием fail-closed для всего RUN.

## Запись

Qualified записывается в том же выполнении сразу после завершения проверки: canonical/contactable + contacts + evidence + increment/run log/runtime. После записи canonical = contactable, integrity PASS, orphan contacts/evidence = 0/0.

Не создавать workers, staging, pending integrator, recovery writer, config writer, dedup writer или другие параллельные write-paths.

## Текущий replay RUN

`N5K-20260904-631` — срочный replay накопленных job-intent работодателей после завершённого RUN 630. Пока replay не завершён, **новый широкий discovery запрещён**.

Текущее подтверждённое состояние replay: baseline 614; replay_total 60; checked 9; remaining 51; duplicates 4; excluded 5; legal_pass 2; scale_pass 1; signal_pass 0; LPR_pass 0; contact_pass 0; qualified/net_new 0/0; canonical/contactable 614/614; integrity PASS; orphan contacts/evidence 0/0; active_wip 0; outreach 0.

Следующий кандидат по сохранённому cursor: **ООО Бэкграунд**. Следующее выполнение обязано продолжить **тот же `N5K-20260904-631`**, а не создавать новый RUN и не запускать новый discovery.

ROOT_CAUSE replay: (A) full-tree/global preflight + truncated connector → fail-closed до discovery; (B) batch-first → десятки WIP; (C) shallow evidence acquisition → false excludes.

Permanent fixes: targeted dedup; sequential end-to-end; retry missing evidence; immediate physical write.

## Главная метрика

**Новые физически записанные QUALIFIED компании при неизменном качестве и active_wip≈0.**
