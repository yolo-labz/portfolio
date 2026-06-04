"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { FigStamp } from "@/components/shared/fig-stamp";
import { useIntersection } from "@/hooks/use-intersection";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Productized, deliverable-scoped engagements (not job titles, not billed hours).
// Grouped by the Pattern → Pipeline → Platform trust ladder. No rates anywhere —
// pricing stays in 1:1 proposals per the positioning canon.
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
	const { ref, isVisible } = useIntersection(0.1);
	const reduced = useReducedMotion();

	return (
		<section
			id="services"
			aria-labelledby="services-heading"
			className="bg-bg-elevated px-6 py-24"
			ref={ref}
		>
			<div className="mx-auto max-w-6xl">
				<div className="mb-12">
					<FigStamp n="05" label={t("figLabel")} />
					<h2 id="services-heading" className="mt-3 text-3xl font-bold tracking-tight">
						{t("heading")}
					</h2>
					<p className="mt-2 max-w-2xl text-text-muted">{t("intro")}</p>
				</div>

				<div className="space-y-12">
					{rungs.map((rung, ri) => (
						<motion.div
							key={rung.rung}
							initial={reduced ? {} : { opacity: 0, y: 20 }}
							animate={isVisible ? { opacity: 1, y: 0 } : {}}
							transition={{
								duration: 0.5,
								delay: reduced ? 0 : ri * 0.1,
								ease: [0.22, 1, 0.36, 1],
							}}
						>
							<div className="mb-4 flex items-baseline gap-3 border-l-2 border-l-accent pl-3">
								<span className="font-mono text-sm font-semibold text-accent">{rung.rung}</span>
								<span className="font-mono text-xs text-text-muted">{rung.tag}</span>
							</div>
							<div className="grid gap-6 md:grid-cols-2">
								{rung.offers.map((offer) => (
									<div key={offer.name} className="rounded-lg border border-border bg-bg-card p-6">
										<h3 className="font-semibold">{offer.name}</h3>
										<p className="mt-2 text-sm leading-relaxed text-text-muted">{offer.scope}</p>
										<p className="mt-3 text-sm leading-relaxed text-text">
											<span className="font-mono text-xs uppercase tracking-wide text-accent">
												{t("outcomeLabel")}{" "}
											</span>
											{offer.outcome}
										</p>
									</div>
								))}
							</div>
						</motion.div>
					))}
				</div>

				<p className="mt-12 text-sm text-text-muted">
					{t("footer")}{" "}
					<a href="mailto:pedrobalbino@proton.me" className="font-mono text-accent hover:underline">
						{t("footerCta")}
					</a>
				</p>
			</div>
		</section>
	);
}
