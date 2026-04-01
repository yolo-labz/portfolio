import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-jetbrains",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Real Estate Price Tracker | Austin, TX",
	description:
		"Track real estate prices, trends, and market data for Austin, TX.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
			<body className="min-h-screen">
				<header className="border-b border-border px-6 py-4">
					<h1 className="font-mono text-xl font-bold text-accent">
						Real Estate Tracker
					</h1>
					<p className="text-sm text-text-muted">
						Austin, TX Market Data
					</p>
				</header>
				<main className="p-6">{children}</main>
			</body>
		</html>
	);
}
