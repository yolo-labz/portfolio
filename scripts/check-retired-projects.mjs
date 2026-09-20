// Retirement guard. Runs through `pnpm lint` (node --experimental-strip-types,
// so Node >= 22.6.0 — see package.json engines). It fails when a retired
// project (realestate-price-tracker, ai-document-processor) reappears in a
// publication, configuration or build surface, and when the retained project
// set changes without the published claims following it.
//
// Scanned whole-file, not by data key: the drift this exists for was prose
// ("three live demo apps" in the locale About copy, a repo-description string
// in scripts/) and a config path, not a projects.ts slug.
// specs/ and .specify/ are archives and stay out of the scan on purpose.
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { projects } from "../apps/web/src/data/projects.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(`${root}/${path}`, "utf8");
const RETIRED = /ai-document-processor|ai-docs|realestate/i;
const RETAINED_PROJECTS = ["exec-job-board", "serverless-data-api"];
const LOCALES = ["en", "pt", "es"];
// Every retired term above is spelled out in this file; it is the one surface
// that is allowed to name them.
const SELF = "scripts/check-retired-projects.mjs";

// 1. Published data: no retired slug, no retired or unpublished demo host, and
//    the retained projects are still published.
assert(!projects.some((project) => RETIRED.test(project.slug)), "retired slug in projects.ts");
assert(
	!projects
		.flatMap((project) => Object.values(project.links))
		.some((url) => RETIRED.test(url ?? "") || /diploma-equivalence/i.test(url ?? "")),
	"retired or unpublished host in projects.ts links",
);
assert.deepEqual(
	projects
		.filter((project) => RETAINED_PROJECTS.includes(project.slug))
		.map((project) => project.slug)
		.sort(),
	[...RETAINED_PROJECTS].sort(),
	"a retained project disappeared from projects.ts",
);

// 2. Locale messages: retired case-study keys gone, and the hero's demo-count
//    claim equals the number of published projects that ship a demo link.
const messages = Object.fromEntries(
	LOCALES.map((locale) => [locale, JSON.parse(read(`apps/web/messages/${locale}.json`))]),
);
const demoCount = projects.filter((project) => project.links.demo).length;
for (const locale of LOCALES) {
	assert(!("realestate-price-tracker" in messages[locale].Projects), `${locale}: retired key`);
	assert(!("ai-document-processor" in messages[locale].Projects), `${locale}: retired key`);
	assert.equal(messages[locale].Hero.stats[1].value, demoCount, `${locale}: hero demo claim`);
}

// 3. Text surfaces, scanned whole. node_modules/build output are skipped; the
//    guard itself is the only file allowed to name the retired projects.
const TEXT = /\.(md|json|jsonc|ya?ml|ts|tsx|mjs|cjs|js|sh|svg|html|css|toml)$/;
const SKIP = new Set(["node_modules", ".next", ".turbo", "dist", "build", "test-results"]);
const walk = (dir) =>
	readdirSync(`${root}/${dir}`, { withFileTypes: true }).flatMap((entry) =>
		entry.isDirectory()
			? SKIP.has(entry.name)
				? []
				: walk(`${dir}/${entry.name}`)
			: TEXT.test(entry.name)
				? [`${dir}/${entry.name}`]
				: [],
	);
const SURFACES = [
	"README.md",
	"CLAUDE.md",
	"biome.json",
	"package.json",
	"Dockerfile.dokku",
	"pnpm-workspace.yaml",
	"pnpm-lock.yaml",
	...walk("apps/web"),
	...walk("packages/ui"),
	...walk("projects"),
	...walk("scripts"),
	...walk(".github/workflows"),
	...walk("docs/assets"),
	...walk("tests/visual"),
].filter((path) => path !== SELF);
for (const path of SURFACES) {
	assert(!RETIRED.test(read(path)), `${path} still names a retired project`);
}

// 4. Tree and archive: exactly one directory per retained project, and the
//    retired specs kept as history. A new project directory failing here is
//    the intended tripwire — update the published counts at the same time.
assert.deepEqual(
	readdirSync(`${root}/projects`, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.sort(),
	[...RETAINED_PROJECTS].sort(),
	"projects/ no longer matches the published project set",
);
for (const archive of ["specs/004-realestate-price-tracker", "specs/006-ai-document-processor"]) {
	assert(readdirSync(`${root}/${archive}`).length > 0, `${archive} archive disappeared`);
}

console.log("PASS: retired publication/code absent; archives and retained sources intact");
