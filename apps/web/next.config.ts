import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	output: "standalone",
	transpilePackages: ["@portfolio/ui"],
	images: {
		formats: ["image/avif", "image/webp"],
	},
	// No `experimental.optimizePackageImports`: its only entry was "motion", and
	// motion/react left the bundle in the D2 remodel (#167), so the mapping was
	// rewriting imports of a package nothing imports.
};

// Auto-detects ./src/i18n/request.ts as the request config.
const withNextIntl = createNextIntlPlugin();

// Self-hosted GlitchTip: runtime error reporting only (via src/sentry.*.config
// + instrumentation). No source-map upload — no Sentry SaaS auth token/org.
export default withSentryConfig(withNextIntl(nextConfig), {
	silent: !process.env.CI,
	sourcemaps: { disable: true },
	webpack: { treeshake: { removeDebugLogging: true } },
});
