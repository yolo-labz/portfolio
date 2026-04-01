from __future__ import annotations

import datetime
import logging
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import case, func, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Listing
from app.schemas import MonthlyPrice, NeighborhoodPrice, StatsResponse

logger = logging.getLogger(__name__)

router = APIRouter(tags=["stats"])


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


def _build_base_where(
    neighborhood: Optional[str],
    min_price: Optional[int],
    max_price: Optional[int],
    bedrooms: Optional[int],
    min_date: Optional[datetime.date],
    max_date: Optional[datetime.date],
) -> list:
    conditions = []
    if neighborhood is not None:
        conditions.append(Listing.neighborhood == neighborhood)
    if min_price is not None:
        conditions.append(Listing.price >= min_price)
    if max_price is not None:
        conditions.append(Listing.price <= max_price)
    if bedrooms is not None:
        conditions.append(Listing.bedrooms == bedrooms)
    if min_date is not None:
        conditions.append(Listing.listed_date >= min_date)
    if max_date is not None:
        conditions.append(Listing.listed_date <= max_date)
    return conditions


@router.get("/stats", response_model=StatsResponse)
async def get_stats(
    db: AsyncSession = Depends(get_db),
    neighborhood: Optional[str] = Query(None),
    min_price: Optional[int] = Query(None),
    max_price: Optional[int] = Query(None),
    bedrooms: Optional[int] = Query(None),
    min_date: Optional[datetime.date] = Query(None),
    max_date: Optional[datetime.date] = Query(None),
) -> StatsResponse:
    conditions = _build_base_where(
        neighborhood, min_price, max_price, bedrooms, min_date, max_date
    )

    # Aggregate stats
    agg_stmt = select(
        func.count(Listing.id).label("total_listings"),
        func.percentile_cont(0.5).within_group(Listing.price).label("median_price"),
        func.avg(Listing.price_per_sqft).label("avg_price_per_sqft"),
        func.avg(Listing.days_on_market).label("avg_days_on_market"),
    ).where(*conditions) if conditions else select(
        func.count(Listing.id).label("total_listings"),
        func.percentile_cont(0.5).within_group(Listing.price).label("median_price"),
        func.avg(Listing.price_per_sqft).label("avg_price_per_sqft"),
        func.avg(Listing.days_on_market).label("avg_days_on_market"),
    )

    agg_result = (await db.execute(agg_stmt)).one()

    total_listings = agg_result.total_listings or 0
    median_price = float(agg_result.median_price or 0)
    avg_price_per_sqft = float(agg_result.avg_price_per_sqft or 0)
    avg_days_on_market = float(agg_result.avg_days_on_market or 0)

    # Price by neighborhood
    nbh_stmt = select(
        Listing.neighborhood,
        func.percentile_cont(0.5).within_group(Listing.price).label("median_price"),
        func.count(Listing.id).label("count"),
    ).group_by(Listing.neighborhood).order_by(Listing.neighborhood)

    if conditions:
        nbh_stmt = nbh_stmt.where(*conditions)

    nbh_result = (await db.execute(nbh_stmt)).all()
    price_by_neighborhood = [
        NeighborhoodPrice(
            neighborhood=row.neighborhood,
            median_price=float(row.median_price),
            count=row.count,
        )
        for row in nbh_result
    ]

    # Price trend by month
    month_expr = func.date_trunc("month", Listing.listed_date)
    trend_stmt = (
        select(
            month_expr.label("month"),
            func.percentile_cont(0.5).within_group(Listing.price).label("median_price"),
            func.count(Listing.id).label("count"),
        )
        .group_by(month_expr)
        .order_by(month_expr)
    )

    if conditions:
        trend_stmt = trend_stmt.where(*conditions)

    trend_result = (await db.execute(trend_stmt)).all()
    price_trend = [
        MonthlyPrice(
            month=row.month.strftime("%Y-%m"),
            median_price=float(row.median_price),
            count=row.count,
        )
        for row in trend_result
    ]

    return StatsResponse(
        median_price=round(median_price, 2),
        avg_price_per_sqft=round(avg_price_per_sqft, 2),
        total_listings=total_listings,
        avg_days_on_market=round(avg_days_on_market, 1),
        price_by_neighborhood=price_by_neighborhood,
        price_trend=price_trend,
    )
