import csv
import sqlite3
from pathlib import Path
from typing import Iterable

from core.models import GrowthEvent


SCHEMA = '''
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_name TEXT NOT NULL,
    source_type TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    published_at TEXT,
    summary TEXT,
    company_name TEXT,
    signal_type TEXT NOT NULL,
    score INTEGER NOT NULL,
    rationale TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_signal_type ON events(signal_type);
CREATE INDEX IF NOT EXISTS idx_events_score ON events(score);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
'''


def init_db(db_path: Path) -> None:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(db_path) as conn:
        conn.executescript(SCHEMA)


def save_events(db_path: Path, events: Iterable[GrowthEvent]) -> int:
    inserted = 0
    with sqlite3.connect(db_path) as conn:
        for event in events:
            cursor = conn.execute(
                '''
                INSERT OR IGNORE INTO events (
                    source_name, source_type, title, url, published_at,
                    summary, company_name, signal_type, score, rationale, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''',
                (
                    event.source_name,
                    event.source_type,
                    event.title,
                    event.url,
                    event.published_at.isoformat() if event.published_at else None,
                    event.summary,
                    event.company_name,
                    event.signal_type,
                    event.score,
                    event.rationale,
                    event.status,
                ),
            )
            inserted += cursor.rowcount
        conn.commit()
    return inserted


def export_events_csv(db_path: Path, output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(db_path) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute(
            '''
            SELECT published_at, company_name, title, signal_type, score,
                   rationale, source_name, url, status
            FROM events
            ORDER BY score DESC, published_at DESC
            '''
        ).fetchall()

    with output_path.open("w", encoding="utf-8-sig", newline="") as file:
        writer = csv.writer(file)
        writer.writerow([
            "Дата", "Компания", "Событие", "Сигнал", "Балл",
            "Почему интересно", "Источник", "Ссылка", "Статус"
        ])
        for row in rows:
            writer.writerow(list(row))
