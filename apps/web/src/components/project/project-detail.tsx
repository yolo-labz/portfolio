import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "@/components/shared/icons";
import { type Project, workIndex } from "@/data/projects";
import { Link } from "@/i18n/navigation";

interface ProjectDetailProps {
	project: Project;
}

// Case-study template (Read mode). The decision record leads the body because it is
// the proof; the facts column holds what a reviewer checks (role, stack, source).
// Server component: the page ships no motion and no client JS of its own.
export function ProjectDetail({ project }: ProjectDetailProps) {
	// Per-project prose lives under the "Projects" namespace, keyed by slug.
	const t = useTranslations("Projects");
	const ui = useTranslations("ProjectDetail");
	const index = useTranslations("Index");
	const slug = project.slug;

	// Optional narrative-arc fields, each guarded so a partial record never renders
	// an empty row.
	const arc = (["constraint", "decision", "outcome"] as const).filter(
		(key) => Boolean(project.hasArc) && t.has(`${slug}.${key}`),
	);
	const arcTone = { constraint: "text-warn", decision: "text-link", outcome: "text-accent" };

	// Prev/next walk the home index order; projects outside it get no walk.
	const at = workIndex.findIndex((entry) => entry.project.slug === slug);
	const entry = at >= 0 ? workIndex[at] : undefined;
	const prev = at > 0 ? workIndex[at - 1] : undefined;
	const next = at >= 0 && at < workIndex.length - 1 ? workIndex[at + 1] : undefined;

	return (
		<article className="px-6 pt-24 pb-20 sm:pt-28">
			<div className="mx-auto max-w-6xl">
				<Link
					href={{ pathname: "/", hash: "projects" }}
					className="-ml-1 inline-flex min-h-11 items-center gap-2 px-1 text-sm text-text-muted transition-colors hover:text-text"
				>
					<ArrowLeft />
					{ui("backToProjects")}
				</Link>

				<header className="mt-6 max-w-4xl">
					<h1 className="text-step-5 leading-[1.1] font-semibold tracking-[-0.025em] text-balance">
						{project.title}
					</h1>
					<p className="mt-5 max-w-[50ch] text-step-1 leading-relaxed text-text-muted">
						{t(`${slug}.tagline`)}
					</p>
				</header>

				<div className="mt-14 grid gap-12 border-t border-border pt-10 lg:grid-cols-12">
					<aside className="lg:col-span-4">
						<div className="lg:sticky lg:top-24">
							{entry && (
								<p
									className={`text-sm font-medium ${entry.kind === "caseFile" ? "text-warn" : "text-link"}`}
								>
									{index(entry.kind)}
								</p>
							)}
							<dl className="mt-4 border-t border-border">
								{project.metrics.map((metric) => (
									<div key={metric.label} className="border-b border-border py-3">
										<dt className="text-xs text-text-muted">{metric.label}</dt>
										<dd className="mt-1 text-sm text-text">{metric.value}</dd>
									</div>
								))}
								<div className="border-b border-border py-3">
									<dt className="text-xs text-text-muted">{ui("stack")}</dt>
									<dd className="mt-1 font-mono text-xs leading-relaxed text-text">
										{project.techStack.map((tech) => tech.name).join(" · ")}
									</dd>
								</div>
							</dl>
							{(project.links.demo || project.links.source) && (
								<ul className="mt-4 flex flex-wrap gap-x-6 text-sm">
									{project.links.source && (
										<li>
											<a
												href={project.links.source}
												className="inline-flex min-h-11 items-center gap-2 text-link underline underline-offset-4"
											>
												{ui("viewSource")} <ArrowUpRight />
											</a>
										</li>
									)}
									{project.links.demo && (
										<li>
											<a
												href={project.links.demo}
												className="inline-flex min-h-11 items-center gap-2 text-link underline underline-offset-4"
											>
												{ui("liveDemo")} <ArrowUpRight />
											</a>
										</li>
									)}
								</ul>
							)}
						</div>
					</aside>

					<div className="min-w-0 space-y-14 lg:col-span-8">
						{arc.length > 0 && (
							<section aria-labelledby="decision-record">
								<h2 id="decision-record" className="text-step-2 font-semibold tracking-[-0.01em]">
									{ui("decisionRecord")}
								</h2>
								<dl className="mt-6 border-t border-border">
									{arc.map((key) => (
										<div
											key={key}
											className="grid gap-x-8 gap-y-2 border-b border-border py-6 sm:grid-cols-[8rem_1fr]"
										>
											<dt className={`text-sm font-medium ${arcTone[key]}`}>{ui(key)}</dt>
											<dd className="max-w-[50ch] leading-relaxed text-text">
												{t(`${slug}.${key}`)}
											</dd>
										</div>
									))}
								</dl>
							</section>
						)}

						<section aria-labelledby="problem" className="max-w-[50ch]">
							<h2 id="problem" className="text-step-2 font-semibold tracking-[-0.01em]">
								{ui("problemHeading")}
							</h2>
							<p className="mt-4 leading-relaxed text-text-muted">
								{t(`${slug}.problemStatement`)}
							</p>
						</section>

						<section aria-labelledby="solution" className="max-w-[50ch]">
							<h2 id="solution" className="text-step-2 font-semibold tracking-[-0.01em]">
								{ui("solutionHeading")}
							</h2>
							<p className="mt-4 leading-relaxed text-text-muted">{t(`${slug}.solutionSummary`)}</p>
						</section>

						<section aria-labelledby="overview" className="max-w-[50ch]">
							<h2 id="overview" className="text-step-2 font-semibold tracking-[-0.01em]">
								{ui("overviewHeading")}
							</h2>
							<p className="mt-4 leading-relaxed text-text-muted">{t(`${slug}.description`)}</p>
						</section>
					</div>
				</div>

				{(prev || next) && (
					<nav
						aria-label={ui("walkLabel")}
						className="mt-20 grid border-y border-border sm:grid-cols-2"
					>
						{prev ? (
							<Link
								href={`/projects/${prev.project.slug}`}
								className="group flex min-h-20 flex-col justify-center gap-1 py-5 sm:pr-8"
							>
								<span className="inline-flex items-center gap-2 text-xs text-text-muted">
									<ArrowLeft /> {ui("previous")}
								</span>
								<span className="font-medium text-text group-hover:text-accent">{prev.name}</span>
							</Link>
						) : (
							<span />
						)}
						{next && (
							<Link
								href={`/projects/${next.project.slug}`}
								className="group flex min-h-20 flex-col justify-center gap-1 border-t border-border py-5 sm:items-end sm:border-t-0 sm:border-l sm:pl-8 sm:text-right"
							>
								<span className="inline-flex items-center gap-2 text-xs text-text-muted">
									{ui("next")} <ArrowRight />
								</span>
								<span className="font-medium text-text group-hover:text-accent">{next.name}</span>
							</Link>
						)}
					</nav>
				)}
			</div>
		</article>
	);
}
