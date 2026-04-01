"use client";

import { motion } from "motion/react";
import { Badge } from "@portfolio/ui";
import { skills } from "@/data/skills";
import { useIntersection } from "@/hooks/use-intersection";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function SkillsMatrix() {
	const { ref, isVisible } = useIntersection(0.05);
	const reduced = useReducedMotion();

	return (
		<section id="skills" className="py-24 px-6 bg-bg-elevated" ref={ref}>
			<div className="mx-auto max-w-6xl">
				<div className="mb-12">
					<h2 className="text-3xl font-bold tracking-tight">Technical Skills</h2>
					<p className="mt-2 text-text-muted">Organized by what I solve, not what I know.</p>
				</div>

				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{skills.map((domain, i) => (
						<motion.div
							key={domain.domain}
							initial={reduced ? {} : { opacity: 0, y: 20 }}
							animate={isVisible ? { opacity: 1, y: 0 } : {}}
							transition={{
								duration: 0.5,
								delay: reduced ? 0 : i * 0.08,
								ease: [0.22, 1, 0.36, 1],
							}}
							className="rounded-lg border border-border bg-bg-card p-6"
						>
							<h3 className="font-semibold text-text">{domain.domain}</h3>
							<p className="mt-1 text-sm text-text-muted">{domain.description}</p>
							<div className="mt-4 flex flex-wrap gap-1.5">
								{domain.technologies.map((tech) => (
									<Badge key={tech}>{tech}</Badge>
								))}
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
