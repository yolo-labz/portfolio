import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";
import { verifyReport } from "../scripts/finalize-proof.mjs";
import {
	assertBytes,
	boundFile,
	containedFile,
	inspectSource,
	inventoryTree,
	LOCALES,
	PINS,
	PROJECTS,
	preflight,
	sha256,
	svgRatio,
	validateManifest,
	validatePublicPath,
} from "../scripts/preflight.mjs";
import { createRunRecord } from "../scripts/prepare-run.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const temporary = mkdtempSync(path.join(root, ".synthetic-validator-"));
after(() => rmSync(temporary, { recursive: true, force: true }));
const seed = JSON.parse(readFileSync(path.join(root, "candidate-manifest.required.json"), "utf8"));
const syntheticBytes = Buffer.from("SYNTHETIC_VALIDATOR_BYTES_ONLY_NOT_A_BRAND_ASSET\n");
const hasCode = (code) => (error) => error.code === code;

test("production URL policy: rejects literal and escaped ASCII controls and spaces", () => {
	for (let code = 0; code <= 32; code += 1) {
		const escaped = `%${code.toString(16).padStart(2, "0")}`;
		for (const value of [String.fromCharCode(code), escaped]) {
			assert.throws(
				() => validatePublicPath(`/asset${value}name.svg`),
				hasCode("INVALID_PUBLIC_PATH"),
			);
		}
	}
});

test("synthetic inventory: hashes a file across multiple read buffers", () => {
	const folder = path.join(temporary, "multi-buffer-inventory");
	mkdirSync(folder);
	const bytes = Buffer.alloc(131089, 0x51);
	bytes[65535] = 0x01;
	bytes[65536] = 0x02;
	bytes[131088] = 0x03;
	writeFileSync(path.join(folder, "synthetic.bytes"), bytes);
	const tree = inventoryTree(folder);
	assert.equal(tree.bytes, bytes.length);
	assert.equal(tree.inventory[0].sha256, sha256(bytes));
});

test("production: unrecovered manifest fails closed with named missing inputs", () => {
	assert.throws(
		() => preflight(path.join(root, "candidate-manifest.required.json")),
		(error) =>
			error.code === "MISSING_INPUTS" &&
			["source.commit", "hero.sourcePath", "hero.publicPath", "build.treeSha256"].every((field) =>
				error.details.missing.includes(field),
			),
	);
});

test("production: expected current pin cannot be replaced with an old candidate hash", () => {
	const changed = structuredClone(seed);
	changed.expected.commonSvgSha256 =
		"a5acd648de2ca28c7422935f758483cc1d49be2bfe365c80809226c40219e609";
	assert.throws(() => validateManifest(changed), hasCode("PIN_MISMATCH"));
});

test("production: this technical companion cannot claim founder approval", () => {
	const changed = structuredClone(seed);
	changed.founderApproved = true;
	assert.throws(() => validateManifest(changed), hasCode("INVALID_ACCEPTANCE_SCOPE"));
});

test("synthetic helper: exact labelled bytes satisfy generic file binding", () => {
	writeFileSync(path.join(temporary, "synthetic.bytes"), syntheticBytes);
	assert.equal(
		boundFile(temporary, "synthetic.bytes", sha256(syntheticBytes), "synthetic fixture").sha256,
		sha256(syntheticBytes),
	);
});

test("synthetic helper: changed bytes fail their previous identity", () => {
	assert.throws(
		() =>
			assertBytes(
				Buffer.concat([syntheticBytes, Buffer.from("changed")]),
				sha256(syntheticBytes),
				"synthetic fixture",
			),
		hasCode("IDENTITY_MISMATCH"),
	);
});

test("synthetic lifecycle helper: creates one run and rejects any directory reuse", () => {
	const folder = path.join(temporary, "synthetic-run-record");
	const record = createRunRecord(folder, {
		status: "synthetic_validator_only",
		runtimeExecuted: false,
	});
	const firstBytes = readFileSync(path.join(folder, "preflight.json"));
	assert.equal(JSON.parse(firstBytes).runId, record.runId);
	assert.throws(
		() => createRunRecord(folder, { status: "synthetic_second_attempt" }),
		hasCode("PROOF_DIRECTORY_EXISTS"),
	);
	assert.deepEqual(readFileSync(path.join(folder, "preflight.json")), firstBytes);
});

