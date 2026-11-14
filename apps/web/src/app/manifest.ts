import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Pedro Balbino | Software Engineer",
		short_name: "Pedro B.",
		description:
			"Production-grade data pipelines, automation systems, and full-stack applications.",
		start_url: "/",
		display: "standalone",
		background_color: "#1e1e2e",
		theme_color: "#1e1e2e",
		// Plain files in public/, copied from yolo-labz/.github mark/build.py output.
		icons: [
			{ src: "/icon-192.png", sizes: "192x192", type: "image/png" },
			{ src: "/icon-512.png", sizes: "512x512", type: "image/png" },
		],
	};
}
