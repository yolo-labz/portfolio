# Implementation Plan: Executive Job Board Aggregator

**Branch**: `003-exec-job-board` | **Date**: 2026-04-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-exec-job-board/spec.md`

## Summary

Build a portfolio showcase project: a Python data collector that fetches executive job listings from 4 public APIs daily, normalizes and deduplicates them, and feeds a Next.js static site with client-side search, filtering, and RSS feed. Deployed to Dokku with a GitHub Actions daily pipeline. Located at `projects/exec-job-board/` within the portfolio monorepo.

## Technical Context

**Language/Version**: Python 3.12 (collector), TypeScript (site)
**Primary Dependencies**: httpx, pydantic (collector); Next.js, Tailwind CSS v4, Fuse.js (site)
**Storage**: JSON file committed to git (`data/jobs.json`)
**Testing**: Manual verification + pipeline output validation
**Target Platform**: Dokku at `exec-job-board.home301server.com.br`
**Project Type**: Data pipeline + static web application
**Performance Goals**: Site loads < 1s, pipeline < 5 min, search filters < 200ms
**Constraints**: Free API tiers only, no database, no server-side search
**Scale/Scope**: 200-500 job listings, 4 API sources, 1 static site

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Sell, Don't Tell | ✅ PASS | Live demo with real data. Stats bar shows metrics. Cards show company/salary/location. |
| II. Static-First | ✅ PASS | JSON data committed to git. Site built at build time. Client-side search, no server. |
| III. Monorepo Discipline | ✅ PASS | Project at `projects/exec-job-board/`. Self-contained with own pyproject.toml and site/package.json. Does not modify `apps/web` or `packages/ui`. |
| IV. Visual Polish | ✅ PASS | Dark theme matching portfolio. Card-based layout. Whitespace-heavy premium design. Mobile responsive. |
| V. No AI Slop | ✅ PASS | README frames in business value terms. No "innovative" or "cutting-edge" language. |
| VI. Mixed-Stack Autonomy | ✅ PASS | Python collector with own venv/requirements.txt. JS site with own package.json. Turbo orchestrates via thin wrapper scripts. |

**Gate result**: PASS — proceed to implementation.

## Project Structure

### Documentation (this feature)

```text
specs/003-exec-job-board/
├── plan.md
├── spec.md
├── research.md
├── data-model.md
├── quickstart.md
└── checklists/
    └── requirements.md
