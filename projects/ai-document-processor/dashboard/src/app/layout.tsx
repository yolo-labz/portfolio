import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
	title: "AI Document Processor",
	description: "Upload, classify, and extract structured data from documents using AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
			<body className="min-h-screen">
				<header className="border-b border-border px-6 py-5">
					<h1 className="font-mono text-xl font-semibold text-accent">Document Processor</h1>
					<p className="mt-1 text-sm text-text-muted">
						Upload, classify, and extract structured data
					</p>
				</header>
				<main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
			</body>
		</html>
	);
}
