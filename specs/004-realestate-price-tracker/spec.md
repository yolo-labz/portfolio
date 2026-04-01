# Feature Specification: Real Estate Price Tracker Dashboard

**Feature Branch**: `004-realestate-price-tracker`
**Created**: 2026-04-01
**Status**: Draft
**Input**: User description: "Build the realestate-price-tracker project under projects/realestate-price-tracker — Python data extraction pipeline, FastAPI backend with PostgreSQL, Next.js dashboard with interactive charts and map, Docker Compose for the full stack. This showcases data extraction + full-stack + dashboard skills. Uses sample/synthetic data to avoid dependency on paid APIs."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Upwork client explores the interactive dashboard (Priority: P1)

An Upwork client clicks the "Live Demo" link on the portfolio. They land on a dashboard showing real estate market data: a map with property markers, price trend charts, key market metrics, and filter controls. The dashboard loads fast, feels polished, and clearly demonstrates full-stack + data visualization skills.

**Why this priority**: The dashboard is the sales artifact. It must impress visually in 5 seconds. Charts and maps are immediately more impressive than tables or text.

**Independent Test**: Open the dashboard URL. Verify: map renders with property markers, at least one chart shows price trends, metrics cards display aggregate data, and the page is responsive.

**Acceptance Scenarios**:

1. **Given** a visitor opens the dashboard, **When** the page loads, **Then** they see: a geographic map with property markers, at least 2 charts (price trends + price distribution), and summary metric cards (median price, avg price/sqft, total listings, avg days on market).
2. **Given** the visitor hovers over a map marker, **When** the tooltip appears, **Then** it shows property address, price, bedrooms, and square footage.
3. **Given** the visitor views the dashboard on mobile, **When** the layout adjusts, **Then** the map takes full width, charts stack vertically, and all content is readable.

---

### User Story 2 — Visitor filters and explores data (Priority: P1)

A visitor uses dashboard controls to narrow data by location, price range, bedrooms, or date range. Charts and map update dynamically to reflect the filtered dataset.

**Why this priority**: Interactive filtering demonstrates real-time data handling — exactly the kind of dashboard Upwork clients want built for their businesses.

**Independent Test**: Select a neighborhood from the location filter — map zooms in, charts update to show only that area's data, metrics recalculate.

**Acceptance Scenarios**:

1. **Given** the visitor selects a location from the filter, **When** the filter applies, **Then** the map centers on that area, charts update, and metrics recalculate for the filtered set.
2. **Given** the visitor sets a price range slider, **When** the range changes, **Then** only properties within that range appear on the map and charts.
3. **Given** the visitor selects a bedroom count, **When** the filter applies, **Then** data narrows to matching properties.
4. **Given** multiple filters are active, **When** the visitor clicks "Reset filters", **Then** all filters clear and full data is restored.

---

### User Story 3 — Visitor exports data (Priority: P2)

A visitor downloads the current (filtered) dataset as CSV or JSON for their own analysis. This demonstrates API design and export capability.

**Why this priority**: Export endpoints show backend API skills. But it's secondary to the visual dashboard.

**Independent Test**: Click "Export CSV" with filters active. Verify the downloaded file contains only the filtered rows with correct headers.

**Acceptance Scenarios**:

1. **Given** the visitor clicks "Export CSV", **When** the download completes, **Then** the file contains property data matching current filters, with headers: address, price, bedrooms, bathrooms, sqft, price_per_sqft, neighborhood, listed_date.
2. **Given** the visitor clicks "Export JSON", **When** the download completes, **Then** the file is valid JSON with the same filtered data.

---

### User Story 4 — Upwork client reviews the architecture (Priority: P2)

An Upwork client opens the GitHub repo and reviews the README with architecture diagram, Docker Compose setup, and API documentation. They understand the full-stack architecture in 2 minutes.

**Why this priority**: Code and architecture quality are the second most important signal after the live demo.

**Independent Test**: Run `docker compose up` from a fresh clone. Verify all services start and the dashboard is accessible at localhost.

**Acceptance Scenarios**:

1. **Given** a developer clones the repo, **When** they run `docker compose up`, **Then** PostgreSQL, FastAPI, and the Next.js dashboard all start and the dashboard is accessible within 2 minutes.
2. **Given** a visitor reads the README, **When** they view the architecture diagram, **Then** they understand the data flow: extraction → database → API → dashboard.

---

### User Story 5 — Data pipeline populates the database (Priority: P2)

A data extraction pipeline collects property listings, normalizes them, and loads them into PostgreSQL. For the portfolio demo, this runs against sample/synthetic data rather than live API calls.

**Why this priority**: The pipeline demonstrates data engineering skills, but the output (dashboard data) matters more than the pipeline itself for the demo.

**Independent Test**: Run the extraction script. Verify new rows appear in the database and the dashboard reflects them.

**Acceptance Scenarios**:

1. **Given** the pipeline runs, **When** it processes property data, **Then** normalized listings appear in the PostgreSQL database with all required fields.
2. **Given** duplicate properties exist in the source, **When** the pipeline processes them, **Then** duplicates are detected and skipped using address-based deduplication.
3. **Given** the pipeline has already run, **When** it runs again, **Then** it only inserts new or updated listings (incremental, not full replacement).

