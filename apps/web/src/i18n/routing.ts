import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	// All supported locales. `en` is the source; `pt` (pt-BR) and `es` follow.
	locales: ["en", "pt", "es"],
	defaultLocale: "en",
	// `en` is served unprefixed (`/`, `/about`); others are prefixed
	// (`/pt`, `/es/about`). A stray `/en/...` redirects to the bare path.
	localePrefix: "as-needed",
});

export type AppLocale = (typeof routing.locales)[number];
