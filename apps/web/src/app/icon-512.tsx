import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon512() {
	return new ImageResponse(
		<div
			style={{
				fontSize: 288,
				background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				color: "#5ec4a0",
				fontWeight: 700,
				borderRadius: 102,
			}}
		>
			P
		</div>,
		{ ...size },
	);
}
