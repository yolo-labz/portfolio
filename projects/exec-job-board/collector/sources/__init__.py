from __future__ import annotations

import logging
from typing import Callable

from collector.models import NormalizedJob

logger = logging.getLogger(__name__)

SourceFetcher = Callable[[], list[NormalizedJob]]

_registry: dict[str, SourceFetcher] = {}


def register(name: str, fetcher: SourceFetcher) -> None:
    _registry[name] = fetcher


def fetch_all() -> list[NormalizedJob]:
    all_jobs: list[NormalizedJob] = []
    for name, fetcher in _registry.items():
        try:
            jobs = fetcher()
            logger.info(f"{name}: fetched {len(jobs)} listings")
            all_jobs.extend(jobs)
        except Exception:
            logger.exception(f"{name}: failed to fetch")
    return all_jobs