for (const [name, expectedOwnHash, expectedCandidate] of [
	[
		"obsolete_portfolio_pr236_svg",
		"a5acd648de2ca28c7422935f758483cc1d49be2bfe365c80809226c40219e609",
		PINS.commonSvgSha256,
	],
	[
		"obsolete_org_pr73_svg",
		"a53011e8754692653294a7476db7363ba43c3f4f6524e70a5989d3c359bf77db",
		PINS.commonSvgSha256,
	],
	[
		"obsolete_portfolio_pr236_ico",
		"45d2a5b047f5bb831ae6b74235ba9e58a4405d9f6c6b7dd70b8e2db1502d5a1a",
		PINS.correctedIcoSha256,
	],
]) {
	test(`real obsolete input: ${name} has recorded identity and is rejected`, () => {
		const bytes = readFileSync(path.join(root, "fixtures", `${name}.bytes`));
		assert.equal(sha256(bytes), expectedOwnHash);
		assert.throws(() => assertBytes(bytes, expectedCandidate, name), hasCode("IDENTITY_MISMATCH"));
	});
}

test("synthetic helper: path traversal and absolute paths cannot escape bindings", () => {
	for (const value of ["../outside", "/etc/passwd", "nested/../file", "./file", "a\\b"]) {
		assert.throws(() => containedFile(temporary, value), hasCode("PATH_ESCAPE"));
	}
});

test("synthetic helper: contained binding rejects an escaping symlink", () => {
	const base = path.join(temporary, "binding-root");
	mkdirSync(base);
	symlinkSync("../synthetic.bytes", path.join(base, "escape"));
	assert.throws(() => containedFile(base, "escape"), hasCode("PATH_ESCAPE"));
});

test("synthetic helper: immutable tree inventory is stable and detects changed bytes", () => {
	const base = path.join(temporary, "build-root");
	mkdirSync(base);
	writeFileSync(path.join(base, "synthetic.bytes"), syntheticBytes);
	const first = inventoryTree(base);
	assert.equal(inventoryTree(base).sha256, first.sha256);
	writeFileSync(path.join(base, "synthetic.bytes"), Buffer.from("SYNTHETIC_CHANGED_BYTES\n"));
	assert.notEqual(inventoryTree(base).sha256, first.sha256);
});

test("synthetic helper: immutable tree inventory rejects escaping symlinks", () => {
	const base = path.join(temporary, "escape-build-root");
	mkdirSync(base);
	symlinkSync("../synthetic.bytes", path.join(base, "escape"));
	assert.throws(() => inventoryTree(base), hasCode("PATH_ESCAPE"));
});

test("production URL policy: accepts a local path and rejects traversal or remote URLs", () => {
	assert.equal(validatePublicPath("/known/example.svg"), "/known/example.svg");
	for (const value of [
		"https://example.org/x",
		"//example.org/x",
		"/a/../b",
		"/%2e%2e/x",
		"/a?b",
		"/a#b",
	]) {
		assert.throws(() => validatePublicPath(value), hasCode("INVALID_PUBLIC_PATH"));
	}
});

test("geometry helper: reads the obsolete source viewBox without accepting its identity", () => {
	const bytes = readFileSync(path.join(root, "fixtures/obsolete_portfolio_pr236_svg.bytes"));
	assert.equal(svgRatio(bytes), 1265.8 / 1181.8);
});

test("synthetic Git fixture: source binding rejects wrong HEAD and tracked edits", () => {
	const repo = path.join(temporary, "synthetic-git");
	mkdirSync(repo);
	const git = (...args) =>
		execFileSync("git", ["-C", repo, ...args], {
			encoding: "utf8",
			stdio: ["ignore", "pipe", "pipe"],
		}).trim();
	git("init", "--quiet");
	writeFileSync(path.join(repo, "synthetic.bytes"), syntheticBytes);
	git("add", "synthetic.bytes");
	git(
		"-c",
		"user.name=Synthetic Validator Fixture",
		"-c",
		"user.email=synthetic-fixture@example.invalid",
		"commit",
		"--quiet",
		"-m",
		"Synthetic validator fixture only",
	);
	const commit = git("rev-parse", "HEAD");
	assert.equal(inspectSource(repo, commit, ["synthetic.bytes"]), commit);
	assert.throws(
		() => inspectSource(repo, "0".repeat(40), ["synthetic.bytes"]),
		hasCode("SOURCE_COMMIT_MISMATCH"),
	);
	writeFileSync(path.join(repo, "synthetic.bytes"), Buffer.from("SYNTHETIC_CHANGED_BYTES"));
	assert.throws(() => inspectSource(repo, commit, ["synthetic.bytes"]), hasCode("DIRTY_SOURCE"));
});

