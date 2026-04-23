"use client";

import { Button } from "@portfolio/ui";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const metrics = [
	{ value: 6, suffix: "", label: "public Claude Code plugins shipped" },
	{ value: 152, suffix: "", label: "NixOS modules across 4-host fleet" },
	{ value: 4.5, suffix: "/wk", label: "commit cadence sustained 90d" },
	{ value: 5, suffix: "", label: "polyglot stacks in production" },
] as const;

export function HeroMetrics() {
	const ref = useRef<HTMLElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });
	const reduced = useReducedMotion();

	return (
		<section
			ref={ref}
			aria-labelledby="hero-heading"
			className="relative flex min-h-[85vh] flex-col justify-center px-6 pt-14"
		>
			<div className="mx-auto w-full max-w-6xl">
				<motion.div
					initial={reduced ? {} : { opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
				>
					<p className="font-mono text-sm text-accent mb-4">Senior SWE — AI-native automation</p>
					<h1
						id="hero-heading"
						className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
					>
						Claude Code plugins,
						<br />
						<span className="text-text-muted">Chrome/macOS workflow tooling,</span>
						<br />
						<span className="text-text-muted">WhatsApp + LinkedIn copilots.</span>
					</h1>
					<p className="mt-6 max-w-2xl text-lg text-text-muted leading-relaxed">
						Six public Claude Code plugins under yolo-labz (wa, claude-mac-chrome,
						linkedin-chrome-copilot, kokoro-speakd, claude-classroom-submit, fand). Python/Go
						backends, Azure OpenAI agents, multi-cloud Terraform. 4-host NixOS fleet with SLSA L2
						supply-chain hardening.
					</p>
				</motion.div>

				<motion.div
					className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4"
					initial={reduced ? {} : { opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
				>
					{metrics.map((metric) => (
						<div key={metric.label} className="space-y-1">
							<div className="font-mono text-3xl font-bold text-text sm:text-4xl">
								{isInView ? <AnimatedCounter value={metric.value} reduced={reduced} /> : "0"}
								<span className="text-accent">{metric.suffix}</span>
							</div>
							<p className="text-sm text-text-muted">{metric.label}</p>
						</div>
					))}
				</motion.div>

				<motion.div
					className="mt-12 flex gap-4"
					initial={reduced ? {} : { opacity: 0 }}
					animate={isInView ? { opacity: 1 } : {}}
					transition={{ duration: 0.6, delay: 0.4 }}
				>
					<Button
						variant="primary"
						size="lg"
						onClick={() =>
							document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
						}
					>
						View Projects
					</Button>
					<Button variant="secondary" size="lg" as="a" href="/resume.pdf">
						Download Resume
					</Button>
				</motion.div>
			</div>

			<div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
				<div className="absolute -top-1/2 right-0 h-[800px] w-[800px] rounded-full bg-accent/5 blur-[120px]" />
			</div>
		</section>
	);
}
