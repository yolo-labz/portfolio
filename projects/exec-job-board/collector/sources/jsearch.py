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
        api_key = get_env("JSEARCH_API_KEY")
    except EnvironmentError:
        logger.warning("JSEARCH_API_KEY not set — skipping JSearch source")
        return []

    headers = {
        "X-RapidAPI-Key": api_key,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    }
    params = {
        "query": "executive",
        "page": "1",
        "num_pages": "1",
        "date_posted": "month",
    }

    for attempt in range(MAX_RETRIES):
        try:
            with httpx.Client(timeout=15) as client:
                resp = client.get(
                    "https://jsearch.p.rapidapi.com/search",
                    headers=headers,
                    params=params,
                )
                if resp.status_code == 429:
                    wait = BACKOFF_BASE * (2 ** attempt)
                    logger.warning(f"JSearch 429 — retrying in {wait}s (attempt {attempt + 1}/{MAX_RETRIES})")
                    time.sleep(wait)
                    continue
                resp.raise_for_status()
                data = resp.json().get("data", [])
                break
        except httpx.HTTPStatusError:
            raise
        except Exception as exc:
            wait = BACKOFF_BASE * (2 ** attempt)
            logger.warning(f"JSearch error: {exc} — retrying in {wait}s (attempt {attempt + 1}/{MAX_RETRIES})")
            time.sleep(wait)
            continue
    else:
        logger.error("JSearch: max retries exceeded")
        return []

    now = datetime.now(timezone.utc)
    jobs: list[NormalizedJob] = []

    for item in data:
        title = item.get("job_title", "")
        if not is_executive(title):
            continue

        company = item.get("employer_name", "")
        location = item.get("job_city", "") or item.get("job_country", "Remote")
        description = _strip_html(item.get("job_description", "") or "")[:500]

        posted_raw = item.get("job_posted_at_datetime_utc")
        posted_at = None
        if posted_raw:
            try:
                posted_at = datetime.fromisoformat(posted_raw.replace("Z", "+00:00"))
            except (ValueError, TypeError):
                pass

        salary_min = item.get("job_min_salary")
        salary_max = item.get("job_max_salary")
        salary_currency = item.get("job_salary_currency", "USD") or "USD"

        jobs.append(
            NormalizedJob(
                id=generate_job_id(title, company, location),
                title=title,
                company=company,
                location=location,
                url=item.get("job_apply_link", ""),
                posted_at=posted_at,
                salary_min=int(salary_min) if salary_min else None,
                salary_max=int(salary_max) if salary_max else None,
                salary_currency=salary_currency,
                seniority=classify_seniority(title),
                description=description,
                source="jsearch",
                tags=[],
                collected_at=now,
            )
        )

    logger.info(f"JSearch: collected {len(jobs)} executive jobs")
    return jobs


register("jsearch", fetch)
