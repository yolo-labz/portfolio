// Authored 16px line icons: one stroke (1.5), round caps, currentColor. The only
// icons on the site; no glyph or emoji stands in for one.
interface IconProps {
	className?: string;
}

function LineIcon({ d, className }: IconProps & { d: string }) {
	return (
		<svg
			viewBox="0 0 16 16"
			width="16"
			height="16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			className={className}
		>
			<path d={d} />
		</svg>
	);
}

export const ArrowRight = (props: IconProps) => <LineIcon d="M3 8h10M9 4l4 4-4 4" {...props} />;
export const ArrowLeft = (props: IconProps) => <LineIcon d="M13 8H3M7 4 3 8l4 4" {...props} />;
export const ArrowUpRight = (props: IconProps) => <LineIcon d="M5 11 11 5M6 5h5v5" {...props} />;
