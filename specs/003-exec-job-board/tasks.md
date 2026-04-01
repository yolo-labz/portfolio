# Tasks: Executive Job Board Aggregator

**Input**: Design documents from `/specs/003-exec-job-board/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks grouped by user story. File paths relative to `projects/exec-job-board/`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1–US5)
- Exact file paths included in every task

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Create the project skeleton, Python environment, and Next.js app within the monorepo

- [x] T001 Create `projects/exec-job-board/pyproject.toml` with project name, Python 3.12 requirement, and description
- [x] T002 [P] Create `projects/exec-job-board/requirements.txt` with: httpx, pydantic>=2.0
- [x] T003 [P] Create `projects/exec-job-board/collector/__init__.py` (empty)
- [x] T004 [P] Create `projects/exec-job-board/collector/sources/__init__.py` — source registry: a dict mapping source name to fetch function, and a `fetch_all()` that calls each registered source and returns combined results
- [x] T005 [P] Create `projects/exec-job-board/data/` directory with empty `.gitkeep`
- [x] T006 Initialize `projects/exec-job-board/site/` as a Next.js app — `site/package.json` (next, react, react-dom, tailwindcss, @tailwindcss/postcss, fuse.js, typescript), `site/tsconfig.json`, `site/next.config.ts` (output: standalone), `site/postcss.config.mjs`
- [x] T007 Update `projects/exec-job-board/package.json` (the thin Turbo wrapper) — add scripts: `"dev": "cd site && pnpm dev"`, `"build": "cd site && pnpm build"`, `"collect": "python -m collector.main"`

**Checkpoint**: Project skeleton created. `pnpm install` from monorepo root recognizes the new workspace.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Data models and config that all user stories depend on

- [x] T008 Create `projects/exec-job-board/collector/models.py` — Pydantic v2 `NormalizedJob` model with fields: id (str), title (str), company (str), location (str), url (str), posted_at (datetime | None), salary_min (int | None), salary_max (int | None), salary_currency (str, default "USD"), seniority (str), description (str | None), source (str), tags (list[str]), collected_at (datetime). Add `JobsData` model with meta (last_updated, total_jobs, sources dict) and jobs list.
- [x] T009 [P] Create `projects/exec-job-board/collector/config.py` — load API keys from env vars: JSEARCH_API_KEY, ADZUNA_APP_ID, ADZUNA_API_KEY, THEMUSE_API_KEY, USAJOBS_API_KEY, USAJOBS_EMAIL. Raise clear error if a key is missing (with the env var name in the message). Include EXECUTIVE_KEYWORDS list for seniority classification.
- [x] T010 [P] Create `projects/exec-job-board/collector/dedup.py` — `generate_job_id(title, company, location) -> str` using sha256 truncated to 16 chars. `classify_seniority(title) -> str` matching against EXECUTIVE_KEYWORDS from config (returns "c-suite", "vp", "director", or "other"). `is_executive(title) -> bool` returns True if any keyword matches. `deduplicate(jobs: list[NormalizedJob]) -> list[NormalizedJob]` removes entries with duplicate ids, keeping the first seen.
- [x] T011 [P] Create `projects/exec-job-board/site/src/lib/types.ts` — TypeScript interfaces matching Pydantic models: `JobListing` and `JobsData` (with meta object)

**Checkpoint**: Models defined in both Python and TypeScript. Config loads API keys. Dedup logic ready.

---

## Phase 3: User Story 3 — Daily Pipeline (Priority: P2, but blocks demo data)

**Goal**: Python collector fetches, normalizes, deduplicates executive listings from 4 APIs and writes `data/jobs.json`

**Independent Test**: Run `python -m collector.main` — produces `data/jobs.json` with entries from multiple sources

### Implementation for User Story 3

- [x] T012 [P] [US3] Create `projects/exec-job-board/collector/sources/jsearch.py` — fetch executive job listings from JSearch API via RapidAPI. Use httpx with 10s timeout. Parse response JSON, normalize each result into `NormalizedJob`. Filter to executive titles only using `is_executive()`. Handle 429 with exponential backoff (1s, 2s, 4s, 3 retries). Return list of `NormalizedJob`. Log source count.
- [x] T013 [P] [US3] Create `projects/exec-job-board/collector/sources/adzuna.py` — fetch from Adzuna API (country=us, category=executive). Normalize salary_min/salary_max from Adzuna's salary fields. Filter to executive titles. Same retry pattern. Return list of `NormalizedJob`.
- [x] T014 [P] [US3] Create `projects/exec-job-board/collector/sources/themuse.py` — fetch from The Muse API (category=Executive, level=Senior). Normalize company name and location. Same retry pattern. Return list of `NormalizedJob`.
- [x] T015 [P] [US3] Create `projects/exec-job-board/collector/sources/usajobs.py` — fetch from USAJobs API (keyword=executive, ResultsPerPage=100). Parse USAJobs XML/JSON response. Normalize GS pay scale to salary range. Same retry pattern. Return list of `NormalizedJob`.
- [x] T016 [US3] Create `projects/exec-job-board/collector/main.py` — orchestrator:
  1. Call `fetch_all()` from source registry to get combined listings
  2. Filter to executive-only via `is_executive()`
  3. Deduplicate via `deduplicate()`
  4. Sort by `posted_at` descending (newest first)
  5. Prune to 500 most recent
  6. Build `JobsData` with meta (timestamp, counts per source)
  7. Write to temp file, then atomically rename to `data/jobs.json`
  8. Log summary: total collected, deduped, pruned, final count
- [x] T017 [US3] Create `projects/exec-job-board/data/seed.json` — manually curated seed dataset with ~50 realistic executive job listings matching the `JobsData` schema. Use realistic titles (VP Engineering, Director of Product, CFO), companies (Stripe, Airbnb, Goldman Sachs), and locations. This file is the fallback when no API keys are configured.

**Checkpoint**: `python -m collector.main` produces valid `data/jobs.json`. Seed data available as fallback.

---

## Phase 4: User Story 1 — Live Demo Site (Priority: P1) 🎯 MVP

**Goal**: Static site renders 100+ job listings with cards showing title, company, location, salary, date

**Independent Test**: `cd site && pnpm dev` — site renders job cards from `data/jobs.json` (or `data/seed.json`)

### Implementation for User Story 1

- [x] T018 [US1] Create `projects/exec-job-board/site/src/app/globals.css` — Tailwind v4 dark theme matching portfolio (oklch colors, Inter + JetBrains Mono). Import tailwindcss. Define custom colors consistent with portfolio palette.
- [x] T019 [US1] Create `projects/exec-job-board/site/src/app/layout.tsx` — root layout with fonts (Inter, JetBrains Mono via next/font/google), metadata (title: "Executive Job Board", description), dark theme html/body
- [x] T020 [US1] Create `projects/exec-job-board/site/src/components/job-card.tsx` — card component showing: title (h3, bold), company name, location with pin icon, salary range (or "Salary not disclosed"), posted date (relative: "2 days ago"), source badge, seniority badge, external link to original posting. Hover effect (subtle border/shadow). Responsive: full-width on mobile, grid on desktop.
- [x] T021 [US1] Create `projects/exec-job-board/site/src/components/stats-bar.tsx` — horizontal bar showing: total listing count, source count, last-updated timestamp (relative). Styled with mono font, muted colors. e.g., "342 executive roles · 4 sources · Updated 3 hours ago"
- [x] T022 [US1] Create `projects/exec-job-board/site/src/app/page.tsx` — server component that reads `data/jobs.json` (with fallback to `data/seed.json`), imports and renders StatsBar + JobBoard (client component). Pass jobs data as props.

**Checkpoint**: Site renders job cards from data file. Looks polished on desktop and mobile.

---

## Phase 5: User Story 2 — Search & Filter (Priority: P1)

**Goal**: Client-side search and 4-dimension filtering with instant results

**Independent Test**: Type a company name — results filter instantly. Select "C-Suite" seniority — only C-level roles shown. Clear all — full list returns.

### Implementation for User Story 2

- [x] T023 [US2] Create `projects/exec-job-board/site/src/lib/use-job-filter.ts` — custom hook using Fuse.js for text search (keys: title, company, tags, description) and array filtering for: location (text match + "Remote" toggle), seniority (c-suite/vp/director/all), posting recency (24h/7d/30d/all), source. Returns filtered results + setter functions. Include "Load more" state: page count, 20 items per page.
- [x] T024 [US2] Create `projects/exec-job-board/site/src/components/filter-bar.tsx` — client component with: search text input (with magnifying glass icon, debounced 200ms), location text input + "Remote only" toggle, seniority dropdown (C-Suite/VP/Director/All), recency tabs (24h/7d/30d/All), source pills. All controls have `aria-label` and visible focus indicators. "Clear filters" button appears when any filter is active.
- [x] T025 [US2] Create `projects/exec-job-board/site/src/components/job-board.tsx` — `"use client"` component that composes FilterBar + JobCard grid + Load More button. Uses `useJobFilter` hook. Grid: 1 col mobile, 2 cols md, 3 cols lg. Shows "No listings match your criteria" empty state. Load More button loads 20 more, hidden when all results displayed.

**Checkpoint**: Search and all 4 filters work. Results update in under 200ms. Empty state handles gracefully.

---

## Phase 6: User Story 4 — RSS Feed (Priority: P3)

**Goal**: Valid RSS 2.0 feed at `/feed.xml`

**Independent Test**: Open `/feed.xml` in browser — returns valid XML with job entries

### Implementation for User Story 4

- [x] T026 [US4] Create `projects/exec-job-board/site/src/app/feed.xml/route.ts` — route handler that reads `data/jobs.json`, takes the 50 most recent entries, generates RSS 2.0 XML with `<channel>` (title, description, link) and `<item>` per job (title, link, pubDate, description). Escape XML entities. Return Response with `Content-Type: application/xml`.

**Checkpoint**: `/feed.xml` serves valid RSS 2.0. Viewable in a feed reader.

---

## Phase 7: User Story 5 — Source Code & README (Priority: P2)

**Goal**: Professional README with architecture diagram, tech stack, and setup instructions

**Independent Test**: Open README on GitHub — understand the project in 2 minutes

### Implementation for User Story 5

- [x] T027 [US5] Create `projects/exec-job-board/README.md` — sections:
  - Title + one-line description + badges (Python 3.12, Next.js, License)
  - "What This Demonstrates" — 5 bullet points framing in business value (multi-source API integration, data normalization, automated pipeline, static site generation, clean UI)
  - "Architecture" — Mermaid flowchart: Sources → Python Collector → Normalize + Dedupe → data/jobs.json → Next.js SSG → Static Site → Dokku
  - "Data Pipeline" — table of sources (name, API type, auth, typical yield)
  - "Tech Stack" — table (layer: Collection/Automation/Frontend/Search/Hosting → technology)
  - "Running Locally" — concise setup (Python venv, install deps, set env vars, run collector, start site)
  - "Live Demo" — link to `exec-job-board.home301server.com.br`
  - No "innovative", "cutting-edge", or "passionate" language

**Checkpoint**: README is clear, professional, and demonstrates engineering quality.

---

## Phase 8: Deployment & Pipeline Automation

**Purpose**: Dokku deployment and GitHub Actions daily pipeline

- [x] T028 Create `projects/exec-job-board/site/src/app/api/health/route.ts` — health check endpoint returning `{"status": "healthy"}`
- [x] T029 [P] Create `projects/exec-job-board/Dockerfile.dokku` — 3-stage build for the site only (not the collector). Stage 1: pnpm install in site/. Stage 2: pnpm build (standalone). Stage 3: node server.js, non-root user, port 3000. Data file copied from `data/` into the build context.
- [x] T030 [P] Create `projects/exec-job-board/app.json` — Dokku health checks: startup (/api/health, 10 attempts, 15s timeout), liveness (/api/health, 3 attempts), readiness (/api/health, content "healthy")
- [x] T031 Create `.github/workflows/collect-jobs.yml` at the **monorepo root** — daily cron (06:00 UTC) + workflow_dispatch. Jobs: (1) collect: ubuntu-latest, setup Python 3.12, pip install requirements, run collector, check for changes, commit + push if changed. (2) deploy: self-hosted runner, triggered if collect succeeds, `dokku/github-action@master` pushing to `ssh://dokku@192.168.1.184:22/exec-job-board`. Secrets: all 6 API keys + DOKKU_SSH_PRIVATE_KEY.
- [x] T032 Provision Dokku app: SSH to Dokku host, create `exec-job-board` app, set domain `exec-job-board.home301server.com.br`, set dockerfile-path `Dockerfile.dokku`, set env vars, add HTTPS (self-signed cert for Cloudflare tunnel), configure ports http:80:3000 + https:443:3000
- [x] T033 Add API key secrets to `yolo-labz/portfolio` repo on GitHub (JSEARCH_API_KEY, ADZUNA_APP_ID, ADZUNA_API_KEY, THEMUSE_API_KEY, USAJOBS_API_KEY, USAJOBS_EMAIL)
- [ ] T034 Initial deploy: `git push dokku main` to verify the site runs on Dokku with seed data

