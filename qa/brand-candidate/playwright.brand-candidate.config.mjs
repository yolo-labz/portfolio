import { createRequire } from "node:module";
import path from "node:path";
import { fail, loadPlaywright, PINS, PROJECTS } from "./scripts/preflight.mjs";
import {
	companionRoot,
	manifestPath,
	proofRoot,
	verifyRunContext,
} from "./scripts/runtime-context.mjs";

// Read-only on every import, including Playwright worker config deserialization.
const { manifest } = verifyRunContext();
const { defineConfig } = loadPlaywright(manifest.source.root);
// The inspected repository has no type:module. Use the CLI's installed CJS
// transform hook, matching Playwright's treatment of its upstream TS config.
const requireFromSource = createRequire(path.join(manifest.source.root, "package.json"));
const importedUpstream = requireFromSource("./playwright.config.ts");
const upstream = importedUpstream.default ?? importedUpstream;
const actualProjects = upstream.projects.map((p) => ({ name: p.name, viewport: p.use.viewport }));
if (JSON.stringify(actualProjects) !== JSON.stringify(PROJECTS)) {
	fail("HARNESS_MISMATCH", "Existing project names or viewports changed");
}
const shellQuote = (value) => `'${value.replaceAll("'", `'"'"'`)}'`;

export default defineConfig({
	...upstream,
	testDir: path.join(companionRoot, "tests"),
	testMatch: "brand-candidate.spec.mjs",
	forbidOnly: true,
	retries: 0,
	outputDir: path.join(proofRoot, "artifacts"),
	reporter: [
		["json", { outputFile: path.join(proofRoot, "playwright-report.json") }],
		["html", { outputFolder: path.join(proofRoot, "html-report"), open: "never" }],
		["list"],
	],
	use: { ...upstream.use, baseURL: PINS.baseURL, serviceWorkers: "block" },
	webServer: {
		command: `${shellQuote(process.execPath)} ${shellQuote(path.join(companionRoot, "scripts/serve-built.mjs"))}`,
		url: `${PINS.baseURL}/en`,
		timeout: 60000,
		reuseExistingServer: false,
		env: { BRAND_MANIFEST: manifestPath, BRAND_PROOF_DIR: proofRoot },
	},
});
