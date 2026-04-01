from __future__ import annotations

from datetime import datetime, timezone
from pydantic import BaseModel


class NormalizedJob(BaseModel):
    id: str
    title: str
    company: str
    location: str
    url: str
    posted_at: datetime | None = None
    salary_min: int | None = None
    salary_max: int | None = None
    salary_currency: str = "USD"
    seniority: str = "other"
    description: str | None = None
    source: str
    tags: list[str] = []
    collected_at: datetime


class SourceMeta(BaseModel):
    jsearch: int = 0
    adzuna: int = 0
    themuse: int = 0
    usajobs: int = 0


class Meta(BaseModel):
    last_updated: datetime
    total_jobs: int
    sources: dict[str, int] = {}


class JobsData(BaseModel):
    meta: Meta
    jobs: list[NormalizedJob]

    @classmethod
    def build(cls, jobs: list[NormalizedJob]) -> JobsData:
        sources: dict[str, int] = {}
        for job in jobs:
            sources[job.source] = sources.get(job.source, 0) + 1
        return cls(
            meta=Meta(
                last_updated=datetime.now(timezone.utc),
                total_jobs=len(jobs),
                sources=sources,
            ),
            jobs=jobs,
        )
