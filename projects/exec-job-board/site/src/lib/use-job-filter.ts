"use client";

import { useMemo, useState, useCallback } from "react";
import Fuse from "fuse.js";
import type { JobListing } from "./types";

export interface Filters {
	location: string;
	seniority: "all" | "c-suite" | "vp" | "director";
	recency: "all" | "24h" | "7d" | "30d";
	source: string;
	remoteOnly: boolean;
}

const DEFAULT_FILTERS: Filters = {
	location: "",
	seniority: "all",
	recency: "all",
	source: "",
	remoteOnly: false,
};

const PAGE_SIZE = 20;

const RECENCY_MS: Record<string, number> = {
	"24h": 24 * 60 * 60 * 1000,
	"7d": 7 * 24 * 60 * 60 * 1000,
	"30d": 30 * 24 * 60 * 60 * 1000,
};

export function useJobFilter(jobs: JobListing[]) {
	const [query, setQuery] = useState("");
	const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

	const fuse = useMemo(
		() =>
			new Fuse(jobs, {
				keys: ["title", "company", "tags", "description"],
				threshold: 0.3,
				includeScore: true,
			}),
		[jobs],
	);

	const filtered = useMemo(() => {
		const now = Date.now();

		let results: JobListing[];

		if (query.trim()) {
			results = fuse.search(query).map((r) => r.item);
		} else {
			results = [...jobs];
		}

		if (filters.remoteOnly) {
			results = results.filter(
				(j) => j.location.toLowerCase().includes("remote"),
			);
		}

		if (filters.location.trim()) {
			const loc = filters.location.toLowerCase();
			results = results.filter(
				(j) => j.location.toLowerCase().includes(loc),
			);
		}

		if (filters.seniority !== "all") {
			results = results.filter((j) => j.seniority === filters.seniority);
		}

		if (filters.recency !== "all") {
			const maxAge = RECENCY_MS[filters.recency];
			if (maxAge) {
				results = results.filter((j) => {
					if (!j.posted_at) return false;
					return now - new Date(j.posted_at).getTime() <= maxAge;
				});
			}
		}

		if (filters.source.trim()) {
			results = results.filter((j) => j.source === filters.source);
		}

		return results;
	}, [jobs, query, filters, fuse]);

	const totalResults = filtered.length;
	const results = filtered.slice(0, visibleCount);
	const hasMore = visibleCount < totalResults;

	const loadMore = useCallback(() => {
		setVisibleCount((prev) => prev + PAGE_SIZE);
	}, []);

	const clearFilters = useCallback(() => {
		setQuery("");
		setFilters(DEFAULT_FILTERS);
		setVisibleCount(PAGE_SIZE);
	}, []);

	return {
		results,
		query,
		setQuery,
		filters,
		setFilters,
		hasMore,
		loadMore,
		clearFilters,
		totalResults,
	};
}
