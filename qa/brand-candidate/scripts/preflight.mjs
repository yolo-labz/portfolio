import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
	closeSync,
	existsSync,
	lstatSync,
	openSync,
	readdirSync,
	readFileSync,
	readlinkSync,
	readSync,
	realpathSync,
	statSync,
} from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const PINS = Object.freeze({
	schema: "yl-brand-runtime-manifest/v1",
	lane: "YL-NEXT-BROWSER-10",
	repository: "yolo-labz/portfolio",
	commonSvgSha256: "bb94717462fdf75a7bf7d172e42982439c5739a6f09eebae299bd4e43e39c330",
	correctedIcoSha256: "da67eb3ec11cd66b16996341b33a2ecae8b936976b9717eaacc70438d167728d",
	technicalReceiptSha256: "11886fe02114d9ea4b4fa1b38864838a7c9981d3ea658e4f3da8ed7ef110cf99",
	frozenRasterSha256: "4c26105181a3fba030f916b1fb2446f84811b1d992702462ee3d75e171c23b7e",
	upstreamConfigSha256: "141e623da0b833512a91e33016f4420f704c16f8071812c089f69abb1d8f3be8",
	playwrightVersion: "1.65.1",
	container: "mcr.microsoft.com/playwright:v1.65.1-noble",
	baseURL: "http://localhost:3000",
});
export const PROJECTS = Object.freeze([
	{ name: "chromium-desktop", viewport: { width: 1280, height: 800 } },
	{ name: "mobile", viewport: { width: 390, height: 844 } },
]);
export const LOCALES = Object.freeze(["en", "pt", "es"]);

export function fail(code, message, details = {}) {
	const error = new Error(message);
	error.code = code;
	error.details = details;
	throw error;
}

export const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

// This generic byte comparison is tested with explicitly synthetic fixtures.
// The production manifest gate below always enforces the fixed real candidate pin.
export function assertBytes(bytes, expected, label) {
	const actual = sha256(bytes);
	if (actual !== expected)
		fail("IDENTITY_MISMATCH", `${label}: SHA-256 differs`, { expected, actual });
	return actual;
}

function nonempty(value) {
	return typeof value === "string" && value.trim().length > 0;
}

