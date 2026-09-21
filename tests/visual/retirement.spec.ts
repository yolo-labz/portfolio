import { expect, test } from "@playwright/test";

for (const locale of ["en", "pt", "es"]) {
	test(`${locale}: retirement removes the route and keeps sibling projects`, async ({ page }) => {
		await page.route("**/*", (route) =>
			new URL(route.request().url()).hostname === "localhost" ? route.continue() : route.abort(),
		);
		for (const path of [`/${locale}`, `/${locale}/about`]) {
			const response = await page.goto(path);
			expect(response?.status()).toBe(200);
			await expect(page.locator("body")).not.toContainText(/real[ -]?estate|market dashboard/i);
			await expect(page.locator('a[href*="realestate"]')).toHaveCount(0);
		}
		const retired = await page.goto(`/${locale}/projects/realestate-price-tracker`);
		expect(retired?.status()).toBe(404);
		for (const slug of ["ai-document-processor", "exec-job-board", "serverless-data-api"]) {
			const response = await page.goto(`/${locale}/projects/${slug}`);
			expect(response?.status()).toBe(200);
			await expect(page.locator("h1")).toContainText(slug);
		}
	});
}
