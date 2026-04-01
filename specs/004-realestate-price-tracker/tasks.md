# Tasks: Real Estate Price Tracker Dashboard

**Input**: Design documents from `/specs/004-realestate-price-tracker/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks grouped by user story. File paths relative to `projects/realestate-price-tracker/`.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Create API, dashboard, and Docker Compose scaffolding

- [ ] T001 Create `projects/realestate-price-tracker/api/pyproject.toml` — dependencies: fastapi, uvicorn[standard], sqlalchemy[asyncio], asyncpg, pydantic, pydantic-settings
- [ ] T002 [P] Create `projects/realestate-price-tracker/api/app/__init__.py` (empty)
- [ ] T003 [P] Create `projects/realestate-price-tracker/api/app/routers/__init__.py` (empty)
- [ ] T004 [P] Create `projects/realestate-price-tracker/.env.example` — POSTGRES_USER=realestate, POSTGRES_PASSWORD=localdev, POSTGRES_DB=realestate, CORS_ORIGINS=http://localhost:3000, NEXT_PUBLIC_API_URL=http://localhost:8000
- [ ] T005 Initialize `projects/realestate-price-tracker/dashboard/` — package.json (next, react, react-dom, recharts, react-leaflet, leaflet, @types/leaflet, tailwindcss, @tailwindcss/postcss, typescript), tsconfig.json, next.config.ts, postcss.config.mjs
- [ ] T006 Update `projects/realestate-price-tracker/package.json` — Turbo wrapper scripts: `"dev": "docker compose up"`, `"build": "echo 'Build handled via Docker'"`, `"seed": "docker compose --profile seed up seed"`

**Checkpoint**: Project skeleton ready. Dependencies defined.

---

## Phase 2: Foundational (API Core)

**Purpose**: Database connection, models, and schemas that all endpoints depend on

- [ ] T007 Create `api/app/config.py` — Pydantic `Settings` class loading DATABASE_URL (constructed from POSTGRES_* vars or explicit), CORS_ORIGINS (comma-separated string → list)
- [ ] T008 [P] Create `api/app/database.py` — async SQLAlchemy engine from `config.DATABASE_URL`, `async_sessionmaker`, `get_db` async generator dependency, `Base` declarative base
- [ ] T009 [P] Create `api/app/models.py` — SQLAlchemy `Listing` model with all columns from data-model.md (id, address, city, state, zip_code, neighborhood, price, bedrooms, bathrooms, sqft, price_per_sqft, year_built, property_type, latitude, longitude, listed_date, days_on_market, source, listing_url, created_at). Indexes on zip_code, neighborhood, listed_date, (neighborhood, listed_date) composite.
- [ ] T010 [P] Create `api/app/schemas.py` — Pydantic schemas: `PropertyResponse` (all fields + id), `PropertyListResponse` (items list + total count + page info), `StatsResponse` (median_price, avg_price_per_sqft, total_listings, avg_days_on_market, price_by_neighborhood list, price_trend list), `NeighborhoodPrice` (neighborhood, median_price, count), `MonthlyPrice` (month str, median_price, count), `ExportParams` (all filter params)
- [ ] T011 Create `api/app/main.py` — FastAPI app with: title "Real Estate Price Tracker API", CORS middleware using config origins, mount routers under `/api/v1/`, health check at `GET /health` returning `{"status": "healthy"}`, startup event to create tables if not exist

**Checkpoint**: API starts, health check responds, DB connection works.

---

## Phase 3: User Story 5 — Data Pipeline / Seed (Priority: P2, but blocks all demo data)

**Goal**: Generate 800 realistic synthetic listings for Austin, TX and seed into PostgreSQL

**Independent Test**: Run seed script → query DB → 800 rows across 6 neighborhoods

### Implementation for User Story 5

- [ ] T012 [US5] Create `api/app/seed.py` — synthetic data generator that:
  1. Defines 6 Austin neighborhoods with bounding boxes (lat/lng), price ranges, and zip codes:
     - Downtown (30.267, -97.743): $500k–$1.2M, zips 78701/78702
     - East Austin (30.263, -97.718): $350k–$700k, zip 78702
     - South Congress (30.247, -97.750): $400k–$900k, zip 78704
     - Mueller (30.298, -97.706): $300k–$600k, zip 78723
     - Round Rock (30.508, -97.678): $250k–$450k, zip 78664
     - Cedar Park (30.505, -97.820): $280k–$500k, zip 78613
  2. Generates 800 listings: ~130 per neighborhood, price from normal distribution around neighborhood median ± 20%, bedrooms 1–5 (weighted), sqft correlated with bedrooms, bathrooms = bedrooms × 0.75 rounded, property_type weighted (60% single_family, 25% condo, 15% townhouse), listing dates uniform across last 12 months, days_on_market 5–90 (lower in expensive areas), lat/lng jittered within neighborhood bbox
  3. Calculates price_per_sqft = price / sqft
  4. Supports `--init-db` to run `Base.metadata.create_all()`
  5. Inserts all listings via bulk insert
  6. Logs summary per neighborhood
  7. Runs as `python -m app.seed` from the api/ directory

**Checkpoint**: Database has 800 listings. `GET /api/v1/listings` returns data.

---

## Phase 4: User Story 1 — Interactive Dashboard (Priority: P1) 🎯 MVP

**Goal**: Dashboard renders map, charts, KPI cards from API data

**Independent Test**: Open localhost:3000 — map with colored markers, price trend chart, metric cards all visible

### Implementation for User Story 1 (API endpoints)

- [ ] T013 [US1] Create `api/app/routers/listings.py` — `GET /api/v1/listings` with query params: neighborhood (str), min_price (int), max_price (int), bedrooms (int), min_date (date), max_date (date), page (int, default 1), page_size (int, default 50, max 200). Return `PropertyListResponse` with items, total, page, page_size. Also `GET /api/v1/listings/geo` returning all listings with just id, lat, lng, price, bedrooms, neighborhood for map (no pagination, all results).
- [ ] T014 [P] [US1] Create `api/app/routers/stats.py` — `GET /api/v1/stats` with same filter params. Compute via SQL: median price (PERCENTILE_CONT), avg price_per_sqft, count, avg days_on_market, GROUP BY neighborhood for price_by_neighborhood, GROUP BY month (DATE_TRUNC) for price_trend. Return `StatsResponse`.

### Implementation for User Story 1 (Dashboard)

- [ ] T015 [US1] Create `dashboard/src/app/globals.css` — Tailwind v4 dark theme (oklch palette matching portfolio), Leaflet CSS import
- [ ] T016 [P] [US1] Create `dashboard/src/app/layout.tsx` — Inter + JetBrains Mono fonts, metadata, dark theme html/body, simple header "Real Estate Tracker" with subtitle "Austin, TX Market Data"
- [ ] T017 [P] [US1] Create `dashboard/src/lib/types.ts` — TypeScript interfaces: Property, MarketStats, NeighborhoodPrice, MonthlyPrice, PropertyListResponse
- [ ] T018 [P] [US1] Create `dashboard/src/lib/api.ts` — functions: `fetchListings(filters)`, `fetchGeoData(filters)`, `fetchStats(filters)`, `getExportUrl(format, filters)`. All use `NEXT_PUBLIC_API_URL` env var. Handle errors gracefully (return empty defaults).
- [ ] T019 [US1] Create `dashboard/src/components/kpi-cards.tsx` — 4 cards in a row: Median Price (formatted $Xk), Avg $/sqft, Total Listings, Avg Days on Market. Mono font for values, muted labels. Responsive: 2×2 grid on mobile.
- [ ] T020 [US1] Create `dashboard/src/components/price-chart.tsx` — `"use client"`, Recharts `ResponsiveContainer` + `LineChart` for price_trend data. X-axis: months. Y-axis: price formatted as $Xk. Accent color line. Tooltip with full price. Dark theme axes/grid.
- [ ] T021 [US1] Create `dashboard/src/components/price-histogram.tsx` — `"use client"`, Recharts `BarChart` showing price distribution in $100k buckets. Count on Y-axis. Accent gradient bars.
- [ ] T022 [US1] Create `dashboard/src/components/property-map.tsx` — `"use client"`, React-Leaflet `MapContainer` centered on Austin (30.267, -97.743, zoom 11). `TileLayer` from OpenStreetMap (dark variant: CartoDB dark_all). `CircleMarker` per listing, color-coded: green (<$400k), yellow (<$700k), red (>=$700k). `Popup` tooltip with address, price, beds, sqft. Use dynamic import with `ssr: false` (Leaflet doesn't support SSR).

**Checkpoint**: Dashboard shows map + chart + metrics from real API data. Visually impressive.

---

## Phase 5: User Story 2 — Filters (Priority: P1)

**Goal**: Filter controls update all dashboard components dynamically

**Independent Test**: Select "Downtown" → map zooms, chart updates, metrics recalculate

### Implementation for User Story 2

- [ ] T023 [US2] Create `dashboard/src/components/filter-sidebar.tsx` — `"use client"` component with:
  - Neighborhood dropdown (All / Downtown / East Austin / South Congress / Mueller / Round Rock / Cedar Park)
  - Price range: min and max number inputs (or range slider)
  - Bedrooms: button group (All / 1 / 2 / 3 / 4 / 5+)
  - Date range: two date inputs (from/to)
  - "Reset filters" button (visible when any filter active)
  - All controls have `aria-label` and visible focus indicators
  - On change: call `onFilterChange(filters)` callback
  - Responsive: sidebar on lg+, horizontal collapsible on mobile
- [ ] T024 [US2] Create `dashboard/src/app/page.tsx` — `"use client"` page component that:
  1. Maintains filter state (useState or URL search params)
  2. Fetches stats, listings/geo on mount and when filters change (useEffect)
  3. Renders: FilterSidebar (left) + main area with KpiCards → PropertyMap + PriceChart row → PriceHistogram → ExportButtons
  4. Layout: `grid grid-cols-1 lg:grid-cols-[280px_1fr]` (sidebar + main)
  5. Loading states while API fetches
  6. Passes filter state to all fetch functions

**Checkpoint**: All filters work. Dashboard updates dynamically. Responsive layout.

---

## Phase 6: User Story 3 — Export (Priority: P2)

**Goal**: Download filtered data as CSV or JSON

**Independent Test**: Apply filters → click Export CSV → file contains only filtered rows

### Implementation for User Story 3

- [ ] T025 [P] [US3] Create `api/app/routers/export.py` — `GET /api/v1/export/csv` and `GET /api/v1/export/json` with same filter params as listings. CSV uses `StreamingResponse` with csv.DictWriter. JSON returns filtered listings array. Both respect active filters.
- [ ] T026 [US3] Create `dashboard/src/components/export-buttons.tsx` — Two buttons: "Export CSV" and "Export JSON". Each constructs the API URL with current filter params and triggers browser download via `window.open()` or `<a download>`.

**Checkpoint**: Export files match current filter state.

---

## Phase 7: User Story 4 — Architecture & Docker (Priority: P2)

**Goal**: Docker Compose works end-to-end, README documents everything

### Implementation for User Story 4

- [ ] T027 [US4] Create `api/Dockerfile` — Python 3.12-slim, install deps from pyproject.toml, copy app/, CMD uvicorn on port 8000
- [ ] T028 [P] [US4] Create `dashboard/Dockerfile` — node:22-alpine, pnpm install, pnpm build (standalone), node server.js on port 3000
- [ ] T029 [US4] Create `docker-compose.yml` — services: db (postgres:16-alpine, health check, volume), api (build ./api, depends_on db healthy, env from .env), web (build ./dashboard, depends_on api healthy, env NEXT_PUBLIC_API_URL), seed (build ./api, command `python -m app.seed --init-db`, profile "seed", depends_on db). Shared .env file.
- [ ] T030 [US4] Create `README.md` — sections: title + description, "What This Demonstrates" (5 bullets: full-stack API, data pipeline, interactive dashboard, Docker orchestration, data export), Mermaid architecture diagram (Seed → PostgreSQL ← FastAPI → Next.js Dashboard), tech stack table, Docker Compose quickstart, API endpoints table, live demo link, screenshot placeholder

**Checkpoint**: `docker compose up` starts all services. README is clear and complete.

---

## Phase 8: Deployment

**Purpose**: Dokku provisioning and deploy

- [ ] T031 Create `Dockerfile.dokku` — single multi-stage build: build API + dashboard, run both (or API serving dashboard static + API). Consider: nginx in front, or Next.js calling API internally.
- [ ] T032 Create `app.json` — Dokku health checks on `/health`
- [ ] T033 Provision Dokku: create `realestate-tracker` app, create PostgreSQL service (`dokku postgres:create realestate-db`), link to app, set domain `realestate-tracker.home301server.com.br`, SSL cert, env vars
- [ ] T034 Seed production database: run seed script against Dokku PostgreSQL
- [ ] T035 Initial deploy and verify dashboard loads with data

**Checkpoint**: Live at `realestate-tracker.home301server.com.br`.

---

## Phase 9: Polish & Cross-Cutting

- [ ] T036 Verify all 5 user stories work on deployed site
- [ ] T037 Verify Docker Compose works from clean clone
- [ ] T038 Update `apps/web/src/data/projects.ts` — add live demo URL for realestate-price-tracker
- [ ] T039 Commit all changes, push, create PR, merge, clean up branch

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies
- **Phase 2 (API Core)**: Depends on Phase 1
- **Phase 3 (Seed)**: Depends on Phase 2 (models + database)
- **Phase 4 (Dashboard MVP)**: Depends on Phase 2 (API endpoints) + Phase 3 (data in DB)
- **Phase 5 (Filters)**: Depends on Phase 4 (base dashboard)
- **Phase 6 (Export)**: Depends on Phase 2 (API) — can run parallel with Phase 5
- **Phase 7 (Docker + README)**: Can start after Phase 2 for Docker, after Phase 5 for README
- **Phase 8 (Deploy)**: Depends on Phase 7 (Docker)
- **Phase 9 (Polish)**: Depends on all

### Parallel Opportunities

**Phase 2**: T008, T009, T010 all parallel (different files)
**Phase 4**: T015+T016+T017+T018 parallel (dashboard foundation), T019+T020+T021+T022 parallel (components)
**Phase 5+6**: Filter sidebar (T023) and export endpoints (T025) can run in parallel
**Phase 7**: API Dockerfile (T027) and dashboard Dockerfile (T028) in parallel

### Recommended Single-Agent Order

T001 → T002+T003+T004 → T005 → T006 → T007 → T008+T009+T010 → T011 → T012 → T013 → T014 → T015+T016+T017+T018 → T019+T020+T021+T022 → T023 → T024 → T025 → T026 → T027+T028 → T029 → T030 → T031 → T032 → T033 → T034 → T035 → T036 → T037 → T038 → T039

---

## Implementation Strategy

### MVP First

1. Phases 1-2: API skeleton (T001–T011)
2. Phase 3: Seed data (T012)
3. Phase 4: Dashboard with map + charts (T013–T022)
4. **STOP**: Dashboard shows data — visually impressive

### Full Build

5. Phase 5: Filters (T023–T024)
6. Phase 6: Export (T025–T026)
7. Phase 7: Docker + README (T027–T030)
8. Phase 8: Deploy (T031–T035)
9. Phase 9: Polish + merge (T036–T039)

---

## Notes

- API at `api/`, dashboard at `dashboard/` — siblings within `projects/realestate-price-tracker/`
- The dashboard fetches from the API at runtime (not static generation)
- React-Leaflet requires `dynamic import` with `ssr: false` — Leaflet doesn't support server rendering
- Recharts works in both SSR and client, but all chart components should be `"use client"` for interactivity
- Docker Compose .env file is gitignored; `.env.example` is committed
- The seed script is idempotent — running it twice doesn't create duplicates (UPSERT on address)
- For Dokku deployment, consider a combined container or separate apps. Single container is simpler.
