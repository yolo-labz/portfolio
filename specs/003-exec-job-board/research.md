# Research: Executive Job Board Aggregator

**Branch**: `003-exec-job-board`
**Date**: 2026-04-01

## R1: API Source Selection

**Decision**: Use 4 sources — JSearch (RapidAPI), Adzuna, The Muse, USAJobs.

**Rationale**: All four have free tiers sufficient for daily collection, allow aggregation with attribution, and return structured JSON. Together they demonstrate multi-source normalization — the exact skill Upwork clients evaluate.

| Source | Auth | Free Tier | Coverage |
|--------|------|-----------|----------|
| JSearch (RapidAPI) | API key | 200 req/month | Broadest — aggregates Indeed, LinkedIn, Glassdoor |
| Adzuna | App ID + API key | 250 req/day | 16 countries, salary estimates |
| The Muse | API key | 500 req/hr | Clean company data, US-focused |
| USAJobs | API key + email | Generous | US federal government roles |

**Alternatives rejected**:
- Indeed Official API: Shut down to new applicants.
- LinkedIn Official API: Requires partner program, no public job search.
- Glassdoor API: Deprecated.

## R2: Python HTTP Client

**Decision**: Use `httpx` (sync mode) for API calls.

**Rationale**: Modern, clean API. Sync mode is sufficient for 4 sequential API calls in a daily cron. No need for async complexity.

**Alternatives rejected**:
- `requests`: Works but lacks HTTP/2 and modern timeout config.
- `aiohttp`: Overkill for 4 API calls per run.

## R3: Data Validation & Schema

**Decision**: Use `pydantic` v2 for data models and validation.

**Rationale**: Type-safe, auto-validates API responses, serializes to JSON natively. Industry standard for Python data pipelines.

## R4: Deduplication Strategy

**Decision**: SHA-256 hash of `title.lower() + company.lower() + location.lower()`, truncated to 16 chars.

**Rationale**: Deterministic, handles cross-source duplicates (same job on JSearch and Adzuna). Ignores minor description differences.

## R5: Seniority Classification

**Decision**: Keyword-based title matching for executive roles.

**Rationale**: Simple, deterministic, sufficient for a portfolio demo. Keywords: chief, ceo, cfo, cto, coo, vp, vice president, director, head of, president, managing director, partner, principal.

## R6: Static Site Architecture

**Decision**: Next.js App Router, server component reads `data/jobs.json` at build time, passes to client component for search/filter.

**Rationale**: Zero runtime cost. Data is committed to git. Build reads the file, generates static HTML + JS bundle. Client-side `Fuse.js` handles search.

**Alternatives rejected**:
- ISR (Incremental Static Regeneration): Requires a server. Unnecessary when data updates are via git commits.
- API routes for search: Adds complexity, requires a running server.

## R7: Client-Side Search

**Decision**: Use `fuse.js` for fuzzy text search, plus simple array filters for location/seniority/date.

**Rationale**: Lightweight (~7KB), works entirely client-side, handles typos. 200-500 jobs is well within its performance range.

## R8: Deployment Strategy

**Decision**: Deploy to Dokku as a Next.js standalone app (same as the portfolio site), at `exec-job-board.home301server.com.br`. The GitHub Actions pipeline commits fresh data, then a deploy step pushes to Dokku.

**Rationale**: Reuses existing infrastructure. No Vercel dependency. The self-hosted runner on the Dokku VM has LAN access for git push.

**Alternative considered**:
- Vercel: Simpler, but user explicitly chose Dokku + self-hosted runner.
- GitHub Pages with static export: Possible but loses API route for RSS. Dokku is more consistent with the portfolio.

## R9: Data File Strategy

**Decision**: Commit `data/jobs.json` to git. Prune to most recent 500 listings on each pipeline run.

**Rationale**: File stays small (~500KB for 500 jobs). Git history shows data updates (impressive to clients). No database needed.

## R10: UI Design Approach

**Decision**: Dark theme matching the portfolio site (oklch colors, Inter + JetBrains Mono). Card-based layout, not tables. Premium feel via whitespace, restrained color, subtle hover effects.

**Rationale**: Consistent with the portfolio site design language. Cards feel curated; tables feel like spreadsheets.

**Key UI elements**: Aggregate stats bar at top ("342 roles from 4 sources, updated 3h ago"), filter pills, card grid with load-more pagination.
