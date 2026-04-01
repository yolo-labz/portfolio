"use client";

import { getExportUrl } from "@/lib/api";
import type { Filters } from "@/lib/types";

export function ExportButtons({ filters }: { filters: Partial<Filters> }) {
	const handleExport = (format: "csv" | "json") => {
		window.open(getExportUrl(format, filters));
	};

	return (
		<div className="flex gap-3">
			<button
				type="button"
				onClick={() => handleExport("csv")}
				className="rounded-md border border-border px-4 py-2 text-sm text-text-muted hover:text-accent hover:border-accent transition-colors font-mono"
			>
				Export CSV
			</button>
			<button
				type="button"
				onClick={() => handleExport("json")}
				className="rounded-md border border-border px-4 py-2 text-sm text-text-muted hover:text-accent hover:border-accent transition-colors font-mono"
			>
				Export JSON
			</button>
		</div>
	);
}
