import { expect, test } from "@playwright/test";
import { projects } from "../../apps/web/src/data/projects";

const selected = ["wa", "serverless-data-api", "kokoro-speakd", "fand"];

// These contracts exercise the existing catalogue, not a second project database.
// Remote navigation is not needed: source destinations are asserted without sends.
test.beforeEach(async ({ page }) => {
	await page.route("**/*", (route) => {
		if (new URL(route.request().url()).hostname === "localhost") return route.continue();
		return route.abort();
	});
	await page.emulateMedia({ reducedMotion: "reduce" });
});

for (const locale of ["en", "pt", "es"]) {
	test(`organization showcase ${locale}: selection, navigation, keyboard and contrast`, async ({
		page,
	}) => {
		await page.goto(`/${locale}`);
		await page.waitForLoadState("networkidle");
		// Scope-only capture: keep the fixed site header from overlaying a tall card.
		// The existing full-page suite still renders and tests the header.
		await page.addStyleTag({
			content:
				"html { scroll-behavior: auto !important; } header { display: none; } #open-source { scroll-margin-top: 0; }",
		});
		await expect(page.locator("header")).toHaveCSS("display", "none");
		await page.evaluate(() => document.fonts.ready);
		const section = page.locator("#open-source");
		await section.scrollIntoViewIfNeeded();
		await expect(section).toHaveAccessibleName(/yolo-labz/);
		const cards = section.locator("ul").first().locator(":scope > li");
		await expect(cards.locator("h4")).toHaveText(selected);
		await expect(section.locator('a[href="https://github.com/yolo-labz"]')).toBeVisible();

		for (const [index, slug] of selected.entries()) {
			const card = cards.nth(index);
			const project = projects.find((entry) => entry.slug === slug);
			expect(project?.links.source).toBeTruthy();
			await expect(card.locator("a")).toHaveCount(2);
			await expect(card.locator("a").first()).toHaveAttribute(
				"href",
				`/${locale}/projects/${slug}`,
			);
			await expect(card.locator("a").last()).toHaveAttribute("href", project?.links.source ?? "");
			for (const link of await card.locator("a").all()) {
				await expect(link).toHaveAccessibleName(new RegExp(slug));
				const box = await link.boundingBox();
				expect(box?.height).toBeGreaterThanOrEqual(44);
			}
		}
		await expect(section).toHaveScreenshot(`showcase-${locale}.png`);

		const summary = section.locator("summary");
		await summary.focus();
		await page.keyboard.press("Enter");
		await expect(section.locator("details")).toHaveAttribute("open", "");
		const remaining = projects.filter(
			(project) => !project.featured && !selected.includes(project.slug),
		);
		await expect(section.locator("details a")).toHaveCount(remaining.length);
		for (const project of remaining) {
			await expect(
				section.locator(`details a[href="/${locale}/projects/${project.slug}"]`),
			).toBeVisible();
		}
		await page.keyboard.press("Tab");
		const firstRemaining = section.locator("details a").first();
		await expect(firstRemaining).toBeFocused();
		await expect(firstRemaining).toHaveCSS("outline-style", "solid");
		await expect(firstRemaining).toHaveCSS("outline-width", "2px");

		// Measure the actual computed foreground/background pairs, including Badge's
		// surface background. This is a scoped WCAG text-contrast check, not an axe audit.
		const contrasts = await section.evaluate((root) => {
			const luminance = (color: string) => {
				const values = (color.match(/[\d.]+/g) ?? []).slice(0, 3).map((part) => {
					const value = Number(part) / 255;
					return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
				});
				return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
			};
			return Array.from(root.querySelectorAll("h3, h4, p, a, summary, span"))
				.filter((element) => element.textContent?.trim() && element.getClientRects().length)
				.map((element) => {
					let ancestor: Element | null = element;
					let background = "rgba(0, 0, 0, 0)";
					while (ancestor && background === "rgba(0, 0, 0, 0)") {
						background = getComputedStyle(ancestor).backgroundColor;
						ancestor = ancestor.parentElement;
					}
					const foreground = luminance(getComputedStyle(element).color);
					const backdrop = luminance(background);
					return {
						text: element.textContent?.trim().slice(0, 60),
						ratio:
							(Math.max(foreground, backdrop) + 0.05) / (Math.min(foreground, backdrop) + 0.05),
					};
				});
		});
		expect(contrasts.length).toBeGreaterThan(20);
		for (const contrast of contrasts)
			expect(contrast.ratio, contrast.text).toBeGreaterThanOrEqual(4.5);

		await summary.focus();
		await page.keyboard.press("Space");
		await expect(section.locator("details")).not.toHaveAttribute("open", "");
	});
}

test("organization showcase reflows at 320px without clipping", async ({ page }) => {
	await page.setViewportSize({ width: 320, height: 844 });
	await page.goto("/pt");
	await page.addStyleTag({
		content:
			"html { scroll-behavior: auto !important; } header { display: none; } #open-source { scroll-margin-top: 0; }",
	});
	await expect(page.locator("header")).toHaveCSS("display", "none");
	const section = page.locator("#open-source");
	await section.locator("summary").click();
	const overflowing = await section.evaluate((root) =>
		Array.from(root.querySelectorAll("h3, h4, p, a, li, summary, span"))
			.filter((element) => {
				const box = element.getBoundingClientRect();
				return (
					box.width > 0 &&
					(box.left < 0 ||
						box.right > window.innerWidth ||
						element.scrollWidth > element.clientWidth + 1)
				);
			})
			.map((element) => element.textContent?.trim()),
	);
	expect(overflowing).toEqual([]);
	await expect(section).toHaveScreenshot("showcase-320-expanded.png");
});
