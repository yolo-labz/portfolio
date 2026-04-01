# Feature Specification: Executive Job Board Aggregator

**Feature Branch**: `003-exec-job-board`
**Created**: 2026-04-01
**Status**: Draft
**Input**: User description: "Build the exec-job-board project under projects/exec-job-board — Python data collection from public job APIs, Next.js static site with search and filters, GitHub Actions daily pipeline, RSS feed. This is the highest-priority portfolio project: it directly mirrors Pedro's $300 in-progress Upwork contract and proves data extraction + automation + static site delivery."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Upwork client views the live demo (Priority: P1)

An Upwork client evaluating Pedro's portfolio clicks the "Live Demo" link on the exec-job-board project card. They land on a clean, fast job board showing 100+ executive-level job listings with company names, locations, salary ranges (when available), and posting dates. The site loads instantly (static), feels polished, and clearly demonstrates data extraction + frontend skills.

**Why this priority**: This is the primary sales artifact. If the demo doesn't impress in 5 seconds, the client moves on. Everything else (pipeline, code quality) supports this moment.

**Independent Test**: Open the deployed site URL. Verify 100+ listings render, the page loads in under 1 second, and the UI is responsive on mobile.

**Acceptance Scenarios**:

1. **Given** a visitor opens the job board URL, **When** the page loads, **Then** they see a grid of job listing cards showing title, company, location, and posting date, with at least 100 listings.
2. **Given** the visitor is on a mobile device, **When** they view the page, **Then** the layout adapts to a single column with readable text and tappable elements.
3. **Given** the visitor wants to explore, **When** they scroll the page, **Then** listings load progressively or paginate without requiring a full page reload.

---

### User Story 2 — Visitor searches and filters listings (Priority: P1)

A visitor wants to find executive roles in a specific location or industry. They use a search bar and filter controls to narrow results. Filtering happens instantly (client-side) without page reloads.

**Why this priority**: Search and filter demonstrate frontend interactivity and data handling — core skills Upwork clients evaluate.

**Independent Test**: Type a company name in the search bar — results filter in real-time. Select a location filter — listings narrow to that location. Clear filters — all listings return.

**Acceptance Scenarios**:

1. **Given** the visitor types a keyword in the search bar, **When** they stop typing, **Then** listings filter in real-time to show only matches (by title, company, or description).
2. **Given** the visitor selects a location from the filter dropdown, **When** the filter applies, **Then** only listings from that location are displayed.
3. **Given** filters are active and the visitor clears them, **When** they click "Clear filters", **Then** all listings are restored.
4. **Given** no listings match the current search/filter combination, **When** the results are empty, **Then** a message like "No listings match your criteria" is displayed.

---

### User Story 3 — Pipeline collects fresh data daily (Priority: P2)

A scheduled pipeline runs every day, collecting executive job listings from multiple public sources, normalizing the data, deduplicating entries, and writing the results to a JSON data file. A subsequent step rebuilds and deploys the static site.

**Why this priority**: Demonstrates automation — the pipeline runs unattended, which is exactly what Pedro's Upwork clients need. But the pipeline is invisible to demo visitors; the static site is what they see.

**Independent Test**: Run the collection script manually. Verify it produces a valid JSON file with normalized job entries from at least 2 sources.

**Acceptance Scenarios**:

1. **Given** the scheduled pipeline triggers, **When** the collection script runs, **Then** it fetches job listings from at least 2 public APIs and writes a unified JSON file.
2. **Given** duplicate listings exist across sources, **When** the deduplication step runs, **Then** duplicates are removed based on title + company + location matching.
3. **Given** the JSON data file has been updated, **When** the static site rebuilds, **Then** the deployed site reflects the latest data within the same pipeline run.
4. **Given** an API source is temporarily unavailable, **When** the collection runs, **Then** it logs the failure and proceeds with available sources (graceful degradation).

---

### User Story 4 — Visitor subscribes via RSS (Priority: P3)

A visitor who wants to be notified of new executive listings subscribes to an RSS feed. The feed updates daily alongside the data pipeline.

**Why this priority**: RSS is a low-effort addition that demonstrates awareness of distribution channels, but it's not critical for the portfolio demo.

**Independent Test**: Open the RSS feed URL in a feed reader. Verify it contains valid entries with titles, links, and dates.

**Acceptance Scenarios**:

1. **Given** a visitor clicks the RSS icon or link, **When** the feed URL loads, **Then** it serves valid RSS 2.0 or Atom XML with job listing entries.
2. **Given** the pipeline runs and data changes, **When** the site rebuilds, **Then** the RSS feed reflects the latest listings.

---

### User Story 5 — Upwork client reviews the source code (Priority: P2)

An Upwork client clicks "View Source" on the portfolio project card and lands on the GitHub repo. They see a well-organized project with a clear README, architecture diagram, and clean code. The README explains the pipeline, tech stack, and how to run it locally.

**Why this priority**: Code quality and documentation are the second most important sales signals after the live demo.

**Independent Test**: Open the repo README on GitHub. Verify it has: a project description, architecture diagram (Mermaid), tech stack badges, local setup instructions, and a link to the live demo.

**Acceptance Scenarios**:

1. **Given** a visitor opens the repository, **When** they read the README, **Then** they understand the project purpose, architecture, and how to run it locally within 2 minutes.
2. **Given** the visitor explores the code, **When** they check the project structure, **Then** files are organized logically (data collection, site, shared types) with no dead code or placeholder files.

---

### Edge Cases

