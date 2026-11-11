import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
};

// Self-hosted GlitchTip: runtime error reporting only (via src/sentry.*.config
// + instrumentation). No source-map upload — no Sentry SaaS auth token/org.
export default withSentryConfig(nextConfig, {
	silent: !process.env.CI,
	sourcemaps: { disable: true },
	webpack: { treeshake: { removeDebugLogging: true } },
});
