import os
from pathlib import Path

from collectors.news.rss_collector import collect_rss_sources
from core.opportunities import build_opportunities, export_opportunities_csv
from core.pipeline import process_raw_items
from database.db import export_events_csv, init_db, save_events


def main() -> None:
    root = Path(__file__).resolve().parent
    db_path = root / "data" / "growth_radar.db"
    sources_path = root / "config" / "sources.json"
    events_export_path = root / "data" / "latest_events.csv"
    opportunities_export_path = root / "data" / "hot_opportunities.csv"
    min_score = int(os.getenv("GROWTH_RADAR_MIN_SCORE", "15"))

    init_db(db_path)
    raw_items = collect_rss_sources(sources_path)
    all_events = process_raw_items(raw_items)
    events = [event for event in all_events if event.score >= min_score]
    inserted = save_events(db_path, events)
    export_events_csv(db_path, events_export_path)

    opportunities = build_opportunities(events)
    export_opportunities_csv(opportunities, opportunities_export_path)

    print(f"Собрано публикаций: {len(raw_items)}")
    print(f"Событий после классификации: {len(all_events)}")
    print(f"Релевантных событий (score >= {min_score}): {len(events)}")
    print(f"Новых событий сохранено: {inserted}")
    print(f"Компаний с определённым названием: {len(opportunities)}")
    print(f"Выгрузка событий: {events_export_path}")
    print(f"Горячие возможности: {opportunities_export_path}")

    if not raw_items:
        raise RuntimeError("Ни один источник не вернул публикации.")


if __name__ == "__main__":
    main()
