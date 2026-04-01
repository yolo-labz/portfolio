"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Button } from "@portfolio/ui";

const metrics = [
	{ value: 5, suffix: "TB+", label: "daily data processed" },
	{ value: 12, suffix: "+", label: "production systems" },
	{ value: 99.7, suffix: "%", label: "uptime on managed infra" },
	{ value: 200, suffix: "ms", prefix: "<", label: "avg API response" },
] as const;

export function HeroMetrics() {
	const ref = useRef<HTMLElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-100px" });
	const reduced = useReducedMotion();

	return (
		<section
			ref={ref}
			className="relative flex min-h-[85vh] flex-col justify-center px-6 pt-14"
		>
			<div className="mx-auto w-full max-w-6xl">
				<motion.div
					initial={reduced ? {} : { opacity: 0, y: 20 }}
					animate={isInView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
				>
					<p className="font-mono text-sm text-accent mb-4">Software Engineer</p>
					<h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
						Pedro Henrique
						<br />
						<span className="text-text-muted">Souza Balbino</span>
					</h1>
					<p className="mt-6 max-w-2xl text-lg text-text-muted leading-relaxed">
						I build data extraction pipelines, automation systems, and full-stack
						applications. Python and TypeScript. AWS-native infrastructure with
						Terraform. Everything ships with CI/CD and monitoring.
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
								{"prefix" in metric && metric.prefix}
								{isInView ? (
									<AnimatedCounter
										value={metric.value}
										reduced={reduced}
									/>
								) : (
									"0"
								)}
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
