"use client";

import { Badge } from "@portfolio/ui";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { OrganizationShowcase } from "@/components/sections/organization-showcase";
import { FigStamp } from "@/components/shared/fig-stamp";
import { projects } from "@/data/projects";
import { useIntersection } from "@/hooks/use-intersection";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Link } from "@/i18n/navigation";

const featured = projects.filter((p) => p.featured);

/** Display form of a repo URL: drop the scheme so the card shows the real path. */
function shortUrl(url: string): string {
	return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function ProjectShowcase() {
	const { ref, isVisible } = useIntersection(0.05);
	const reduced = useReducedMotion();
	// Per-project taglines come from the shared "Projects" namespace, keyed by slug;
	// this section's own static labels live under "ProjectShowcase".
	const t = useTranslations("Projects");
	const ui = useTranslations("ProjectShowcase");
	// Reuses the detail page's label rather than minting a second one.
	const detail = useTranslations("ProjectDetail");

	return (
		<section id="projects" aria-labelledby="projects-heading" className="px-6 py-24" ref={ref}>
			<div className="mx-auto max-w-6xl">
				<div className="mb-12">
					<FigStamp n="01" label={ui("selectedWorkStamp")} />
					<h2 id="projects-heading" className="mt-3 text-3xl font-bold tracking-tight">
						{ui("selectedWorkHeading")}
					</h2>
					<p className="mt-2 max-w-2xl text-text-muted">{ui("selectedWorkLead")}</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					{featured.map((project, i) => (
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
							{/* Stretched-link pattern: the card body opens the case study, and the
								    repo anchor sits above it (z-10) because a flagship card must
								    carry its real source URL. Nesting two <a> would be invalid. */}
							<div className="group relative h-full rounded-lg border border-border border-l-2 border-l-accent bg-bg-card p-6 transition-colors hover:border-text-muted hover:border-l-accent">
								<h3 className="text-lg font-semibold">
									<Link
										href={`/projects/${project.slug}`}
										className="after:absolute after:inset-0 after:content-['']"
									>
										{project.title}
									</Link>
								</h3>
								<p className="mt-2 text-sm leading-relaxed text-text-muted">
									{t(`${project.slug}.tagline`)}
								</p>

								<div className="mt-4 flex flex-wrap gap-1.5">
									{project.techStack.slice(0, 5).map((tech) => (
										<Badge key={tech.name}>{tech.name}</Badge>
									))}
									{project.techStack.length > 5 && (
										<Badge variant="accent">+{project.techStack.length - 5}</Badge>
									)}
								</div>

								<dl className="mt-6 space-y-3 border-t border-border/50 pt-4">
									{project.metrics.map((metric) => (
										<div key={metric.label} className="border-l border-dashed border-overlay pl-3">
											<dt className="text-xs text-text-muted">{metric.label}</dt>
											<dd className="font-mono text-sm font-medium text-text">{metric.value}</dd>
										</div>
									))}
								</dl>

								{project.links.source && (
									<a
										href={project.links.source}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={`${detail("viewSource")}: ${shortUrl(project.links.source)}`}
										className="relative z-10 mt-4 inline-flex items-center gap-1 font-mono text-xs text-text-muted transition-colors hover:text-accent"
									>
										{shortUrl(project.links.source)}
										<span aria-hidden="true">&nearr;</span>
									</a>
								)}
							</div>
						</motion.div>
					))}
				</div>

				<OrganizationShowcase />
			</div>
		</section>
	);
}
