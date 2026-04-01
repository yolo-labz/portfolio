"use client";

import { useMemo } from "react";
import type { JobListing } from "@/lib/types";
import { useJobFilter } from "@/lib/use-job-filter";
import { FilterBar } from "./filter-bar";
import { JobCard } from "./job-card";

export function JobBoard({ jobs }: { jobs: JobListing[] }) {
	const {
		results,
		query,
		setQuery,
		filters,
		setFilters,
		hasMore,
		loadMore,
		clearFilters,
		totalResults,
	} = useJobFilter(jobs);

	const sources = useMemo(() => {
		const set = new Set(jobs.map((j) => j.source));
		return Array.from(set).sort();
	}, [jobs]);

	return (
		<div>
			<FilterBar
				query={query}
				onQueryChange={setQuery}
				filters={filters}
				onFiltersChange={setFilters}
				onClear={clearFilters}
				sources={sources}
			/>

			<p className="mb-4 font-mono text-sm text-text-muted">
				Showing {results.length} of {totalResults} results
			</p>

			{results.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-xl border border-border bg-bg-card px-6 py-16 text-center">
					<p className="mb-2 text-lg text-text-muted">No listings match your criteria</p>
					<button
						type="button"
						onClick={clearFilters}
						className="text-sm text-accent transition-colors hover:text-accent-hover"
					>
						Clear all filters
					</button>
				</div>
			) : (
				<>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
						{results.map((job) => (
							<JobCard key={job.id} job={job} />
						))}
					</div>

					{hasMore && (
						<div className="mt-8 flex justify-center">
							<button
								type="button"
								onClick={loadMore}
								className="rounded-lg border border-border bg-bg-card px-6 py-2.5 text-sm font-medium text-text transition-colors hover:border-accent/40 hover:text-accent"
							>
								Load more
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
}
