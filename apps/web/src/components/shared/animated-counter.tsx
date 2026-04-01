"use client";

import { useEffect, useState } from "react";

interface AnimatedCounterProps {
	value: number;
	reduced: boolean;
	duration?: number;
}

export function AnimatedCounter({ value, reduced, duration = 1200 }: AnimatedCounterProps) {
	const [current, setCurrent] = useState(reduced ? value : 0);

	useEffect(() => {
		if (reduced) {
			setCurrent(value);
			return;
		}

		const steps = 40;
		const increment = value / steps;
		const stepDuration = duration / steps;
		let step = 0;

		const timer = setInterval(() => {
			step++;
			if (step >= steps) {
				setCurrent(value);
				clearInterval(timer);
			} else {
				setCurrent(Number((increment * step).toFixed(1)));
			}
		}, stepDuration);

		return () => clearInterval(timer);
	}, [value, reduced, duration]);

	const display = Number.isInteger(value) ? Math.round(current) : current.toFixed(1);

	return <>{display}</>;
}
