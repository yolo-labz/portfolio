#!/usr/bin/env node
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { projects } from "../apps/web/src/data/projects.ts";

// ponytail: inspect publishable source, not historical specs or binary pixels.
// Browser assertions and regenerated screenshots cover the rendered surface.
const retired = /real[ -]?estate|realestate-tracker\.home301server\.com\.br/i;
function check(path) {
	assert(!retired.test(path), `Retired path: ${path}`);
	const text = readFileSync(path, "utf8");
	const decoded = path.endsWith(".json") ? JSON.stringify(JSON.parse(text)) : text;
	assert(!retired.test(decoded), `Retired public/build reference: ${path}`);
}
function walk(dir) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		if (["node_modules", ".next", ".turbo", "__pycache__", ".venv"].includes(entry.name)) continue;
		const path = join(dir, entry.name);
		assert(!retired.test(path), `Retired path: ${path}`);
		if (entry.isDirectory()) walk(path);
		else if (/\.(md|json|tsx?|jsx?|mjs|html|svg|ya?ml|py|toml)$/.test(path)) check(path);
	}
}
for (const dir of ["apps", "packages", "projects"]) walk(dir);
for (const path of [
	"README.md",
	"CLAUDE.md",
	"Dockerfile.dokku",
	"pnpm-workspace.yaml",
	"pnpm-lock.yaml",
	"docs/assets/hero-dark.svg",
	"docs/assets/hero-light.svg",
])
	check(path);

for (const slug of ["ai-document-processor", "exec-job-board", "serverless-data-api"]) {
	assert(
		projects.some((project) => project.slug === slug),
		`Missing retained project: ${slug}`,
	);
	assert(existsSync(`projects/${slug}/package.json`), `Missing retained workspace: ${slug}`);
}
assert(
	existsSync("specs/004-realestate-price-tracker/spec.md"),
	"Preserve historical specification",
);
assert(!existsSync("projects/realestate-price-tracker/package.json"), "Retired workspace restored");
for (const locale of ["en", "pt", "es"]) {
	const messages = JSON.parse(readFileSync(`apps/web/messages/${locale}.json`, "utf8"));
	for (const project of projects)
		assert(messages.Projects[project.slug], `${locale}: ${project.slug}`);
	assert.equal(messages.Hero.stats[1].value, 2, `${locale}: demo count`);
	assert(
		!/live demo apps|demonstração ao vivo|demo en vivo/i.test(
			JSON.stringify([messages.Hero.stats[1], messages.About.summary]),
		),
		`${locale}: unverified live-demo promise`,
	);
}
console.log("retirement: PASS (public source, build references, locales, retained projects)");
