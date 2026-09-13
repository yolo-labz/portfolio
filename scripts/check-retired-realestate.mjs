// Run: node --experimental-strip-types scripts/check-retired-realestate.mjs
import assert from "node:assert/strict";
import { projects } from "../apps/web/src/data/projects.ts";

assert(!projects.some((project) => project.slug === "realestate-price-tracker"));
assert(
	!projects.some((project) =>
		Object.values(project.links).some((url) =>
			url?.includes("realestate-tracker.home301server.com.br"),
		),
	),
);
assert(projects.some((project) => project.slug === "exec-job-board"));
assert(projects.some((project) => project.slug === "ai-document-processor"));
console.log("PASS: retired demo absent; adjacent projects retained");
