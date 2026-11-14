// Small-screen gate: no route scrolls sideways at 360px, the narrowest phone
// width we design for (DESIGN.md "Small screens"). No screenshots, so there are
// no baselines to seed. Runs in both projects; the viewport is fixed here.

import { expect, test } from "@playwright/test";

const ROUTES = ["", "/about", "/projects/wa", "/projects/ai-document-processor"];
const LOCALES = ["en", "pt", "es"];

test.use({ viewport: { width: 360, height: 740 } });

for (const locale of LOCALES) {
	for (const route of ROUTES) {
		test(`/${locale}${route} does not scroll sideways at 360px`, async ({ page }) => {
			await page.goto(`/${locale}${route}`);
			await page.waitForLoadState("networkidle");
			const { sw, cw } = await page.evaluate(() => ({
				sw: document.documentElement.scrollWidth,
				cw: document.documentElement.clientWidth,
			}));
			expect(sw).toBeLessThanOrEqual(cw);
		});
	}
}
