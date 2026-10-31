"use client";

import { Badge, Card } from "@portfolio/ui";
import { useTranslations } from "next-intl";
import { FigStamp } from "@/components/shared/fig-stamp";
import { projects } from "@/data/projects";
import { Link } from "@/i18n/navigation";

// Four capability entry points, not a popularity or uptime ranking. Keep the
// catalogue as the source of truth; every other non-featured project stays below.
const selectedSlugs = new Set(["wa", "serverless-data-api", "kokoro-speakd", "fand"]);
const selected = projects.filter((project) => !project.featured && selectedSlugs.has(project.slug));
const remaining = projects.filter(
	(project) => !project.featured && !selectedSlugs.has(project.slug),
);

export function OrganizationShowcase() {
	const t = useTranslations("Projects");
	const ui = useTranslations("ProjectShowcase");

	return (
		<section
			id="open-source"
			aria-labelledby="open-source-heading"
			className="mt-16 scroll-mt-24 border-t border-border pt-10"
		>
			<div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
				<div className="max-w-2xl">
					<FigStamp n="02" label="yolo-labz" />
					<h3 id="open-source-heading" className="mt-3 text-2xl font-semibold tracking-tight">
						{ui("openSourceHeading")}
					</h3>
					<p className="mt-3 text-sm leading-relaxed text-text-muted">{ui("openSourceLead")}</p>
				</div>
				<a
					href="https://github.com/yolo-labz"
					className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-sm text-sm text-link underline underline-offset-4 sm:self-auto"
				>
					{ui("browseRepositories")} <span aria-hidden="true">↗</span>
				</a>
			</div>

			<ul aria-label={ui("selectedRepositories")} className="mt-8 grid gap-4 md:grid-cols-2">
				{selected.map((project, index) => (
					<li key={project.slug}>
						<Card className="flex h-full min-w-0 flex-col transition-colors hover:border-text-muted focus-within:border-accent">
							<div className="flex items-baseline justify-between gap-3">
								<h4 className="break-words font-mono text-base font-semibold">{project.slug}</h4>
								<span aria-hidden="true" className="font-mono text-xs text-text-muted">
									0{index + 1}
								</span>
							</div>
							<p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
								{project.slug === "kokoro-speakd"
									? ui("speechSummary")
									: t(`${project.slug}.tagline`)}
							</p>
							<div className="mt-5 flex flex-wrap gap-1.5">
								{project.techStack.slice(0, 3).map((tech) => (
									<Badge key={tech.name}>{tech.name}</Badge>
								))}
							</div>
							<div className="mt-5 flex flex-wrap gap-x-6 border-t border-border pt-2 text-sm">
								<Link
									href={`/projects/${project.slug}`}
									aria-label={ui("projectNotesLabel", { project: project.slug })}
									className="inline-flex min-h-11 items-center gap-2 rounded-sm text-text underline decoration-border underline-offset-4 hover:decoration-accent"
								>
									{ui("projectNotes")} <span aria-hidden="true">→</span>
								</Link>
								{project.links.source && (
									<a
										href={project.links.source}
										aria-label={ui("sourceCodeLabel", { project: project.slug })}
										className="inline-flex min-h-11 items-center gap-2 rounded-sm text-link underline underline-offset-4"
									>
										{ui("sourceCode")} <span aria-hidden="true">↗</span>
									</a>
								)}
							</div>
						</Card>
					</li>
				))}
			</ul>

			<details className="group mt-6 rounded-lg border border-border bg-bg-card px-5">
				<summary className="cursor-pointer py-5 text-sm font-medium text-text">
					{ui("moreProjects", { count: remaining.length })}
				</summary>
				<ul className="divide-y divide-border border-t border-border">
					{remaining.map((project) => (
						<li key={project.slug}>
							<Link
								href={`/projects/${project.slug}`}
								className="block rounded-sm py-4 hover:underline"
							>
								<h4 className="break-words font-mono text-sm text-text">
									{project.title.split(" — ")[0]}
								</h4>
								<p className="mt-1 text-sm leading-relaxed text-text-muted">
									{t(`${project.slug}.tagline`)}
								</p>
							</Link>
						</li>
					))}
				</ul>
			</details>
		</section>
	);
}
