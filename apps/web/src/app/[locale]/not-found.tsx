import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "@/components/shared/icons";
import { workIndex } from "@/data/projects";
import { Link } from "@/i18n/navigation";

// A 404 that keeps the visitor moving: it says what happened in one line and lists
// every piece of work, so the dead end is one click from a real page.
export default function NotFound() {
	const t = useTranslations("NotFound");
	const index = useTranslations("Index");

	return (
		<section aria-labelledby="not-found-heading" className="px-6 pt-24 pb-20 sm:pt-28">
			<div className="mx-auto max-w-3xl">
				<h1
					id="not-found-heading"
					className="text-step-5 leading-[1.1] font-semibold tracking-[-0.025em] text-balance"
				>
					{t("title")}
				</h1>
				<p className="mt-5 max-w-[50ch] text-step-1 leading-relaxed text-text-muted">{t("body")}</p>
				<Link
					href="/"
					className="mt-6 inline-flex min-h-11 items-center gap-2 font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
				>
					<ArrowLeft />
					{t("home")}
				</Link>

				<h2 className="mt-14 text-sm font-medium text-text-muted">{t("workHeading")}</h2>
				<ul className="mt-3 border-t border-border">
					{workIndex.map(({ project, kind, name }) => (
						<li key={project.slug} className="border-b border-border">
							<Link
								href={`/projects/${project.slug}`}
								className="group flex min-h-11 items-center justify-between gap-4 py-2"
							>
								<span
									className={`text-text group-hover:text-accent ${kind === "repository" ? "font-mono text-sm" : ""}`}
								>
									{name}
								</span>
								<span className="flex items-center gap-2 text-xs text-text-muted">
									<span className={kind === "caseFile" ? "text-warn" : "text-link"}>
										{index(kind)}
									</span>
									<ArrowRight className="group-hover:text-accent" />
								</span>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
