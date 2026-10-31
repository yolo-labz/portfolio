import { useTranslations } from "next-intl";
import { ArrowRight } from "@/components/shared/icons";
import { CONTACT_EMAIL } from "@/lib/constants";

// Productized, deliverable-scoped engagements (not job titles, not billed hours).
// Grouped by the Pattern → Pipeline → Platform trust ladder. No rates anywhere:
// pricing stays in 1:1 proposals per the positioning canon. Persuade surface:
// one ruled ladder, the rung on the left, its offers as rows on the right.
interface Offer {
	name: string;
	scope: string;
	outcome: string;
}
interface Rung {
	rung: string;
	tag: string;
	offers: Offer[];
}

export function ServicesLadder() {
	const t = useTranslations("Services");
	const rungs = t.raw("rungs") as Rung[];

	return (
		<section
			id="services"
			aria-labelledby="services-heading"
			className="border-t border-border bg-bg-elevated px-6 py-20 sm:py-28"
		>
			<div className="mx-auto max-w-6xl">
				<div className="grid gap-6 lg:grid-cols-12 lg:gap-12">
					<h2
						id="services-heading"
						className="text-step-4 leading-tight font-semibold tracking-[-0.02em] text-balance lg:col-span-5"
					>
						{t("heading")}
					</h2>
					<p className="max-w-[50ch] text-base leading-relaxed text-text-muted lg:col-span-7">
						{t("intro")}
					</p>
				</div>

				<ol className="mt-14 border-t border-border">
					{rungs.map((rung) => (
						<li
							key={rung.rung}
							className="grid gap-x-12 gap-y-4 border-b border-border py-8 lg:grid-cols-12"
						>
							<div className="lg:col-span-3">
								<h3 className="text-step-1 font-semibold text-accent">{rung.rung}</h3>
								<p className="text-sm text-text-muted">{rung.tag}</p>
							</div>
							<ul className="grid gap-8 md:grid-cols-2 lg:col-span-9">
								{rung.offers.map((offer) => (
									<li key={offer.name}>
										<h4 className="font-medium text-text">{offer.name}</h4>
										<p className="mt-2 text-sm leading-relaxed text-text-muted">{offer.scope}</p>
										<p className="mt-3 text-sm leading-relaxed text-text">
											<span className="font-medium text-accent">{t("outcomeLabel")}</span>{" "}
											{offer.outcome}
										</p>
									</li>
								))}
							</ul>
						</li>
					))}
				</ol>

				<p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-text-muted">
					{t("footer")}
					<a
						href={`mailto:${CONTACT_EMAIL}`}
						className="inline-flex min-h-11 items-center gap-2 font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
					>
						{t("footerCta")}
						<ArrowRight />
					</a>
				</p>
			</div>
		</section>
	);
}
