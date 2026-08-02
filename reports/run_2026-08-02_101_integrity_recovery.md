# Growth Radar — восстановление целостности GR-20260802-101

Дата: 2026-08-02  
Тип запуска: техническое восстановление без поиска новых компаний и без outreach.

## Что было повреждено

Канонический master, метрики и рабочая конфигурация расходились. Ранее заявленное количество компаний нельзя было использовать для дедупликации без повторной сборки из фактических CSV и Git history.

## Источники восстановления

- все доступные версии `data/leads_master.csv` из Git history;
- текущие и исторические `data/increments/leads_*.csv`;
- contact/evidence CSV и их последние доступные исторические версии;
- `data/run_log.csv` и отдельные RUN-логи.

Резервная копия до изменений: `data/recovery/backup_20260802T071202Z`.

## Проверенный результат

- строк-кандидатов исследовано: **117**;
- уникальных компаний/ИП: **70**;
- уникальных Lead ID: **70**;
- уникальных валидных ИНН: **69**;
- уникальных валидных ОГРН/ОГРНИП: **68**;
- объединено дублирующих Lead ID: **37**;
- восстановлено повреждённых полей статуса: **8**;
- контактных записей: **176**;
- evidence records: **523**;
- orphan contacts/evidence в канонических файлах: **0**;
- записей manual review: **77**.

## Статусы

```json
{
  "МОЖНО СВЯЗЫВАТЬСЯ": 54,
  "НУЖНА ДОПРОВЕРКА": 7,
  "RESERVE": 9
}
```

## Карта объединённых дублей

- `GRM-111` → `GRM-023`: Chacha's Club / Chacha's Crew / ИП Кожомин Кирилл Павлович (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-065` → `GRM-024`: MARROB / ООО «МАРРОБ РУС» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-081` → `GRM-024`: MARROB / ООО «МАРРОБ РУС» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-092` → `GRM-024`: MARROB / ООО «МАРРОБ РУС» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-110` → `GRM-024`: MARROB / ООО «МАРРОБ РУС» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-080` → `GRM-028`: Авто Сувенир / ООО «АВТО СУВЕНИР» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-082` → `GRM-031`: ACELED / Линии Света / ООО «ТОРГ-ЛАЙТ» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-105` → `GRM-031`: ACELED / Линии Света / ООО «ТОРГ-ЛАЙТ» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-073` → `GRM-034`: LinzLaser / ООО «ЛИНЗЛАЗЕР» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-099` → `GRM-040`: ЭНЕРГОПУСК / ООО «ЭНЕРГОПУСК» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-115` → `GRM-040`: ЭНЕРГОПУСК / ООО «ЭНЕРГОПУСК» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-084` → `GRM-047`: АЙБИПИ / ООО «АЙБИПИ» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-098` → `GRM-047`: АЙБИПИ / ООО «АЙБИПИ» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-068` → `GRM-052`: YURSUS / Сибирская фабрика мебели / ИП Гармаш Юрий Владимирович (same INN; same OGRN/OGRNIP; same legal name)
- `GRM-087` → `GRM-052`: YURSUS / Сибирская фабрика мебели / ИП Гармаш Юрий Владимирович (same INN; same OGRN/OGRNIP; same legal name)
- `GRM-100` → `GRM-052`: YURSUS / Сибирская фабрика мебели / ИП Гармаш Юрий Владимирович (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-112` → `GRM-052`: YURSUS / Сибирская фабрика мебели / ИП Гармаш Юрий Владимирович (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-101` → `GRM-053`: Estore creating / ООО «ИСТОР КРИЭЙТИНГ» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-104` → `GRM-054`: Feliks Station Catering / ООО «ФОРЕВЕНТ» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-060` → `GRM-055`: RIEN / NE SHALI / ИП Гафурова Замира Абдулазизовна (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-102` → `GRM-055`: RIEN / NE SHALI / ИП Гафурова Замира Абдулазизовна (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-076` → `GRM-056`: Magnitof / ООО «МАГНИТОФ» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-086` → `GRM-056`: Magnitof / ООО «МАГНИТОФ» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-097` → `GRM-056`: Magnitof / ООО «МАГНИТОФ» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-083` → `GRM-066`: Литтек / ООО «ЛИТТЕК» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-094` → `GRM-066`: Литтек / ООО «ЛИТТЕК» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-072` → `GRM-069`: Лесоруб Бани / ИП Заречный Дмитрий Сергеевич (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-090` → `GRM-069`: Лесоруб Бани / ИП Заречный Дмитрий Сергеевич (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-093` → `GRM-070`: Городская Ферма / ООО «ГОРОДСКАЯ ФЕРМА» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-107` → `GRM-070`: Городская Ферма / ООО «ГОРОДСКАЯ ФЕРМА» (same INN; same OGRN/OGRNIP; same legal name)
- `GRM-114` → `GRM-070`: Городская Ферма / ООО «ГОРОДСКАЯ ФЕРМА» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-109` → `GRM-071`: Строй-Инспект / ООО «СТРОЙ-ИНСПЕКТ» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-089` → `GRM-074`: НИЦ ОБСК / ООО «НАУЧНО-ИССЛЕДОВАТЕЛЬСКИЙ ЦЕНТР ОБЕСПЕЧЕНИЯ БЕЗОПАСНОСТИ СТРОИТЕЛЬНОГО КОМПЛЕКСА» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-088` → `GRM-077`: Алтайский заготовитель / ООО «ЦВЕТ ЛЕТА» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-095` → `GRM-077`: Алтайский заготовитель / ООО «ЦВЕТ ЛЕТА» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-117` → `GRM-078`: ТоталТехКом / ООО «ТОТАЛТЕХКОМ» (same INN; same OGRN/OGRNIP; same legal name; same brand)
- `GRM-113` → `GRM-103`: Лапушкины Снеки / ИП Лапушкин Сергей Андреевич (same INN; same OGRN/OGRNIP; same legal name; same brand)

Полная карта: `data/recovery/duplicate_map.csv`.

## Контроль качества

- master пересобран из фактических строк, а не из старых счётчиков;
- одинаковые ИНН и ОГРН/ОГРНИП объединены;
- контакты и доказательства перепривязаны к каноническим Lead ID;
- точные технические дубли удалены;
- orphan records исключены из канонических файлов и зафиксированы в manual review;
- семантически повреждённые значения `Final Quick Status` восстановлены из последних валидных исторических значений или переведены в `НУЖНА ДОПРОВЕРКА`.

Валидатор: `scripts/validate_growth_radar.py`.  
Машиночитаемый результат: `data/recovery/integrity_validation.json`.

## Итог

После успешного запуска валидатора проект получает `integrity_status=READY`. Recovery data commit: `82a9e1923e9b568f15eacb9236749779ab0be238`.
