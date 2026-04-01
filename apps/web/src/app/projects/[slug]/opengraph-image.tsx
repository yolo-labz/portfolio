import { ImageResponse } from "next/og";
import { projects } from "@/data/projects";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
	return projects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectOGImage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const project = projects.find((p) => p.slug === slug);

	return new ImageResponse(
		<div
			style={{
				background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%)",
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "flex-end",
				padding: "60px 80px",
			}}
		>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div
					style={{
						fontSize: 52,
						fontWeight: 700,
						color: "#e8e8ec",
						lineHeight: 1.2,
					}}
				>
					{project?.title ?? "Project"}
				</div>
				<div
					style={{
						fontSize: 24,
						color: "#9898a8",
						marginTop: 16,
						lineHeight: 1.4,
					}}
				>
					{project?.tagline ?? ""}
				</div>
				<div
					style={{
						fontSize: 18,
						color: "#5ec4a0",
						marginTop: 24,
					}}
				>
					pedrobalbino.dev
				</div>
			</div>
		</div>,
		{ ...size },
	);
}
