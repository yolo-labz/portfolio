import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	// All supported locales. `en` is the source; `pt` (pt-BR) and `es` follow.
	locales: ["en", "pt", "es"],
	defaultLocale: "en",
	// Every locale is prefixed: /en, /pt, /es. `/` does a single clean redirect
	// to the detected (or default) locale. We deliberately use 'always' rather
	// than 'as-needed': the as-needed default-locale-root serves en via an
	// INTERNAL rewrite, and in the standalone/production build next-intl builds
	// that rewrite against a cross-origin host (localhost vs the request host),
	// which Next.js materializes as a `location: /` self-redirect ->
	// ERR_TOO_MANY_REDIRECTS. 'always' uses a redirect (no rewrite branch) and
	// avoids the loop entirely, in CI and behind the Dokku proxy alike.
	localePrefix: "always",
});

export type AppLocale = (typeof routing.locales)[number];
