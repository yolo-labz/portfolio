import type { ComponentProps } from "react";
import { cn } from "./utils";

export interface CardProps extends ComponentProps<"div"> {
	hover?: boolean;
}

export function Card({ hover = false, className, ...props }: CardProps) {
	return (
		<div
			className={cn(
				"rounded-lg border border-border bg-bg-card p-6",
				hover && "transition-all hover:border-text-muted hover:shadow-lg hover:shadow-accent/5",
				className,
			)}
			{...props}
		/>
	);
}
