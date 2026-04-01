from __future__ import annotations

import os

EXECUTIVE_KEYWORDS: list[str] = [
    "chief",
    "ceo",
    "cfo",
    "cto",
    "coo",
    "cio",
    "cmo",
    "cpo",
    "cro",
    "vp ",
    "vp,",
    "vice president",
    "director",
    "head of",
    "president",
    "managing director",
    "partner",
    "principal",
    "svp",
    "evp",
]

MAX_LISTINGS = 500
MAX_RETRIES = 3
BACKOFF_BASE = 1  # seconds


def get_env(name: str) -> str:
    value = os.environ.get(name, "")
    if not value:
        raise EnvironmentError(f"Missing required environment variable: {name}")
    return value


def get_env_optional(name: str, default: str = "") -> str:
    return os.environ.get(name, default)
