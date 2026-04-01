import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-sans",
	display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Executive Job Board | Curated Leadership Roles",
	description:
		"Aggregated executive and leadership job listings from top sources. C-Suite, VP, and Director roles updated daily.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			className={`${inter.variable} ${jetbrainsMono.variable}`}
		>
			<body>
				<header className="border-b border-border">
					<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
						<h1 className="font-mono text-xl font-semibold tracking-tight text-accent">
							Executive Jobs
						</h1>
						<a
							href="/feed.xml"
							className="font-mono text-sm text-text-muted transition-colors hover:text-accent"
							aria-label="RSS Feed"
						>
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								className="inline-block"
								aria-hidden="true"
							>
								<path d="M4 11a9 9 0 0 1 9 9" />
								<path d="M4 4a16 16 0 0 1 16 16" />
								<circle cx="5" cy="19" r="1" />
							</svg>
							<span className="ml-1.5 hidden sm:inline">RSS</span>
						</a>
					</div>
				</header>
				<main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
			</body>
		</html>
	);
}
