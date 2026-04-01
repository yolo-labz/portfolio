from __future__ import annotations

import hashlib

from collector.config import EXECUTIVE_KEYWORDS
from collector.models import NormalizedJob


def generate_job_id(title: str, company: str, location: str) -> str:
    normalized = f"{title.lower().strip()}|{company.lower().strip()}|{location.lower().strip()}"
    return hashlib.sha256(normalized.encode()).hexdigest()[:16]


def is_executive(title: str) -> bool:
    title_lower = title.lower()
    return any(kw in title_lower for kw in EXECUTIVE_KEYWORDS)


def classify_seniority(title: str) -> str:
    title_lower = title.lower()
    c_suite = ["chief", "ceo", "cfo", "cto", "coo", "cio", "cmo", "cpo", "cro"]
    vp_level = ["vp ", "vp,", "vice president", "svp", "evp"]
    director_level = ["director", "head of", "managing director"]

    if any(kw in title_lower for kw in c_suite):
        return "c-suite"
    if any(kw in title_lower for kw in vp_level):
        return "vp"
    if any(kw in title_lower for kw in director_level):
        return "director"
    return "other"


def deduplicate(jobs: list[NormalizedJob]) -> list[NormalizedJob]:
    seen: set[str] = set()
    unique: list[NormalizedJob] = []
    for job in jobs:
        if job.id not in seen:
            seen.add(job.id)
            unique.append(job)
    return unique
