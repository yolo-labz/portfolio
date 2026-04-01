import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Pedro Balbino — Software Engineer",
		short_name: "Pedro B.",
		description:
			"Production-grade data pipelines, automation systems, and full-stack applications.",
		start_url: "/",
		display: "standalone",
		background_color: "#1a1a2e",
		theme_color: "#1a1a2e",
		icons: [
			{ src: "/icon-192", sizes: "192x192", type: "image/png" },
			{ src: "/icon-512", sizes: "512x512", type: "image/png" },
		],
	};
}
