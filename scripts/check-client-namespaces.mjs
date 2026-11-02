#!/usr/bin/env node
// Guard for the trimmed client catalogue (apps/web/src/i18n/client-messages.ts).
//
// Every `"use client"` module that calls `useTranslations("<ns>")` needs <ns> in
// CLIENT_NAMESPACES, otherwise that component renders the missing-key marker in
// the browser while everything looks fine server-side. Fail the lint instead of
// finding out from a screenshot.
//
// Zero dependencies: reads the two sources as text. Run from the repo root.

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SRC = "apps/web/src";
const CATALOGUE = join(SRC, "i18n/client-messages.ts");

function walk(dir) {
	const out = [];
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) out.push(...walk(full));
		else if (/\.(tsx?|mts)$/.test(entry)) out.push(full);
	}
	return out;
}

const catalogue = readFileSync(CATALOGUE, "utf8");
const listMatch = catalogue.match(/CLIENT_NAMESPACES\s*=\s*\[([^\]]*)\]/);
if (!listMatch) {
	console.error(`client-namespaces: cannot find CLIENT_NAMESPACES in ${CATALOGUE}`);
	process.exit(1);
}
const allowed = new Set([...listMatch[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]));

const problems = [];
const clientNamespaces = new Map();
for (const file of walk(SRC)) {
	const source = readFileSync(file, "utf8");
	const isClient = /^\s*["']use client["'];?/m.test(source);
	if (!isClient) continue;
	for (const match of source.matchAll(/useTranslations\(\s*"([^"]+)"\s*\)/g)) {
		const ns = match[1];
		clientNamespaces.set(ns, [...(clientNamespaces.get(ns) ?? []), relative(SRC, file)]);
		if (!allowed.has(ns))
			problems.push(
				`${relative(SRC, file)}: "${ns}" is used on the client but not in CLIENT_NAMESPACES`,
			);
	}
}

// A namespace listed in the catalogue that no client module reads is dead weight
// in every response; report it so the list cannot rot in the other direction.
for (const ns of allowed) {
	if (!clientNamespaces.has(ns))
		problems.push(
			`CLIENT_NAMESPACES lists "${ns}" but no "use client" module calls useTranslations("${ns}")`,
		);
}

const used = [...clientNamespaces.keys()].sort();
if (problems.length) {
	console.error("client-namespaces: FAIL");
	for (const p of problems) console.error(`  ${p}`);
	process.exit(1);
}
console.log(
	`client-namespaces: PASS (client reads ${used.map((n) => `"${n}"`).join(", ")}; catalogue ships those only)`,
);
