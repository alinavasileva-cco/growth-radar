import json
from pathlib import Path
from typing import List

import feedparser
from dateutil import parser as date_parser

from core.models import RawItem


def _parse_date(value: str):
    if not value:
        return None
    try:
        return date_parser.parse(value)
    except (ValueError, TypeError, OverflowError):
        return None


def collect_rss_sources(config_path: Path) -> List[RawItem]:
    config = json.loads(config_path.read_text(encoding="utf-8"))
    results: List[RawItem] = []

    for source in config.get("sources", []):
        if not source.get("enabled", True):
            continue
        if source.get("format") != "rss":
            continue

        feed = feedparser.parse(source["url"])
        for entry in feed.entries[: source.get("limit", 30)]:
            url = entry.get("link", "").strip()
            title = entry.get("title", "").strip()
            if not url or not title:
                continue

            results.append(
                RawItem(
                    source_name=source["name"],
                    source_type=source.get("category", "news"),
                    title=title,
                    url=url,
                    published_at=_parse_date(
                        entry.get("published", "") or entry.get("updated", "")
                    ),
                    summary=entry.get("summary", "").strip(),
                )
            )

    return results
