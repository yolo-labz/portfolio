"use client";

import { useCallback, useEffect, useRef } from "react";
import type { Filters } from "@/lib/use-job-filter";

interface FilterBarProps {
	query: string;
	onQueryChange: (q: string) => void;
	filters: Filters;
	onFiltersChange: (f: Filters) => void;
	onClear: () => void;
	sources: string[];
}

const RECENCY_OPTIONS = [
	{ label: "All", value: "all" as const },
	{ label: "24h", value: "24h" as const },
	{ label: "7d", value: "7d" as const },
	{ label: "30d", value: "30d" as const },
];

export function FilterBar({
	query,
	onQueryChange,
	filters,
	onFiltersChange,
	onClear,
	sources,
}: FilterBarProps) {
	const searchRef = useRef<HTMLInputElement>(null);
	const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

	const hasActiveFilters =
		query.trim() !== "" ||
		filters.location.trim() !== "" ||
		filters.seniority !== "all" ||
		filters.recency !== "all" ||
		filters.source !== "" ||
		filters.remoteOnly;

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			if (debounceRef.current) clearTimeout(debounceRef.current);
			debounceRef.current = setTimeout(() => {
				onQueryChange(value);
			}, 200);
		},
		[onQueryChange],
	);

	useEffect(() => {
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
	}, []);

	const updateFilter = useCallback(
		<K extends keyof Filters>(key: K, value: Filters[K]) => {
			onFiltersChange({ ...filters, [key]: value });
		},
		[filters, onFiltersChange],
	);

	return (
		<div className="mb-8 space-y-4">
			{/* Search row */}
			<div className="flex flex-col gap-3 sm:flex-row">
				<div className="relative flex-1">
					<svg
						className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<circle cx="11" cy="11" r="8" />
						<line x1="21" y1="21" x2="16.65" y2="16.65" />
					</svg>
					<input
						ref={searchRef}
						type="text"
						defaultValue={query}
						onChange={handleSearchChange}
						placeholder="Search roles, companies..."
						aria-label="Search job listings"
						className="w-full rounded-lg border border-border bg-bg-card py-2.5 pl-10 pr-4 text-sm text-text placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none"
					/>
				</div>
				<div className="relative w-full sm:w-48">
					<input
						type="text"
						value={filters.location}
						onChange={(e) => updateFilter("location", e.target.value)}
						placeholder="Filter by location"
						aria-label="Filter by location"
						className="w-full rounded-lg border border-border bg-bg-card px-4 py-2.5 text-sm text-text placeholder:text-text-muted transition-colors focus:border-accent focus:outline-none"
					/>
				</div>
			</div>

			{/* Filter controls row */}
			<div className="flex flex-wrap items-center gap-3">
				{/* Remote toggle */}
				<label className="flex cursor-pointer items-center gap-2 text-sm text-text-muted">
					<input
						type="checkbox"
						checked={filters.remoteOnly}
						onChange={(e) => updateFilter("remoteOnly", e.target.checked)}
						className="h-4 w-4 rounded border-border bg-bg-card accent-accent"
						aria-label="Remote only"
					/>
					Remote only
				</label>

				{/* Seniority dropdown */}
				<select
					value={filters.seniority}
					onChange={(e) =>
						updateFilter(
							"seniority",
							e.target.value as Filters["seniority"],
						)
					}
					aria-label="Filter by seniority"
					className="rounded-lg border border-border bg-bg-card px-3 py-2 text-sm text-text transition-colors focus:border-accent focus:outline-none"
				>
					<option value="all">All levels</option>
					<option value="c-suite">C-Suite</option>
					<option value="vp">VP</option>
					<option value="director">Director</option>
				</select>

				{/* Recency tabs */}
				<div className="flex rounded-lg border border-border" role="group" aria-label="Filter by recency">
					{RECENCY_OPTIONS.map((opt) => (
						<button
							key={opt.value}
							type="button"
							onClick={() => updateFilter("recency", opt.value)}
							aria-pressed={filters.recency === opt.value}
							className={`px-3 py-1.5 text-sm transition-colors first:rounded-l-lg last:rounded-r-lg ${
								filters.recency === opt.value
									? "bg-accent text-bg font-medium"
									: "text-text-muted hover:text-text hover:bg-bg-elevated"
							}`}
						>
							{opt.label}
						</button>
					))}
				</div>

				{/* Source pills */}
				{sources.length > 1 && (
					<div className="flex flex-wrap gap-1.5">
						{sources.map((src) => (
							<button
								key={src}
								type="button"
								onClick={() =>
									updateFilter(
										"source",
										filters.source === src ? "" : src,
									)
								}
								aria-pressed={filters.source === src}
								className={`rounded-full px-2.5 py-1 text-xs transition-colors ${
									filters.source === src
										? "bg-accent text-bg font-medium"
										: "bg-surface text-text-muted hover:text-text"
								}`}
							>
								{src}
							</button>
						))}
					</div>
				)}

				{/* Clear filters */}
				{hasActiveFilters && (
					<button
						type="button"
						onClick={onClear}
						className="ml-auto text-sm text-text-muted transition-colors hover:text-accent"
					>
						Clear filters
					</button>
				)}
			</div>
		</div>
	);
}
