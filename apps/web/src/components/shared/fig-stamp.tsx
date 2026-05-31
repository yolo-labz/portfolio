// Engineering-notebook "fig. N — subject" stamp, per VISUAL-IDENTITY.md §2.4.
// Monospace, subtext color, used to mark sections as reference artifacts.
interface FigStampProps {
	n: string;
	label: string;
	className?: string;
}

export function FigStamp({ n, label, className }: FigStampProps) {
	return (
		<span className={`font-mono text-xs text-text-muted ${className ?? ""}`}>
			fig. {n} — {label}
		</span>
	);
}
