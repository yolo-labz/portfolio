// Visual-regression harness for portfolio.home301server.com.br
// Layer 3 of META-PLATFORM-PLAN-2026Q2.md — Next.js variant of blog PR #28
// (phsb5321/blog) for the same Playwright `toHaveScreenshot` pattern.
//
// Both the seed step and CI run inside the pinned Playwright Docker image
// (mcr.microsoft.com/playwright:v1.50.1-noble) so font/freetype/harfbuzz
// versions are byte-stable across both. Baselines live next to the spec file
// (tests/visual/portfolio.spec.ts-snapshots/) and are committed in-repo.
// macOS-side runs are advisory only — pixel diffs vs the Linux baselines
// are expected.
//
// The site is built once via `next build` and served by `next start` — this
// avoids dev-mode HMR / Fast Refresh injection (which shifts layout
// pixel-for-pixel) and keeps CI deterministic.

import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "./tests/visual",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 2 : undefined,
	reporter: [["html", { outputFolder: "test-results/playwright-report", open: "never" }], ["list"]],
	outputDir: "test-results/artifacts",
	// Drop platform suffix so baselines are renderer-pinned, not OS-pinned.
	// Both local seeding and CI run inside the same Docker image, so font
	// byte-stability is preserved without splitting baselines per OS.
	snapshotPathTemplate: "{testDir}/{testFilePath}-snapshots/{arg}-{projectName}{ext}",
	webServer: {
		// Build the @portfolio/web Next.js workspace, copy public/ + static/ into
		// the standalone bundle (Next.js standalone mode does NOT do this for
		// you — it's documented behavior, see
		// https://nextjs.org/docs/app/api-reference/config/next-config-js/output#automatically-copying-traced-files
		// ), then run the standalone server on PORT=3000.
		//
		// `next start` warns + falls back when `output: 'standalone'` is set, so
		// use the standalone server path directly to mirror the Dockerfile.dokku
		// production path 1:1. PORT=3000 must match `port` and `baseURL` below.
		command: [
			"pnpm --filter @portfolio/web build",
			"cp -R apps/web/public apps/web/.next/standalone/apps/web/public",
			"cp -R apps/web/.next/static apps/web/.next/standalone/apps/web/.next/static",
			"PORT=3000 HOSTNAME=127.0.0.1 node apps/web/.next/standalone/apps/web/server.js",
		].join(" && "),
		port: 3000,
		timeout: 180_000,
		reuseExistingServer: !process.env.CI,
		env: {
			NEXT_TELEMETRY_DISABLED: "1",
			NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
		},
	},
	use: {
		baseURL: "http://localhost:3000",
		trace: "retain-on-failure",
	},
	expect: {
		toHaveScreenshot: {
			maxDiffPixelRatio: 0.02,
			animations: "disabled",
			scale: "css",
		},
	},
	projects: [
		{
			name: "chromium-desktop",
			use: { viewport: { width: 1280, height: 800 } },
		},
		{
			name: "mobile",
			use: { viewport: { width: 390, height: 844 } },
		},
	],
});
