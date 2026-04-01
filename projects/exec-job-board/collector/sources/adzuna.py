from __future__ import annotations

import logging
import re
import time
from datetime import datetime, timezone

import httpx

from collector.config import BACKOFF_BASE, MAX_RETRIES, get_env
from collector.dedup import classify_seniority, generate_job_id, is_executive
from collector.models import NormalizedJob
from collector.sources import register

logger = logging.getLogger(__name__)


def _strip_html(text: str) -> str:
    return re.sub(r"<[^>]+>", "", text) if text else ""


def fetch() -> list[NormalizedJob]:
    try:
        app_id = get_env("ADZUNA_APP_ID")
        app_key = get_env("ADZUNA_API_KEY")
    except EnvironmentError as exc:
        logger.warning(f"Adzuna credentials not set — skipping: {exc}")
        return []

    params = {
        "app_id": app_id,
        "app_key": app_key,
        "what": "executive director VP",
        "results_per_page": "50",
        "content-type": "application/json",
    }

    for attempt in range(MAX_RETRIES):
        try:
            with httpx.Client(timeout=15) as client:
                resp = client.get(
                    "https://api.adzuna.com/v1/api/jobs/us/search/1",
                    params=params,
                )
                if resp.status_code == 429:
                    wait = BACKOFF_BASE * (2 ** attempt)
                    logger.warning(f"Adzuna 429 — retrying in {wait}s (attempt {attempt + 1}/{MAX_RETRIES})")
                    time.sleep(wait)
                    continue
                resp.raise_for_status()
                results = resp.json().get("results", [])
                break
        except httpx.HTTPStatusError:
            raise
        except Exception as exc:
            wait = BACKOFF_BASE * (2 ** attempt)
            logger.warning(f"Adzuna error: {exc} — retrying in {wait}s (attempt {attempt + 1}/{MAX_RETRIES})")
            time.sleep(wait)
            continue
    else:
        logger.error("Adzuna: max retries exceeded")
        return []

    now = datetime.now(timezone.utc)
    jobs: list[NormalizedJob] = []

    for item in results:
        title = item.get("title", "")
        if not is_executive(title):
            continue

        company = (item.get("company", {}) or {}).get("display_name", "")
        location = (item.get("location", {}) or {}).get("display_name", "")
        description = _strip_html(item.get("description", "") or "")[:500]

        posted_raw = item.get("created")
        posted_at = None
        if posted_raw:
            try:
                posted_at = datetime.fromisoformat(posted_raw.replace("Z", "+00:00"))
            except (ValueError, TypeError):
                pass

        salary_min = item.get("salary_min")
        salary_max = item.get("salary_max")

        jobs.append(
            NormalizedJob(
                id=generate_job_id(title, company, location),
                title=title,
                company=company,
                location=location,
                url=item.get("redirect_url", ""),
                posted_at=posted_at,
                salary_min=int(salary_min) if salary_min else None,
                salary_max=int(salary_max) if salary_max else None,
                salary_currency="USD",
                seniority=classify_seniority(title),
                description=description,
                source="adzuna",
                tags=[],
                collected_at=now,
            )
        )

    logger.info(f"Adzuna: collected {len(jobs)} executive jobs")
    return jobs


register("adzuna", fetch)
