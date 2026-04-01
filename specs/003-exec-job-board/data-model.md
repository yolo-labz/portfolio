# Data Model: Executive Job Board Aggregator

**Branch**: `003-exec-job-board`
**Date**: 2026-04-01

## Entities

### Job Listing (Python: Pydantic model)

| Field | Type | Required | Source |
|-------|------|----------|--------|
| id | string (16-char hash) | Yes | Generated: sha256(title+company+location) |
| title | string | Yes | API |
| company | string | Yes | API |
| location | string | Yes | API (normalized) |
| url | string (URL) | Yes | API |
| posted_at | datetime (ISO 8601) | No | API |
| salary_min | integer | No | API |
| salary_max | integer | No | API |
| salary_currency | string ("USD") | No | API (default USD) |
| seniority | string enum | Yes | Derived from title keywords |
| description | string (max 500 chars) | No | API (truncated, HTML stripped) |
| source | string enum | Yes | "jsearch" / "adzuna" / "themuse" / "usajobs" |
| tags | string[] | No | API |
| collected_at | datetime (ISO 8601) | Yes | Pipeline timestamp |

### Data File Schema (JSON)

```json
{
  "meta": {
    "last_updated": "2026-04-01T06:00:00Z",
    "total_jobs": 342,
    "sources": {
      "jsearch": 80,
      "adzuna": 120,
      "themuse": 62,
      "usajobs": 80
    }
  },
  "jobs": [ /* array of Job Listing objects */ ]
}
```

### TypeScript Interface (Site)

```typescript
interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  posted_at: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string;
  seniority: string;
  description: string | null;
  source: string;
  tags: string[];
  collected_at: string;
}

interface JobsData {
  meta: {
    last_updated: string;
    total_jobs: number;
    sources: Record<string, number>;
  };
  jobs: JobListing[];
}
```

## File Inventory

### Python Collector (`projects/exec-job-board/collector/`)

| File | Purpose |
|------|---------|
| `main.py` | Orchestrator: fetch → normalize → dedupe → prune → save |
| `models.py` | Pydantic `NormalizedJob` model |
| `dedup.py` | Hash-based deduplication |
| `config.py` | API keys from env vars |
| `sources/__init__.py` | Source registry |
| `sources/jsearch.py` | JSearch adapter |
| `sources/adzuna.py` | Adzuna adapter |
| `sources/themuse.py` | The Muse adapter |
| `sources/usajobs.py` | USAJobs adapter |
| `requirements.txt` | httpx, pydantic |

### Next.js Site (`projects/exec-job-board/site/`)

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Server component, reads jobs.json, passes to JobBoard |
| `src/app/layout.tsx` | Root layout with fonts, metadata |
| `src/app/feed.xml/route.ts` | RSS feed generation |
| `src/components/job-board.tsx` | Client component: search, filter, pagination |
| `src/components/job-card.tsx` | Single job listing card |
| `src/components/filter-bar.tsx` | Search input + filter dropdowns |
| `src/components/stats-bar.tsx` | Aggregate stats display |
| `src/lib/types.ts` | TypeScript interfaces |
| `src/lib/use-job-filter.ts` | Client-side filter hook with Fuse.js |
| `package.json` | Next.js, Tailwind, Fuse.js |
| `next.config.ts` | output: standalone |
| `Dockerfile.dokku` | Standalone build for Dokku |

### Shared / Root

| File | Purpose |
|------|---------|
| `data/jobs.json` | Current listings (committed to repo) |
| `data/seed.json` | Seed dataset for initial build |
| `.github/workflows/collect-jobs.yml` | Daily pipeline |
| `README.md` | Project documentation |
| `app.json` | Dokku health checks |
