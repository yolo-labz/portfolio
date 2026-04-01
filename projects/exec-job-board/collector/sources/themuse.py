from __future__ import annotations

import logging
import re
import time
from datetime import datetime, timezone

import httpx

from collector.config import BACKOFF_BASE, MAX_RETRIES
from collector.dedup import classify_seniority, generate_job_id, is_executive
from collector.models import NormalizedJob
from collector.sources import register

logger = logging.getLogger(__name__)


def _strip_html(text: str) -> str:
    return re.sub(r"<[^>]+>", "", text) if text else ""


def fetch() -> list[NormalizedJob]:
    params = {
        "page": "0",
        "level": "Senior Level",
        "category": "Executive",
    }

    for attempt in range(MAX_RETRIES):
        try:
            with httpx.Client(timeout=15) as client:
                resp = client.get(
                    "https://www.themuse.com/api/public/jobs",
                    params=params,
                )
                if resp.status_code == 429:
                    wait = BACKOFF_BASE * (2 ** attempt)
                    logger.warning(f"TheMuse 429 — retrying in {wait}s (attempt {attempt + 1}/{MAX_RETRIES})")
                    time.sleep(wait)
                    continue
                resp.raise_for_status()
                results = resp.json().get("results", [])
                break
        except httpx.HTTPStatusError:
            raise
        except Exception as exc:
            wait = BACKOFF_BASE * (2 ** attempt)
            logger.warning(f"TheMuse error: {exc} — retrying in {wait}s (attempt {attempt + 1}/{MAX_RETRIES})")
            time.sleep(wait)
            continue
    else:
        logger.error("TheMuse: max retries exceeded")
        return []

    now = datetime.now(timezone.utc)
    jobs: list[NormalizedJob] = []

    for item in results:
        title = item.get("name", "")
        if not is_executive(title):
            continue

        company = (item.get("company", {}) or {}).get("name", "")
        locations = item.get("locations", [])
        location = locations[0].get("name", "Remote") if locations else "Remote"
        refs = item.get("refs", {}) or {}
        url = refs.get("landing_page", "")
        description = _strip_html(item.get("contents", "") or "")[:500]

        posted_raw = item.get("publication_date")
        posted_at = None
        if posted_raw:
            try:
                posted_at = datetime.fromisoformat(posted_raw.replace("Z", "+00:00"))
            except (ValueError, TypeError):
                pass

        jobs.append(
            NormalizedJob(
                id=generate_job_id(title, company, location),
                title=title,
                company=company,
                location=location,
                url=url,
                posted_at=posted_at,
                salary_min=None,
                salary_max=None,
                salary_currency="USD",
                seniority=classify_seniority(title),
                description=description,
                source="themuse",
                tags=[],
                collected_at=now,
            )
        )

    logger.info(f"TheMuse: collected {len(jobs)} executive jobs")
    return jobs


register("themuse", fetch)
