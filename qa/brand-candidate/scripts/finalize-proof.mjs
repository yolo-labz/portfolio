import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { containedFile, fail, LOCALES, PINS, PROJECTS, sha256 } from "./preflight.mjs";
import { proofRoot, verifyRunContext } from "./runtime-context.mjs";

function allTests(suites) {
	return suites.flatMap((suite) => [
		...(suite.specs ?? []).flatMap((spec) => spec.tests ?? []),
		...allTests(suite.suites ?? []),
	]);
}

function attachmentBytes(root, attachment) {
	if (!attachment?.path) fail("MISSING_ATTACHMENT", "Required attachment is absent");
	const absolute = path.isAbsolute(attachment.path)
		? attachment.path
		: path.resolve(root, attachment.path);
	return readFileSync(containedFile(root, path.relative(root, absolute)));
}

// Pure evidence checker. Unit fixtures exercise this function only; the executable
// entry point additionally reruns production preflight against real source and build.
export function verifyReport(report, root, preflightProof) {
	if ((report.errors ?? []).length) fail("RUNTIME_ERRORS", "Playwright recorded top-level errors");
	const tests = allTests(report.suites ?? []);
	const expected = new Set(
		PROJECTS.flatMap((project) => LOCALES.map((locale) => `${project.name}/${locale}`)),
	);
	if (tests.length !== expected.size)
		fail("MATRIX_INCOMPLETE", "Expected exactly six locale/project cases");
	const observations = [];
	for (const item of tests) {
		if (
			item.expectedStatus !== "passed" ||
			item.status !== "expected" ||
			item.results?.length !== 1 ||
			item.results[0].status !== "passed" ||
			item.results[0].retry !== 0
		) {
			fail(
				"RUNTIME_NOT_CLEAN",
				"Each case must pass once without retries, skips, or expected failures",
			);
		}
		const attachments = item.results[0].attachments ?? [];
		const proofAttachments = attachments.filter((a) => a.name === "brand-candidate-runtime.json");
		const images = attachments.filter((a) => a.name === "candidate-viewport.png");
		if (proofAttachments.length !== 1 || images.length !== 1)
			fail("MISSING_ATTACHMENT", "Require one proof and one viewport image per case");
		const observation = JSON.parse(attachmentBytes(root, proofAttachments[0]));
		const key = `${item.projectName}/${observation.locale}`;
		if (!expected.delete(key) || observation.project !== item.projectName)
			fail("MATRIX_DUPLICATE", "Unexpected or duplicate locale/project");
		for (const binding of [
			"runId",
			"manifestSha256",
			"sourceCommit",
			"buildTreeSha256",
			"implementationSha256",
		]) {
			if (observation[binding] !== preflightProof[binding])
				fail("PROOF_BINDING_MISMATCH", `Observation ${binding} differs`);
		}
		const viewport = PROJECTS.find((p) => p.name === item.projectName).viewport;
		if (
			observation.viewport?.width !== viewport.width ||
			observation.viewport?.height !== viewport.height
		) {
			fail("VIEWPORT_MISMATCH", "Observation viewport differs from inspected existing projects");
		}
		if (
			observation.schema !== "yl-brand-runtime-observation/v1" ||
			observation.scope !== "technical_candidate_only" ||
			observation.hero?.servedSha256 !== PINS.commonSvgSha256 ||
			observation.founderApproved !== false ||
			observation.releaseAuthorized !== false
		) {
			fail("INVALID_OBSERVATION", "Unexpected asset identity or acceptance scope");
		}
		if (preflightProof.icon) {
			if (
				observation.icon?.servedSha256 !== PINS.correctedIcoSha256 ||
				observation.iconStatus !== "mapped_response_checked"
			)
				fail("ICON_PROOF_MISSING", "Mapped corrected icon was not checked");
		} else if (observation.icon !== null || observation.iconStatus !== "not_mapped_not_tested") {
			fail("INVALID_ICON_SCOPE", "An unmapped icon cannot acquire a runtime pass");
		}
		if (sha256(attachmentBytes(root, images[0])) !== observation.screenshotSha256) {
			fail("SCREENSHOT_MISMATCH", "Viewport attachment changed");
		}
		observations.push({
			case: key,
			screenshotSha256: observation.screenshotSha256,
			heroSha256: observation.hero.servedSha256,
			iconStatus: observation.iconStatus,
		});
	}
	if (expected.size) fail("MATRIX_INCOMPLETE", "Missing cases remain");
	return {
		cases: observations.sort((a, b) => a.case.localeCompare(b.case)),
		count: observations.length,
	};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	try {
		const { proof, fresh } = verifyRunContext();
		const reportBytes = readFileSync(path.join(proofRoot, "playwright-report.json"));
		const result = verifyReport(JSON.parse(reportBytes), proofRoot, proof);
		const receipt = {
			schema: "yl-brand-runtime-result/v1",
			status: "technical_runtime_checks_passed",
			runId: proof.runId,
			manifestSha256: proof.manifestSha256,
			implementationSha256: proof.implementationSha256,
			sourceCommit: proof.sourceCommit,
			buildTreeSha256: fresh.buildTreeSha256,
			playwrightReportSha256: sha256(reportBytes),
			iconStatus: fresh.iconStatus,
			...result,
			founderApproved: false,
			releaseAuthorized: false,
			ownerAccepted: false,
			limits: [
				"No founder design approval",
				"No baseline update",
				"No deployment or production verification",
				"Three home locales and two existing viewports only",
				"Unmapped icon remains untested",
			],
		};
		writeFileSync(
			path.join(proofRoot, "candidate-runtime-result.json"),
			JSON.stringify(receipt, null, 2) + "\n",
		);
		console.log(JSON.stringify(receipt, null, 2));
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
