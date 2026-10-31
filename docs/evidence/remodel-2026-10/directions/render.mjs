// Key-screen renderer for the direction round: desktop 1280x800 + mobile 390x844,
// first viewport only, in the pinned Playwright image. Usage (repo root):
//   node docs/evidence/remodel-2026-10/directions/render.mjs
import { chromium } from "@playwright/test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
const here = dirname(fileURLToPath(import.meta.url));
const browser = await chromium.launch();
for (const name of ["c2-ledger", "c3-stage"])
	for (const [vp, size] of [["desktop", { width: 1280, height: 800 }], ["mobile", { width: 390, height: 844 }]]) {
		const page = await browser.newPage({ viewport: size, deviceScaleFactor: 1 });
		await page.goto(`file://${join(here, `${name}.html`)}`);
		await page.evaluate(() => document.fonts.ready);
		await page.screenshot({ path: join(here, `${name}-${vp}.png`) });
		await page.close();
	}
await browser.close();
