export interface Property {
	id: number;
	address: string;
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

export interface GeoProperty {
	id: number;
	latitude: number;
	longitude: number;
	price: number;
	bedrooms: number;
	neighborhood: string;
}

export interface NeighborhoodPrice {
	neighborhood: string;
	median_price: number;
	count: number;
}

export interface MonthlyPrice {
	month: string;
	median_price: number;
	count: number;
}

export interface MarketStats {
	median_price: number;
	avg_price_per_sqft: number;
	total_listings: number;
	avg_days_on_market: number;
	price_by_neighborhood: NeighborhoodPrice[];
	price_trend: MonthlyPrice[];
}

export interface Filters {
	neighborhood: string;
	min_price: string;
	max_price: string;
	bedrooms: string;
	min_date: string;
	max_date: string;
}
