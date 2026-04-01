from __future__ import annotations

from sqlalchemy import (
    Date,
    DateTime,
    Float,
    Index,
    Integer,
    Numeric,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Listing(Base):
    __tablename__ = "listings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False, default="Austin")
    state: Mapped[str] = mapped_column(String(2), nullable=False, default="TX")
    zip_code: Mapped[str] = mapped_column(String(5), nullable=False, index=True)
    neighborhood: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    price: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    bedrooms: Mapped[int] = mapped_column(Integer, nullable=False)
    bathrooms: Mapped[float] = mapped_column(Float, nullable=False)
    sqft: Mapped[int] = mapped_column(Integer, nullable=False)
    price_per_sqft: Mapped[float] = mapped_column(Numeric(8, 2), nullable=False)
    year_built: Mapped[int | None] = mapped_column(Integer, nullable=True)
    property_type: Mapped[str] = mapped_column(String(50), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    listed_date: Mapped[str] = mapped_column(Date, nullable=False, index=True)
    days_on_market: Mapped[int] = mapped_column(Integer, nullable=False)
    source: Mapped[str] = mapped_column(String(50), nullable=False, default="synthetic")
    listing_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    created_at: Mapped[str] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )

    __table_args__ = (
        Index("ix_listings_neighborhood_listed_date", "neighborhood", "listed_date"),
    )
