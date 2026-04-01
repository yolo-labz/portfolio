import fs from "node:fs";
import path from "node:path";
import type { JobsData } from "@/lib/types";

function escapeXml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

function loadJobs(): JobsData {
	const candidates = [
		path.join(process.cwd(), "data"),
		path.join(process.cwd(), "..", "data"),
		path.join(process.cwd(), "projects", "exec-job-board", "data"),
	];

	for (const dataDir of candidates) {
		for (const file of ["jobs.json", "seed.json"]) {
			const p = path.join(dataDir, file);
			if (fs.existsSync(p)) {
				return JSON.parse(fs.readFileSync(p, "utf-8")) as JobsData;
			}
		}
	}

	return { meta: { last_updated: new Date().toISOString(), total_jobs: 0, sources: {} }, jobs: [] };
}

export function GET() {
	const data = loadJobs();

	const recent = [...data.jobs]
		.sort((a, b) => {
			const da = a.posted_at ? new Date(a.posted_at).getTime() : 0;
			const db = b.posted_at ? new Date(b.posted_at).getTime() : 0;
			return db - da;
		})
		.slice(0, 50);

	const items = recent
		.map(
			(job) => `
		<item>
			<title>${escapeXml(job.title)} at ${escapeXml(job.company)}</title>
			<link>${escapeXml(job.url)}</link>
			<guid isPermaLink="false">${escapeXml(job.id)}</guid>
			<pubDate>${job.posted_at ? new Date(job.posted_at).toUTCString() : ""}</pubDate>
			<description>${escapeXml(
				[
					job.location,
					job.salary_min && job.salary_max
						? `$${Math.round(job.salary_min / 1000)}k - $${Math.round(job.salary_max / 1000)}k`
						: null,
					job.description,
				]
					.filter(Boolean)
					.join(" | "),
			)}</description>
			<category>${escapeXml(job.seniority)}</category>
			<source url="${escapeXml(job.url)}">${escapeXml(job.source)}</source>
		</item>`,
		)
		.join("\n");

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Executive Job Board</title>
		<description>Curated executive and leadership job listings</description>
		<link>https://exec-jobs.example.com</link>
		<atom:link href="https://exec-jobs.example.com/feed.xml" rel="self" type="application/rss+xml"/>
		<lastBuildDate>${new Date(data.meta.last_updated).toUTCString()}</lastBuildDate>
		${items}
	</channel>
</rss>`;

	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml",
			"Cache-Control": "public, max-age=3600",
		},
	});
}
