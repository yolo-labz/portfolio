"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ExportButtons } from "@/components/export-buttons";
import { FilterSidebar } from "@/components/filter-sidebar";
import { KpiCards } from "@/components/kpi-cards";
import { PriceChart } from "@/components/price-chart";
import { PriceHistogram } from "@/components/price-histogram";
import { PropertyMap } from "@/components/property-map";
import { fetchGeoData, fetchStats } from "@/lib/api";
import type { Filters, GeoProperty, MarketStats } from "@/lib/types";

const EMPTY_FILTERS: Filters = {
	neighborhood: "",
	min_price: "",
	max_price: "",
	bedrooms: "",
	min_date: "",
	max_date: "",
};

export default function DashboardPage() {
	const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
	const [stats, setStats] = useState<MarketStats | null>(null);
	const [geoData, setGeoData] = useState<GeoProperty[]>([]);
	const [loading, setLoading] = useState(true);

	const loadData = useCallback(async (f: Filters) => {
		setLoading(true);
		try {
			const [statsResult, geoResult] = await Promise.all([fetchStats(f), fetchGeoData(f)]);
			setStats(statsResult);
			setGeoData(geoResult);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadData(filters);
	}, [filters, loadData]);

	const neighborhoods = useMemo(() => {
		const unique = [...new Set(geoData.map((p) => p.neighborhood))];
		return unique.sort();
	}, [geoData]);

	const isEmpty = stats !== null && stats.total_listings === 0;

	return (
		<div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
			{/* Sidebar - filters */}
			<div className="lg:sticky lg:top-6 lg:self-start">
				<FilterSidebar filters={filters} onChange={setFilters} neighborhoods={neighborhoods} />
			</div>

			{/* Main content */}
			<div className="space-y-8">
				{/* Loading state */}
				{loading && (
					<div className="flex items-center gap-3 text-accent font-mono text-sm">
						<span className="inline-block h-4 w-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
						Loading market data...
					</div>
				)}

				{/* Empty state */}
				{!loading && isEmpty && (
					<div className="rounded-lg border border-border bg-bg-card p-8 text-center">
						<p className="text-text-muted">No properties match your filters.</p>
					</div>
				)}

				{/* KPI Cards */}
				{stats && !isEmpty && (
					<>
						<KpiCards stats={stats} />

						{/* Price Trends */}
						<section className="space-y-3">
							<h2 className="text-sm font-mono font-semibold text-text-muted uppercase tracking-wider">
								Price Trends
							</h2>
							<div className="rounded-lg border border-border bg-bg-card p-4">
								<PriceChart data={stats.price_trend} />
							</div>
						</section>

						{/* Map + Histogram row */}
						<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
							{/* Location Map */}
							<section className="space-y-3">
								<h2 className="text-sm font-mono font-semibold text-text-muted uppercase tracking-wider">
									Location Map
								</h2>
								<div className="rounded-lg border border-border bg-bg-card overflow-hidden h-[400px]">
									<PropertyMap properties={geoData} />
								</div>
							</section>

							{/* Price Distribution */}
							<section className="space-y-3">
								<h2 className="text-sm font-mono font-semibold text-text-muted uppercase tracking-wider">
									Price Distribution
								</h2>
								<div className="rounded-lg border border-border bg-bg-card p-4">
									<PriceHistogram listings={geoData} />
								</div>
							</section>
						</div>

						{/* Export */}
						<section className="space-y-3">
							<h2 className="text-sm font-mono font-semibold text-text-muted uppercase tracking-wider">
								Export Data
							</h2>
							<ExportButtons filters={filters} />
						</section>
					</>
				)}
			</div>
		</div>
	);
}
