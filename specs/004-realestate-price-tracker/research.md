# Research: Real Estate Price Tracker Dashboard

**Branch**: `004-realestate-price-tracker`
**Date**: 2026-04-01

## R1: Data Strategy

**Decision**: Use a hybrid approach — real market trend data from Zillow ZHVI / Redfin CSVs (free, public, legal) + synthetic individual property listings generated via Faker.

**Rationale**: Real trend data gives the dashboard credibility and real chart patterns. Synthetic listings fill the map and individual property views without requiring paid APIs. The demo always works with zero external dependencies.

**Alternatives rejected**:
- Zillow/Redfin/Realtor.com APIs: Paid, require partnerships, or violate ToS.
- Full synthetic: Charts would look obviously fake — no seasonal patterns or real market dynamics.

## R2: Metro Area for Sample Data

**Decision**: Austin, TX — 5+ neighborhoods (Downtown, East Austin, South Congress, Mueller, Round Rock, Cedar Park) with varied price ranges ($250k–$1.5M).

**Rationale**: Austin has well-known neighborhoods, price diversity, and is a growing market that makes sense as a demo. Easy to generate realistic lat/lng coordinates.

## R3: Backend Framework

**Decision**: FastAPI with async SQLAlchemy + asyncpg for PostgreSQL.

**Rationale**: Async by default, automatic OpenAPI docs, Pydantic integration for request/response validation. Industry standard for Python APIs. The auto-generated Swagger UI is itself a demo artifact.

## R4: Database

**Decision**: PostgreSQL 16 via Docker Compose. Two tables: `listings` (individual properties) and `zip_metrics` (monthly aggregates per ZIP).

**Rationale**: PostgreSQL is the expected choice for a senior engineer portfolio. Two tables demonstrate normalized schema design + aggregation queries.

## R5: Frontend Charts

**Decision**: Recharts for all chart types (line, bar, histogram).

**Rationale**: Most popular React charting library. Composable, responsive, well-documented. No licensing issues.

**Chart types**: Price trend line chart (primary), price distribution histogram, inventory bar chart, price-per-sqft scatter.

## R6: Map Library

**Decision**: React-Leaflet with OpenStreetMap tiles.

**Rationale**: Free (no API key), lightweight, well-suited for circle markers with tooltips. No Mapbox pricing. Color-coded markers by price range (green < $400k, yellow < $700k, red > $700k).

## R7: Docker Compose Architecture

**Decision**: 3 services (db, api, web) + 1 profile-gated seed service. PostgreSQL health check gates API startup. API health check gates dashboard startup.

**Rationale**: `docker compose up` brings everything online in order. The seed service only runs with `--profile seed` to populate the database on first setup.

## R8: Dashboard Layout

**Decision**: Sidebar filters on desktop (collapsing on mobile), main area with KPI cards row → map + chart grid → optional listings table below.

**Rationale**: Sidebar keeps filters always visible on desktop. KPI cards give immediate impact. Map + charts are the hero elements.

## R9: Deployment

**Decision**: Deploy to Dokku at `realestate-tracker.home301server.com.br`. PostgreSQL as a Dokku-managed database service (`dokku postgres:create`). FastAPI and Next.js as separate Dokku apps, or combined via a single Docker Compose-like setup.

**Revised approach**: Single Dokku app running Docker Compose is complex. Instead, deploy the Next.js dashboard as a static build that calls the FastAPI API. For the live demo, seed data is baked into the Docker image at build time.

**Final decision**: Single Dockerfile that builds both API and dashboard into one container. The API serves the dashboard's static files and the API endpoints from the same port. This simplifies Dokku deployment to a single app.

## R10: Synthetic Data Generation

**Decision**: Python script using `random` (not Faker — too heavy for just addresses). Generate 800 listings with:
- Prices: normal distribution centered on neighborhood median ± 20%
- Sqft: correlated with bedrooms (1br=600-900, 2br=900-1200, 3br=1200-2000, 4br=1800-3000, 5br=2500-4500)
- Lat/lng: jittered within neighborhood bounding boxes
- Listing dates: uniform across last 12 months
- Days on market: 5–90, skewed lower in hot neighborhoods

**Rationale**: Realistic distributions that produce convincing charts without any external dependency.
