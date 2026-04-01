# Implementation Plan: Real Estate Price Tracker Dashboard

**Branch**: `004-realestate-price-tracker` | **Date**: 2026-04-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-realestate-price-tracker/spec.md`

## Summary

Build a full-stack portfolio project: FastAPI backend with PostgreSQL serving property data via REST endpoints, Next.js dashboard with interactive charts (Recharts) and map (React-Leaflet), Docker Compose for the full stack, and a synthetic data generator seeding 800 realistic Austin, TX listings. Located at `projects/realestate-price-tracker/` within the portfolio monorepo.

## Technical Context

**Language/Version**: Python 3.12 (API + pipeline), TypeScript (dashboard)
**Primary Dependencies**: FastAPI, SQLAlchemy (async), asyncpg (API); Next.js, Recharts, React-Leaflet, Tailwind CSS v4 (dashboard)
**Storage**: PostgreSQL 16 (Docker Compose)
**Testing**: Manual verification via Docker Compose + Swagger UI
**Target Platform**: Dokku at `realestate-tracker.home301server.com.br`
**Project Type**: Full-stack web application (API-driven)
**Performance Goals**: Dashboard loads < 3s, API responses < 500ms, filter updates < 500ms
**Constraints**: No paid APIs, synthetic + public CSV data only, single Docker Compose stack
**Scale/Scope**: 800 listings, 5+ neighborhoods, 12 months of trend data

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Sell, Don't Tell | ✅ PASS | Interactive dashboard with real chart patterns, map visualization, KPI cards. Swagger UI as bonus demo. |
| II. Static-First | ⚠️ N/A | This project is intentionally API-driven (not static). Demonstrates a different architecture from the static portfolio and exec-job-board. Constitution allows this — the portfolio site itself remains static. |
| III. Monorepo Discipline | ✅ PASS | Self-contained at `projects/realestate-price-tracker/`. Own Docker Compose, own Python env, own Next.js app. Does not modify `apps/web` or `packages/ui`. |
| IV. Visual Polish | ✅ PASS | Dark theme matching portfolio. Recharts + Leaflet visualizations. Responsive layout. |
| V. No AI Slop | ✅ PASS | README frames in business value. Data is realistic (based on real Austin market ranges). |
| VI. Mixed-Stack Autonomy | ✅ PASS | Python API + JS dashboard + PostgreSQL — each with own Dockerfile/config. Docker Compose orchestrates. |

**Gate result**: PASS

## Project Structure

### Documentation

```text
specs/004-realestate-price-tracker/
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
projects/realestate-price-tracker/
├── api/                            # FastAPI backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                # FastAPI app, CORS, routers
│   │   ├── config.py              # Settings from env
│   │   ├── database.py            # Async engine + session
│   │   ├── models.py              # SQLAlchemy Listing model
│   │   ├── schemas.py             # Pydantic schemas
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── listings.py        # CRUD + filter
│   │   │   ├── stats.py           # Aggregates
│   │   │   └── export.py          # CSV/JSON export
│   │   └── seed.py                # Synthetic data generator
│   ├── Dockerfile
│   └── pyproject.toml
├── dashboard/                      # Next.js frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx           # Dashboard page
│   │   │   ├── layout.tsx         # Root layout
│   │   │   └── globals.css        # Dark theme
│   │   ├── components/
│   │   │   ├── kpi-cards.tsx      # Summary metrics
│   │   │   ├── price-chart.tsx    # Recharts line chart
│   │   │   ├── price-histogram.tsx # Distribution bar chart
│   │   │   ├── property-map.tsx   # React-Leaflet map
│   │   │   ├── filter-sidebar.tsx # Filter controls
│   │   │   └── export-buttons.tsx # CSV/JSON download
│   │   └── lib/
│   │       ├── api.ts             # API client
│   │       └── types.ts           # TypeScript interfaces
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
├── docker-compose.yml
├── .env.example
├── Dockerfile.dokku                # Combined build for Dokku
├── app.json                        # Dokku health checks
├── package.json                    # Thin Turbo wrapper
└── README.md
```

## Implementation Order

### Step 1: API Foundation

1. Create `api/pyproject.toml`: fastapi, uvicorn, sqlalchemy[asyncio], asyncpg, pydantic
2. Create `api/app/config.py`: load DATABASE_URL, CORS_ORIGINS from env
3. Create `api/app/database.py`: async engine, session factory, Base
4. Create `api/app/models.py`: SQLAlchemy `Listing` model
5. Create `api/app/schemas.py`: Pydantic request/response schemas
6. Create `api/app/main.py`: FastAPI app with CORS, health check, router mounting

### Step 2: API Endpoints

1. Create `api/app/routers/listings.py`: `GET /api/v1/listings` with pagination + all filters (neighborhood, price range, bedrooms, date range)
2. Create `api/app/routers/stats.py`: `GET /api/v1/stats` returning median_price, avg_price_per_sqft, total_listings, avg_days_on_market, price_by_neighborhood, price_trend
3. Create `api/app/routers/export.py`: `GET /api/v1/export/csv` and `/json` with same filters as listings

### Step 3: Synthetic Data Generator

1. Create `api/app/seed.py`: generate 800 realistic Austin, TX listings — 5+ neighborhoods, varied prices, correlated sqft/bedrooms, lat/lng within bounding boxes, listing dates across 12 months. Support `--init-db` flag to create tables.
2. Neighborhoods: Downtown ($500k–$1.2M), East Austin ($350k–$700k), South Congress ($400k–$900k), Mueller ($300k–$600k), Round Rock ($250k–$450k), Cedar Park ($280k–$500k)

### Step 4: Docker Compose + API Dockerfile

1. Create `api/Dockerfile`: Python 3.12, install deps, uvicorn CMD
2. Create `docker-compose.yml`: db (postgres:16-alpine), api (depends on db health), web (depends on api health), seed (profile-gated)
3. Create `.env.example`
4. Test: `docker compose up -d && docker compose --profile seed up seed` → API responds at localhost:8000

### Step 5: Dashboard Foundation

1. Create `dashboard/package.json`: next, react, recharts, react-leaflet, leaflet, tailwindcss
2. Create `dashboard/tsconfig.json`, `next.config.ts`, `postcss.config.mjs`
3. Create `dashboard/src/lib/types.ts`: TypeScript interfaces
4. Create `dashboard/src/lib/api.ts`: fetch wrappers for listings, stats, export
5. Create `dashboard/src/app/globals.css`: dark theme matching portfolio
6. Create `dashboard/src/app/layout.tsx`: fonts, metadata, header

### Step 6: Dashboard Components

1. Create `kpi-cards.tsx`: 4 metric cards (median price, price/sqft, total listings, avg days on market)
2. Create `price-chart.tsx`: Recharts ResponsiveContainer + LineChart for monthly price trend
3. Create `price-histogram.tsx`: Recharts BarChart for price distribution buckets
4. Create `property-map.tsx`: React-Leaflet MapContainer with CircleMarker per listing, color-coded by price, tooltip with address/price/beds/sqft
5. Create `filter-sidebar.tsx`: neighborhood dropdown, price range slider (or min/max inputs), bedrooms buttons, date range, reset button. All with ARIA labels.
6. Create `export-buttons.tsx`: CSV and JSON download buttons calling API export endpoints

### Step 7: Dashboard Page

1. Create `dashboard/src/app/page.tsx`: client component, fetch stats + listings from API on mount (with filter state in URL params), render KPI cards → map + price chart row → histogram → export buttons
2. Wire filter changes to re-fetch from API
3. Responsive: sidebar on desktop, collapsible on mobile

### Step 8: Deployment

1. Create `Dockerfile.dokku`: multi-stage build — build API + dashboard, run both from single container (API serves dashboard static files)
2. Create `app.json`: health checks on `/health`
3. Provision Dokku app: `realestate-tracker`, PostgreSQL service, domain, SSL
4. Initial deploy and seed

### Step 9: README + Verification

1. Create `README.md`: description, Mermaid architecture diagram, tech stack, Docker Compose setup, API docs link, live demo link
2. Update portfolio `projects.ts` with live demo URL
3. Verify all 5 user stories + 6 success criteria

## Complexity Tracking

| Note | Justification |
|------|--------------|
| API-driven (not static) | Intentional — demonstrates full-stack architecture. Static sites already covered by portfolio + exec-job-board. |
| Docker Compose complexity | Necessary to showcase DevOps skills. PostgreSQL + FastAPI + Next.js is a real-world stack. |
