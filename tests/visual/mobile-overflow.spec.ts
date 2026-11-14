// Small-screen gate: no route scrolls sideways at 360px, the narrowest phone
// width we design for, or at the 768px and 820px tablet widths where the
// desktop nav first appears (DESIGN.md "Small screens"). No screenshots, so
// there are no baselines to seed. Runs in both projects; the viewport is set here.

import { expect, test } from "@playwright/test";

const ROUTES = ["", "/about", "/projects/wa", "/projects/ai-document-processor"];
const LOCALES = ["en", "pt", "es"];
const WIDTHS = [360, 768, 820];

for (const width of WIDTHS) {
	for (const locale of LOCALES) {
		for (const route of ROUTES) {
			test(`/${locale}${route} does not scroll sideways at ${width}px`, async ({ page }) => {
				await page.setViewportSize({ width, height: 900 });
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
}
