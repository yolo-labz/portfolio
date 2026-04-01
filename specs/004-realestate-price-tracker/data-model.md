# Data Model: Real Estate Price Tracker Dashboard

**Branch**: `004-realestate-price-tracker`
**Date**: 2026-04-01

## Database Schema

### `listings` table

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | SERIAL PK | No | Auto-increment |
| address | VARCHAR(255) | No | Full street address |
| city | VARCHAR(100) | No | Always "Austin" for demo |
| state | VARCHAR(2) | No | Always "TX" for demo |
| zip_code | VARCHAR(5) | No | Indexed |
| neighborhood | VARCHAR(100) | No | Indexed (Downtown, East Austin, etc.) |
| price | NUMERIC(12,2) | No | Listing price |
| bedrooms | INTEGER | No | 1–6 |
| bathrooms | FLOAT | No | 1–4 |
| sqft | INTEGER | No | Square footage |
| price_per_sqft | NUMERIC(8,2) | No | Calculated: price / sqft |
| year_built | INTEGER | Yes | 1950–2025 |
| property_type | VARCHAR(50) | No | single_family, condo, townhouse |
| latitude | FLOAT | No | For map markers |
| longitude | FLOAT | No | For map markers |
| listed_date | DATE | No | Indexed |
| days_on_market | INTEGER | No | 5–90 |
| source | VARCHAR(50) | No | "synthetic" for demo |
| listing_url | VARCHAR(500) | Yes | Placeholder URL |
| created_at | TIMESTAMP | No | Auto: now() |

**Indexes**: zip_code, neighborhood, listed_date, (neighborhood, listed_date) composite

### Pydantic Models (FastAPI)

```python
class PropertyBase(BaseModel):
    address: str
    city: str
    state: str
    zip_code: str
    neighborhood: str
    price: float
    bedrooms: int
    bathrooms: float
    sqft: int
    price_per_sqft: float
    year_built: int | None
    property_type: str
    latitude: float
    longitude: float
    listed_date: date
    days_on_market: int

class PropertyResponse(PropertyBase):
    id: int

class StatsResponse(BaseModel):
    median_price: float
    avg_price_per_sqft: float
    total_listings: int
    avg_days_on_market: float
    price_by_neighborhood: list[NeighborhoodPrice]
    price_trend: list[MonthlyPrice]

class NeighborhoodPrice(BaseModel):
    neighborhood: str
    median_price: float
    count: int

class MonthlyPrice(BaseModel):
    month: str  # "2026-01"
    median_price: float
    count: int
```

### TypeScript Interfaces (Dashboard)

```typescript
interface Property {
  id: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  neighborhood: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  price_per_sqft: number;
  latitude: number;
  longitude: number;
  listed_date: string;
  days_on_market: number;
  property_type: string;
}

interface MarketStats {
  median_price: number;
  avg_price_per_sqft: number;
  total_listings: number;
  avg_days_on_market: number;
  price_by_neighborhood: { neighborhood: string; median_price: number; count: number }[];
  price_trend: { month: string; median_price: number; count: number }[];
}
```

## File Inventory

### FastAPI Backend (`projects/realestate-price-tracker/api/`)

| File | Purpose |
|------|---------|
| `app/main.py` | FastAPI app, CORS, router mounting |
| `app/config.py` | Settings from env (DATABASE_URL, CORS_ORIGINS) |
| `app/database.py` | Async engine, session factory |
| `app/models.py` | SQLAlchemy Listing model |
| `app/schemas.py` | Pydantic request/response schemas |
| `app/routers/listings.py` | CRUD + filter endpoints |
| `app/routers/stats.py` | Aggregate stats endpoint |
| `app/routers/export.py` | CSV/JSON export endpoints |
| `app/seed.py` | Synthetic data generator + DB seeder |
| `Dockerfile` | Python 3.12 + uvicorn |
| `pyproject.toml` | Dependencies |

### Next.js Dashboard (`projects/realestate-price-tracker/dashboard/`)

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Dashboard page — fetches from API, renders components |
| `src/app/layout.tsx` | Root layout, fonts, metadata |
| `src/app/globals.css` | Dark theme (oklch) |
| `src/components/kpi-cards.tsx` | Summary metric cards |
| `src/components/price-chart.tsx` | Recharts line chart |
| `src/components/price-histogram.tsx` | Price distribution bar chart |
| `src/components/property-map.tsx` | React-Leaflet map with markers |
| `src/components/filter-sidebar.tsx` | Dashboard filters |
| `src/components/listings-table.tsx` | Optional scrollable table |
| `src/lib/api.ts` | API client functions |
| `src/lib/types.ts` | TypeScript interfaces |
| `package.json` | Next.js, Recharts, React-Leaflet, Tailwind |

### Infrastructure

| File | Purpose |
|------|---------|
| `docker-compose.yml` | PostgreSQL + API + Dashboard + Seed profile |
| `.env.example` | Environment variable template |
| `Dockerfile.dokku` | Combined build for Dokku deployment |
| `app.json` | Dokku health checks |
| `README.md` | Architecture, setup, screenshots |