**Checkpoint**: Site live at `exec-job-board.home301server.com.br`. Pipeline runs daily.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, build verification, portfolio update

- [ ] T035 Run `python -m collector.main` end-to-end with real API keys, verify `data/jobs.json` has 50+ entries from 2+ sources
- [ ] T036 Run `cd site && pnpm build` — verify static build succeeds
- [ ] T037 Verify search, all 4 filters, load-more pagination, empty state, and RSS feed on the deployed site
- [ ] T038 Verify keyboard navigation of filter controls (Tab, Enter, Escape)
- [ ] T039 Update `apps/web/src/data/projects.ts` — add live demo URL (`https://exec-job-board.home301server.com.br`) and source link for exec-job-board project card on the portfolio site
- [ ] T040 Commit all changes to `003-exec-job-board` branch, push, create PR, merge, clean up branch

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 for project skeleton
- **Phase 3 (US3 — Pipeline)**: Depends on Phase 2 for models/config. BUILDS THE DATA.
- **Phase 4 (US1 — Site)**: Depends on Phase 2 for types.ts and Phase 3 for data/jobs.json (or seed.json)
- **Phase 5 (US2 — Search/Filter)**: Depends on Phase 4 for base site
- **Phase 6 (US4 — RSS)**: Can start after Phase 4 (independent of US2)
- **Phase 7 (US5 — README)**: Can start after Phase 3 (needs architecture to document)
- **Phase 8 (Deploy)**: Depends on Phase 4 (site must build)
- **Phase 9 (Polish)**: Depends on all previous phases

