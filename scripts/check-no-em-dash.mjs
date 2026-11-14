#!/usr/bin/env node
// check-no-em-dash: the site serves zero em dashes (U+2014) or en dashes (U+2013).
//
// Scope is what a visitor can receive: message catalogs, app source (page copy, metadata, JSON-LD, manifest),
// and static public text. Code comments are skipped, they are never served. A dash in a title separator or
// a date range is rewritten, not exempted: use "|" in titles, ":" or "," in prose, "to" in ranges.
//
// ponytail: comment stripping is regex-based, not a parser. A `//` inside a string literal that is preceded by
// whitespace (not a URL scheme) would hide a dash on that line. Upgrade path: swap in the TypeScript scanner.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const DASHES = /[\u2013\u2014]|&mdash;|&ndash;|&#821[12];|&#x201[34];|\\u201[34]/i;
const ROOTS = [
	"apps/web/messages",
	"apps/web/src",
	"apps/web/public",
	"projects/exec-job-board/site/src",
];
const CODE = /\.(ts|tsx|mjs|js|css)$/;
const TEXT = /\.(json|svg|txt|xml|webmanifest|html)$/;

function* walk(dir) {
	let entries;
	try {
		entries = readdirSync(dir);
	} catch {
		return;
	}
	for (const name of entries) {
		if (name === "node_modules" || name === ".next") continue;
		const p = join(dir, name);
		if (statSync(p).isDirectory()) yield* walk(p);
		else if (CODE.test(name) || TEXT.test(name)) yield p;
	}
}

const stripComments = (src) =>
	src
		.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
		.replace(/(^|\s)\/\/.*$/gm, "$1");

const hits = [];
for (const root of ROOTS) {
	for (const file of walk(root)) {
		const raw = readFileSync(file, "utf8");
		const text = CODE.test(file) ? stripComments(raw) : raw;
		text.split("\n").forEach((line, i) => {
			if (DASHES.test(line)) hits.push(`${file}:${i + 1}: ${line.trim().slice(0, 120)}`);
		});
	}
}

if (hits.length) {
	console.error(
		`check-no-em-dash: ${hits.length} em/en dash(es) in served files. Rewrite the sentence, do not swap the glyph.`,
	);
	for (const h of hits) console.error(`  ${h}`);
	process.exit(1);
}
console.log("check-no-em-dash: 0 em/en dashes in served files");
