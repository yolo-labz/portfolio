import { writeFileSync } from "node:fs";
import { LOCALES, loadPlaywright, PINS, sha256 } from "../scripts/preflight.mjs";
import { readManifest, verifyRunContext } from "../scripts/runtime-context.mjs";

const manifest = readManifest();
const { test, expect } = loadPlaywright(manifest.source.root);
let context;
test.beforeAll(() => {
	context = verifyRunContext();
});

for (const locale of LOCALES) {
	test(`brand candidate ${locale}`, async ({ page }, testInfo) => {
		const heroURL = new URL(manifest.hero.publicPath, PINS.baseURL).href;
		const received = [];
		page.on("response", (response) => {
			if (response.url() === heroURL) received.push(response);
		});
		await page.route("**/*", (route) => {
			const url = new URL(route.request().url());
			return url.origin === PINS.baseURL ? route.continue() : route.abort();
		});
		const pageResponse = await page.goto(`/${locale}`, { waitUntil: "networkidle" });
		expect(pageResponse?.status()).toBe(200);
		expect(new URL(page.url()).pathname.replace(/\/$/u, "")).toBe(`/${locale}`);
		const hero = page.locator(manifest.hero.selector);
		await expect(hero).toHaveCount(1);
		await expect(hero).toBeVisible();
		await expect(hero).toHaveAttribute("alt", manifest.hero.alt[locale]);
		const image = await hero.evaluate(async (element) => {
			if (!(element instanceof HTMLImageElement)) throw new Error("Hero binding is not an img");
			await element.decode();
			await document.fonts.ready;
			return {
				src: element.currentSrc,
				width: element.naturalWidth,
				height: element.naturalHeight,
			};
		});
		expect(image.src).toBe(heroURL);
		expect(image.width).toBeGreaterThan(0);
		expect(image.height).toBeGreaterThan(0);
		expect(Math.abs(image.width / image.height / context.proof.hero.ratio - 1)).toBeLessThan(0.01);
		expect(received.length).toBeGreaterThan(0);
		const response = received.at(-1);
		expect(response.status()).toBe(200);
		expect(response.headers()["content-type"]).toContain("image/svg+xml");
		const servedSha256 = sha256(await response.body());
		expect(servedSha256).toBe(PINS.commonSvgSha256);

		await hero.scrollIntoViewIfNeeded();
		await expect
			.poll(async () =>
				hero.evaluate((element) => {
					for (let current = element; current; current = current.parentElement) {
						if (Number(getComputedStyle(current).opacity) < 0.99) return false;
					}
					return true;
				}),
			)
			.toBe(true);
		const box = await hero.boundingBox();
		expect(box).not.toBeNull();
		expect(box.width).toBeGreaterThan(0);
		expect(box.height).toBeGreaterThan(0);
		expect(Math.abs(box.width / box.height / context.proof.hero.ratio - 1)).toBeLessThan(0.02);
		const viewport = page.viewportSize();
		expect(box.x).toBeGreaterThanOrEqual(-1);
		expect(box.x + box.width).toBeLessThanOrEqual(viewport.width + 1);
		expect(box.y).toBeGreaterThanOrEqual(-1);
		expect(box.y + box.height).toBeLessThanOrEqual(viewport.height + 1);
		const overflow = await page.evaluate(
			() => document.documentElement.scrollWidth - window.innerWidth,
		);
		expect(overflow).toBeLessThanOrEqual(1);

		let iconProof = null;
		if (manifest.icon) {
			const matchingLinks = await page.locator("link[rel~='icon']").evaluateAll(
				(links, expectedPath) =>
					links
						.map((link) => link.href)
						.filter((href) => {
							const url = new URL(href);
							return url.origin === location.origin && url.pathname === expectedPath;
						}),
				manifest.icon.publicPath,
			);
			expect(matchingLinks.length).toBeGreaterThan(0);
			const iconResponse = await page.request.get(matchingLinks[0]);
			expect(iconResponse.status()).toBe(200);
			const iconSha256 = sha256(await iconResponse.body());
			expect(iconSha256).toBe(PINS.correctedIcoSha256);
			iconProof = { href: matchingLinks[0], servedSha256: iconSha256 };
		}
		// This is evidence capture. No toHaveScreenshot, golden copy, or --update-snapshots.
		const screenshotPath = testInfo.outputPath("candidate-viewport.png");
		const screenshot = await page.screenshot({
			path: screenshotPath,
			animations: "disabled",
			scale: "css",
		});
		await testInfo.attach("candidate-viewport.png", {
			path: screenshotPath,
			contentType: "image/png",
		});
		const observationPath = testInfo.outputPath("brand-candidate-runtime.json");
		writeFileSync(
			observationPath,
			JSON.stringify(
				{
					schema: "yl-brand-runtime-observation/v1",
					scope: "technical_candidate_only",
					runId: context.proof.runId,
					manifestSha256: context.proof.manifestSha256,
					implementationSha256: context.proof.implementationSha256,
					sourceCommit: context.proof.sourceCommit,
					buildTreeSha256: context.proof.buildTreeSha256,
					locale,
					project: testInfo.project.name,
					viewport,
					url: page.url(),
					hero: { ...image, box, servedSha256, alt: manifest.hero.alt[locale] },
					icon: iconProof,
					iconStatus: iconProof ? "mapped_response_checked" : "not_mapped_not_tested",
					screenshotSha256: sha256(screenshot),
					founderApproved: false,
					releaseAuthorized: false,
				},
				null,
				2,
			) + "\n",
		);
		await testInfo.attach("brand-candidate-runtime.json", {
			path: observationPath,
			contentType: "application/json",
		});
	});
}
