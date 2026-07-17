import os
from pathlib import Path

from collectors.news.rss_collector import collect_rss_sources
from core.company_eligibility import load_company_profiles
from core.opportunities import (
    build_opportunities,
    export_opportunities_csv,
    export_outreach_ready_csv,
)
from core.pipeline import process_raw_items
from database.db import export_events_csv, init_db, save_events


def main() -> None:
    root = Path(__file__).resolve().parent
    db_path = root / "data" / "growth_radar.db"
    sources_path = root / "config" / "sources.json"
    profiles_path = root / "data" / "company_profiles.csv"
    events_export_path = root / "data" / "latest_events.csv"
    opportunities_export_path = root / "data" / "company_pipeline.csv"
    outreach_export_path = root / "data" / "outreach_ready.csv"
    min_score = int(os.getenv("GROWTH_RADAR_MIN_SCORE", "15"))

    init_db(db_path)
    profiles = load_company_profiles(profiles_path)
    raw_items = collect_rss_sources(sources_path)
    all_events = process_raw_items(raw_items)
    events = [event for event in all_events if event.score >= min_score]
    inserted = save_events(db_path, events)
    export_events_csv(db_path, events_export_path)

    opportunities = build_opportunities(events, profiles)
    export_opportunities_csv(opportunities, opportunities_export_path)
    export_outreach_ready_csv(opportunities, outreach_export_path)

    google_sync_enabled = os.getenv("GOOGLE_SHEETS_SYNC", "false").lower() == "true"
    if google_sync_enabled:
        from integrations.google.sheets import sync_opportunities_to_sheet

        synced = sync_opportunities_to_sheet(opportunities)
        print(f"В Google Sheets записано компаний: {synced}")
    else:
        print("Google Sheets: синхронизация пока отключена.")

    outreach_ready = [item for item in opportunities if item.get("outreach_ready")]
    needs_direct_contact = [item for item in opportunities if item.get("status") == "needs_direct_contact"]
    market_segments = {item.get("market_segment") for item in opportunities if item.get("market_segment")}

    print(f"Собрано публикаций: {len(raw_items)}")
    print(f"Событий после классификации: {len(all_events)}")
    print(f"Релевантных событий (score >= {min_score}): {len(events)}")
    print(f"Новых событий сохранено: {inserted}")
    print(f"Компаний в рабочем списке: {len(opportunities)}")
    print(f"Сегментов рынка: {len(market_segments)}")
    print(f"Нужен прямой контакт ЛПР: {len(needs_direct_contact)}")
    print(f"Готовы к отправке: {len(outreach_ready)}")
    print(f"Выгрузка событий: {events_export_path}")
    print(f"Рабочая база компаний: {opportunities_export_path}")
    print(f"Готовые к контакту: {outreach_export_path}")

    if not raw_items and not profiles:
        raise RuntimeError("Источники не вернули публикации и база профилей пуста.")


if __name__ == "__main__":
    main()
