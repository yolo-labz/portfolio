import { notFound } from "next/navigation";

// Required for the LOCALIZED not-found (app/[locale]/not-found.tsx) to render
// under `localePrefix: 'as-needed'`. Without this catch-all, an unmatched path
// under a valid locale (e.g. /pt/does-not-exist) would fall through to the
// global root not-found and lose the locale layout.
export default function CatchAllPage() {
	notFound();
}
