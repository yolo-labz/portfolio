"use client";

import { Badge, Button } from "@portfolio/ui";
import { motion } from "motion/react";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface ProjectDetailProps {
	project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
	const reduced = useReducedMotion();

	return (
		<article className="px-6 pt-24 pb-16">
			<div className="mx-auto max-w-4xl">
				<motion.div
					initial={reduced ? {} : { opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
				>
					<Link
						href="/#projects"
						className="inline-flex items-center text-sm text-text-muted hover:text-text transition-colors mb-8"
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

					{project.links.source && (
						<div className="mt-6">
							<Button
								variant="secondary"
								size="sm"
								as="a"
								href={project.links.source}
								target="_blank"
								rel="noopener noreferrer"
							>
								View Source
							</Button>
						</div>
					)}
				</motion.div>

				<motion.div
					className="mt-12 grid gap-4 sm:grid-cols-3"
					initial={reduced ? {} : { opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
				>
					{project.metrics.map((metric) => (
						<div
							key={metric.label}
							className="rounded-lg border border-border bg-bg-card p-4 text-center"
						>
							<div className="font-mono text-2xl font-bold text-accent">{metric.value}</div>
							<div className="mt-1 text-sm text-text-muted">{metric.label}</div>
						</div>
					))}
				</motion.div>

				<motion.div
					className="mt-12 space-y-10"
					initial={reduced ? {} : { opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
				>
					<div>
						<h2 className="text-xl font-semibold mb-3">The Problem</h2>
						<p className="text-text-muted leading-relaxed">{project.problemStatement}</p>
					</div>

					<div>
						<h2 className="text-xl font-semibold mb-3">The Solution</h2>
						<p className="text-text-muted leading-relaxed">{project.solutionSummary}</p>
					</div>

					<div>
						<h2 className="text-xl font-semibold mb-3">Overview</h2>
						<p className="text-text-muted leading-relaxed">{project.description}</p>
					</div>
				</motion.div>
			</div>
		</article>
	);
}
