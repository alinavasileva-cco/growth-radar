# Growth Radar

Бесплатный локальный радар возможностей для поиска малых бизнесов и предпринимателей, которым может быть нужен бизнес-трекер.

## MVP v0.1

Система:

1. собирает новости и публичные сигналы роста;
2. выделяет компании и предпринимателей;
3. классифицирует событие;
4. рассчитывает предварительный Growth Score;
5. сохраняет результат в SQLite;
6. готовит данные для выгрузки в Google Sheets.

## Бесплатный стек

- Python
- Playwright
- SQLite
- Google Sheets / Gmail / Calendar
- GitHub
- Windows Task Scheduler

## Быстрый запуск

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m playwright install chromium
python main.py
```

На первом запуске будет создана база `data/growth_radar.db`.
