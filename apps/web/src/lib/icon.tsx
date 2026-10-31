import { ImageResponse } from "next/og";

// Shared "P" letter mark behind app/icon.tsx, app/icon1.tsx, app/icon2.tsx and
// app/apple-icon.tsx. Next.js needs one route file per size (the reserved
// metadata names are icon, icon1, icon2, apple-icon), so the geometry is a
// parameter here instead of being pasted into four near-identical components.
export interface LetterMarkOptions {
	size: number;
	fontSize: number;
	radius: number;
	/** Kept for the call sites; every size is flat now (no gradients, per DESIGN.md). */
	flat?: boolean;
}

// Palette-true mark: emerald #00c77a on the base ground #1e1e2e (DESIGN.md colors).
export function letterMark({ size, fontSize, radius }: LetterMarkOptions) {
	return new ImageResponse(
		<div
			style={{
				fontSize,
				background: "#1e1e2e",
				width: "100%",
				height: "100%",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				color: "#00c77a",
				fontWeight: 700,
				borderRadius: radius,
			}}
		>
			P
		</div>,
		{ width: size, height: size },
	);
}
