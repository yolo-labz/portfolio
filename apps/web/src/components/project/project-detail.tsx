"use client";

import { Badge, Button } from "@portfolio/ui";
import { motion } from "motion/react";
import Link from "next/link";
import { FigStamp } from "@/components/shared/fig-stamp";
import type { Project } from "@/data/projects";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface ProjectDetailProps {
	project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
	const reduced = useReducedMotion();
	const hasArc = Boolean(project.constraint || project.decision || project.outcome);

	return (
		<article className="px-6 pt-32 pb-16">
			<div className="mx-auto max-w-4xl">
				<motion.div
					initial={reduced ? {} : { opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
				>
					<Link
						href="/#projects"
						className="mb-8 inline-flex items-center text-sm text-text-muted transition-colors hover:text-text"
					>
						&larr; Back to projects
					</Link>

					<h1 className="text-4xl font-bold tracking-tight">{project.title}</h1>
					<p className="mt-3 text-lg text-text-muted">{project.tagline}</p>

					<div className="mt-6 flex flex-wrap gap-2">
						{project.techStack.map((tech) => (
							<Badge key={tech.name} variant="accent">
								{tech.name}
							</Badge>
						))}
					</div>

					{(project.links.demo || project.links.source) && (
						<div className="mt-6 flex flex-wrap gap-3">
							{project.links.demo && (
								<Button
									variant="primary"
									size="sm"
									as="a"
									href={project.links.demo}
									target="_blank"
									rel="noopener noreferrer"
								>
									Live demo
								</Button>
							)}
							{project.links.source && (
								<Button
									variant="secondary"
									size="sm"
									as="a"
									href={project.links.source}
									target="_blank"
									rel="noopener noreferrer"
								>
									View source
								</Button>
							)}
						</div>
					)}
				</motion.div>

				<motion.dl
					className="mt-12 grid gap-x-8 gap-y-5 sm:grid-cols-2"
					initial={reduced ? {} : { opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
				>
					{project.metrics.map((metric) => (
						<div key={metric.label} className="border-l border-dashed border-overlay pl-4">
							<dt className="text-xs text-text-muted">{metric.label}</dt>
							<dd className="mt-0.5 font-mono text-sm font-medium text-text">{metric.value}</dd>
						</div>
					))}
				</motion.dl>

				<motion.div
					className="mt-12 space-y-10"
					initial={reduced ? {} : { opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
				>
					<div>
						<h2 className="mb-3 text-xl font-semibold">The problem</h2>
						<p className="leading-relaxed text-text-muted">{project.problemStatement}</p>
					</div>

					<div>
						<h2 className="mb-3 text-xl font-semibold">The solution</h2>
						<p className="leading-relaxed text-text-muted">{project.solutionSummary}</p>
					</div>

					{hasArc && (
						<div className="rounded-lg border border-border border-l-2 border-l-accent bg-bg-card p-6">
							<FigStamp n="01" label="decision record" />
							<dl className="mt-4 space-y-5">
								{project.constraint && (
									<div>
										<dt className="font-mono text-xs uppercase tracking-wide text-accent">
											Constraint
										</dt>
										<dd className="mt-1 leading-relaxed text-text-muted">{project.constraint}</dd>
									</div>
								)}
								{project.decision && (
									<div>
										<dt className="font-mono text-xs uppercase tracking-wide text-accent">
											Decision
										</dt>
										<dd className="mt-1 leading-relaxed text-text-muted">{project.decision}</dd>
									</div>
								)}
								{project.outcome && (
									<div>
										<dt className="font-mono text-xs uppercase tracking-wide text-accent">
											Outcome
										</dt>
										<dd className="mt-1 leading-relaxed text-text-muted">{project.outcome}</dd>
									</div>
								)}
							</dl>
						</div>
					)}

					<div>
						<h2 className="mb-3 text-xl font-semibold">Overview</h2>
						<p className="leading-relaxed text-text-muted">{project.description}</p>
					</div>
				</motion.div>
			</div>
		</article>
	);
}
