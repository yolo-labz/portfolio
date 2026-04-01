"use client";

import { Badge } from "@portfolio/ui";
import { motion } from "motion/react";
import Link from "next/link";
import { projects } from "@/data/projects";
import { useIntersection } from "@/hooks/use-intersection";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function ProjectShowcase() {
	const { ref, isVisible } = useIntersection(0.05);
	const reduced = useReducedMotion();

	return (
		<section id="projects" aria-labelledby="projects-heading" className="py-24 px-6" ref={ref}>
			<div className="mx-auto max-w-6xl">
				<div className="mb-12">
					<h2 id="projects-heading" className="text-3xl font-bold tracking-tight">
						Projects
					</h2>
					<p className="mt-2 text-text-muted">Systems I have designed, built, and shipped.</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{projects.map((project, i) => (
						<motion.div
							key={project.slug}
							initial={reduced ? {} : { opacity: 0, y: 20 }}
							animate={isVisible ? { opacity: 1, y: 0 } : {}}
							transition={{
								duration: 0.5,
								delay: reduced ? 0 : i * 0.1,
								ease: [0.22, 1, 0.36, 1],
							}}
						>
							<Link href={`/projects/${project.slug}`} className="group block h-full">
								<div className="relative h-full rounded-lg border border-border bg-bg-card p-6 transition-all group-hover:border-text-muted group-hover:shadow-lg group-hover:shadow-accent/5">
									<div
										className={`absolute inset-0 rounded-lg bg-gradient-to-br ${project.gradient} opacity-0 transition-opacity group-hover:opacity-100`}
									/>
									<div className="relative">
										<h3 className="text-lg font-semibold">{project.title}</h3>
										<p className="mt-2 text-sm text-text-muted leading-relaxed">
											{project.tagline}
										</p>

										<div className="mt-4 flex flex-wrap gap-1.5">
											{project.techStack.slice(0, 5).map((tech) => (
												<Badge key={tech.name}>{tech.name}</Badge>
											))}
											{project.techStack.length > 5 && (
												<Badge variant="accent">+{project.techStack.length - 5}</Badge>
											)}
										</div>

										<div className="mt-6 grid grid-cols-3 gap-3 border-t border-border/50 pt-4">
											{project.metrics.map((metric) => (
												<div key={metric.label}>
													<div className="font-mono text-sm font-bold text-accent">
														{metric.value}
													</div>
													<div className="text-xs text-text-muted">{metric.label}</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</Link>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
