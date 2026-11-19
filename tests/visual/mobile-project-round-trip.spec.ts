import { expect, type Locator, type Page, test } from "@playwright/test";

const projectPath = "/en/projects/ai-document-processor";

test.use({ hasTouch: true });

async function expectNoOverflow(page: Page) {
	const overflow = await page.evaluate(async () => {
		await document.fonts.ready;
		const root = document.documentElement;
		return root.scrollWidth - root.clientWidth;
	});
	expect(overflow, `horizontal overflow on ${page.url()}`).toBeLessThanOrEqual(0);
}

async function tapLink(link: Locator, href: string) {
	await expect(link).toHaveAttribute("href", href);
	await expect(link).toBeVisible();
	const { width, height } = await link.evaluate((el) => {
		const rect = el.getBoundingClientRect();
		return { width: rect.width, height: rect.height };
	});
	expect(width, `${href} width`).toBeGreaterThanOrEqual(44);
	expect(height, `${href} height`).toBeGreaterThanOrEqual(44);
	await link.tap();
}

for (const width of [360, 390, 430]) {
	test(`open the document processor and return via the header at ${width}px`, async ({ page }) => {
		await page.setViewportSize({ width, height: 844 });
		await page.goto("/en");
		const details = page.locator("#open-source details");
		const summary = details.locator("summary");
		await expectNoOverflow(page);
		await summary.tap();
		await expect(details).toHaveAttribute("open", "");
		const project = details.getByRole("link", { name: /ai-document-processor/i });
		await expectNoOverflow(page);
		await tapLink(project, projectPath);

		await expect(page).toHaveURL(projectPath);
		await expect(page.getByRole("heading", { level: 1 })).toContainText("ai-document-processor");
		await expectNoOverflow(page);
		const home = page.getByRole("banner").getByRole("link", { name: "pedro.balbino", exact: true });
		await tapLink(home, "/en");

		await expect(page).toHaveURL("/en");
		await expect(summary).toBeVisible();
		await expectNoOverflow(page);
	});
}
