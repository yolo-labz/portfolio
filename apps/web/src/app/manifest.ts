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
		// Next.js only emits metadata image routes for the reserved file names
		// (icon, icon1, icon2, apple-icon, opengraph-image). The previous
		// icon-192/icon-512 files were never routed, so both entries 404'd — the
		// installable-PWA icons have been broken; these now hit icon1.tsx /
		// icon2.tsx. The ?<hash> Next appends is cache-busting only, so the bare
		// paths are stable.
		icons: [
			{ src: "/icon1", sizes: "192x192", type: "image/png" },
			{ src: "/icon2", sizes: "512x512", type: "image/png" },
		],
	};
}
