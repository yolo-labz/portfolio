import { randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fail, preflight, sha256 } from "./preflight.mjs";
import { implementationFingerprint, manifestPath, proofRoot } from "./runtime-context.mjs";

// Single initialization point. Playwright re-imports its config in workers, so
// config loading must never create, overwrite, or rotate the run identity.
export function createRunRecord(directory, proof) {
	try {
		mkdirSync(directory);
	} catch (error) {
		if (error.code === "EEXIST")
			fail("PROOF_DIRECTORY_EXISTS", "Use a new evidence directory for each run");
		throw error;
	}
	const record = {
		...proof,
		runId: randomUUID(),
		implementationSha256: implementationFingerprint(),
		createdAt: new Date().toISOString(),
	};
	writeFileSync(path.join(directory, "preflight.json"), JSON.stringify(record, null, 2) + "\n", {
		flag: "wx",
	});
	return record;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	try {
		const proof = preflight(manifestPath);
		const manifestBytes = readFileSync(manifestPath);
		if (sha256(manifestBytes) !== proof.manifestSha256)
			fail("MANIFEST_CHANGED", "Manifest changed during preparation");
		const record = createRunRecord(proofRoot, proof);
		writeFileSync(path.join(proofRoot, "candidate-manifest.json"), manifestBytes, { flag: "wx" });
		console.log(
			JSON.stringify(
				{
					status: "runtime_prepared_not_executed",
					runId: record.runId,
					manifestSha256: record.manifestSha256,
					proofRoot,
				},
				null,
				2,
			),
		);
	} catch (error) {
		console.error(
			JSON.stringify({
				status: "blocked",
				code: error.code ?? "INPUT_ERROR",
				message: error.message,
			}),
		);
		process.exitCode = 1;
	}
}
