import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SITE_URL } from "@/lib/constants";
import { inter, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: "Pedro Balbino — Compliance-Grade AI Architect",
	description:
		"Compliance-grade AI architecture for regulated LATAM & global workloads: production RAG, agent systems, and MCP integrations with audit trails, decision provenance, and cost ceilings designed in from day one.",
	openGraph: {
		title: "Pedro Balbino — Compliance-Grade AI Architect",
		description:
			"Production RAG, agent systems, and MCP integrations for regulated workloads — where the audit trail, decision provenance, and cost ceiling are first-class architectural citizens.",
		type: "website",
	},
};

export const viewport: Viewport = {
	themeColor: "#1e1e2e",
};

const jsonLd = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "WebSite",
			url: SITE_URL,
			name: "Pedro Balbino — Compliance-Grade AI Architect",
			description:
				"Production RAG, agent systems, and MCP integrations for regulated LATAM & global workloads — audit trails, decision provenance, and cost ceilings designed in from day one.",
		},
		{
			"@type": "Person",
			name: "Pedro Henrique Souza Balbino",
			jobTitle: "Compliance-Grade AI Architect",
			url: SITE_URL,
			knowsAbout: [
				"Retrieval-Augmented Generation",
				"Model Context Protocol",
				"LLM agent systems",
				"AI compliance",
				"Audit-trail design",
				"LGPD",
				"pgvector",
				"Go",
				"TypeScript",
				"Python",
				"Rust",
				"Terraform",
				"AWS",
			],
			sameAs: ["https://github.com/phsb5321", "https://linkedin.com/in/balbinopedro"],
		},
	],
};

// JSON-LD content is a static constant — no user input, safe to serialize.
// The replace call escapes < to prevent script injection per Next.js docs.
const jsonLdHtml = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
			<body>
				<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml }} />
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-bg focus:outline-none"
				>
					Skip to main content
				</a>
				<Header />
				<main id="main-content">{children}</main>
				<Footer />
			</body>
		</html>
	);
}
