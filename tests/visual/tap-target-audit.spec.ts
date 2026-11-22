import { expect, type Page, test } from "@playwright/test";

// Audits every visible interactive element against the 44 CSS px minimum
// target size (WCAG 2.5.5 / 2.5.8) on the home page and one project page at
// the phone, tablet and laptop widths the site ships. Lists each failing
// selector with its measured size so a failure is actionable.

const widths = [360, 390, 430, 768, 820, 1024];
const paths = ["/en", "/en/projects/ai-document-processor"];
const MIN = 44;

async function undersizedTargets(page: Page) {
	return page.evaluate((min) => {
		const selector =
			"a[href], button, summary, input, select, textarea, [role='button'], [role='link']";
		const labelOf = (el: Element) => {
			const id = el.id ? `#${el.id}` : "";
			const cls = (el.getAttribute("class") ?? "")
				.trim()
				.split(/\s+/)
				.filter(Boolean)
				.slice(0, 2)
				.join(".");
			const text = (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 40);
			return `${el.tagName.toLowerCase()}${id}${cls ? `.${cls}` : ""} "${text}"`;
		};
		const failures: string[] = [];
		let total = 0;
		for (const el of Array.from(document.querySelectorAll(selector))) {
			const style = getComputedStyle(el);
			const rect = el.getBoundingClientRect();
			if (
				style.display === "none" ||
				style.visibility === "hidden" ||
				rect.width === 0 ||
				rect.height === 0
			)
				continue;
			total += 1;
			const w = Math.round(rect.width);
			const h = Math.round(rect.height);
			if (w < min || h < min) failures.push(`${labelOf(el)} ${w}x${h}`);
		}
		return { total, failures };
	}, MIN);
}

for (const width of widths) {
	for (const path of paths) {
		test(`tap targets are at least ${MIN}px at ${width}px on ${path}`, async ({ page }) => {
			await page.setViewportSize({ width, height: 844 });
			await page.goto(path);
			await page.evaluate(() => document.fonts.ready);
			const { total, failures } = await undersizedTargets(page);
			expect(total, "audited targets").toBeGreaterThan(0);
			expect(
				failures,
				`targets under ${MIN}px at ${width}px on ${path}:\n${failures.join("\n")}`,
			).toEqual([]);
		});
	}
}