export function validatePublicPath(value) {
	if (!nonempty(value) || !value.startsWith("/") || value.startsWith("//")) {
		fail("INVALID_PUBLIC_PATH", "Asset URL must be an explicit same-origin absolute path");
	}
	let decoded;
	try {
		decoded = decodeURIComponent(value);
	} catch {
		fail("INVALID_PUBLIC_PATH", "Invalid URL escape");
	}
	if (
		/[?#\\]/u.test(decoded) ||
		Array.from(decoded).some((character) => character.codePointAt(0) <= 0x20) ||
		decoded.split("/").some((p) => p === "." || p === "..")
	) {
		fail(
			"INVALID_PUBLIC_PATH",
			"Asset path cannot contain query, fragment, traversal, or control bytes",
		);
	}
	const url = new URL(value, PINS.baseURL);
	if (url.origin !== PINS.baseURL || url.pathname !== value)
		fail("INVALID_PUBLIC_PATH", "Noncanonical asset path");
	return value;
}

export function validateManifest(manifest) {
	const missing = [];
	const need = (name, value, check = nonempty) => {
		if (!check(value)) missing.push(name);
	};
	if (!manifest || typeof manifest !== "object")
		fail("INVALID_MANIFEST", "Manifest must be an object");
	if (manifest.schema !== PINS.schema || manifest.lane !== PINS.lane) {
		fail("INVALID_MANIFEST", "Unsupported schema or owner lane");
	}
	if (
		manifest.expected?.commonSvgSha256 !== PINS.commonSvgSha256 ||
		manifest.expected?.technicalReceiptSha256 !== PINS.technicalReceiptSha256 ||
		manifest.expected?.frozenRasterSha256 !== PINS.frozenRasterSha256
	) {
		fail("PIN_MISMATCH", "Candidate pins cannot be replaced with old PR or synthetic identities");
	}
	if (manifest.founderApproved !== false || manifest.releaseAuthorized !== false) {
		fail("INVALID_ACCEPTANCE_SCOPE", "This companion cannot assert founder or release approval");
	}
	if (manifest.source?.repository !== PINS.repository)
		fail("INVALID_REPOSITORY", "Unexpected repository");
	need(
		"state=ready_for_technical_validation",
		manifest.state,
		(v) => v === "ready_for_technical_validation",
	);
	for (const key of ["source", "build", "evidence"]) {
		need(
			`${key}.root`,
			manifest[key]?.root,
			(v) => nonempty(v) && path.isAbsolute(v) && v !== path.parse(v).root,
		);
	}
	need("source.commit", manifest.source?.commit, (v) => /^[a-f0-9]{40}$/u.test(v ?? ""));
	need("build.treeSha256", manifest.build?.treeSha256, (v) => /^[a-f0-9]{64}$/u.test(v ?? ""));
	for (const [name, value] of [
		["evidence.technicalReceiptPath", manifest.evidence?.technicalReceiptPath],
		["build.serverEntry", manifest.build?.serverEntry],
		["build.buildIdPath", manifest.build?.buildIdPath],
		["build.buildId", manifest.build?.buildId],
		["hero.sourcePath", manifest.hero?.sourcePath],
		["hero.builtPath", manifest.hero?.builtPath],
		["hero.publicPath", manifest.hero?.publicPath],
		["hero.selector", manifest.hero?.selector],
	])
		need(name, value);
	for (const locale of LOCALES) need(`hero.alt.${locale}`, manifest.hero?.alt?.[locale]);
	if (manifest.hero?.sha256 !== PINS.commonSvgSha256)
		fail("PIN_MISMATCH", "Hero must use the newer common SVG");
	if (manifest.icon !== null) {
		if (!manifest.icon || manifest.icon.sha256 !== PINS.correctedIcoSha256) {
			fail("PIN_MISMATCH", "A mapped icon must use the corrected ICO identity");
		}
		for (const key of ["sourcePath", "builtPath", "publicPath"])
			need(`icon.${key}`, manifest.icon[key]);
	}
	if (
		manifest.runtime?.baseURL !== PINS.baseURL ||
		manifest.runtime?.playwrightVersion !== PINS.playwrightVersion ||
		manifest.runtime?.container !== PINS.container ||
		manifest.runtime?.upstreamConfigSha256 !== PINS.upstreamConfigSha256
	) {
		fail("HARNESS_MISMATCH", "Runtime must retain the inspected existing harness and tool version");
	}
	if (missing.length)
		fail("MISSING_INPUTS", "Current candidate recovery is incomplete", { missing });
	validatePublicPath(manifest.hero.publicPath);
	if (manifest.icon) validatePublicPath(manifest.icon.publicPath);
	return manifest;
}

function within(root, candidate) {
	const relative = path.relative(root, candidate);
	return (
		relative === "" ||
		(!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative))
	);
}

export function containedFile(root, relative) {
	if (
		!nonempty(relative) ||
		path.isAbsolute(relative) ||
		relative.includes("\\") ||
		relative.split("/").some((p) => p === ".." || p === "." || p === "")
	) {
		fail("PATH_ESCAPE", "A file binding must be a normalized relative path", { relative });
	}
	const base = realpathSync(root);
	const candidate = path.resolve(base, relative);
	if (!within(base, candidate)) fail("PATH_ESCAPE", "File path escapes its root", { relative });
	const real = realpathSync(candidate);
	if (!within(base, real)) fail("PATH_ESCAPE", "Symlink escapes its root", { relative });
	if (!statSync(real).isFile()) fail("NOT_A_FILE", "Binding is not a regular file", { relative });
	return real;
}

export function boundFile(root, relative, expected, label) {
	const file = containedFile(root, relative);
	const bytes = readFileSync(file);
	assertBytes(bytes, expected, label);
	return { path: relative, sha256: expected, bytes: bytes.length };
}

function hashFile(file) {
	const fd = openSync(file, "r");
	const digest = createHash("sha256");
	const buffer = Buffer.allocUnsafe(65536);
	try {
		let length = readSync(fd, buffer, 0, buffer.length, null);
		while (length > 0) {
			digest.update(buffer.subarray(0, length));
			length = readSync(fd, buffer, 0, buffer.length, null);
		}
	} finally {
		closeSync(fd);
	}
	return digest.digest("hex");
}

