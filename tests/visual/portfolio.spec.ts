// Visual-regression spec — exercises the most-trafficked routes of
// portfolio.home301server.com.br. The list is intentionally narrow: every
// page carries an O(N) baseline cost and we want the diff signal to stay
// loud.
//
// Project pages: top 5 featured cards from apps/web/src/data/projects.ts
// (`featured: true`). Adding a route?
//   1) append below
//   2) regenerate baselines via `pnpm test:visual:update` inside the pinned
//      playwright Docker image (see tests/visual/README.md)
//   3) hand-check the new PNGs in the PR.

import { expect, test } from "@playwright/test";

// Paths are explicit-locale (localePrefix: "always" → "/" redirects to "/en").
const PAGES: ReadonlyArray<{ name: string; path: string }> = [
	{ name: "home", path: "/en" },
	{ name: "about", path: "/en/about" },
	// Top 5 featured projects (apps/web/src/data/projects.ts: featured === true).
	{ name: "project-wa", path: "/en/projects/wa" },
	{ name: "project-claude-mac-chrome", path: "/en/projects/claude-mac-chrome" },
	{
		name: "project-linkedin-chrome-copilot",
		path: "/en/projects/linkedin-chrome-copilot",
	},
	{
		name: "project-ai-document-processor",
		path: "/en/projects/ai-document-processor",
	},
	{ name: "project-exec-job-board", path: "/en/projects/exec-job-board" },
	// Locale coverage: translated home + about for pt-BR and es.
	{ name: "home-pt", path: "/pt" },
	{ name: "about-pt", path: "/pt/about" },
	{ name: "home-es", path: "/es" },
	{ name: "about-es", path: "/es/about" },
];

// Block all third-party requests (font CDNs, analytics, etc). External
// dependencies introduce non-determinism: a slow fonts.googleapis.com
// response changes which fallback font is laid out, which shifts page
// height, which invalidates the baseline. Local fallback fonts in the
// playwright image (Noto + DejaVu) are byte-stable.
test.beforeEach(async ({ page }) => {
	await page.route("**/*", (route) => {
		const url = new URL(route.request().url());
		if (url.hostname === "localhost") {
			route.continue();
		} else {
			route.abort();
		}
	});
});

for (const { name, path } of PAGES) {
	test(`${name} renders without visual regression`, async ({ page }) => {
		await page.goto(path);
		await page.waitForLoadState("networkidle");

		// Pre-render: force ALL lazy-loaded images to load and ALL fonts to
		// resolve before the screenshot pair. Without this, Playwright's
		// "two consecutive stable screenshots" check fails on long pages
		// (>5000px) because content height drifts as images decode in.
		await page.evaluate(async () => {
			document.querySelectorAll("img").forEach((img) => {
				img.loading = "eager";
				img.decoding = "sync";
			});
			await Promise.all(
				Array.from(document.images)
					.filter((img) => !img.complete)
					.map(
						(img) =>
							new Promise<void>((resolve) => {
								img.addEventListener("load", () => resolve(), { once: true });
								img.addEventListener("error", () => resolve(), { once: true });
							}),
					),
			);
			await document.fonts.ready;
		});

		// Visit every section so IntersectionObserver-driven content is really
		// rendered. The old 300ms smooth-scroll cycle could capture mid-scroll;
		// jumping straight to the bottom would instead leave middle sections blank.
		await page.evaluate(async () => {
			for (const section of document.querySelectorAll("main section")) {
				section.scrollIntoView({ behavior: "instant", block: "start" });
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
			window.scrollTo({ top: 0, behavior: "instant" });
			await new Promise((resolve) => setTimeout(resolve, 1000));
		});
		await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

		await expect(page).toHaveScreenshot(`${name}.png`, {
			fullPage: true,
		});
	});
}
