"use client";

import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { MonthlyPrice } from "@/lib/types";

function formatMonth(value: string): string {
	try {
		const date = new Date(`${value}-01`);
		return date.toLocaleDateString("en-US", {
			month: "short",
			year: "2-digit",
		});
	} catch {
		return value;
	}
}

function formatPriceAxis(value: number): string {
	if (value >= 1_000_000) {
		return `$${(value / 1_000_000).toFixed(1)}M`;
	}
	return `$${Math.round(value / 1000)}k`;
}

function formatPriceFull(value: number): string {
	return `$${value.toLocaleString("en-US")}`;
}

export function PriceChart({ data }: { data: MonthlyPrice[] }) {
	if (data.length === 0) {
		return (
			<div className="flex items-center justify-center h-[300px] text-text-muted text-sm">
				No trend data available
			</div>
		);
	}

	return (
		<ResponsiveContainer width="100%" height={300}>
			<LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: 16 }}>
				<CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.015 260)" vertical={false} />
				<XAxis
					dataKey="month"
					tickFormatter={formatMonth}
					tick={{ fill: "oklch(0.65 0.01 260)", fontSize: 12 }}
					axisLine={{ stroke: "oklch(0.30 0.015 260)" }}
					tickLine={false}
				/>
				<YAxis
					tickFormatter={formatPriceAxis}
					tick={{ fill: "oklch(0.65 0.01 260)", fontSize: 12 }}
					axisLine={false}
					tickLine={false}
					width={60}
				/>
				<Tooltip
					formatter={(value) => [formatPriceFull(Number(value)), "Median Price"]}
					labelFormatter={(label) => formatMonth(String(label))}
					contentStyle={{
						backgroundColor: "oklch(0.20 0.02 260)",
						borderColor: "oklch(0.30 0.015 260)",
						borderRadius: "8px",
						color: "oklch(0.93 0.01 260)",
					}}
					itemStyle={{ color: "oklch(0.72 0.19 160)" }}
				/>
				<Line
					type="monotone"
					dataKey="median_price"
					stroke="oklch(0.72 0.19 160)"
					strokeWidth={2}
					dot={false}
					activeDot={{ r: 4, fill: "oklch(0.72 0.19 160)" }}
				/>
			</LineChart>
		</ResponsiveContainer>
	);
}
