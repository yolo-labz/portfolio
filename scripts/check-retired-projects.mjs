// Retirement guard. Runs through `pnpm lint` (node --experimental-strip-types,
// so Node >= 22.6.0 — see package.json engines). It fails when a retired
// project (realestate-price-tracker, ai-document-processor) reappears in a
// publication, configuration or build surface, and when the published project
// claims stop matching the tree.
//
// Scanned whole-file, not by data key: the drift this exists for was prose
// ("three live demo apps" in the locale About copy, a repo-description string
// in scripts/), a decoded JSON escape and a config path — not a projects.ts
// slug. The walk skips archives (specs/, .specify/), dependencies and build
// output, and treats a file as text unless it carries a NUL byte.
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { projects } from "../apps/web/src/data/projects.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const read = (path) => readFileSync(`${root}/${path}`, "utf8");
const RETIRED = /ai-document-processor|ai-docs|realestate/i;
const RETAINED_PROJECTS = ["exec-job-board", "serverless-data-api"];
const LOCALES = ["en", "pt", "es"];
// Every retired term above is spelled out in this file; it is the one surface
// allowed to name them.
const SELF = "./scripts/check-retired-projects.mjs";
// Archives are history and dependencies/build output are not the repo.
const SKIP_DIRS = new Set([
	".git",
	".specify",
	"specs",
	"node_modules",
	".next",
	".turbo",
	".cache",
	".playwright",
	"coverage",
	"dist",
	"build",
	"playwright-report",
	"test-results",
]);
const MAX_TEXT_BYTES = 2 * 1024 * 1024;

// 1. Published data: no retired slug, no retired or unpublished demo host, and
//    the retained projects are still published.
assert(!projects.some((project) => RETIRED.test(project.slug)), "retired slug in projects.ts");
assert(
	!projects
		.flatMap((project) => Object.values(project.links))
		.some((url) => RETIRED.test(url ?? "") || /diploma-equivalence/i.test(url ?? "")),
	"retired or unpublished host in projects.ts links",
);
for (const slug of RETAINED_PROJECTS) {
	assert(
		projects.some((project) => project.slug === slug),
		`${slug} disappeared from projects.ts`,
	);
}

// 2. Locale messages: retired keys gone, the hero's demo-count claim equals the
//    number of published projects that ship a demo link, and no retired name
//    hides in a JSON escape that only appears once the file is decoded.
const messages = Object.fromEntries(
	LOCALES.map((locale) => [locale, JSON.parse(read(`apps/web/messages/${locale}.json`))]),
);
const demoCount = projects.filter((project) => project.links.demo).length;
for (const locale of LOCALES) {
	assert(!("realestate-price-tracker" in messages[locale].Projects), `${locale}: retired key`);
	assert(!("ai-document-processor" in messages[locale].Projects), `${locale}: retired key`);
	assert.equal(messages[locale].Hero.stats[1].value, demoCount, `${locale}: hero demo claim`);
	assert(
		!RETIRED.test(JSON.stringify(messages[locale])),
		`${locale}: retired project named in message copy`,
	);
}

// 3. Every other text surface in the repo, by content and by file name. The
//    walk is rooted at the repo, so a new directory is covered by default and
//    only the archive/dependency skips above are exempt.
const walk = (dir) =>
	readdirSync(`${root}/${dir}`, { withFileTypes: true }).flatMap((entry) => {
		const path = `${dir}/${entry.name}`;
		// `.git` is a directory in a clone and a file in a worktree, and its
		// content points at paths like .../portfolio-135-retire-realestate.
		if (entry.name === ".git") {
			return [];
		}
		if (entry.isDirectory()) {
			return SKIP_DIRS.has(entry.name) ? [] : walk(path);
		}
		if (path === SELF) {
			return [];
		}
		// Name check first: an empty or binary file named after a retired project
		// is still a publication leak, and the content filters below skip it.
		assert(!RETIRED.test(path), `${path} is named after a retired project`);
		const { size } = statSync(`${root}/${path}`);
		if (size === 0 || size > MAX_TEXT_BYTES) {
			return [];
		}
		const head = readFileSync(`${root}/${path}`).subarray(0, 8192);
		return head.includes(0) ? [] : [path];
	});

const surfaces = walk(".");
for (const path of surfaces) {
	assert(!RETIRED.test(read(path)), `${path} still names a retired project`);
}

// 4. Tree and published counts agree: one directory per retained project, no
//    retired directory, and every "N mixed-stack project..." claim in the
//    README matching the tree. Adding a project is expected to update those
//    claims (and RETAINED_PROJECTS above) in the same change.
const projectDirs = readdirSync(`${root}/projects`, { withFileTypes: true })
	.filter((entry) => entry.isDirectory())
	.map((entry) => entry.name);
for (const slug of RETAINED_PROJECTS) {
	assert(projectDirs.includes(slug), `${slug} disappeared from projects/`);
}
assert(!projectDirs.some((dir) => RETIRED.test(dir)), "retired directory in projects/");
const claimed = [...read("README.md").matchAll(/(\d+) mixed-stack project/g)].map((match) =>
	Number(match[1]),
);
assert(claimed.length > 0, "README no longer states a project count");
for (const count of claimed) {
	assert.equal(
		count,
		projectDirs.length,
		`README claims ${count} projects, projects/ holds ${projectDirs.length}`,
	);
}

console.log("PASS: retired publication/code absent; archives and retained sources intact");
