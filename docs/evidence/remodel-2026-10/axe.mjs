// Full axe-core scan (all WCAG 2.x A/AA rules, not Lighthouse's subset) of the
// redesigned templates against a running standalone server on :3000.
//   AXE=/path/to/axe.min.js node docs/evidence/remodel-2026-10/axe.mjs
// axe-core is fetched to scratch (`npm pack axe-core`), not added to the lockfile.
import { chromium } from "@playwright/test";
const routes = ["/en", "/pt", "/es", "/en/about", "/en/thesis", "/en/projects/compliance-tax-agent", "/en/projects/wa", "/en/nope"];
const browser = await chromium.launch();
let total = 0;
for (const [vp, size] of [["desktop", { width: 1280, height: 800 }], ["mobile", { width: 390, height: 844 }]])
	for (const route of routes) {
		const page = await browser.newPage({ viewport: size });
		await page.goto(`http://127.0.0.1:3000${route}`);
		// The 404 is recovered client-side (see REPORT.md), so wait for its heading.
		await page.waitForSelector("main h1");
		await page.addScriptTag({ path: process.env.AXE });
		const result = await page.evaluate(() =>
			window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] }),
		);
		total += result.violations.length;
		console.log(`${vp} ${route}: ${result.violations.length} violation(s)${result.violations.map((v) => ` ${v.id}(${v.nodes.length})`).join("")}`);
		await page.close();
	}
await browser.close();
console.log(`AXE_TOTAL=${total}`);
process.exit(total ? 1 : 0);