---

### Edge Cases

- What happens when the database is empty? The dashboard shows an empty state with a message: "No property data available. Run the extraction pipeline to populate."
- What happens when all properties are filtered out? The map shows the default area, charts show "No data for current filters", and metrics show zeroes.
- What happens when a property has no price? It is excluded from price-based charts but appears on the map with "Price TBD".
- What happens when Docker Compose starts but PostgreSQL isn't ready? FastAPI retries database connection with backoff. The dashboard shows a loading state until the API responds.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST include a PostgreSQL database storing property listings with fields: address, price, bedrooms, bathrooms, sqft, price_per_sqft (calculated), neighborhood, city, state, zip_code, latitude, longitude, listed_date, source, listing_url.
- **FR-002**: The system MUST include a FastAPI backend serving property data via REST endpoints: `GET /properties` (list with pagination + filters), `GET /properties/stats` (aggregate metrics), `GET /properties/export/csv`, `GET /properties/export/json`.
- **FR-003**: The `GET /properties` endpoint MUST support query parameters: neighborhood, min_price, max_price, bedrooms, min_date, max_date, page, page_size (default 50).
- **FR-004**: The `GET /properties/stats` endpoint MUST return: median_price, avg_price_per_sqft, total_listings, avg_days_on_market, price_by_neighborhood (grouped), price_trend (monthly averages).
- **FR-005**: The export endpoints MUST respect active filters — exported data matches the current filter state.
- **FR-006**: The system MUST include a Next.js dashboard with: an interactive map showing property markers with tooltips, a price trend line chart (monthly), a price distribution histogram, and summary metric cards.
- **FR-007**: The dashboard MUST provide filter controls: location (dropdown or search), price range (slider), bedrooms (buttons), date range. All charts and map MUST update when filters change.
- **FR-008**: The dashboard MUST be responsive (375px to 2560px). Map takes full width on mobile, charts stack vertically.
- **FR-009**: The system MUST include a Docker Compose configuration that starts PostgreSQL, FastAPI, and the Next.js dashboard with a single `docker compose up` command.
- **FR-010**: The system MUST include a Python data pipeline that loads property data into PostgreSQL. For the portfolio demo, this seeds the database with synthetic/sample data (500-1000 realistic property listings across 5+ neighborhoods).
- **FR-011**: The pipeline MUST deduplicate properties using address as the unique key.
- **FR-012**: The system MUST include a README with: project description, Mermaid architecture diagram, tech stack table, Docker Compose setup instructions, API documentation, and live demo link.
- **FR-013**: The dashboard MUST include keyboard-navigable filter controls with visible focus indicators and ARIA labels.
- **FR-014**: The FastAPI backend MUST include a health check endpoint at `GET /health` returning `{"status": "healthy"}`.
- **FR-015**: The data pipeline MUST generate realistic synthetic data: varied prices ($200k–$2M), 1–6 bedrooms, addresses across 5+ neighborhoods in a single metro area, listing dates spanning the last 12 months.

### Key Entities

- **Property Listing**: A single real estate listing — address, price, bedrooms, bathrooms, sqft, price_per_sqft, neighborhood, city, state, zip_code, latitude, longitude, listed_date, source, listing_url, created_at.
- **Market Stats**: Aggregate metrics computed from property listings — median_price, avg_price_per_sqft, total_listings, avg_days_on_market, price_by_neighborhood, price_trend.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The dashboard loads and renders all components (map, charts, metrics) in under 3 seconds.
- **SC-002**: The database contains 500+ property listings across 5+ neighborhoods after pipeline seed.
- **SC-003**: Filter changes update the dashboard in under 500ms.
- **SC-004**: `docker compose up` brings all services online within 2 minutes on a machine with Docker installed.
- **SC-005**: The README allows a developer to clone and run the full stack locally in under 5 minutes.
- **SC-006**: The project is referenceable as an Upwork portfolio piece with screenshots and a live demo link.

## Assumptions

- The project uses **synthetic/sample data** rather than live API calls. This avoids dependency on paid real estate APIs (Zillow, ATTOM) and ensures the demo always works. The synthetic data generator is part of the pipeline and produces realistic listings.
- The metro area for sample data is a US city (e.g., Austin, TX or Denver, CO) with 5+ distinct neighborhoods, each with different price ranges.
- The site is deployed via Dokku at `realestate-tracker.home301server.com.br`. PostgreSQL runs as a Dokku-managed database service.
- The FastAPI backend and Next.js dashboard are separate services in Docker Compose. The dashboard fetches from the API at runtime (not static generation — this project demonstrates a full-stack API-driven architecture, unlike the static exec-job-board).
- No user accounts or authentication. The dashboard is public and read-only.
- Playwright is included in the pipeline code to demonstrate browser-based extraction capability, but the actual data population uses the synthetic generator for reliability.
- API keys for real estate services are NOT required. The project is self-contained.
