#!/usr/bin/env node
// Failing-fixture proof for check-public-repo-links.mjs; offline, fake lookups.
import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { collectRepoLinks, findNonPublic, githubLookup } from "./check-public-repo-links.mjs";

const dir = mkdtempSync(join(tmpdir(), "public-links-"));
mkdirSync(join(dir, "src"));
mkdirSync(join(dir, "src", "evidence"));
writeFileSync(
	join(dir, "src", "data.ts"),
	[
		'links: { source: "https://github.com/acme/open-tool" }',
		'links: { source: "https://github.com/acme/secret-recipes/tree/main/x" }',
		'links: { source: "https://github.com/acme/gone.git" }',
		'sameAs: ["https://github.com/acme"]',
	].join("\n"),
);
writeFileSync(join(dir, "src", "evidence", "old.md"), "https://github.com/acme/ignored");

const repos = collectRepoLinks([dir]);
assert.deepEqual(
	[...repos.keys()].sort(),
	["acme/gone", "acme/open-tool", "acme/secret-recipes"],
	"org-only links and evidence snapshots are not repositories to check",
);

const lookup = async (repo) => {
	if (repo === "acme/open-tool") return { status: 200, private: false };
	if (repo === "acme/secret-recipes") return { status: 200, private: true }; // token sees it
	if (repo === "acme/gone") return { status: 404 };
	throw new Error(`unexpected ${repo}`);
};
const failing = await findNonPublic(repos, lookup);
assert.deepEqual(failing.bad.map((b) => `${b.repo}:${b.why}`).sort(), [
	"acme/gone:not found or private",
	"acme/secret-recipes:private",
]);

const onlyPublic = await findNonPublic(new Map([["acme/open-tool", ["x"]]]), lookup);
assert.deepEqual(onlyPublic, { bad: [], warn: [] });

const outage = await findNonPublic(new Map([["acme/open-tool", ["x"]]]), async () => {
	throw new Error("network down");
});
assert.equal(outage.bad.length, 0, "an outage must not fail the gate");
assert.equal(outage.warn.length, 1);
const limited = await findNonPublic(new Map([["acme/open-tool", ["x"]]]), async () => ({
	status: 403,
}));
assert.equal(limited.bad.length, 0, "rate limiting must not fail the gate");

// Rate-limited API falls back to the visitor's view of github.com.
const reply = (status, body = {}) => ({ status, json: async () => body });
const asVisitor = (webStatus) => async (url) =>
	url.startsWith("https://api.github.com") ? reply(403) : reply(webStatus);
assert.deepEqual(await githubLookup("a/b", asVisitor(200)), { status: 200, private: false });
assert.deepEqual(await githubLookup("a/b", asVisitor(404)), { status: 404 });
assert.deepEqual(await githubLookup("a/b", async () => reply(200, { private: true })), {
	status: 200,
	private: true,
});

console.log("test-public-repo-links: ok");
