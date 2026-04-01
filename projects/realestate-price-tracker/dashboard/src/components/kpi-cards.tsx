import type { MarketStats } from "@/lib/types";

function formatPrice(value: number): string {
	if (value >= 1_000_000) {
		return `$${(value / 1_000_000).toFixed(1)}M`;
	}
	return `$${Math.round(value / 1000)}k`;
}

function formatNumber(value: number): string {
	return value.toLocaleString("en-US");
}

interface KpiCardProps {
	label: string;
	value: string;
}

function KpiCard({ label, value }: KpiCardProps) {
	return (
		<div className="rounded-lg bg-bg-card p-4 border border-border">
			<p className="text-2xl font-mono font-bold text-text">{value}</p>
			<p className="text-sm text-text-muted mt-1">{label}</p>
		</div>
	);
}

export function KpiCards({ stats }: { stats: MarketStats }) {
	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			<KpiCard label="Median Price" value={formatPrice(stats.median_price)} />
			<KpiCard label="Avg $/sqft" value={`$${Math.round(stats.avg_price_per_sqft)}`} />
			<KpiCard label="Total Listings" value={formatNumber(stats.total_listings)} />
			<KpiCard label="Avg Days on Market" value={`${Math.round(stats.avg_days_on_market)}`} />
		</div>
	);
}
