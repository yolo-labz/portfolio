import { useTranslations } from "next-intl";
import { ArrowRight } from "@/components/shared/icons";
import { workIndex } from "@/data/projects";
import { Link } from "@/i18n/navigation";

// First viewport (Experience mode): the work leads. The thesis is one sentence, the
// index of ten works fills the rest, and the gremlin render sits beside it as the
// one doing the typing. Server component: no client JS on the LCP path.
//
// The render is `gremlin-hero.png` from yolo-labz/.github `model/` (Blender
// Workbench, flat albedo), cropped and re-encoded only; its plate is exactly the
// page ground #1e1e2e, so it needs no frame. Provenance: public/brand/README.md.
export function WorkIndex() {
	const t = useTranslations("Index");
	const hero = useTranslations("Hero");
	const projects = useTranslations("Projects");

	return (
		<section
			id="projects"
			aria-labelledby="hero-heading"
			className="scroll-mt-14 px-6 pt-24 pb-16 sm:pt-28 lg:pt-20"
		>
			<div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-start gap-x-4 lg:grid-cols-12 lg:gap-x-12">
				<h1
					id="hero-heading"
					className="col-start-1 row-start-1 text-step-4 leading-[1.15] font-semibold tracking-[-0.02em] text-balance lg:col-span-7"
				>
					{hero("headingLead")} <span className="text-accent">{hero("headingSeams")}</span>
				</h1>

				{/* One element, two placements: beside the thesis on small screens, the
				    full plate beside the index from lg up. srcSet keeps phones on 402w. */}
				<img
					src="/brand/gremlin-hero-804.webp"
					srcSet="/brand/gremlin-hero-402.webp 402w, /brand/gremlin-hero-804.webp 804w"
					sizes="(min-width: 1024px) 360px, 128px"
					alt={t("renderAlt")}
					width={804}
					height={770}
					fetchPriority="high"
					className="col-start-2 row-start-1 -mt-1 w-24 sm:w-32 lg:sticky lg:top-24 lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:mt-0 lg:w-full"
				/>

				<div className="col-span-2 lg:col-span-8 lg:col-start-1">
					<h2 className="sr-only">{t("heading")}</h2>
					{/* Subgrid: every row shares one set of columns, sized to the longest name. */}
					<ol className="mt-8 border-t border-border sm:mt-10 sm:grid sm:grid-cols-[max-content_minmax(0,1fr)_max-content] sm:gap-x-6 lg:mt-8">
						{workIndex.map(({ project, kind, name }, i) => (
							<li
								key={project.slug}
								className="work-row border-b border-border sm:col-span-3 sm:grid sm:grid-cols-subgrid"
								style={{ "--i": i } as React.CSSProperties}
							>
								<Link
									href={`/projects/${project.slug}`}
									className="group relative grid min-h-11 grid-cols-[1fr_auto] items-center gap-x-4 gap-y-0.5 py-2.5 sm:col-span-3 sm:grid-cols-subgrid sm:gap-x-6 sm:py-2"
								>
									<span
										className={`col-start-1 row-start-1 min-w-0 sm:whitespace-nowrap font-medium text-text transition-colors group-hover:text-accent group-focus-visible:text-accent ${kind === "repository" ? "font-mono text-sm" : "text-base"}`}
									>
										{name}
									</span>
									<span className="col-span-2 col-start-1 row-start-2 line-clamp-2 text-sm text-text-muted sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:line-clamp-1">
										{projects(`${project.slug}.tagline`)}
									</span>
									<span className="col-start-2 row-start-1 flex items-center justify-end gap-2 text-xs text-text-muted sm:col-start-3">
										<span className={kind === "caseFile" ? "text-warn" : "text-link"}>
											{t(kind)}
										</span>
										<ArrowRight className="transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-accent group-focus-visible:text-accent" />
									</span>
									<span
										aria-hidden="true"
										className="pointer-events-none absolute right-0 -bottom-px left-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
									/>
								</Link>
							</li>
						))}
					</ol>
					<p className="mt-4 text-xs text-text-muted">{t("note")}</p>
				</div>
			</div>
		</section>
	);
}
