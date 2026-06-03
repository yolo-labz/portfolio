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

export default withNextIntl(nextConfig);
