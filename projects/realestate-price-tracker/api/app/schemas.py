from __future__ import annotations

import datetime

from pydantic import BaseModel, ConfigDict


class PropertyResponse(BaseModel):
    id: int
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
    listed_date: datetime.date
    days_on_market: int
    source: str
    listing_url: str | None
    created_at: datetime.datetime

    model_config = ConfigDict(from_attributes=True)


class PropertyListResponse(BaseModel):
    items: list[PropertyResponse]
    total: int
    page: int
    page_size: int


class NeighborhoodPrice(BaseModel):
    neighborhood: str
    median_price: float
    count: int


class MonthlyPrice(BaseModel):
    month: str
    median_price: float
    count: int


class StatsResponse(BaseModel):
    median_price: float
    avg_price_per_sqft: float
    total_listings: int
    avg_days_on_market: float
    price_by_neighborhood: list[NeighborhoodPrice]
    price_trend: list[MonthlyPrice]
