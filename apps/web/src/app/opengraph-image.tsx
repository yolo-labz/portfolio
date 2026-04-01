import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Pedro Balbino — Software Engineer";

export default function OGImage() {
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
						fontSize: 64,
						fontWeight: 700,
						color: "#e8e8ec",
						lineHeight: 1.1,
					}}
				>
					Pedro Balbino
				</div>
				<div
					style={{
						fontSize: 28,
						color: "#5ec4a0",
						marginTop: 16,
					}}
				>
					Software Engineer
				</div>
				<div
					style={{
						fontSize: 20,
						color: "#9898a8",
						marginTop: 12,
					}}
				>
					Data Extraction · Automation · Full-Stack · AWS
				</div>
			</div>
		</div>,
		{ ...size },
	);
}