// Hash every file and every contained symlink. No filename exclusion and no cache exclusion.
// The caller must supply the immutable standalone build root, never a whole workspace.
export function inventoryTree(root) {
	const base = realpathSync(root);
	if (base === path.parse(base).root || !statSync(base).isDirectory())
		fail("INVALID_BUILD_ROOT", "Expected a bounded build directory");
	const entries = [];
	let bytes = 0;
	const walk = (relative) => {
		for (const name of readdirSync(path.join(base, relative)).sort()) {
			const rel = relative ? `${relative}/${name}` : name;
			const absolute = path.join(base, rel);
			const info = lstatSync(absolute);
			if (info.isSymbolicLink()) {
				if (!within(base, realpathSync(absolute)))
					fail("PATH_ESCAPE", "Build symlink escapes immutable tree", { path: rel });
				entries.push({ path: rel, kind: "symlink", target: readlinkSync(absolute) });
			} else if (info.isDirectory()) {
				entries.push({ path: rel, kind: "directory" });
				walk(rel);
			} else if (info.isFile()) {
				bytes += info.size;
				if (bytes > 4 * 1024 ** 3) fail("BUILD_TOO_LARGE", "Build inventory exceeds four GiB");
				entries.push({ path: rel, kind: "file", bytes: info.size, sha256: hashFile(absolute) });
			} else fail("UNSUPPORTED_BUILD_ENTRY", "Unexpected non-file build entry", { path: rel });
			if (entries.length > 100000)
				fail("BUILD_TOO_LARGE", "Build inventory exceeds one hundred thousand entries");
		}
	};
	walk("");
	return {
		sha256: sha256(JSON.stringify(entries)),
		entries: entries.length,
		bytes,
		inventory: entries,
	};
}

export function svgRatio(bytes) {
	const tag = bytes.toString("utf8").match(/<svg\b[^>]*>/u)?.[0];
	const viewBox = tag?.match(/\bviewBox\s*=\s*["']([^"']+)["']/u)?.[1];
	const values = viewBox
		?.trim()
		.split(/[\s,]+/u)
		.map(Number);
	if (values?.length !== 4 || !values.every(Number.isFinite) || values[2] <= 0 || values[3] <= 0) {
		fail("INVALID_SVG_GEOMETRY", "The recovered SVG needs a valid positive viewBox");
	}
	return values[2] / values[3];
}

function git(root, args) {
	return execFileSync("git", ["-C", root, ...args], { encoding: "utf8", timeout: 10000 }).trim();
}

export function inspectSource(root, expectedCommit, assetPaths) {
	const actual = git(root, ["rev-parse", "HEAD"]);
	if (actual !== expectedCommit)
		fail("SOURCE_COMMIT_MISMATCH", "Source HEAD differs", { expected: expectedCommit, actual });
	if (git(root, ["status", "--porcelain", "--untracked-files=no"]))
		fail("DIRTY_SOURCE", "Tracked source differs from the pinned commit");
	for (const relative of assetPaths) git(root, ["ls-files", "--error-unmatch", "--", relative]);
	return actual;
}

export function loadPlaywright(sourceRoot) {
	const require = createRequire(path.join(sourceRoot, "package.json"));
	const version = require("@playwright/test/package.json").version;
	if (version !== PINS.playwrightVersion)
		fail("PLAYWRIGHT_VERSION_MISMATCH", "Installed Playwright differs", { version });
	return require("@playwright/test");
}

