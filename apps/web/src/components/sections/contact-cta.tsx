"use client";

import { motion } from "motion/react";
import { Button } from "@portfolio/ui";
import { useIntersection } from "@/hooks/use-intersection";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ContactCTA() {
	const { ref, isVisible } = useIntersection(0.1);
	const reduced = useReducedMotion();

	return (
		<section id="contact" className="py-24 px-6" ref={ref}>
			<motion.div
				className="mx-auto max-w-2xl text-center"
				initial={reduced ? {} : { opacity: 0, y: 20 }}
				animate={isVisible ? { opacity: 1, y: 0 } : {}}
				transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
			>
				<h2 className="text-3xl font-bold tracking-tight">
					Have a project in mind?
				</h2>
				<p className="mt-4 text-text-muted leading-relaxed">
					I take on data extraction, automation, and full-stack projects.
					Fixed-price or hourly. Fast turnaround, clean deliverables,
					async communication.
				</p>
				<div className="mt-8 flex items-center justify-center gap-4">
					<Button
						variant="primary"
						size="lg"
						as="a"
						href="https://www.upwork.com/freelancers/~01dae7197e964ddf3f"
						target="_blank"
						rel="noopener noreferrer"
					>
						Hire on Upwork
					</Button>
					<Button variant="secondary" size="lg" as="a" href="mailto:pedro@balbino.dev">
						Email Directly
					</Button>
				</div>
			</motion.div>
		</section>
	);
}
