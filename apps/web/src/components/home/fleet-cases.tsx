import { useTranslations } from "next-intl";
import { ArrowRight } from "@/components/shared/icons";
import { fleetCaseSlugs, projects } from "@/data/projects";
import { Link } from "@/i18n/navigation";

// Persuade, third beat: three decision records from running my own agent fleet,
// each with the number it was held to and what it cost. Same record shape as the
// client case files (constraint, decision, outcome); the full record is the case page.
const records = fleetCaseSlugs.map((slug) => {
	const project = projects.find((p) => p.slug === slug);
	if (!project) throw new Error(`fleet cases: unknown project ${slug}`);
	return project;
});

export function FleetCases() {
	const t = useTranslations("FleetCases");
	const projectCopy = useTranslations("Projects");

	return (
		<section
			id="fleet-cases"
			aria-labelledby="fleet-cases-heading"
			className="border-t border-border px-6 py-20 sm:py-28"
		>
			<div className="mx-auto max-w-6xl">
				<div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
					<h2
						id="fleet-cases-heading"
						className="text-step-4 leading-tight font-semibold tracking-[-0.02em] text-balance lg:col-span-5"
					>
						{t("heading")}
					</h2>
					<p className="max-w-[50ch] text-base leading-relaxed text-text-muted lg:col-span-7">
						{t("intro")}
					</p>
				</div>

				<ol className="mt-14 border-t border-border">
					{records.map((project) => {
						const name = project.title.split(": ")[0] ?? project.title;
						return (
							<li
								key={project.slug}
								className="grid gap-x-12 gap-y-4 border-b border-border py-8 lg:grid-cols-12"
							>
								<h3 className="text-step-1 font-semibold tracking-[-0.01em] text-balance lg:col-span-4">
									{name}
								</h3>
								<div className="lg:col-span-8">
									<p className="max-w-[60ch] text-base leading-relaxed text-text">
										{projectCopy(`${project.slug}.tagline`)}
									</p>
									<Link
										href={`/projects/${project.slug}`}
										className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-text underline decoration-border underline-offset-4 transition-colors hover:text-accent focus-visible:text-accent"
									>
										{t("read")}
										<span className="sr-only">: {name}</span>
										<ArrowRight />
									</Link>
								</div>
							</li>
						);
					})}
				</ol>
			</div>
		</section>
	);
}
