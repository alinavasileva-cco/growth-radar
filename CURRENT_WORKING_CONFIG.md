# Growth Radar — актуальная production-конфигурация

**Версия:** 2026-09-05 — fresh discovery always-on / RUN-144 sequential qualification  
**Кампания:** `new_5000`  
**Источник истины:** физические `data/campaigns/new_5000/leads_master.csv` и `contactable_master.csv` + contacts/evidence/runtime  
**Цель:** 5000 НОВЫХ полностью квалифицированных российских частных компаний  
**Операционный ориентир:** 100–200 physically written net_new qualified в сутки; 5–10 за цикл при достаточном потоке  
**Outreach:** запрещён, `outreach_sent=0`

## Единственный production writer

Работает ОДИН canonical writer. Старые discovery workers, pending_workers, staging queues, recovery writer, dedup writer, config writer и parallel canonical writers запрещены.

## Критическое правило — fresh discovery никогда не блокируется

`new_discovery_allowed = true` ВСЕГДА.

Ни replay, ни backlog, ни recovery, ни `active_wip`, ни truncated/incomplete API/connector response, ни невозможность прочитать большой master/tree целиком НЕ МОГУТ остановить свежий discovery всего RUN.

Минимум 80% каждого RUN — СВЕЖИЙ DISCOVERY. Максимум 20% — replay/backlog/recovery. Один проблемный кандидат может остаться неqualified/на точечный повтор, но не может держать весь RUN заложником.

Fail-open для discovery / fail-closed для qualification:
- не доказан обязательный факт по одной компании → эта компания не проходит;
- не доказан обязательный факт по одной компании ≠ остановить поиск других компаний.

## Discovery — русскоязычные job-intent сигналы

Приоритет №1 — свежие русскоязычные вакансии российских работодателей.

Основной источник: HH. При насыщении сразу ротировать SuperJob, Работа.ру, другие российские job boards и официальные карьерные страницы.

Англоязычные вакансии и лиды исключать.

Анализировать ПОЛНЫЙ текст вакансии, а не только title/ключевые слова. Сильные business-intent сигналы:
- построить/перезапустить/перестроить отдел продаж или коммерческий блок;
- внедрить CRM, воронку, KPI, аналитику, скрипты, регламенты;
- увеличить выручку, прибыль, маржинальность;
- построить лидогенерацию или outbound B2B;
- развить проектные, дилерские или партнёрские продажи;
- запустить новое направление;
- построить коммерческую команду;
- масштабировать бизнес;
- вывести собственника из операционки.

Каталоги, индустриальные парки, выставочные списки и массовые региональные реестры не использовать как основной discovery.

## Sequential qualification

Каждый кандидат проходит полностью и последовательно:

`DISCOVERY → TARGETED DEDUP → LEGAL → SCALE → SIGNAL → LPR → CONTACT → FINAL DEDUP → QUALIFIED / EXCLUDED`

Норма `active_wip=0`; временно максимум 1 для текущей проверки. `active_wip` никогда не запрещает fresh discovery.

Как только кандидат проходит все gates, его немедленно физически записывать в canonical; не ждать конца RUN.

## Targeted dedup

Проверять кандидата точечно:
1. ИНН;
2. ОГРН/ОГРНИП;
3. exact legal entity;
4. brand + domain;
5. при необходимости phone/email.

Запрещено читать целиком огромный pending/master/tree как обязательный preflight. Truncated response не является глобальным blocker.

## Строгая квалификация — не ослаблять

QUALIFIED только при наличии:
1. точного действующего российского частного юрлица/ИП;
2. ИНН/ОГРН;
3. соответствия текущему scale gate;
4. датированного S1–S3 бизнес-сигнала с evidence URL;
5. реального собственника/CEO/ЛПР;
6. практического опубликованного контакта;
7. evidence;
8. финального dedup.

Для любого недостающего обязательного факта сделать минимум две независимые targeted попытки. Не придумывать контакты, юрлица или linkage бренда.

## Ротация и self-healing

Если первые 20–30 СВЕЖИХ кандидатов дают <2 qualified → немедленно менять query/регион/группу вакансий/job board.

Если duplicate rate >50% → менять source/region/query.  
Если LEGAL fail >40% → менять способ legal linkage и источник evidence, не gate.  
Если SIGNAL fail >50% → переходить к прямым S1 business-intent вакансиям.  
Если LPR/CONTACT fail высок → усиливать targeted owner/CEO/contact lookup.

Два последовательных завершённых RUN с `net_new=0` = аварийное состояние. Диагностика максимум 20% RUN: сравнить с `N5K-20260809-144`, найти первый сломанный этап, проверить source/query/dedup/legal/signal/LPR/contact/write/config. Затем В ЭТОМ ЖЕ RUN устранить технический blocker и продолжить fresh discovery.

Никаких обязательных raw floors 120/300/400/800. Главная метрика — **PHYSICALLY WRITTEN NET_NEW QUALIFIED**.

## Physical write

Каждая прошедшая компания сразу должна появиться в:
- `leads_master.csv`;
- `contactable_master.csv`;
- `contacts.csv`;
- `evidence.csv`;
- increment/shard;
- run log/report;
- runtime.

После записи:
`canonical_count = contactable_count`; `integrity = PASS`; `orphan_contacts = 0`; `orphan_evidence = 0`.

Если текущий connector не может безопасно append большой master, использовать доступный безопасный write-path/script/increment/shard и синхронизировать canonical. Невозможность записи ОДНОЙ компании не останавливает discovery.

## Отчёт каждого RUN

Фиксировать: `run_id`, `baseline`, `fresh_discovery_count`, `replay_count`, `fully_dispositioned`, `duplicates`, `legal_pass`, `scale_pass`, `signal_pass`, `LPR_pass`, `contact_pass`, `excluded`, `qualified`, `net_new`, `physically_added_companies`, `canonical_count`, `contactable_count`, `remaining_to_5000`, `duplicate_rate`, source yield, exclusion reasons, `net_new_24h`, отклонение от 100–200/day, diagnosis/corrective_actions, integrity, orphan counts, active_wip и `new_discovery_allowed=true`.

## Эталон

Исторический benchmark: `N5K-20260809-144`: 30 raw → 5 fully-qualified → integrity PASS.

Первый ранее выявленный сломанный этап: **DISCOVERY** — replay/active_wip/raw-floor логика запрещала новый поиск. Эта архитектура удалена из production-конфигурации.