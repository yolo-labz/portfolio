import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SITE_URL } from "@/lib/constants";
import "./globals.css";

// Root-level metadata files (opengraph-image.tsx, manifest.ts, icons,
// not-found.tsx) resolve `metadataBase` against THIS segment — the
// [locale]/layout.tsx metadataBase does not propagate up to the root, so
// without this Next falls back to the build host (localhost in CI) when
// resolving absolute OG/Twitter image URLs. Pin it to the canonical origin.
export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
};

// Pass-through root layout. The real <html>/<body>, providers, Header/Footer
// live in app/[locale]/layout.tsx. This file exists only because a root
// not-found.tsx requires a sibling root layout (Next.js requirement); it must
// NOT render <html>/<body> itself.
export default function RootLayout({ children }: { children: ReactNode }) {
	return children;
}
