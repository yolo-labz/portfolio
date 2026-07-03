import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	output: "standalone",
	transpilePackages: ["@portfolio/ui"],
	images: {
		formats: ["image/avif", "image/webp"],
	},
	experimental: {
		optimizePackageImports: ["motion"],
	},
};

// Auto-detects ./src/i18n/request.ts as the request config.
const withNextIntl = createNextIntlPlugin();

// Self-hosted GlitchTip: runtime error reporting only (via src/sentry.*.config
// + instrumentation). No source-map upload — no Sentry SaaS auth token/org.
export default withSentryConfig(withNextIntl(nextConfig), {
	silent: !process.env.CI,
	sourcemaps: { disable: true },
	disableLogger: true,
});
