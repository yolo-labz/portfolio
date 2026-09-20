// Run: node --experimental-strip-types scripts/check-retired-projects.mjs
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { projects } from "../apps/web/src/data/projects.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(`${root}/${path}`, "utf8");
const projectLinks = projects.flatMap((project) => Object.values(project.links));
const demoSlugs = projects.filter((project) => project.links.demo).map((project) => project.slug);

assert.deepEqual(demoSlugs, ["exec-job-board"]);
assert(!projects.some((project) => project.slug === "realestate-price-tracker"));
assert(!projects.some((project) => project.slug === "ai-document-processor"));
assert(
	!projectLinks.some((url) => /realestate-tracker|ai-docs|diploma-equivalence/i.test(url ?? "")),
);

assert(!existsSync(`${root}/projects/realestate-price-tracker`));
assert(existsSync(`${root}/specs/004-realestate-price-tracker/spec.md`));
assert(!read("Dockerfile.dokku").includes("projects/realestate-price-tracker"));
assert(!read("pnpm-lock.yaml").includes("projects/realestate-price-tracker"));
// Publication + config surfaces must stop naming a retired project. These were
// the drift points left behind when the implementation was deleted last: a
// dangling Biome override, a stale CI comment and README count claims.
const RETIRED = /ai-document-processor|ai-docs|realestate/i;
for (const path of ["README.md", "CLAUDE.md", "biome.json"]) {
	assert(!RETIRED.test(read(path)), `${path} still names a retired project`);
}
// One retained subfolder per project claim, so README counts cannot drift.
assert.equal(readdirSync(`${root}/projects`).length, 2);
for (const hero of ["hero-dark.svg", "hero-light.svg"]) {
	assert(!RETIRED.test(read(`docs/assets/${hero}`)), `${hero} still names a retired project`);
}

assert(!existsSync(`${root}/projects/ai-document-processor`));
assert(!read("Dockerfile.dokku").includes("projects/ai-document-processor"));
assert(!read("pnpm-lock.yaml").includes("projects/ai-document-processor"));

for (const locale of ["en", "pt", "es"]) {
	const messages = JSON.parse(read(`apps/web/messages/${locale}.json`));
	assert(!("realestate-price-tracker" in messages.Projects));
	assert(!("ai-document-processor" in messages.Projects));
	assert.equal(messages.Hero.stats[1].value, 1);
}

assert(projects.some((project) => project.slug === "exec-job-board"));
assert(projects.some((project) => project.slug === "serverless-data-api"));
console.log("PASS: retired publication/code absent; archives and adjacent source retained");
