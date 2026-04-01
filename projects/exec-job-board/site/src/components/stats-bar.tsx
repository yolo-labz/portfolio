import type { JobsData } from "@/lib/types";

function relativeTime(dateStr: string): string {
	const now = Date.now();
	const then = new Date(dateStr).getTime();
	const diffMs = now - then;

	const minutes = Math.floor(diffMs / 60_000);
	if (minutes < 1) return "just now";
	if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

	const days = Math.floor(hours / 24);
	if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;

	const months = Math.floor(days / 30);
	return `${months} month${months === 1 ? "" : "s"} ago`;
}

export function StatsBar({ meta }: { meta: JobsData["meta"] }) {
	const sourceCount = Object.keys(meta.sources).length;

	return (
		<div className="mb-8 font-mono text-sm text-text-muted">
			<span>{meta.total_jobs} executive roles</span>
			<span className="mx-2 text-border">&middot;</span>
			<span>
				{sourceCount} source{sourceCount === 1 ? "" : "s"}
			</span>
			<span className="mx-2 text-border">&middot;</span>
			<span>Updated {relativeTime(meta.last_updated)}</span>
		</div>
	);
}
