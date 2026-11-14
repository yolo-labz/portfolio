import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 renamed middleware.ts -> proxy.ts (the next-intl import path is
// unchanged). Handles locale negotiation + the `/` -> /<locale> redirect.
export default createMiddleware(routing);

export const config = {
	// Skip API routes, Next internals, extension-less metadata routes, and any
	// path with a dot (static files: favicon.ico, robots.txt, sitemap.xml,
	// *.png, ...). Everything else gets locale handling.
	//
	// The static app/opengraph-image.png route has no extension in its URL and lives at
	// the ROOT only. Without it here the locale middleware 307-redirects it to
	// /en/opengraph-image, which 404s (there is no [locale]/opengraph-image route).
	// The icons are plain files (icon.svg, apple-icon.png, favicon.ico), so the dot rule covers them.
	matcher:
		"/((?!api|trpc|_next|_vercel|(?:opengraph-image)(?:/|$)|.*\\..*).*)",
};
