from pathlib import Path

from collectors.news.rss_collector import collect_rss_sources
from core.pipeline import process_raw_items
from database.db import export_events_csv, init_db, save_events


def main() -> None:
    root = Path(__file__).resolve().parent
    db_path = root / "data" / "growth_radar.db"
    sources_path = root / "config" / "sources.json"
    export_path = root / "data" / "latest_events.csv"

    init_db(db_path)
    raw_items = collect_rss_sources(sources_path)
    events = process_raw_items(raw_items)
    inserted = save_events(db_path, events)
    export_events_csv(db_path, export_path)

    print(f"Собрано публикаций: {len(raw_items)}")
    print(f"Подготовлено событий: {len(events)}")
    print(f"Новых событий сохранено: {inserted}")
    print(f"Выгрузка: {export_path}")


if __name__ == "__main__":
    main()
