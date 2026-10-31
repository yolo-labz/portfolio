// Visual-regression spec — exercises the most-trafficked routes of
// portfolio.home301server.com.br. The list is intentionally narrow: every
// page carries an O(N) baseline cost and we want the diff signal to stay
// loud.
//
// Project pages: the flagship cards plus the three deep-dive routes this suite
// already carried. Flagships are the six named propositions in
// yolo-labz/.github docs/brand-positioning.md (`featured: true` in
// apps/web/src/data/projects.ts), so a card and its page are never out of step.
// Adding a route?
//   1) append below
//   2) regenerate baselines via `pnpm test:visual:update` inside the pinned
//      playwright Docker image (see tests/visual/README.md)
//   3) hand-check the new PNGs in the PR.

import { expect, test } from "@playwright/test";

// Paths are explicit-locale (localePrefix: "always" → "/" redirects to "/en").
const PAGES: ReadonlyArray<{ name: string; path: string }> = [
	{ name: "home", path: "/en" },
	{ name: "about", path: "/en/about" },
	// The six flagship cards (apps/web/src/data/projects.ts: featured === true).
	{ name: "project-wa", path: "/en/projects/wa" },
	{ name: "project-claude-mac-chrome", path: "/en/projects/claude-mac-chrome" },
	{ name: "project-kokoro-speakd", path: "/en/projects/kokoro-speakd" },
	{ name: "project-fand", path: "/en/projects/fand" },
	{
		name: "project-anthropic-throttle-proxy",
		path: "/en/projects/anthropic-throttle-proxy",
	},
	{ name: "project-chrome-bridge", path: "/en/projects/chrome-bridge" },
	// Deep-dive routes this suite already covered, kept for regression signal.
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

// Card-copy guard, moved here with the card it protects: kokoro-speakd is a
// flagship card now, and the brand-positioning corpus marks its old latency
// tokens as needs-measurement. The card must state the boundary instead.
test("flagship rows state the audited one-liner, not a latency token", async ({ page }) => {
	await page.goto("/en");
	await page.waitForLoadState("networkidle");
	// The home index row carries the repo name, its audited one-liner and the kind.
	const row = page.locator("#projects li").filter({ hasText: "kokoro-speakd" });
	await expect(row).toHaveCount(1);
	const copy = await row.innerText();
	expect(copy).toContain("Keep Kokoro ready between speech requests");
	expect(copy).not.toMatch(/200\s?ms|3[-\u2013]5\s?s/);
});

// Experience-mode contract: the work leads. All ten index rows and the gremlin
// render sit inside the first desktop viewport, and every row is a real link.
test("home first viewport shows the work index and the gremlin render", async ({ page }) => {
	// The contract is the 1280x800 laptop viewport in every project.
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto("/en");
	const rows = page.locator("#projects ol > li a");
	await expect(rows).toHaveCount(10);
	const viewport = page.viewportSize()?.height ?? 0;
	const last = await rows.last().boundingBox();
	expect(last && last.y + last.height).toBeLessThanOrEqual(viewport);
	const render = page.locator('#projects img[src*="gremlin-hero"]');
	await expect(render).toBeVisible();
	await expect(render).not.toHaveAttribute("alt", "");
	for (const row of await rows.all())
		expect((await row.boundingBox())?.height).toBeGreaterThanOrEqual(44);
});

// Reduced motion: the index entrance is removed, not merely shortened to zero
// visible change, so nothing on the page is mid-animation for these readers.
test("reduced motion removes the index entrance", async ({ page }) => {
	await page.emulateMedia({ reducedMotion: "reduce" });
	await page.goto("/en");
	const name = await page
		.locator(".work-row")
		.first()
		.evaluate((el) => getComputedStyle(el).animationName);
	expect(name).toBe("none");
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

		// Visit each section and wait for its actual content, not an arbitrary
		// delay: a fast scroll can outrun hydration and leave motion cards blank.
		// Instant scroll also avoids the old mid-smooth-scroll screenshot race.
		for (const section of await page.locator("main section").all()) {
			await section.evaluate((element) =>
				element.scrollIntoView({ behavior: "instant", block: "start" }),
			);
			await expect
				.poll(() =>
					section.evaluate(
						(element) =>
							Array.from(element.querySelectorAll<HTMLElement>("[style]")).filter(
								(child) => child.style.opacity && Number(getComputedStyle(child).opacity) < 1,
							).length,
					),
				)
				.toBe(0);
		}
		await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
		await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

		await expect(page).toHaveScreenshot(`${name}.png`, {
			fullPage: true,
		});
		// Retain actual pixels for hydration/stability evidence, including passing runs.
		if (name.startsWith("home")) {
			await test.info().attach(`${name}-settled`, {
				body: await page.screenshot({ fullPage: true, animations: "disabled", scale: "css" }),
				contentType: "image/png",
			});
		}
	});
}

// A real 404: localized, status 404, and every piece of work one click away.
for (const locale of ["en", "pt", "es"]) {
	test(`${locale} 404 lists the work index`, async ({ page }) => {
		const response = await page.goto(`/${locale}/does-not-exist`);
		expect(response?.status()).toBe(404);
		await expect(page.locator("h1")).toHaveCount(1);
		await expect(page.locator(`main a[href^="/${locale}/projects/"]`)).toHaveCount(10);
	});
}

// prefers-contrast: more lifts muted text to the body colour.
test("prefers-contrast more raises muted text", async ({ page }) => {
	await page.emulateMedia({ contrast: "more" });
	await page.goto("/en");
	const [muted, body] = await page.evaluate(() => {
		const probe = document.querySelector("#projects ol .text-text-muted");
		return [probe ? getComputedStyle(probe).color : "", getComputedStyle(document.body).color];
	});
	expect(muted).toBe(body);
});
