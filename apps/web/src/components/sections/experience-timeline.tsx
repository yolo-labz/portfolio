"use client";

import { motion } from "motion/react";
import { experience } from "@/data/experience";
import { useIntersection } from "@/hooks/use-intersection";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ExperienceTimeline() {
	const { ref, isVisible } = useIntersection(0.05);
	const reduced = useReducedMotion();

	return (
		<section id="experience" className="py-24 px-6" ref={ref}>
			<div className="mx-auto max-w-6xl">
				<div className="mb-12">
					<h2 className="text-3xl font-bold tracking-tight">Experience</h2>
					<p className="mt-2 text-text-muted">What I shipped and where.</p>
				</div>

				<div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
					{experience.map((entry, i) => (
						<motion.div
							key={`${entry.company}-${entry.period}`}
							initial={reduced ? {} : { opacity: 0, x: -20 }}
							animate={isVisible ? { opacity: 1, x: 0 } : {}}
							transition={{
								duration: 0.5,
								delay: reduced ? 0 : i * 0.15,
								ease: [0.22, 1, 0.36, 1],
							}}
							className="relative pl-10"
						>
							<div
								className={`absolute left-0 top-2 h-6 w-6 rounded-full border-2 ${
									entry.current
										? "border-accent bg-accent/20"
										: "border-border bg-bg-card"
								}`}
							/>

							<div className="rounded-lg border border-border bg-bg-card p-6">
								<div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
									<h3 className="font-semibold">{entry.role}</h3>
									<span className="font-mono text-xs text-text-muted">
										{entry.period}
									</span>
								</div>
								<p className="mt-1 text-sm text-accent">{entry.company}</p>
								<ul className="mt-4 space-y-2">
									{entry.deliverables.map((item) => (
										<li
											key={item}
											className="text-sm text-text-muted leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-text-muted/50"
										>
											{item}
										</li>
									))}
								</ul>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
