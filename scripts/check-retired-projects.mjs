// Retirement guard. Runs through `pnpm lint` (node --experimental-strip-types,
// so Node >= 22.6.0 — see package.json engines). It fails when a retired
// project (realestate-price-tracker, ai-document-processor) reappears in a
// publication, configuration or build surface, and when the published project
// claims stop matching the tree.
//
// Scanned whole-file, not by data key: the drift this exists for was prose
// ("three live demo apps" in the locale About copy, a repo-description string
// in scripts/), a decoded JSON escape and a config path — not a projects.ts
// slug.
//
// What a regex over this tree cannot decide: wording rendered inside images,
// text produced at runtime, and content in other repositories. Those stay a
// review/human concern; the guard is the cheap tripwire underneath them.
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { projects } from "../apps/web/src/data/projects.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const abs = (path) => `${root}/${path}`;
const read = (path) => readFileSync(abs(path), "utf8");
const RETIRED = /ai-document-processor|ai-docs|realestate/i;
const RETAINED_PROJECTS = ["exec-job-board", "serverless-data-api"];
const LOCALES = ["en", "pt", "es"];
// Every retired term above is spelled out in this file; it is the one surface
// allowed to name them.
const SELF = "./scripts/check-retired-projects.mjs";
// Archive roots are matched by full path, never by basename: a publication
// directory called "specs" or "build" must still be scanned.
const ARCHIVE_ROOTS = ["./.specify", "./specs"];
// Dependencies and caches — unambiguous by basename at any depth. Output dirs
// like dist/build/report are deliberately NOT exempt: a publication directory
// can carry that name, and skipping it by name hid a retired reference once.
const SKIP_DIRS = new Set([".git", "node_modules", ".next", ".turbo", ".cache", ".playwright"]);
// Binary carriers: a regex cannot read them, and scanning their bytes only
// produces noise. Everything else is read, whatever its extension.
const BINARY_FILE =
	/\.(png|jpe?g|gif|webp|avif|ico|icns|pdf|woff2?|ttf|otf|eot|zip|tar|t?gz|bz2|xz|7z|rar|mp[34]|mov|webm|wav|ogg|opus|flac|db|sqlite3?|wasm|so|dylib|dll|exe|bin|jar|class|pyc|lockb|core)$/i;
const MAX_TEXT_BYTES = 8 * 1024 * 1024;
const oversized = [];

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

// 3. Every other file in the repo, by name and by content. The walk is rooted
//    at the repo, so new directories are covered by default and only the
//    archive/dependency skips above are exempt.
const textOf = (path) => {
	const raw = readFileSync(abs(path));
	const utf8 = raw.toString("utf8");
	// UTF-16 content carries NUL bytes; decode it as such as well.
	return utf8.includes("\u0000") ? [utf8, raw.toString("utf16le")] : [utf8];
};

const walk = (dir) =>
	readdirSync(abs(dir), { withFileTypes: true }).flatMap((entry) => {
		const path = `${dir}/${entry.name}`;
		if (entry.isDirectory()) {
			if (ARCHIVE_ROOTS.includes(path) || SKIP_DIRS.has(entry.name)) {
				return [];
			}
			return walk(path);
		}
		// `.git` is a directory in a clone and a text file in a worktree, whose
		// content points at a path like .../portfolio-135-retire-realestate.
		if (path === SELF || entry.name === ".git") {
			return [];
		}
		// Name check before every content filter: a binary, empty or oversized
		// file named after a retired project is still a publication leak.
		assert(!RETIRED.test(path), `${path} is named after a retired project`);
		if (BINARY_FILE.test(entry.name)) {
			return [];
		}
		const { size } = statSync(abs(path));
		if (size === 0) {
			return [];
		}
		if (size > MAX_TEXT_BYTES) {
			oversized.push(path);
			return [];
		}
		return [path];
	});

for (const path of walk(".")) {
	assert(!textOf(path).some((text) => RETIRED.test(text)), `${path} still names a retired project`);
}

// 4. Tree, archive and published counts agree: one directory per retained
//    project, both retired specs kept as history, and every
//    "N mixed-stack project..." claim in the README matching the tree. Adding a
//    project is expected to update those claims (and RETAINED_PROJECTS above)
//    in the same change; adding a claim is expected to keep it true.
const projectDirs = readdirSync(abs("projects"), { withFileTypes: true })
	.filter((entry) => entry.isDirectory())
	.map((entry) => entry.name);
for (const slug of RETAINED_PROJECTS) {
	assert(projectDirs.includes(slug), `${slug} disappeared from projects/`);
}
assert(!projectDirs.some((dir) => RETIRED.test(dir)), "retired directory in projects/");
for (const archive of ["specs/004-realestate-price-tracker", "specs/006-ai-document-processor"]) {
	assert(readdirSync(abs(archive)).length > 0, `${archive} archive disappeared`);
}
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

for (const path of oversized) {
	console.warn(`warning: ${path} is over ${MAX_TEXT_BYTES} bytes and was not scanned`);
}
console.log("PASS: retired publication/code absent; archives and retained sources intact");
