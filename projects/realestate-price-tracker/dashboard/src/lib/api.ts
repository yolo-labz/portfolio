import type { Filters, GeoProperty, MarketStats, Property } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function buildParams(filters: Partial<Filters>): URLSearchParams {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(filters)) {
		if (value !== undefined && value !== "") {
			params.set(key, String(value));
		}
	}
	return params;
}

export async function fetchStats(filters: Partial<Filters>): Promise<MarketStats> {
	try {
		const params = buildParams(filters);
		const res = await fetch(`${API_URL}/api/stats?${params.toString()}`);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		return await res.json();
	} catch (err) {
		console.error("Failed to fetch stats:", err);
		return {
			median_price: 0,
			avg_price_per_sqft: 0,
			total_listings: 0,
			avg_days_on_market: 0,
			price_by_neighborhood: [],
			price_trend: [],
		};
	}
}

export async function fetchGeoData(filters: Partial<Filters>): Promise<GeoProperty[]> {
	try {
		const params = buildParams(filters);
		const res = await fetch(`${API_URL}/api/geo?${params.toString()}`);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		return await res.json();
	} catch (err) {
		console.error("Failed to fetch geo data:", err);
		return [];
	}
}

export async function fetchListings(
	filters: Partial<Filters>,
	page = 1,
): Promise<{ items: Property[]; total: number }> {
	try {
		const params = buildParams(filters);
		params.set("page", String(page));
		const res = await fetch(`${API_URL}/api/listings?${params.toString()}`);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		return await res.json();
	} catch (err) {
		console.error("Failed to fetch listings:", err);
		return { items: [], total: 0 };
	}
}

export function getExportUrl(format: "csv" | "json", filters: Partial<Filters>): string {
	const params = buildParams(filters);
	params.set("format", format);
	return `${API_URL}/api/export?${params.toString()}`;
}