// The following are labelled fabricated REPORTS, not actual browser observations.
// The screenshot byte fixture is deliberately plain text, not an invented image.
function syntheticReport(name) {
	const folder = path.join(temporary, name);
	mkdirSync(folder);
	const binding = {
		runId: "SYNTHETIC_VALIDATOR_RUN",
		manifestSha256: sha256("SYNTHETIC_MANIFEST"),
		sourceCommit: "a".repeat(40),
		buildTreeSha256: sha256("SYNTHETIC_BUILD"),
		implementationSha256: sha256("SYNTHETIC_IMPLEMENTATION"),
		icon: null,
	};
	const tests = PROJECTS.flatMap((project) =>
		LOCALES.map((locale) => {
			const stem = `${project.name}-${locale}`;
			const imagePath = path.join(folder, `${stem}.synthetic-bytes`);
			const observationPath = path.join(folder, `${stem}.synthetic-report.json`);
			writeFileSync(imagePath, syntheticBytes);
			writeFileSync(
				observationPath,
				JSON.stringify({
					schema: "yl-brand-runtime-observation/v1",
					scope: "technical_candidate_only",
					...binding,
					locale,
					project: project.name,
					viewport: project.viewport,
					hero: { servedSha256: PINS.commonSvgSha256 },
					icon: null,
					iconStatus: "not_mapped_not_tested",
					screenshotSha256: sha256(syntheticBytes),
					founderApproved: false,
					releaseAuthorized: false,
				}),
			);
			return {
				projectName: project.name,
				expectedStatus: "passed",
				status: "expected",
				results: [
					{
						status: "passed",
						retry: 0,
						attachments: [
							{ name: "brand-candidate-runtime.json", path: observationPath },
							{ name: "candidate-viewport.png", path: imagePath },
						],
					},
				],
			};
		}),
	);
	return { folder, binding, report: { errors: [], suites: [{ specs: [{ tests }] }] }, tests };
}

test("synthetic report helper: complete six-case fixture validates only the checker", () => {
	const fixture = syntheticReport("complete-report");
	assert.equal(verifyReport(fixture.report, fixture.folder, fixture.binding).count, 6);
});

test("synthetic report helper: missing case cannot pass", () => {
	const fixture = syntheticReport("missing-case");
	fixture.tests.pop();
	assert.throws(
		() => verifyReport(fixture.report, fixture.folder, fixture.binding),
		hasCode("MATRIX_INCOMPLETE"),
	);
});

test("synthetic report helper: retry cannot pass", () => {
	const fixture = syntheticReport("retry-case");
	fixture.tests[0].results[0].retry = 1;
	assert.throws(
		() => verifyReport(fixture.report, fixture.folder, fixture.binding),
		hasCode("RUNTIME_NOT_CLEAN"),
	);
});

test("synthetic report helper: a stale manifest binding cannot pass", () => {
	const fixture = syntheticReport("stale-manifest");
	fixture.binding.manifestSha256 = sha256("DIFFERENT_SYNTHETIC_MANIFEST");
	assert.throws(
		() => verifyReport(fixture.report, fixture.folder, fixture.binding),
		hasCode("PROOF_BINDING_MISMATCH"),
	);
});

test("synthetic report helper: tampered screenshot bytes cannot pass", () => {
	const fixture = syntheticReport("tampered-image");
	writeFileSync(fixture.tests[0].results[0].attachments[1].path, "DIFFERENT_SYNTHETIC_BYTES");
	assert.throws(
		() => verifyReport(fixture.report, fixture.folder, fixture.binding),
		hasCode("SCREENSHOT_MISMATCH"),
	);
});

test("synthetic report helper: old served SVG identity cannot pass", () => {
	const fixture = syntheticReport("old-runtime-identity");
	const file = fixture.tests[0].results[0].attachments[0].path;
	const observation = JSON.parse(readFileSync(file, "utf8"));
	observation.hero.servedSha256 =
		"a5acd648de2ca28c7422935f758483cc1d49be2bfe365c80809226c40219e609";
	writeFileSync(file, JSON.stringify(observation));
	assert.throws(
		() => verifyReport(fixture.report, fixture.folder, fixture.binding),
		hasCode("INVALID_OBSERVATION"),
	);
});

test("synthetic report helper: mapped icon requires its own runtime proof", () => {
	const fixture = syntheticReport("missing-icon");
	fixture.binding.icon = { synthetic: true };
	assert.throws(
		() => verifyReport(fixture.report, fixture.folder, fixture.binding),
		hasCode("ICON_PROOF_MISSING"),
	);
});
