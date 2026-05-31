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
				background: "#1e1e2e",
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "flex-end",
				padding: "60px 80px",
				borderLeft: "10px solid #cba6f7",
			}}
		>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div
					style={{
						fontSize: 52,
						fontWeight: 700,
						color: "#cdd6f4",
						lineHeight: 1.2,
					}}
				>
					{project?.title ?? "Project"}
				</div>
				<div
					style={{
						fontSize: 24,
						color: "#a6adc8",
						marginTop: 16,
						lineHeight: 1.4,
					}}
				>
					{project?.tagline ?? ""}
				</div>
				<div
					style={{
						fontSize: 18,
						color: "#cba6f7",
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
