"use client";

import { Button } from "@portfolio/ui";
import { motion } from "motion/react";
import { useIntersection } from "@/hooks/use-intersection";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ContactCTA() {
	const { ref, isVisible } = useIntersection(0.1);
	const reduced = useReducedMotion();

	return (
		<section id="contact" aria-labelledby="contact-heading" className="py-24 px-6" ref={ref}>
			<motion.div
				className="mx-auto max-w-2xl text-center"
				initial={reduced ? {} : { opacity: 0, y: 20 }}
				animate={isVisible ? { opacity: 1, y: 0 } : {}}
				transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
			>
				<h2 id="contact-heading" className="text-3xl font-bold tracking-tight">
					Contact
				</h2>
				<p className="mt-4 text-text-muted leading-relaxed">
					Questions about any of the patterns above — RAG architecture, Chrome automation,
					Claude Code plugins, NixOS fleets? Email is the fastest way.
				</p>
				<div className="mt-8 flex items-center justify-center gap-4">
					<Button variant="primary" size="lg" as="a" href="mailto:pedro@balbino.dev">
						Email
					</Button>
					<Button
						variant="secondary"
						size="lg"
						as="a"
						href="https://github.com/phsb5321"
						target="_blank"
						rel="noopener noreferrer"
					>
						GitHub
					</Button>
				</div>
			</motion.div>
		</section>
	);
}
