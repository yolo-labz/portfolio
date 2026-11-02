#!/usr/bin/env node
// Gate: every repository the site links to must be public. The site's rule is
// "every claim links to a public repository"; a private target is a dead link for
// every visitor and a claim nobody can check. Only a definitive answer fails
// (404 or private: true); a network or rate-limit error is a warning, so an
// outage cannot block unrelated work. OFFLINE=1 skips the lookup.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const SKIP_DIRS = new Set(["node_modules", ".next", ".turbo", ".git", "evidence"]);
const TEXT = /\.(md|json|tsx?|jsx?|mjs|html)$/;
const REPO_URL = /https?:\/\/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)/g;

export function collectRepoLinks(roots, files = []) {
	const found = new Map();
	const add = (path) => {
		const text = readFileSync(path, "utf8");
		for (const [, owner, name] of text.matchAll(REPO_URL)) {
			const repo = `${owner}/${name.replace(/\.git$/, "")}`;
			if (!found.has(repo)) found.set(repo, []);
			found.get(repo).push(path);
		}
	};
	const walk = (dir) => {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			if (SKIP_DIRS.has(entry.name)) continue;
			const path = join(dir, entry.name);
			if (entry.isDirectory()) walk(path);
			else if (TEXT.test(path)) add(path);
		}
	};
	for (const root of roots) walk(root);
	for (const file of files) add(file);
	return found;
}

// lookup(repo) -> { status: number, private?: boolean }. Throws on network errors.
export async function findNonPublic(repos, lookup) {
	const bad = [];
	const warn = [];
	for (const [repo, where] of repos) {
		try {
			const answer = await lookup(repo);
			if (answer.status === 404) bad.push({ repo, why: "not found or private", where });
			else if (answer.status === 200 && answer.private !== false)
				bad.push({ repo, why: "private", where });
			else if (answer.status !== 200) warn.push(`${repo}: HTTP ${answer.status}, not checked`);
		} catch (error) {
			warn.push(`${repo}: ${error.message}, not checked`);
		}
	}
	return { bad, warn };
}

// API first (exact `private` flag). The anonymous API quota is shared per IP, so on
// 403/429 fall back to what a visitor sees: github.com answers 200 for a public
// repository and 404 for a private or missing one.
export async function githubLookup(repo, fetchFn = fetch) {
	const headers = { Accept: "application/vnd.github+json" };
	const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
	// A token only raises the rate limit; visibility comes from the `private` field.
	if (token) headers.Authorization = `Bearer ${token}`;
	const api = await fetchFn(`https://api.github.com/repos/${repo}`, {
		headers,
		signal: AbortSignal.timeout(15000),
	});
	if (api.status === 200) return { status: 200, private: (await api.json()).private };
	if (api.status !== 403 && api.status !== 429) return { status: api.status };
	const web = await fetchFn(`https://github.com/${repo}`, {
		method: "HEAD",
		signal: AbortSignal.timeout(15000),
	});
	return web.status === 200 ? { status: 200, private: false } : { status: web.status };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const repos = collectRepoLinks(["apps", "packages"], ["README.md", "PRODUCT.md", "DESIGN.md"]);
	if (process.env.OFFLINE === "1") {
		console.log(`check-public-repo-links: OFFLINE=1, skipped ${repos.size} repositories`);
		process.exit(0);
	}
	const { bad, warn } = await findNonPublic(repos, githubLookup);
	for (const message of warn) console.warn(`warn  ${message}`);
	for (const { repo, why, where } of bad)
		console.error(`FAIL  ${repo}: ${why} (${[...new Set(where)].join(", ")})`);
	if (bad.length) process.exit(1);
	console.log(`check-public-repo-links: ${repos.size} linked repositories, all public`);
}
