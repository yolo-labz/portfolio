import { ImageResponse } from "next/og";

// Shared "P" letter mark behind app/icon.tsx, app/icon1.tsx, app/icon2.tsx and
// app/apple-icon.tsx. Next.js needs one route file per size (the reserved
// metadata names are icon, icon1, icon2, apple-icon), so the geometry is a
// parameter here instead of being pasted into four near-identical components.
export interface LetterMarkOptions {
	size: number;
	fontSize: number;
	radius: number;
	/** Flat background: the gradient reads as noise at favicon scale. */
	flat?: boolean;
}

const GRADIENT = "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)";

export function letterMark({ size, fontSize, radius, flat = false }: LetterMarkOptions) {
	return new ImageResponse(
		<div
			style={{
				fontSize,
				background: flat ? "#1a1a2e" : GRADIENT,
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				color: "#5ec4a0",
				fontWeight: 700,
				borderRadius: radius,
			}}
		>
			P
		</div>,
		{ width: size, height: size },
	);
}
