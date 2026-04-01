from __future__ import annotations

import datetime
import logging
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Listing
from app.schemas import PropertyListResponse, PropertyResponse

logger = logging.getLogger(__name__)

router = APIRouter(tags=["listings"])


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


@router.get("/listings", response_model=PropertyListResponse)
async def get_listings(
    db: AsyncSession = Depends(get_db),
    neighborhood: Optional[str] = Query(None),
    min_price: Optional[int] = Query(None),
    max_price: Optional[int] = Query(None),
    bedrooms: Optional[int] = Query(None),
    min_date: Optional[datetime.date] = Query(None),
    max_date: Optional[datetime.date] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
) -> PropertyListResponse:
    base = select(Listing)
    base = _apply_filters(base, neighborhood, min_price, max_price, bedrooms, min_date, max_date)

    count_stmt = select(func.count()).select_from(base.subquery())
    total = (await db.execute(count_stmt)).scalar_one()

    stmt = base.order_by(Listing.listed_date.desc()).offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(stmt)
    rows = result.scalars().all()

    return PropertyListResponse(
        items=[PropertyResponse.model_validate(r) for r in rows],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/listings/geo")
async def get_listings_geo(
    db: AsyncSession = Depends(get_db),
) -> list[dict]:
    stmt = select(
        Listing.id,
        Listing.latitude,
        Listing.longitude,
        Listing.price,
        Listing.bedrooms,
        Listing.neighborhood,
    )
    result = await db.execute(stmt)
    return [
        {
            "id": row.id,
            "latitude": row.latitude,
            "longitude": row.longitude,
            "price": float(row.price),
            "bedrooms": row.bedrooms,
            "neighborhood": row.neighborhood,
        }
        for row in result.all()
    ]
