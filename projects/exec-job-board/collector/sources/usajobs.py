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
        api_key = get_env("USAJOBS_API_KEY")
        email = get_env("USAJOBS_EMAIL")
    except EnvironmentError as exc:
        logger.warning(f"USAJobs credentials not set — skipping: {exc}")
        return []

    headers = {
        "Authorization-Key": api_key,
        "User-Agent": email,
        "Host": "data.usajobs.gov",
    }
    params = {
        "Keyword": "executive",
        "ResultsPerPage": "100",
        "WhoMayApply": "All",
    }

    for attempt in range(MAX_RETRIES):
        try:
            with httpx.Client(timeout=15) as client:
                resp = client.get(
                    "https://data.usajobs.gov/api/search",
                    headers=headers,
                    params=params,
                )
                if resp.status_code == 429:
                    wait = BACKOFF_BASE * (2 ** attempt)
                    logger.warning(f"USAJobs 429 — retrying in {wait}s (attempt {attempt + 1}/{MAX_RETRIES})")
                    time.sleep(wait)
                    continue
                resp.raise_for_status()
                items = (
                    resp.json()
                    .get("SearchResult", {})
                    .get("SearchResultItems", [])
                )
                break
        except httpx.HTTPStatusError:
            raise
        except Exception as exc:
            wait = BACKOFF_BASE * (2 ** attempt)
            logger.warning(f"USAJobs error: {exc} — retrying in {wait}s (attempt {attempt + 1}/{MAX_RETRIES})")
            time.sleep(wait)
            continue
    else:
        logger.error("USAJobs: max retries exceeded")
        return []

    now = datetime.now(timezone.utc)
    jobs: list[NormalizedJob] = []

    for item in items:
        desc = item.get("MatchedObjectDescriptor", {})
        title = desc.get("PositionTitle", "")
        if not is_executive(title):
            continue

        company = desc.get("OrganizationName", "")
        locations = desc.get("PositionLocation", [])
        location = locations[0].get("LocationName", "") if locations else ""
        url = desc.get("PositionURI", "")
        description = _strip_html(desc.get("UserArea", {}).get("Details", {}).get("MajorDuties", [""])[0] if desc.get("UserArea") else "")[:500]

        posted_raw = desc.get("PublicationStartDate")
        posted_at = None
        if posted_raw:
            try:
                posted_at = datetime.fromisoformat(posted_raw.replace("Z", "+00:00"))
            except (ValueError, TypeError):
                pass

        salary_min = None
        salary_max = None
        salary_currency = "USD"
        remuneration = desc.get("PositionRemuneration", [])
        if remuneration:
            pay = remuneration[0]
            try:
                salary_min = int(float(pay.get("MinimumRange", 0)))
            except (ValueError, TypeError):
                pass
            try:
                salary_max = int(float(pay.get("MaximumRange", 0)))
            except (ValueError, TypeError):
                pass
            salary_currency = pay.get("CurrencyCode", "USD") or "USD"

        jobs.append(
            NormalizedJob(
                id=generate_job_id(title, company, location),
                title=title,
                company=company,
                location=location,
                url=url,
                posted_at=posted_at,
                salary_min=salary_min if salary_min else None,
                salary_max=salary_max if salary_max else None,
                salary_currency=salary_currency,
                seniority=classify_seniority(title),
                description=description,
                source="usajobs",
                tags=[],
                collected_at=now,
            )
        )

    logger.info(f"USAJobs: collected {len(jobs)} executive jobs")
    return jobs


register("usajobs", fetch)
