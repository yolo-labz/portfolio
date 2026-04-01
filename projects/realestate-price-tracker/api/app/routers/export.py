from __future__ import annotations

import csv
import datetime
import io
import logging
from typing import Optional

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Listing
from app.schemas import PropertyResponse

logger = logging.getLogger(__name__)

router = APIRouter(tags=["export"])


def _apply_filters(
    stmt,
    neighborhood: Optional[str],
    min_price: Optional[int],
    max_price: Optional[int],
    bedrooms: Optional[int],
    min_date: Optional[datetime.date],
    max_date: Optional[datetime.date],
):
    if neighborhood is not None:
        stmt = stmt.where(Listing.neighborhood == neighborhood)
    if min_price is not None:
        stmt = stmt.where(Listing.price >= min_price)
    if max_price is not None:
        stmt = stmt.where(Listing.price <= max_price)
    if bedrooms is not None:
        stmt = stmt.where(Listing.bedrooms == bedrooms)
    if min_date is not None:
        stmt = stmt.where(Listing.listed_date >= min_date)
    if max_date is not None:
        stmt = stmt.where(Listing.listed_date <= max_date)
    return stmt


def _get_filtered_query(
    neighborhood: Optional[str],
    min_price: Optional[int],
    max_price: Optional[int],
    bedrooms: Optional[int],
    min_date: Optional[datetime.date],
    max_date: Optional[datetime.date],
):
    stmt = select(Listing).order_by(Listing.listed_date.desc())
    return _apply_filters(stmt, neighborhood, min_price, max_price, bedrooms, min_date, max_date)


CSV_COLUMNS = [
    "id", "address", "city", "state", "zip_code", "neighborhood",
    "price", "bedrooms", "bathrooms", "sqft", "price_per_sqft",
    "year_built", "property_type", "latitude", "longitude",
    "listed_date", "days_on_market", "source", "listing_url",
]


@router.get("/export/csv")
async def export_csv(
    db: AsyncSession = Depends(get_db),
    neighborhood: Optional[str] = Query(None),
    min_price: Optional[int] = Query(None),
    max_price: Optional[int] = Query(None),
    bedrooms: Optional[int] = Query(None),
    min_date: Optional[datetime.date] = Query(None),
    max_date: Optional[datetime.date] = Query(None),
) -> StreamingResponse:
    stmt = _get_filtered_query(neighborhood, min_price, max_price, bedrooms, min_date, max_date)
    result = await db.execute(stmt)
    rows = result.scalars().all()

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=CSV_COLUMNS)
    writer.writeheader()

    for row in rows:
        writer.writerow({
            "id": row.id,
            "address": row.address,
            "city": row.city,
            "state": row.state,
            "zip_code": row.zip_code,
            "neighborhood": row.neighborhood,
            "price": float(row.price),
            "bedrooms": row.bedrooms,
            "bathrooms": row.bathrooms,
            "sqft": row.sqft,
            "price_per_sqft": float(row.price_per_sqft),
            "year_built": row.year_built,
            "property_type": row.property_type,
            "latitude": row.latitude,
            "longitude": row.longitude,
            "listed_date": str(row.listed_date),
            "days_on_market": row.days_on_market,
            "source": row.source,
            "listing_url": row.listing_url,
        })

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=listings.csv"},
    )


@router.get("/export/json", response_model=list[PropertyResponse])
async def export_json(
    db: AsyncSession = Depends(get_db),
    neighborhood: Optional[str] = Query(None),
    min_price: Optional[int] = Query(None),
    max_price: Optional[int] = Query(None),
    bedrooms: Optional[int] = Query(None),
    min_date: Optional[datetime.date] = Query(None),
    max_date: Optional[datetime.date] = Query(None),
) -> list[PropertyResponse]:
    stmt = _get_filtered_query(neighborhood, min_price, max_price, bedrooms, min_date, max_date)
    result = await db.execute(stmt)
    rows = result.scalars().all()
    return [PropertyResponse.model_validate(r) for r in rows]
