import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fail, preflight, sha256 } from "./preflight.mjs";

export const companionRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const manifestPath = path.resolve(
	process.env.BRAND_MANIFEST ?? path.join(companionRoot, "candidate-manifest.required.json"),
);
export const proofRoot = path.resolve(
	process.env.BRAND_PROOF_DIR ?? path.join(companionRoot, "runtime-results"),
);

export function readManifest() {
	return JSON.parse(readFileSync(manifestPath, "utf8"));
}

export function implementationFingerprint() {
	const files = [
		"playwright.brand-candidate.config.mjs",
		"tests/brand-candidate.spec.mjs",
		"scripts/preflight.mjs",
		"scripts/runtime-context.mjs",
		"scripts/serve-built.mjs",
		"scripts/prepare-run.mjs",
		"scripts/finalize-proof.mjs",
	];
	return sha256(
		JSON.stringify(
			files.map((file) => ({ file, sha256: sha256(readFileSync(path.join(companionRoot, file))) })),
		),
	);
}

export function verifyRunContext() {
	const saved = JSON.parse(readFileSync(path.join(proofRoot, "preflight.json"), "utf8"));
	if (!saved.runId || saved.manifestSha256 !== sha256(readFileSync(manifestPath))) {
		fail("STALE_RUN_CONTEXT", "Manifest changed or runtime context is missing");
	}
	if (
		sha256(readFileSync(path.join(proofRoot, "candidate-manifest.json"))) !== saved.manifestSha256
	) {
		fail("STALE_RUN_CONTEXT", "Retained manifest copy differs from the prepared input");
	}
	if (saved.implementationSha256 !== implementationFingerprint()) {
		fail("VALIDATOR_CHANGED", "Companion implementation changed during the run");
	}
	const fresh = preflight(manifestPath);
	for (const key of Object.keys(fresh)) {
		if (JSON.stringify(saved[key]) !== JSON.stringify(fresh[key])) {
			fail("STALE_RUN_CONTEXT", `Preflight field changed after preparation: ${key}`);
		}
	}
	return { manifest: readManifest(), proof: saved, fresh };
}
