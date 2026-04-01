import type { ElementType, ReactNode } from "react";
import { cn } from "./utils";

const variants = {
	primary:
		"bg-accent text-bg font-medium hover:bg-accent-hover active:scale-[0.98] transition-all",
	secondary:
		"border border-border text-text hover:bg-surface hover:border-text-muted active:scale-[0.98] transition-all",
	ghost: "text-text-muted hover:text-text hover:bg-surface transition-colors",
} as const;

const sizes = {
	sm: "px-3 py-1.5 text-sm rounded-sm",
	md: "px-5 py-2.5 text-sm rounded-md",
	lg: "px-7 py-3 text-base rounded-md",
} as const;

export interface ButtonProps {
	variant?: keyof typeof variants;
	size?: keyof typeof sizes;
	className?: string;
	children?: ReactNode;
	as?: ElementType;
	[key: string]: unknown;
}

export function Button({
	variant = "primary",
	size = "md",
	className,
	as: Component = "button",
	...props
}: ButtonProps) {
	return (
		<Component
			className={cn(
				"inline-flex items-center justify-center font-sans cursor-pointer no-underline",
				variants[variant],
				sizes[size],
				className,
			)}
			{...props}
		/>
	);
}
