#!/usr/bin/env node
// voice-lint — mechanical gate against AI-tell prose in the message catalogs.
//
// Derived from the R8 portfolio voice spec (vault: PORTFOLIO-VOICE-SIGNATURE-2026-07-12.md)
// and the blog voice card (personal/blog/docs/voice.md). Two layers:
//   HARD (exit 1): unambiguous AI-slop that never belongs in this site's copy —
//     banned lexicon, participial-significance tails, copula avoidance,
//     "not only … but also", em-dash in prose strings.
//   SOFT (warn, exit 0): tic-overuse advisories — flat burstiness, anaphora,
//     negation-contrast density. Surfaced for the author; never fails CI.
//
// Em-dash policy: allowed only in data-ish fields (date ranges, meta titles,
// claim labels), never in prose. See DASH_EXEMPT below.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const FILES = ["en", "pt", "es"].map((l) => `apps/web/messages/${l}.json`);

// Keys whose values may carry a typographic em-dash (ranges, title separators, labels).
const DASH_EXEMPT = /(\.period$|\.metaTitle$|^About\.claims\.\d+$)/;

// EN-only banned lexicon (2026-active tells + model manner-words). Word-boundary, case-insensitive.
const BANNED_EN = [
	"delve",
	"delves",
	"tapestry",
	"realm",
	"beacon",
	"cornerstone",
	"testament to",
	"multifaceted",
	"holistic",
	"transformative",
	"groundbreaking",
	"seamless",
	"seamlessly",
	"meticulous",
	"pivotal",
	"navigate the landscape",
	"it's worth noting",
	"it is worth noting",
	"it's important to note",
	"it is important to note",
	"in today's",
	"at its core",
	"when it comes to",
	"in conclusion",
	"in summary",
	"furthermore and",
	"not only",
];

// Sentence-final analytical participle tails: ", …ing the/its/their …" at clause end.
const PARTICIPLE_TAIL =
	/,\s+(highlighting|underscoring|showcasing|emphasizing|reflecting|demonstrating|ensuring|solidifying|cementing)\b/i;

// Copula avoidance ("X serves as Y" instead of "X is Y").
const COPULA_AVOID = /\b(serves as|stands as|boasts)\b/i;

function walk(obj, path, out) {
	if (typeof obj === "string") {
		out.push([path, obj]);
	} else if (Array.isArray(obj)) {
		for (const [i, v] of obj.entries()) walk(v, `${path}.${i}`, out);
	} else if (obj && typeof obj === "object") {
		for (const [k, v] of Object.entries(obj)) walk(v, path ? `${path}.${k}` : k, out);
	}
}

function sentences(text) {
	return text
		.split(/(?<=[.!?])\s+/)
		.map((s) => s.trim())
		.filter((s) => s.split(/\s+/).length >= 2);
}

function cv(nums) {
	const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
	const variance = nums.reduce((a, b) => a + (b - mean) ** 2, 0) / nums.length;
	return mean === 0 ? 0 : Math.sqrt(variance) / mean;
}

let hardFails = 0;
let softWarns = 0;

for (const rel of FILES) {
	const lang = rel.match(/(\w+)\.json$/)[1];
	const data = JSON.parse(readFileSync(resolve(rel), "utf8"));
	const strings = [];
	walk(data, "", strings);

	for (const [path, text] of strings) {
		// HARD: em-dash in prose.
		if (text.includes("—") && !DASH_EXEMPT.test(path)) {
			console.error(`HARD ${lang} ${path}: em-dash in prose ("${text.slice(0, 60)}…")`);
			hardFails++;
		}

		if (lang === "en") {
			for (const term of BANNED_EN) {
				const re = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
				if (re.test(text)) {
					console.error(`HARD en ${path}: banned term "${term}"`);
					hardFails++;
				}
			}
			if (PARTICIPLE_TAIL.test(text)) {
				console.error(`HARD en ${path}: participial-significance tail`);
				hardFails++;
			}
			if (COPULA_AVOID.test(text)) {
				console.error(`HARD en ${path}: copula avoidance ("serves as"/"stands as"/"boasts")`);
				hardFails++;
			}
		}

		// SOFT: anaphora — 3+ consecutive sentences opening with the same word.
		const sents = sentences(text);
		if (sents.length >= 3) {
			for (let i = 0; i + 2 < sents.length; i++) {
				const heads = [i, i + 1, i + 2].map((j) => sents[j].split(/\s+/)[0].toLowerCase());
				if (heads[0] === heads[1] && heads[1] === heads[2]) {
					console.warn(`soft ${lang} ${path}: anaphora ("${heads[0]} …" x3)`);
					softWarns++;
					break;
				}
			}
		}

		// SOFT: flat burstiness — uniform sentence lengths in multi-sentence prose.
		if (sents.length >= 4) {
			const lens = sents.map((s) => s.split(/\s+/).length);
			const c = cv(lens);
			if (c < 0.35) {
				console.warn(
					`soft ${lang} ${path}: flat burstiness (CV ${c.toFixed(2)} over ${sents.length} sentences)`,
				);
				softWarns++;
			}
		}
	}
}

if (hardFails > 0) {
	console.error(`\nvoice-lint: ${hardFails} hard failure(s), ${softWarns} advisory warning(s).`);
	process.exit(1);
}
console.log(`voice-lint: clean (0 hard, ${softWarns} advisory warning(s)).`);
