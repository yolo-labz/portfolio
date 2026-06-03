import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 renamed middleware.ts -> proxy.ts (the next-intl import path is
// unchanged). Handles locale negotiation + as-needed prefix redirects.
export default createMiddleware(routing);

export const config = {
	// Skip API routes, Next internals, and any path with a dot (static files:
	// favicon.ico, robots.txt, sitemap.xml, *.png, ...). Everything else gets
	// locale handling — including the unprefixed default-locale paths.
	matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
