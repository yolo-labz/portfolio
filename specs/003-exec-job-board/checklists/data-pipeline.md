# Data Pipeline Checklist: Executive Job Board Aggregator

**Purpose**: Validate requirements quality for the data collection, normalization, and delivery pipeline before implementation
**Created**: 2026-04-01
**Feature**: [spec.md](../spec.md)

## Requirement Completeness

- [x] CHK001 Are rate limit handling requirements defined for each API source? — **Fixed**: FR-006 now specifies exponential backoff on 429, 3 retries, skip on persistent failure.
- [x] CHK002 Are attribution requirements documented for each API source? — **Fixed**: FR-014 added requiring source attribution where API terms demand it.
- [x] CHK003 Are retry/backoff requirements defined for transient API failures? — **Fixed**: FR-006 and edge case for HTTP 429 now specify 1s/2s/4s backoff, 3 retries.
- [x] CHK004 Is the data pruning threshold specified? — **Accepted**: Edge case specifies 500-listing cap. Kept in edge cases rather than FRs since it's an operational detail.
- [x] CHK005 Are data validation requirements defined for malformed API responses? — **Fixed**: FR-002 now says "Listings missing any required field MUST be silently dropped." Edge case added for details.
- [x] CHK006 Are the specific fields for the filter dimensions defined? — **Fixed**: FR-009 now specifies 4 dimensions: location (text + Remote toggle), posting recency (24h/7d/30d/All), seniority (C-Suite/VP/Director/All), and source.
- [x] CHK007 Is the RSS feed entry count specified? — **Fixed**: FR-013 now caps RSS at 50 most recent entries.
- [x] CHK008 Are GitHub Actions secret names enumerated in the spec? — **Fixed**: Assumptions now list all 6 required secrets by name.

## Requirement Clarity

- [x] CHK009 Is "executive-level" defined with specific criteria? — **Fixed**: FR-005 added with explicit keyword list (chief, ceo, cfo, cto, vp, director, head of, etc.).
- [x] CHK010 Is "real-time" search quantified? — **Fixed**: FR-008 now says "under 200ms on the client", consistent with SC-003.
- [x] CHK011 Is "at least 100 listings" a hard minimum or a target? — **Accepted as target**: SC-002 is a target. The pipeline succeeds with whatever it collects; 100 is the goal, not a blocker.
- [x] CHK012 Is "posting recency" filter granularity defined? — **Fixed**: FR-009 specifies "Last 24h / 7 days / 30 days / All" as the exact breakpoints.

## Requirement Consistency

- [x] CHK013 Does FR-001 align with the plan's 4-source commitment? — **Fixed**: FR-001 now targets 4 sources with a floor of 2.
- [x] CHK014 Are the data file location requirements consistent? — **Fixed**: FR-018 explicitly makes seed.json a formal requirement.
- [x] CHK015 Is the deployment target consistent? — **Fixed**: Assumptions now state Dokku definitively (removed "or static export" ambiguity).

## Acceptance Criteria Quality

- [x] CHK016 Can "loads in under 1 second" be measured? — **Accepted**: Measured via Lighthouse on broadband. Standard industry benchmark.
- [x] CHK017 Can "pipeline completes in under 5 minutes" be measured? — **Fixed**: Assumptions now clarify SC-004 includes collection + commit + deploy.
- [x] CHK018 Can "run locally in under 3 minutes" be verified? — **Fixed**: Assumptions now clarify SC-005 assumes API keys already configured.

## Scenario Coverage

- [x] CHK019 Are requirements for corrupted JSON defined? — **Fixed**: Edge case added for atomic file writes (temp file + rename).
- [x] CHK020 Are requirements for API key expiration defined? — **Accepted as out of scope**: Free-tier keys don't expire. If they do, the pipeline skips the source (FR-006 graceful degradation).
- [x] CHK021 Are requirements for non-English listings defined? — **Fixed**: Assumptions now state "Non-English listings are filtered out."
- [x] CHK022 Are Load More pagination requirements defined? — **Fixed**: FR-011 specifies "Load more" pagination, 20 listings initially, 20 per click.
- [x] CHK023 Are empty state / seed data requirements formalized? — **Fixed**: FR-018 makes seed dataset a formal FR.
- [x] CHK024 Are stats bar content requirements defined? — **Fixed**: FR-016 specifies total count, source count, and last-updated timestamp.

## Non-Functional Requirements

- [x] CHK025 Are bundle size requirements defined? — **Accepted**: No explicit cap. 500 listings × ~500 bytes = ~250KB JSON. Acceptable for static site.
- [x] CHK026 Are accessibility requirements defined? — **Fixed**: FR-015 added requiring keyboard-navigable filter controls, visible focus indicators, and ARIA labels.
- [x] CHK027 Is data archival policy defined? — **Accepted as out of scope**: Archival is explicitly not in scope for v1. Only current listings are kept.

## Dependencies & Assumptions

- [x] CHK028 Is the JSearch free-tier assumption validated? — **Fixed**: Assumptions now explain that 200 req/month ≈ 6-7/day is sufficient for 1-2 pages of results per run.
- [x] CHK029 Is the RapidAPI account dependency documented? — **Fixed**: Assumptions now state implementing agent MUST create accounts on all 4 API portals.
- [x] CHK030 Is the Dokku provisioning dependency documented? — **Accepted**: Plan Step 7 covers Dokku setup. The pattern mirrors the portfolio site's `scripts/setup-dokku.sh`.

## Notes

- All 30 items resolved: 20 fixed in spec, 10 accepted with rationale
- Spec now has 18 FRs (up from 12), covering all identified gaps
- Ready for `/speckit.tasks`
