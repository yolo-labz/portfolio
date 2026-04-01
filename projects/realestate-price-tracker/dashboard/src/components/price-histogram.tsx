"use client";

import type { GeoProperty } from "@/lib/types";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

interface Bucket {
	label: string;
	count: number;
}

function computeBuckets(listings: GeoProperty[]): Bucket[] {
	const ranges: [string, number, number][] = [
		["$0-200k", 0, 200_000],
		["$200-400k", 200_000, 400_000],
		["$400-600k", 400_000, 600_000],
		["$600-800k", 600_000, 800_000],
		["$800k-1M", 800_000, 1_000_000],
		["$1M+", 1_000_000, Infinity],
	];

	return ranges.map(([label, min, max]) => ({
		label,
		count: listings.filter((p) => p.price >= min && p.price < max).length,
	}));
}

export function PriceHistogram({ listings }: { listings: GeoProperty[] }) {
	const data = computeBuckets(listings);

	if (listings.length === 0) {
		return (
			<div className="flex items-center justify-center h-[250px] text-text-muted text-sm">
				No distribution data available
			</div>
		);
	}

	return (
		<ResponsiveContainer width="100%" height={250}>
			<BarChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
				<CartesianGrid
					strokeDasharray="3 3"
					stroke="oklch(0.25 0.015 260)"
					vertical={false}
				/>
				<XAxis
					dataKey="label"
					tick={{ fill: "oklch(0.65 0.01 260)", fontSize: 12 }}
					axisLine={{ stroke: "oklch(0.30 0.015 260)" }}
					tickLine={false}
				/>
				<YAxis
					tick={{ fill: "oklch(0.65 0.01 260)", fontSize: 12 }}
					axisLine={false}
					tickLine={false}
					allowDecimals={false}
				/>
				<Tooltip
					formatter={(value) => [Number(value), "Properties"]}
					contentStyle={{
						backgroundColor: "oklch(0.20 0.02 260)",
						borderColor: "oklch(0.30 0.015 260)",
						borderRadius: "8px",
						color: "oklch(0.93 0.01 260)",
					}}
					itemStyle={{ color: "oklch(0.72 0.19 160)" }}
					cursor={{ fill: "oklch(0.25 0.015 260 / 0.5)" }}
				/>
				<Bar
					dataKey="count"
					fill="oklch(0.72 0.19 160)"
					radius={[4, 4, 0, 0]}
					maxBarSize={48}
				/>
			</BarChart>
		</ResponsiveContainer>
	);
}
