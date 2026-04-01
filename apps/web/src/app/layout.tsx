import type { Metadata } from "next";
import { inter, jetbrainsMono } from "@/lib/fonts";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
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

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
			<body>
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
}
