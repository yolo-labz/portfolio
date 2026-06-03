"use client";

import { motion } from "motion/react";
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

const rungs: Rung[] = [
	{
		rung: "Pattern",
		tag: "prove it",
		offers: [
			{
				name: "Regulated-AI Architecture Review",
				scope:
					"A fixed-week diagnostic of your existing LLM stack — three-plane topology memo, severity-ranked findings, annotated reference repo.",
				outcome:
					"A go/no-go verdict and a scoped remediation map before you commit engineering quarters.",
			},
			{
				name: "MCP Tool-Boundary Security Audit",
				scope:
					"STRIDE threat model of every exposed tool, LLM-vs-operator input-boundary review, deny-by-default permission matrix, signed-release hardening (Sigstore + SLSA L2 + dual SBOM).",
				outcome:
					"A severity-ranked report with concrete patches, and a pipeline where every binary verifies with one command.",
			},
		],
	},
	{
		rung: "Pipeline",
		tag: "make it real",
		offers: [
			{
				name: "RAG Audit-Chain Readiness Sprint",
				scope:
					"A production retrieval pipeline — pgvector + hybrid retrieval + rerank, forced-citation answers, recall measured on your own holdout set, a decision-trace ledger keyed to (prompt, docs, model, output).",
				outcome:
					"Provably-grounded answers, accuracy measured against your data, and behaviour auditable from day one.",
			},
			{
				name: "Event-Driven Backend Build & Rescue",
				scope:
					"An authenticated, production-shape backend — typed schema, audit ledger, outbox + idempotency, fitness-function tests, CI gate, observability. Serverless variant ships at $0 idle.",
				outcome:
					"A backend that survives load, costs nothing idle, and provisions and tears down reproducibly — owned in your repo.",
			},
		],
	},
	{
		rung: "Platform",
		tag: "keep custody",
		offers: [
			{
				name: "Embedded AI-Platform Custody",
				scope:
					"Fractional architecture custody — weekly fitness-function review, monthly audit-chain integrity probe, compliance-plane ownership, participation in the AI hiring loop.",
				outcome:
					"An audit-grade AI capability your whole org reuses, with the audit chain kept green between releases.",
			},
		],
	},
];

export function ServicesLadder() {
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
					<FigStamp n="05" label="how an engagement scales" />
					<h2 id="services-heading" className="mt-3 text-3xl font-bold tracking-tight">
						Start with a verdict. Scale when the proof holds.
					</h2>
					<p className="mt-2 max-w-2xl text-text-muted">
						Each offer ships a defined deliverable, scoped and fixed at signature. Most clients open
						with a diagnostic, then expand into a build once the architecture proves out against
						their own data.
					</p>
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
												Outcome —{" "}
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
					Every engagement opens with a short discovery call and a written diagnostic. Scope is
					fixed at signature.{" "}
					<a href="mailto:pedrobalbino@proton.me" className="font-mono text-accent hover:underline">
						Send a brief →
					</a>
				</p>
			</div>
		</section>
	);
}
