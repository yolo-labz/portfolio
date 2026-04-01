import type { JobListing } from "@/lib/types";

function relativeTime(dateStr: string | null): string {
	if (!dateStr) return "Date unknown";
	const now = Date.now();
	const then = new Date(dateStr).getTime();
	const diffMs = now - then;

	const minutes = Math.floor(diffMs / 60_000);
	if (minutes < 1) return "just now";
	if (minutes < 60) return `${minutes}m ago`;

	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;

	const days = Math.floor(hours / 24);
	if (days < 30) return `${days}d ago`;

	const months = Math.floor(days / 30);
	return `${months}mo ago`;
}

function formatSalary(min: number | null, max: number | null, currency: string): string {
	if (min === null && max === null) return "Salary not disclosed";

	const fmt = (n: number) => {
		if (n >= 1000) return `$${Math.round(n / 1000)}k`;
		return `$${n}`;
	};

	if (min !== null && max !== null) {
		return `${fmt(min)} \u2013 ${fmt(max)} ${currency}`;
	}
	if (min !== null) return `From ${fmt(min)} ${currency}`;
	return `Up to ${fmt(max!)} ${currency}`;
}

const SENIORITY_STYLES: Record<string, string> = {
	"c-suite": "bg-accent/15 text-accent",
	vp: "bg-badge-vp/15 text-badge-vp",
	director: "bg-badge-director/15 text-badge-director",
};

export function JobCard({ job }: { job: JobListing }) {
	const seniorityStyle = SENIORITY_STYLES[job.seniority] ?? "bg-surface text-text-muted";
	const salaryStr = formatSalary(job.salary_min, job.salary_max, job.salary_currency);
	const hasSalary = job.salary_min !== null || job.salary_max !== null;

	return (
		<a
			href={job.url}
			target="_blank"
			rel="noopener noreferrer"
			className="group block rounded-xl border border-border bg-bg-card p-5 transition-all hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5"
		>
			<div className="mb-3 flex items-start justify-between gap-3">
				<h3 className="text-lg font-semibold leading-snug text-text group-hover:text-accent transition-colors">
					{job.title}
				</h3>
				<svg
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="mt-1 shrink-0 text-text-muted opacity-0 transition-opacity group-hover:opacity-100"
					aria-hidden="true"
				>
					<path d="M7 17L17 7" />
					<path d="M7 7h10v10" />
				</svg>
			</div>

			<p className="mb-2 text-sm font-medium text-accent">{job.company}</p>

			<div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-muted">
				<span className="inline-flex items-center gap-1">
					<span aria-hidden="true">&#x1F4CD;</span>
					{job.location}
				</span>
				<span>{relativeTime(job.posted_at)}</span>
			</div>

			<p className={`mb-4 text-sm ${hasSalary ? "text-text" : "text-text-muted italic"}`}>
				{salaryStr}
			</p>

			<div className="flex flex-wrap items-center gap-2">
				<span
					className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${seniorityStyle}`}
				>
					{job.seniority === "c-suite"
						? "C-Suite"
						: job.seniority === "vp"
							? "VP"
							: job.seniority === "director"
								? "Director"
								: job.seniority}
				</span>
				<span className="inline-block rounded-full bg-surface px-2.5 py-0.5 text-xs text-text-muted">
					{job.source}
				</span>
			</div>

			{job.source === "adzuna" && (
				<p className="mt-3 text-[10px] text-text-muted/60">
					Powered by Adzuna
				</p>
			)}
		</a>
	);
}
