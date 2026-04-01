# Quickstart: Real Estate Price Tracker Dashboard

**Branch**: `004-realestate-price-tracker`

## Docker Compose (Recommended)

```bash
cd projects/realestate-price-tracker

# Copy environment template
cp .env.example .env

# Start all services
docker compose up -d

# Seed the database (first time only)
docker compose --profile seed up seed

# Open dashboard
open http://localhost:3000

# API docs
open http://localhost:8000/docs
```

## Manual Setup

### Backend (FastAPI)

```bash
cd projects/realestate-price-tracker/api
python3 -m venv .venv && source .venv/bin/activate
pip install -e .

# Start PostgreSQL (requires local install or Docker)
# Set DATABASE_URL in environment

# Run migrations
python -m app.seed --init-db

# Seed data
python -m app.seed

# Start server
uvicorn app.main:app --reload --port 8000
```

### Dashboard (Next.js)

```bash
cd projects/realestate-price-tracker/dashboard
pnpm install
NEXT_PUBLIC_API_URL=http://localhost:8000 pnpm dev
# Open http://localhost:3000
```

## Verification

- [ ] `docker compose up -d` starts all 3 services
- [ ] `docker compose --profile seed up seed` populates 800 listings
- [ ] `http://localhost:8000/docs` shows Swagger UI
- [ ] `http://localhost:8000/health` returns `{"status": "healthy"}`
- [ ] `http://localhost:8000/api/v1/listings` returns paginated listings
- [ ] `http://localhost:8000/api/v1/stats` returns aggregate metrics
- [ ] `http://localhost:3000` renders dashboard with map, charts, metrics
- [ ] Filter by neighborhood — map and charts update
- [ ] Export CSV — file downloads with filtered data
- [ ] Dashboard responsive on 375px viewport

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `POSTGRES_USER` | realestate | DB user |
| `POSTGRES_PASSWORD` | localdev | DB password |
| `POSTGRES_DB` | realestate | DB name |
| `DATABASE_URL` | (constructed from above) | Full connection string |
| `CORS_ORIGINS` | http://localhost:3000 | Allowed CORS origins |
| `NEXT_PUBLIC_API_URL` | http://localhost:8000 | API base URL for dashboard |
