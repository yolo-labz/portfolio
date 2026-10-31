import { Inter, JetBrains_Mono } from "next/font/google";

export const inter = Inter({
	subsets: ["latin"],
	// Optical sizing: the opsz axis gives headings Inter's display cut.
	axes: ["opsz"],
	display: "swap",
	variable: "--font-inter",
});

export const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-jetbrains",
});
