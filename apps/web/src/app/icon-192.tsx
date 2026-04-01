import { ImageResponse } from "next/og";

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

export default function Icon192() {
	return new ImageResponse(
		<div
			style={{
				fontSize: 108,
				background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				color: "#5ec4a0",
				fontWeight: 700,
				borderRadius: 38,
			}}
		>
			P
		</div>,
		{ ...size },
	);
}
