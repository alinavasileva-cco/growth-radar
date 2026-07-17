import json
import os
from typing import Iterable

import gspread
from google.oauth2.service_account import Credentials

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
]


def _client_from_env() -> gspread.Client:
    raw_credentials = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON", "").strip()
    if not raw_credentials:
        raise RuntimeError("Переменная GOOGLE_SERVICE_ACCOUNT_JSON не задана.")

    info = json.loads(raw_credentials)
    credentials = Credentials.from_service_account_info(info, scopes=SCOPES)
    return gspread.authorize(credentials)


def sync_opportunities_to_sheet(opportunities: Iterable[dict]) -> int:
    """Перезаписывает лист Opportunities актуальным рейтингом компаний."""
    spreadsheet_id = os.getenv("GOOGLE_SHEET_ID", "").strip()
    if not spreadsheet_id:
        raise RuntimeError("Переменная GOOGLE_SHEET_ID не задана.")

    client = _client_from_env()
    spreadsheet = client.open_by_key(spreadsheet_id)

    try:
        worksheet = spreadsheet.worksheet("Opportunities")
    except gspread.WorksheetNotFound:
        worksheet = spreadsheet.add_worksheet(title="Opportunities", rows=1000, cols=12)

    headers = [
        "Компания",
        "Growth Score",
        "Сигналы",
        "Количество событий",
        "Почему интересно",
        "Последнее событие",
        "Ссылка",
        "Статус",
    ]

    rows = [headers]
    for item in opportunities:
        rows.append(
            [
                item.get("company", ""),
                item.get("score", 0),
                item.get("signals", ""),
                item.get("events_count", 0),
                item.get("reason", ""),
                item.get("latest_title", ""),
                item.get("latest_url", ""),
                item.get("status", "new"),
            ]
        )

    worksheet.clear()
    worksheet.update(rows, value_input_option="USER_ENTERED")
    worksheet.freeze(rows=1)
    return max(0, len(rows) - 1)