export function preflight(manifestPath) {
	const raw = readFileSync(manifestPath);
	const manifest = validateManifest(JSON.parse(raw));
	for (const item of [manifest.source, manifest.build, manifest.evidence]) {
		if (!statSync(realpathSync(item.root)).isDirectory())
			fail("INVALID_ROOT", "Input root is not a directory");
	}
	const sourceCommit = inspectSource(manifest.source.root, manifest.source.commit, [
		manifest.hero.sourcePath,
		...(manifest.icon ? [manifest.icon.sourcePath] : []),
	]);
	const receipt = boundFile(
		manifest.evidence.root,
		manifest.evidence.technicalReceiptPath,
		PINS.technicalReceiptSha256,
		"technical receipt",
	);
	const config = boundFile(
		manifest.source.root,
		"playwright.config.ts",
		PINS.upstreamConfigSha256,
		"inspected upstream Playwright config",
	);
	const packageFile = JSON.parse(
		readFileSync(containedFile(manifest.source.root, "package.json"), "utf8"),
	);
	if (
		packageFile.devDependencies?.["@playwright/test"] !== PINS.playwrightVersion ||
		packageFile.packageManager !== "pnpm@10.28.2"
	)
		fail("TOOLCHAIN_MISMATCH", "Repository toolchain differs from inspected source");
	if (packageFile.type === "module")
		fail("HARNESS_MISMATCH", "Upstream config module classification changed");
	const heroSource = boundFile(
		manifest.source.root,
		manifest.hero.sourcePath,
		PINS.commonSvgSha256,
		"hero source",
	);
	const heroBuilt = boundFile(
		manifest.build.root,
		manifest.hero.builtPath,
		PINS.commonSvgSha256,
		"hero built copy",
	);
	const ratio = svgRatio(
		readFileSync(containedFile(manifest.source.root, manifest.hero.sourcePath)),
	);
	const icon = manifest.icon
		? {
				source: boundFile(
					manifest.source.root,
					manifest.icon.sourcePath,
					PINS.correctedIcoSha256,
					"icon source",
				),
				built: boundFile(
					manifest.build.root,
					manifest.icon.builtPath,
					PINS.correctedIcoSha256,
					"icon built copy",
				),
			}
		: null;
	const serverEntry = containedFile(manifest.build.root, manifest.build.serverEntry);
	if (path.basename(serverEntry) !== "server.js")
		fail("INVALID_SERVER_ENTRY", "Expected the inspected Next standalone server.js entry");
	const buildId = readFileSync(
		containedFile(manifest.build.root, manifest.build.buildIdPath),
		"utf8",
	).trim();
	if (buildId !== manifest.build.buildId) fail("BUILD_ID_MISMATCH", "Standalone BUILD_ID differs");
	const tree = inventoryTree(manifest.build.root);
	if (tree.sha256 !== manifest.build.treeSha256)
		fail("BUILD_TREE_MISMATCH", "Standalone build tree differs", {
			expected: manifest.build.treeSha256,
			actual: tree.sha256,
		});
	return {
		schema: "yl-brand-preflight/v1",
		status: "static_identity_passed",
		scope: "technical_candidate_only",
		manifestSha256: sha256(raw),
		sourceCommit,
		buildTreeSha256: tree.sha256,
		buildId,
		buildEntries: tree.entries,
		buildBytes: tree.bytes,
		upstreamConfig: config,
		receipt,
		hero: { source: heroSource, built: heroBuilt, ratio },
		icon,
		iconStatus: icon ? "mapped_identity_passed" : "not_mapped_not_tested",
		founderApproved: false,
		releaseAuthorized: false,
		runtimeExecuted: false,
	};
}

export function errorReport(error) {
	return {
		schema: "yl-brand-preflight/v1",
		status: "blocked",
		runtimeExecuted: false,
		founderApproved: false,
		releaseAuthorized: false,
		error: { code: error.code ?? "INPUT_ERROR", message: error.message, ...(error.details ?? {}) },
	};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	try {
		const [command, file] = process.argv.slice(2);
		if (!file || !existsSync(file))
			fail("MISSING_INPUTS", "Usage: preflight.mjs check MANIFEST | inventory BUILD_ROOT");
		const result =
			command === "check"
				? preflight(path.resolve(file))
				: command === "inventory"
					? { scope: "observed_tree_only_not_acceptance", ...inventoryTree(file) }
					: fail("INVALID_COMMAND", "Expected check or inventory");
		console.log(JSON.stringify(result, null, 2));
	} catch (error) {
		console.log(JSON.stringify(errorReport(error), null, 2));
		process.exitCode = 1;
	}
}
