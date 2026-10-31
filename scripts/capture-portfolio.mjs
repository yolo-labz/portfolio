#!/usr/bin/env node
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const site = process.argv[2] || "http://localhost:3000";
assert(["localhost", "127.0.0.1"].includes(new URL(site).hostname), "Local builds only");
const assets = resolve("docs/assets");
mkdirSync(`${assets}/screenshots`, { recursive: true });
const browser = await chromium.launch();
const routes = [
	["en", "home"],
	["en/projects/compliance-tax-agent", "projects"],
	["en/about", "about"],
];
try {
	const context = await browser.newContext({
		viewport: { width: 430, height: 2800 },
		reducedMotion: "reduce",
	});
	await context.route("**/*", (route) => {
		const url = new URL(route.request().url());
		return url.origin === new URL(site).origin || url.protocol === "file:"
			? route.continue()
			: route.abort();
	});
	const page = await context.newPage();
	for (const [route, name] of routes) {
		const response = await page.goto(`${site}/${route}`, { waitUntil: "networkidle" });
		assert.equal(response.status(), 200, route);
		await page.evaluate(async () => {
			document.documentElement.style.scrollBehavior = "auto";
			await document.fonts.ready;
			for (let y = 0; y < document.body.scrollHeight; y += 600) {
				window.scrollTo(0, y);
				await new Promise((r) => setTimeout(r, 80));
			}
			window.scrollTo(0, 0);
		});
		await page.waitForTimeout(500);
		assert((await page.locator("h1").innerText()).length > 10, "Missing rendered heading");
		await page.screenshot({
			path: `${assets}/screenshots/${name}-tall.png`,
			fullPage: true,
			animations: "disabled",
		});
	}
	await page.setViewportSize({ width: 1200, height: 900 });
	await page.goto(pathToFileURL(`${assets}/portfolio-grid.html`).href, {
		waitUntil: "networkidle",
	});
	await page.screenshot({ path: `${assets}/portfolio-grid.png`, animations: "disabled" });
	const sha256 = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
	writeFileSync(
		`${assets}/portfolio-grid.json`,
		`${JSON.stringify(
			{
				capturedAt: new Date().toISOString(),
				source: "local production build, not deployed",
				base: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
				sourceSha256: sha256("apps/web/src/data/projects.ts"),
				englishMessagesSha256: sha256("apps/web/messages/en.json"),
				browser: browser.version(),
				routes: Object.fromEntries(routes.map(([route, name]) => [name, `/${route}`])),
				width: 1200,
				height: 900,
				audio: false,
				sha256: sha256(`${assets}/portfolio-grid.png`),
			},
			null,
			"\t",
		)}\n`,
	);
	console.log("Captured local production pages and 1200x900 grid");
} finally {
	await browser.close();
}