### User Story Independence

- **US3 (Pipeline)**: Independent — produces data. Must run first to generate content.
- **US1 (Site)**: Depends on US3 output (data/jobs.json) or seed data
- **US2 (Search/Filter)**: Depends on US1 (base site must render)
- **US4 (RSS)**: Independent of US2 — can build in parallel after US1
- **US5 (README)**: Independent — can write anytime after architecture is clear

### Parallel Opportunities

**Within Phase 1**: T002, T003, T004, T005 all parallel
**Within Phase 2**: T009, T010, T011 all parallel (different files)
**Within Phase 3**: T012, T013, T014, T015 all parallel (one per API source)
**Phase 6 + Phase 7**: US4 (RSS) and US5 (README) can run in parallel after Phase 4

### Recommended Single-Agent Order

T001 → T002+T003+T004+T005 → T006 → T007 → T008 → T009+T010+T011 → T012+T013+T014+T015 → T016 → T017 → T018 → T019 → T020 → T021 → T022 → T023 → T024 → T025 → T026 → T027 → T028 → T029+T030 → T031 → T032 → T033 → T034 → T035 → T036 → T037 → T038 → T039 → T040

---

## Implementation Strategy

### MVP First (US3 + US1)

1. Phase 1: Setup (T001–T007)
2. Phase 2: Models/Config (T008–T011)
3. Phase 3: Collector with 2 sources (T012+T013, skip T014+T015 for MVP)
4. Phase 3: Orchestrator + seed (T016+T017)
5. Phase 4: Site renders cards (T018–T022)
6. **STOP and VALIDATE**: Site shows real data from 2 sources

### Full Build

7. Phase 3: Add remaining 2 sources (T014+T015)
8. Phase 5: Search & filter (T023–T025)
9. Phase 6 + 7: RSS + README in parallel (T026+T027)
10. Phase 8: Deploy to Dokku (T028–T034)
11. Phase 9: Polish + merge (T035–T040)

---

## Notes

- All Python files under `projects/exec-job-board/collector/`. All JS/TS under `projects/exec-job-board/site/`.
- The collector writes to `projects/exec-job-board/data/jobs.json`. The site reads it at build time.
- The Dockerfile.dokku only builds the site, not the collector. The collector runs in GitHub Actions.
- API keys are NEVER committed. They live in GitHub Secrets and are injected at pipeline runtime.
- The site reads `data/jobs.json` with a fallback to `data/seed.json` so it always renders, even without API keys.
- `page.tsx` is a server component (reads JSON at build time). `job-board.tsx` is a client component (search/filter state).
