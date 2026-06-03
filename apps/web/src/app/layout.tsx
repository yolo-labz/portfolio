import type { ReactNode } from "react";
import "./globals.css";

// Pass-through root layout. The real <html>/<body>, providers, Header/Footer
// live in app/[locale]/layout.tsx. This file exists only because a root
// not-found.tsx requires a sibling root layout (Next.js requirement); it must
// NOT render <html>/<body> itself.
export default function RootLayout({ children }: { children: ReactNode }) {
	return children;
}
