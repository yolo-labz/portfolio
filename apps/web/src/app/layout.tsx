import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SITE_URL } from "@/lib/constants";
import { inter, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: "Pedro Balbino — Software Engineer",
	description:
		"Production-grade data pipelines, automation systems, and full-stack applications. Python, TypeScript, AWS, Terraform.",
	openGraph: {
		title: "Pedro Balbino — Software Engineer",
		description:
			"Production-grade data pipelines, automation systems, and full-stack applications.",
		type: "website",
	},
};

export const viewport: Viewport = {
	themeColor: "#1a1a2e",
};

const jsonLd = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "WebSite",
			url: SITE_URL,
			name: "Pedro Balbino — Software Engineer",
			description:
				"Production-grade data pipelines, automation systems, and full-stack applications.",
		},
		{
			"@type": "Person",
			name: "Pedro Henrique Souza Balbino",
			jobTitle: "Software Engineer",
			url: SITE_URL,
			knowsAbout: [
				"Python",
				"TypeScript",
				"AWS",
				"Terraform",
				"Data Pipelines",
				"Web Automation",
				"FastAPI",
				"Next.js",
			],
			sameAs: [
				"https://github.com/phsb5321",
				"https://www.upwork.com/freelancers/~01dae7197e964ddf3f",
				"https://linkedin.com/in/pedro-balbino",
			],
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
