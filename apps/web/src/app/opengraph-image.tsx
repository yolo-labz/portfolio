import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Pedro Balbino — Compliance-Grade AI Architect";

export default function OGImage() {
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
				borderLeft: "10px solid #00c77a",
			}}
		>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div style={{ fontSize: 30, color: "#a6adc8", marginBottom: 18 }}>
					Most AI stacks fail audit at the same three seams.
				</div>
				<div style={{ fontSize: 60, fontWeight: 700, color: "#cdd6f4", lineHeight: 1.1 }}>
					Pedro Balbino
				</div>
				<div style={{ fontSize: 30, color: "#00c77a", marginTop: 16 }}>
					Compliance-Grade AI Architect
				</div>
				<div style={{ fontSize: 20, color: "#a6adc8", marginTop: 14 }}>
					Regulated LATAM &amp; global workloads · RAG · agents · MCP · audit-trail by design
				</div>
			</div>
		</div>,
		{ ...size },
	);
}
