"use client";

import type { Filters } from "@/lib/types";

const BEDROOM_OPTIONS = ["All", "1", "2", "3", "4", "5+"];

const DEFAULT_FILTERS: Filters = {
	neighborhood: "",
	min_price: "",
	max_price: "",
	bedrooms: "",
	min_date: "",
	max_date: "",
};

function hasActiveFilters(filters: Filters): boolean {
	return Object.values(filters).some((v) => v !== "");
}

interface FilterSidebarProps {
	filters: Filters;
	onChange: (filters: Filters) => void;
	neighborhoods: string[];
}

export function FilterSidebar({ filters, onChange, neighborhoods }: FilterSidebarProps) {
	const update = (key: keyof Filters, value: string) => {
		onChange({ ...filters, [key]: value });
	};

	return (
		<aside className="space-y-5 lg:space-y-6">
			<h2 className="text-sm font-mono font-semibold text-text-muted uppercase tracking-wider">
				Filters
			</h2>

			{/* Neighborhood */}
			<div className="space-y-1.5">
				<label htmlFor="filter-neighborhood" className="text-xs text-text-muted">
					Neighborhood
				</label>
				<select
					id="filter-neighborhood"
					aria-label="Filter by neighborhood"
					value={filters.neighborhood}
					onChange={(e) => update("neighborhood", e.target.value)}
					className="w-full rounded-md bg-bg-card border border-border px-3 py-2 text-sm text-text focus-visible:outline-2 focus-visible:outline-accent"
				>
					<option value="">All Neighborhoods</option>
					{neighborhoods.map((n) => (
						<option key={n} value={n}>
							{n}
						</option>
					))}
				</select>
			</div>

			{/* Price Range */}
			<div className="space-y-1.5">
				<span className="text-xs text-text-muted">Price Range</span>
				<div className="flex gap-2">
					<input
						type="number"
						aria-label="Minimum price"
						placeholder="$200,000"
						value={filters.min_price}
						onChange={(e) => update("min_price", e.target.value)}
						className="w-full rounded-md bg-bg-card border border-border px-3 py-2 text-sm text-text placeholder:text-text-muted/50 focus-visible:outline-2 focus-visible:outline-accent"
					/>
					<input
						type="number"
						aria-label="Maximum price"
						placeholder="$1,500,000"
						value={filters.max_price}
						onChange={(e) => update("max_price", e.target.value)}
						className="w-full rounded-md bg-bg-card border border-border px-3 py-2 text-sm text-text placeholder:text-text-muted/50 focus-visible:outline-2 focus-visible:outline-accent"
					/>
				</div>
			</div>

			{/* Bedrooms */}
			<div className="space-y-1.5">
				<span className="text-xs text-text-muted">Bedrooms</span>
				<div className="flex gap-1">
					{BEDROOM_OPTIONS.map((opt) => {
						const value = opt === "All" ? "" : opt;
						const isActive = filters.bedrooms === value;
						return (
							<button
								key={opt}
								type="button"
								aria-label={`Filter by ${opt === "All" ? "all" : opt} bedrooms`}
								onClick={() => update("bedrooms", value)}
								className={`flex-1 rounded-md px-2 py-1.5 text-xs font-mono font-medium transition-colors ${
									isActive
										? "bg-accent text-bg font-bold"
										: "bg-bg-card border border-border text-text-muted hover:text-text hover:border-accent/50"
								}`}
							>
								{opt}
							</button>
						);
					})}
				</div>
			</div>

			{/* Date Range */}
			<div className="space-y-1.5">
				<span className="text-xs text-text-muted">Listed Date</span>
				<div className="flex gap-2">
					<input
						type="date"
						aria-label="Minimum date"
						value={filters.min_date}
						onChange={(e) => update("min_date", e.target.value)}
						className="w-full rounded-md bg-bg-card border border-border px-3 py-2 text-sm text-text focus-visible:outline-2 focus-visible:outline-accent"
					/>
					<input
						type="date"
						aria-label="Maximum date"
						value={filters.max_date}
						onChange={(e) => update("max_date", e.target.value)}
						className="w-full rounded-md bg-bg-card border border-border px-3 py-2 text-sm text-text focus-visible:outline-2 focus-visible:outline-accent"
					/>
				</div>
			</div>

			{/* Reset */}
			{hasActiveFilters(filters) && (
				<button
					type="button"
					onClick={() => onChange(DEFAULT_FILTERS)}
					className="w-full rounded-md border border-border px-3 py-2 text-sm text-text-muted hover:text-accent hover:border-accent transition-colors"
				>
					Reset Filters
				</button>
			)}
		</aside>
	);
}
