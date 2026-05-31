"use client";

import { Button } from "@portfolio/ui";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// Outcome metrics, not effort metrics. All four are client value-proof, locked-verified
// in the positioning corpus (08-applied-about): 0/18mo IRPF agent, 100K DAU RAG,
// 10K tx/day retail, −60% legal-domain RAG. Craft/supply-chain proof lives in the proof band.
type HeroStat =
	| { value: number; suffix: string; label: string; detail: string }
	| { display: string; label: string; detail: string };

const stats: HeroStat[] = [
	{
		value: 0,
		suffix: "",
		label: "hallucinated numerical fields",
		detail: "18 months · regulated tax-filing agent in production",
	},
	{
		value: 100,
		suffix: "K+",
		label: "daily active users",
		detail: "multilingual RAG · +40% knowledge-base precision",
	},
	{
		value: 10,
		suffix: "K+/day",
		label: "transactions cleared",
		detail: "event-driven retail backend · outbox + idempotency",
	},
	{
		value: 60,
		suffix: "%",
		label: "less manual review",
		detail: "tier-1 LATAM legal-domain RAG · validated citations",
	},
];

export function HeroMetrics() {
	const ref = useRef<HTMLElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });
	const reduced = useReducedMotion();

	return (
		<section ref={ref} aria-labelledby="hero-heading" className="px-6 pt-32 pb-20">
			<div className="mx-auto w-full max-w-6xl">
				<motion.div
					initial={reduced ? {} : { opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
				>
					<p className="mb-5 font-mono text-sm tracking-tight text-accent">
						Compliance-grade AI architecture · RAG · agents · MCP
					</p>
					<h1
						id="hero-heading"
						className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
					>
						Most AI stacks fail audit at the same three seams —{" "}
						<span className="text-accent">
							prompt provenance, retrieval lineage, output attestation.
						</span>
					</h1>
					<p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-muted">
						I architect retrieval-augmented and agentic systems for regulated LATAM and global
						workloads — where the audit chain, decision provenance, and cost ceiling are first-class
						citizens, not bolted on after the demo. Production RAG mapped to LGPD, BCB 4.893, and
						the EU AI Act Art. 12 logging mandate (enforceable 02/08/2026).
					</p>
				</motion.div>

				<motion.div
					className="mt-14 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2"
					initial={reduced ? {} : { opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
				>
					{stats.map((stat) => (
						<div key={stat.label} className="border-l border-dashed border-overlay pl-4">
							<div className="font-mono text-3xl font-bold text-text sm:text-4xl">
								{"display" in stat ? (
									stat.display
								) : (
									<>
										{isInView ? <AnimatedCounter value={stat.value} reduced={reduced} /> : "0"}
										<span className="text-accent">{stat.suffix}</span>
									</>
								)}
							</div>
							<div className="mt-1 text-sm font-medium text-text">{stat.label}</div>
							<div className="mt-0.5 font-mono text-xs text-text-muted">{stat.detail}</div>
						</div>
					))}
				</motion.div>

				<motion.div
					className="mt-12 flex flex-wrap gap-4"
					initial={reduced ? {} : { opacity: 0 }}
					animate={isInView ? { opacity: 1 } : {}}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					<Button variant="primary" size="lg" as="a" href="mailto:pedrobalbino@proton.me">
						Send a brief
					</Button>
					<Button
						variant="secondary"
						size="lg"
						as="a"
						href="https://blog.home301server.com.br"
						target="_blank"
						rel="noopener noreferrer"
					>
						Read the architecture writeups
					</Button>
				</motion.div>
			</div>
		</section>
	);
}
