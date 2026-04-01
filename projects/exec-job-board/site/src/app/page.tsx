import fs from "node:fs";
import path from "node:path";
import { JobBoard } from "@/components/job-board";
import { StatsBar } from "@/components/stats-bar";
import type { JobsData } from "@/lib/types";

function loadJobs(): JobsData {
	// Try multiple possible locations for the data directory
	const candidates = [
		path.join(process.cwd(), "data"), // monorepo: projects/exec-job-board/data
		path.join(process.cwd(), "..", "data"), // site/ subdirectory context
		path.join(process.cwd(), "projects", "exec-job-board", "data"), // monorepo root
	];

	for (const dataDir of candidates) {
		const primaryPath = path.join(dataDir, "jobs.json");
		if (fs.existsSync(primaryPath)) {
			return JSON.parse(fs.readFileSync(primaryPath, "utf-8")) as JobsData;
		}
		const seedPath = path.join(dataDir, "seed.json");
		if (fs.existsSync(seedPath)) {
			return JSON.parse(fs.readFileSync(seedPath, "utf-8")) as JobsData;
		}
	}

	// Absolute fallback: empty dataset
	return { meta: { last_updated: new Date().toISOString(), total_jobs: 0, sources: {} }, jobs: [] };
}

export default function HomePage() {
	const data = loadJobs();

	return (
		<>
			<StatsBar meta={data.meta} />
			<JobBoard jobs={data.jobs} />
		</>
	);
}
