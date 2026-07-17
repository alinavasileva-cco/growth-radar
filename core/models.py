from dataclasses import dataclass
from datetime import datetime
from typing import Optional


@dataclass
class RawItem:
    source_name: str
    source_type: str
    title: str
    url: str
    published_at: Optional[datetime]
    summary: str = ""


@dataclass
class GrowthEvent:
    source_name: str
    source_type: str
    title: str
    url: str
    published_at: Optional[datetime]
    summary: str
    company_name: Optional[str]
    signal_type: str
    score: int
    rationale: str
    status: str = "new"
