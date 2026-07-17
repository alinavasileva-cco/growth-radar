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
    """Перезаписывает лист Companies актуальной сегментированной базой."""
    spreadsheet_id = os.getenv("GOOGLE_SHEET_ID", "").strip()
    if not spreadsheet_id:
        raise RuntimeError("Переменная GOOGLE_SHEET_ID не задана.")

    client = _client_from_env()
    spreadsheet = client.open_by_key(spreadsheet_id)

    try:
        worksheet = spreadsheet.worksheet("Companies")
    except gspread.WorksheetNotFound:
        worksheet = spreadsheet.add_worksheet(title="Companies", rows=1500, cols=30)

    headers = [
        "Компания",
        "Юрлицо",
        "ИНН",
        "Город",
        "Сегмент рынка",
        "Подсегмент",
        "ОКВЭД",
        "Выручка",
        "Предыдущая выручка",
        "Динамика, %",
        "Прибыль",
        "Собственник",
        "Директор",
        "Прямой контакт",
        "Роль контакта",
        "Прямой email",
        "Прямой телефон",
        "Telegram",
        "Сайт",
        "Триггер",
        "Почему нужен консалтинг",
        "Growth Score",
        "Сигналы",
        "Статус",
        "Приоритет",
        "Источник",
    ]

    rows = [headers]
    for item in opportunities:
        rows.append(
            [
                item.get("company", ""),
                item.get("legal_name", ""),
                item.get("inn", ""),
                item.get("city", ""),
                item.get("market_segment", ""),
                item.get("market_subsegment", ""),
                item.get("okved_main", ""),
                item.get("revenue_latest", ""),
                item.get("revenue_previous", ""),
                item.get("revenue_change_pct", ""),
                item.get("profit_latest", ""),
                item.get("owner_name", ""),
                item.get("director_name", ""),
                item.get("direct_contact_name", ""),
                item.get("direct_contact_role", ""),
                item.get("direct_email", ""),
                item.get("direct_phone", ""),
                item.get("telegram", ""),
                item.get("website", ""),
                item.get("trigger", ""),
                item.get("consulting_reason", ""),
                item.get("score", 0),
                item.get("signals", ""),
                item.get("status", "new"),
                item.get("priority", ""),
                item.get("source_url", ""),
            ]
        )

    worksheet.clear()
    worksheet.update(rows, value_input_option="USER_ENTERED")
    worksheet.freeze(rows=1)
    return max(0, len(rows) - 1)
