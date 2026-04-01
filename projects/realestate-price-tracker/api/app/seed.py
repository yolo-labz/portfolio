from __future__ import annotations

import argparse
import asyncio
import logging
import random
import sys
from datetime import date, timedelta

from sqlalchemy import func, select

from app.config import settings
from app.database import Base, engine, async_session
from app.models import Listing

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

NEIGHBORHOODS = [
    {"name": "Downtown", "zip": "78701", "lat": 30.267, "lng": -97.743, "price_min": 500000, "price_max": 1200000, "count": 130},
    {"name": "East Austin", "zip": "78702", "lat": 30.263, "lng": -97.718, "price_min": 350000, "price_max": 700000, "count": 140},
    {"name": "South Congress", "zip": "78704", "lat": 30.247, "lng": -97.750, "price_min": 400000, "price_max": 900000, "count": 130},
    {"name": "Mueller", "zip": "78723", "lat": 30.298, "lng": -97.706, "price_min": 300000, "price_max": 600000, "count": 140},
    {"name": "Round Rock", "zip": "78664", "lat": 30.508, "lng": -97.678, "price_min": 250000, "price_max": 450000, "count": 130},
    {"name": "Cedar Park", "zip": "78613", "lat": 30.505, "lng": -97.820, "price_min": 280000, "price_max": 500000, "count": 130},
]

STREET_NAMES = [
    "Main", "Oak", "Cedar", "Elm", "Maple", "Pine", "Walnut", "Birch",
    "Pecan", "Willow", "Congress", "Lamar", "Guadalupe", "Burnet",
    "Manor", "Cesar Chavez", "Riverside", "Barton Springs", "South First",
    "Red River", "Rainey", "Trinity", "Brazos", "Colorado",
]

SUFFIXES = ["St", "Ave", "Blvd", "Dr", "Ln"]

SQFT_BY_BEDS = {
    1: (600, 900),
    2: (900, 1200),
    3: (1200, 2000),
    4: (1800, 3000),
    5: (2500, 4500),
}


def _generate_listing(nbh: dict, today: date) -> dict:
    price_min = nbh["price_min"]
    price_max = nbh["price_max"]
    mean = (price_min + price_max) / 2
    sigma = (price_max - price_min) / 6
    price = max(price_min, min(price_max, random.gauss(mean, sigma)))
    price = round(price, 2)

    bedrooms = random.choices([1, 2, 3, 4, 5], weights=[5, 20, 35, 30, 10])[0]
    sqft_low, sqft_high = SQFT_BY_BEDS[bedrooms]
    sqft = random.randint(sqft_low, sqft_high)
    bathrooms = max(1.0, round(bedrooms * 0.75))
    price_per_sqft = round(price / sqft, 2)

    year_built = random.randint(1960, 2025)
    property_type = random.choices(
        ["single_family", "condo", "townhouse"], weights=[60, 25, 15]
    )[0]

    lat = nbh["lat"] + random.uniform(-0.015, 0.015)
    lng = nbh["lng"] + random.uniform(-0.015, 0.015)

    listed_date = today - timedelta(days=random.randint(0, 365))

    # Lower avg days_on_market for more expensive neighborhoods
    max_dom = 90 if price_max < 600000 else 60
    days_on_market = random.randint(5, max_dom)

    address = (
        f"{random.randint(100, 9999)} {random.choice(STREET_NAMES)} "
        f"{random.choice(SUFFIXES)}"
    )

    return {
        "address": address,
        "city": "Austin",
        "state": "TX",
        "zip_code": nbh["zip"],
        "neighborhood": nbh["name"],
        "price": price,
        "bedrooms": bedrooms,
        "bathrooms": bathrooms,
        "sqft": sqft,
        "price_per_sqft": price_per_sqft,
        "year_built": year_built,
        "property_type": property_type,
        "latitude": round(lat, 6),
        "longitude": round(lng, 6),
        "listed_date": listed_date,
        "days_on_market": days_on_market,
        "source": "synthetic",
        "listing_url": None,
    }


async def seed_data(init_db: bool = False) -> None:
    if init_db:
        logger.info("Initializing database tables")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async with async_session() as session:
        count_result = await session.execute(select(func.count(Listing.id)))
        existing = count_result.scalar_one()
        if existing > 0:
            logger.info(
                "Database already contains %d listings, skipping seed", existing
            )
            return

        today = date.today()
        listings: list[Listing] = []

        for nbh in NEIGHBORHOODS:
            for _ in range(nbh["count"]):
                data = _generate_listing(nbh, today)
                listings.append(Listing(**data))

        session.add_all(listings)
        await session.commit()
        logger.info("Seeded %d listings into the database", len(listings))


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed the real estate database")
    parser.add_argument(
        "--init-db",
        action="store_true",
        help="Create database tables before seeding",
    )
    args = parser.parse_args()
    asyncio.run(seed_data(init_db=args.init_db))


if __name__ == "__main__":
    main()
