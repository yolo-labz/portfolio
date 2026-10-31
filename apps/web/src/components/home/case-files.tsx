import { useTranslations } from "next-intl";
import { ArrowRight } from "@/components/shared/icons";
import { workIndex } from "@/data/projects";
import { Link } from "@/i18n/navigation";

// Persuade, after the index: the four client case files opened one notch further:
// the constraint that shaped each system and the outcome it was held to. Both
// lines are the anonymized decision record verbatim (Projects.<slug>.constraint /
// .outcome); the full record lives on the case-study page.
const caseFiles = workIndex.filter((entry) => entry.kind === "caseFile");

export function CaseFiles() {
	const t = useTranslations("CaseFiles");
	const hero = useTranslations("Hero");
	const projects = useTranslations("Projects");
	const ui = useTranslations("ProjectDetail");

	return (
		<section
			id="case-files"
			aria-labelledby="case-files-heading"
			className="border-t border-border px-6 py-20 sm:py-28"
		>
			<div className="mx-auto max-w-6xl">
				<div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
					<h2
						id="case-files-heading"
						className="text-step-4 leading-tight font-semibold tracking-[-0.02em] text-balance lg:col-span-5"
					>
						{t("heading")}
					</h2>
					<p className="max-w-[50ch] text-base leading-relaxed text-text-muted lg:col-span-7">
						{hero("body")}
					</p>
				</div>

				<ol className="mt-14 space-y-0 border-t border-border">
					{caseFiles.map(({ project, name }) => (
						<li
							key={project.slug}
							className="grid gap-x-12 gap-y-5 border-b border-border py-10 lg:grid-cols-12"
						>
							<div className="lg:col-span-4">
								<h3 className="text-step-2 font-semibold tracking-[-0.01em] text-balance">
									{name}
								</h3>
								<p className="mt-2 text-sm text-text-muted">{project.metrics[0]?.value}</p>
								<Link
									href={`/projects/${project.slug}`}
									className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-text underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
								>
									{t("read")}
									<span className="sr-only">: {name}</span>
									<ArrowRight />
								</Link>
							</div>
							<dl className="grid gap-6 sm:grid-cols-2 lg:col-span-8">
								<div>
									<dt className="text-xs font-medium tracking-wide text-warn uppercase">
										{ui("constraint")}
									</dt>
									<dd className="mt-2 text-base leading-relaxed text-text">
										{projects(`${project.slug}.constraint`)}
									</dd>
								</div>
								<div>
									<dt className="text-xs font-medium tracking-wide text-accent uppercase">
										{ui("outcome")}
									</dt>
									<dd className="mt-2 text-base leading-relaxed text-text-muted">
										{projects(`${project.slug}.outcome`)}
									</dd>
								</div>
							</dl>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
