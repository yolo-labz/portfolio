import { Badge } from "@portfolio/ui";
import { useTranslations } from "next-intl";
import { ArrowRight, ArrowUpRight } from "@/components/shared/icons";
import { projects } from "@/data/projects";
import { Link } from "@/i18n/navigation";

// Four capability entry points, not a popularity or uptime ranking. Keep the
// catalogue as the source of truth; every other non-featured project stays below.
// The six brand-positioning flagships lead the home index, so this shelf starts
// after them and only offers repos whose source is public.
const selectedSlugs = new Set([
	"serverless-data-api",
	"pedro-portfolio-recipes",
	"claude-classroom-submit",
	"linkedin-chrome-copilot",
]);
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
			className="scroll-mt-24 border-t border-border px-6 py-20 sm:py-28"
		>
			<div className="mx-auto max-w-6xl">
				<div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
					<div className="max-w-2xl">
						<h3
							id="open-source-heading"
							className="text-step-4 leading-tight font-semibold tracking-[-0.02em] text-balance"
						>
							{ui("openSourceHeading")}
						</h3>
						<p className="mt-4 text-base leading-relaxed text-text-muted">{ui("openSourceLead")}</p>
					</div>
					<a
						href="https://github.com/yolo-labz"
						className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start text-sm text-link underline underline-offset-4 sm:self-auto"
					>
						{ui("browseRepositories")} <ArrowUpRight />
					</a>
				</div>

				<ul
					aria-label={ui("selectedRepositories")}
					className="mt-12 grid border-t border-border md:grid-cols-2"
				>
					{selected.map((project, index) => (
						<li
							key={project.slug}
							className={`flex min-w-0 flex-col border-b border-border py-8 md:px-8 ${index % 2 === 0 ? "md:border-r md:pl-0" : "md:pr-0"}`}
						>
							<h4 className="break-words font-mono text-base font-semibold text-text">
								{project.slug}
							</h4>
							<p className="mt-3 flex-1 text-sm leading-relaxed text-text-muted">
								{t(`${project.slug}.tagline`)}
							</p>
							<div className="mt-5 flex flex-wrap gap-1.5">
								{project.techStack.slice(0, 3).map((tech) => (
									<Badge key={tech.name}>{tech.name}</Badge>
								))}
							</div>
							<div className="mt-4 flex flex-wrap gap-x-6 text-sm">
								<Link
									href={`/projects/${project.slug}`}
									aria-label={ui("projectNotesLabel", { project: project.slug })}
									className="inline-flex min-h-11 items-center gap-2 text-text underline decoration-border underline-offset-4 hover:text-accent hover:decoration-accent"
								>
									{ui("projectNotes")} <ArrowRight />
								</Link>
								{project.links.source && (
									<a
										href={project.links.source}
										aria-label={ui("sourceCodeLabel", { project: project.slug })}
										className="inline-flex min-h-11 items-center gap-2 text-link underline underline-offset-4"
									>
										{ui("sourceCode")} <ArrowUpRight />
									</a>
								)}
							</div>
						</li>
					))}
				</ul>

				<details className="group mt-8 border-b border-border">
					<summary className="flex min-h-11 cursor-pointer items-center gap-2 py-4 text-sm font-medium text-text">
						<ArrowRight className="transition-transform duration-200 group-open:rotate-90" />
						{ui("moreProjects", { count: remaining.length })}
					</summary>
					<ul className="divide-y divide-border border-t border-border">
						{remaining.map((project) => (
							<li key={project.slug}>
								<Link href={`/projects/${project.slug}`} className="block py-4 hover:underline">
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
			</div>
		</section>
	);
}
