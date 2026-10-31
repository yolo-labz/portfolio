#!/usr/bin/env node
// Mutation checks run in an isolated fixture, never against the working tree.
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const fixture = mkdtempSync(join(tmpdir(), "portfolio-retirement-"));
const files = execFileSync("git", ["ls-files", "-c", "-o", "--exclude-standard"], {
	encoding: "utf8",
})
	.trim()
	.split("\n")
	.filter(
		(path) =>
			/^(apps\/web\/(src\/data\/projects.ts|messages\/)|projects\/.*\/package.json$|specs\/004-.*\/spec.md$)/.test(
				path,
			) ||
			[
				"README.md",
				"CLAUDE.md",
				"Dockerfile.dokku",
				"pnpm-workspace.yaml",
				"pnpm-lock.yaml",
				"docs/assets/hero-dark.svg",
				"docs/assets/hero-light.svg",
				"scripts/check-retirement.mjs",
			].includes(path),
	);
try {
	for (const path of files) {
		mkdirSync(dirname(join(fixture, path)), { recursive: true });
		cpSync(path, join(fixture, path));
	}
	mkdirSync(join(fixture, "packages"));
	function run() {
		return spawnSync(
			process.execPath,
			["--experimental-strip-types", "scripts/check-retirement.mjs"],
			{ cwd: fixture, encoding: "utf8" },
		);
	}
	assert.equal(run().status, 0, "Clean fixture must pass");
	for (const [path, change] of [
		["README.md", (s) => `${s}\n[Live demo](https://realestate-tracker.home301server.com.br)\n`],
		["apps/web/messages/pt.json", (s) => s.replace('"value": 2', '"value": 3')],
		[
			"apps/web/messages/en.json",
			(s) => s.replace('"Nav": {', '"retired": "realestate-price-tracker", "Nav": {'),
		],
		[
			"apps/web/src/data/projects.ts",
			(s) => s.replace('slug: "ai-document-processor"', 'slug: "removed-project"'),
		],
		["Dockerfile.dokku", (s) => `${s}\nCOPY projects/realestate-price-tracker/package.json ./\n`],
	]) {
		const target = join(fixture, path);
		const original = readFileSync(target, "utf8");
		writeFileSync(target, change(original));
		assert.equal(run().status, 1, `Guard must reject mutation: ${path}`);
		writeFileSync(target, original);
		console.log(`Rejected regression: ${path}`);
	}
	assert.equal(run().status, 0, "Restored fixture must pass");
	console.log("retirement mutation tests: 5 rejected, clean fixture passes");
} finally {
	rmSync(fixture, { recursive: true, force: true });
}
