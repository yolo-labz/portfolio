import type { ComponentProps } from "react";
import { cn } from "./utils";

const variants = {
	default: "bg-surface text-text-muted border-border",
	accent: "bg-accent-dim text-accent border-accent/20",
} as const;

export interface BadgeProps extends ComponentProps<"span"> {
	variant?: keyof typeof variants;
}

export function Badge({ variant = "default", className, ...props }: BadgeProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-mono",
				variants[variant],
				className,
			)}
			{...props}
		/>
	);
}