```

### Source Code

```text
projects/exec-job-board/
├── collector/
│   ├── __init__.py
│   ├── main.py                  # Orchestrator
│   ├── models.py                # Pydantic NormalizedJob
│   ├── dedup.py                 # Hash-based deduplication
│   ├── config.py                # API keys from env
│   └── sources/
│       ├── __init__.py          # Source registry
│       ├── jsearch.py           # JSearch adapter
│       ├── adzuna.py            # Adzuna adapter
│       ├── themuse.py           # The Muse adapter
│       └── usajobs.py           # USAJobs adapter
├── site/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Server component, reads jobs.json
│   │   │   ├── layout.tsx       # Root layout, metadata
│   │   │   ├── globals.css      # Tailwind v4 theme (dark, matching portfolio)
│   │   │   ├── api/
│   │   │   │   └── health/
│   │   │   │       └── route.ts # Dokku health check
│   │   │   └── feed.xml/
│   │   │       └── route.ts     # RSS feed
│   │   ├── components/
│   │   │   ├── job-board.tsx    # Client: search + filter + pagination
│   │   │   ├── job-card.tsx     # Single listing card
│   │   │   ├── filter-bar.tsx   # Search + filter controls
│   │   │   └── stats-bar.tsx    # Aggregate metrics
│   │   └── lib/
│   │       ├── types.ts         # JobListing, JobsData interfaces
│   │       └── use-job-filter.ts # Filter hook with Fuse.js
│   ├── public/
│   │   └── (empty, no static assets needed)
│   ├── next.config.ts           # output: standalone
│   ├── postcss.config.mjs
│   ├── tsconfig.json
│   └── package.json             # Next.js, Tailwind, Fuse.js deps
├── data/
│   ├── jobs.json                # Current listings (pipeline output)
│   └── seed.json                # Initial seed dataset
├── .github/
│   └── workflows/
│       └── collect-jobs.yml     # Daily collection + deploy pipeline
├── Dockerfile.dokku             # Standalone Next.js build
├── app.json                     # Dokku health checks
├── requirements.txt             # Python deps (collector)
├── pyproject.toml               # Python project config
├── package.json                 # Thin Turbo wrapper
└── README.md                    # Architecture, setup, screenshots
```

**Structure Decision**: Two-part project — Python collector and Next.js site as siblings within `projects/exec-job-board/`. The collector writes to `data/jobs.json` which the site reads at build time. The Dockerfile only builds the site (the collector runs in GitHub Actions, not in the container).

## Implementation Order

### Step 1: Python Collector Foundation

1. Create `pyproject.toml` with project metadata
2. Create `requirements.txt`: httpx, pydantic
3. Create `collector/models.py`: Pydantic `NormalizedJob` model
4. Create `collector/config.py`: load API keys from env
5. Create `collector/dedup.py`: hash-based dedup + seniority classifier

### Step 2: API Source Adapters

1. Create `collector/sources/__init__.py`: source registry pattern
2. Create `collector/sources/jsearch.py`: fetch + normalize
3. Create `collector/sources/adzuna.py`: fetch + normalize
4. Create `collector/sources/themuse.py`: fetch + normalize
5. Create `collector/sources/usajobs.py`: fetch + normalize

### Step 3: Collector Orchestrator + Seed Data

1. Create `collector/main.py`: orchestrate fetch → normalize → dedupe → prune → save
2. Create `data/seed.json`: ~50 sample listings (hardcoded from real data structure)
3. Test: `python -m collector.main` produces valid `data/jobs.json`

### Step 4: Next.js Site Foundation

1. Create `site/package.json` with Next.js, Tailwind, Fuse.js
2. Create `site/tsconfig.json`, `site/next.config.ts` (standalone), `site/postcss.config.mjs`
3. Create `site/src/lib/types.ts`: TypeScript interfaces matching Pydantic model
4. Create `site/src/app/globals.css`: dark theme matching portfolio (oklch)
5. Create `site/src/app/layout.tsx`: metadata, fonts

### Step 5: Site Components

1. Create `site/src/lib/use-job-filter.ts`: Fuse.js search + filter state
2. Create `site/src/components/stats-bar.tsx`: aggregate metrics bar
3. Create `site/src/components/filter-bar.tsx`: search input + filter dropdowns
4. Create `site/src/components/job-card.tsx`: listing card with title, company, location, salary, tags
5. Create `site/src/components/job-board.tsx`: client component composing filter + cards + load-more

### Step 6: Site Pages + RSS

1. Create `site/src/app/page.tsx`: server component, read jobs.json, pass to JobBoard
2. Create `site/src/app/feed.xml/route.ts`: RSS 2.0 feed
3. Create `site/src/app/api/health/route.ts`: health check for Dokku

### Step 7: Deployment Configuration

1. Create `Dockerfile.dokku`: standalone Next.js build (site only, not collector)
2. Create `app.json`: health checks
3. Create `.github/workflows/collect-jobs.yml`: daily cron → python collector → commit → deploy to Dokku
4. Create Dokku app: `exec-job-board` at `exec-job-board.home301server.com.br`

### Step 8: README + Portfolio Integration

1. Create `README.md`: project description, Mermaid architecture diagram, tech stack, setup instructions, live demo link
2. Update `apps/web/src/data/projects.ts`: add live demo URL and source link for exec-job-board
3. Verify site renders on Dokku

### Step 9: Build Verification

1. `python -m collector.main` succeeds
2. `cd site && pnpm build` succeeds
3. Site renders with seed data
4. Pipeline workflow runs manually via `workflow_dispatch`
5. README is clear and complete

## Complexity Tracking

No constitution violations. No complexity justifications needed.