- What happens when all API sources are down? The pipeline logs failures and exits without overwriting the existing data file (stale data is better than no data).
- What happens when a listing has no salary information? It displays "Salary not disclosed" instead of an empty field.
- What happens when the JSON data file exceeds reasonable size (10K+ listings)? Only the most recent 500 listings are kept; older entries are pruned.
- What happens when the site is accessed before the first pipeline run? A seed dataset of sample listings is committed to the repo so the site always has content.
- What happens when an API returns a listing with missing required fields (no title or no company)? The listing is silently dropped and logged as a warning. Partial data never reaches the output.
- What happens when an API returns HTTP 429 (rate limited)? The collector waits with exponential backoff (1s, 2s, 4s) up to 3 retries, then skips that source for the current run.
- What happens when the JSON data file is corrupted or invalid after a failed write? The collector writes to a temporary file first, then atomically renames it to `jobs.json` only on success.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The data collection script MUST fetch executive job listings from at least 4 public APIs (target: JSearch, Adzuna, The Muse, USAJobs). The minimum acceptable for a passing build is 2 sources.
- **FR-002**: Each listing MUST contain: title, company, location, URL to original posting, and posting date. Salary and description are optional. Listings missing any required field MUST be silently dropped.
- **FR-003**: The collection script MUST deduplicate listings using a deterministic hash of title + company + location.
- **FR-004**: The collection output MUST be a single JSON file with a normalized schema, regardless of source API differences. The file MUST be written atomically (write to temp, then rename).
- **FR-005**: "Executive-level" MUST be defined by title keyword matching: chief, ceo, cfo, cto, coo, cio, vp, vice president, director, head of, president, managing director, partner, principal. Only listings matching these keywords are included.
- **FR-006**: The collector MUST respect API rate limits. On HTTP 429 responses, it MUST retry with exponential backoff (up to 3 retries). On persistent failure, it MUST skip the source and proceed with remaining sources.
- **FR-007**: The static site MUST render all listings from the JSON data file at build time.
- **FR-008**: The site MUST provide a text search that filters listings by keyword (title, company, description) with results updating in under 200ms on the client.
- **FR-009**: The site MUST provide 4 filter dimensions: location (text + "Remote" toggle), posting recency (Last 24h / 7 days / 30 days / All), seniority level (C-Suite / VP / Director / All), and source.
- **FR-010**: The site MUST be responsive and usable on viewports from 375px to 2560px.
- **FR-011**: The site MUST use "Load more" pagination, showing 20 listings initially and loading 20 more per click.
- **FR-012**: A GitHub Actions workflow MUST run the collection script daily on a schedule, commit updated data, and trigger a site rebuild/deploy.
- **FR-013**: The site MUST generate an RSS feed (capped at 50 most recent entries) as valid RSS 2.0 XML.
- **FR-014**: The site MUST display source attribution where required by API terms (e.g., "Powered by Adzuna" for Adzuna listings).
- **FR-015**: All interactive filter controls MUST be keyboard-navigable. The search input and filter dropdowns MUST have visible focus indicators and appropriate ARIA labels.
- **FR-016**: The site MUST display aggregate stats: total listing count, source count, and last-updated timestamp.
- **FR-017**: The project MUST include a README with: project description, Mermaid architecture diagram, tech stack table, setup instructions, and live demo link.
- **FR-018**: The project MUST include a seed dataset (`data/seed.json`) so the site renders correctly before the first pipeline run.

### Key Entities

- **Job Listing**: A single job posting — title, company, location, url, posted_date, salary (optional), description (optional), source (which API it came from), hash (dedup key).
- **Data File**: A JSON file containing an array of Job Listings plus metadata (last_updated timestamp, source counts).
- **RSS Feed**: An XML file generated at build time from the Job Listings.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The live demo site loads in under 1 second on a standard broadband connection.
- **SC-002**: The site displays at least 100 unique job listings from at least 2 sources.
- **SC-003**: Search filters results in under 200ms (perceived instant) on a modern device.
- **SC-004**: The daily pipeline completes in under 5 minutes including data collection, site rebuild, and deploy.
- **SC-005**: The README allows a developer to clone, install, and run the site locally in under 3 minutes.
- **SC-006**: The project is referenceable as an Upwork portfolio piece with screenshots and a live demo link.

## Assumptions

- Public job board APIs (JSearch/RapidAPI, Adzuna, The Muse, USAJobs) are used. APIs that require enterprise contracts or prohibit aggregation are excluded.
- The site is deployed via the existing Dokku infrastructure at `exec-job-board.home301server.com.br`.
- The data collection script runs as a Python script inside GitHub Actions (not on the Dokku host).
- The project lives at `projects/exec-job-board/` within the existing portfolio monorepo.
- No user accounts, authentication, or saved searches — this is a read-only public listing site.
- JSearch free tier (200 req/month) is sufficient for daily runs that fetch 1-2 pages of executive results per run (~6 requests/day). If the limit is hit, the collector skips JSearch and proceeds with other sources.
- API keys are stored as GitHub Actions secrets. Required secrets: `JSEARCH_API_KEY`, `ADZUNA_APP_ID`, `ADZUNA_API_KEY`, `THEMUSE_API_KEY`, `USAJOBS_API_KEY`, `USAJOBS_EMAIL`.
- Implementing agent MUST create free accounts on RapidAPI (for JSearch), Adzuna developer portal, The Muse API, and USAJobs developer portal to obtain API keys.
- Non-English listings are filtered out. Only English-language results are included.
- SC-005 ("3 minutes to run locally") assumes API keys are already configured. Key acquisition is not counted.
- SC-004 ("5 minutes pipeline") includes data collection + git commit + Dokku deploy.
