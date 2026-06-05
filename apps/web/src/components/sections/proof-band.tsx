"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { FigStamp } from "@/components/shared/fig-stamp";
import { useIntersection } from "@/hooks/use-intersection";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { Link } from "@/i18n/navigation";

// Homepage proof strip — only links to surfaces that are live right now (public
// GitHub repos + the /about claim map). No links to unpublished writeups, so the
// "auditable" claim never points at a 404.
const repos = [
	{ name: "wa", lang: "Go" },
	{ name: "claude-mac-chrome", lang: "Bash" },
	{ name: "linkedin-chrome-copilot", lang: "Bash" },
	{ name: "kokoro-speakd", lang: "Python" },
	{ name: "claude-classroom-submit", lang: "Python" },
	{ name: "fand", lang: "Rust" },
];

export function ProofBand() {
	const t = useTranslations("ProofBand");
	const { ref, isVisible } = useIntersection(0.1);
	const reduced = useReducedMotion();

	return (
		<section aria-labelledby="proof-heading" className="px-6 py-24" ref={ref}>
			<motion.div
				className="mx-auto max-w-6xl"
				initial={reduced ? {} : { opacity: 0, y: 20 }}
				animate={isVisible ? { opacity: 1, y: 0 } : {}}
				transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
			>
				<FigStamp n="06" label={t("figLabel")} />
				<h2 id="proof-heading" className="mt-3 text-3xl font-bold tracking-tight">
					{t("heading")}
				</h2>
				<p className="mt-2 max-w-2xl text-text-muted">
					{t("bodyBefore")} <span className="font-mono text-text">yolo-labz</span>
					{t("bodyAfter")}
				</p>
				<ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
					{repos.map((repo) => (
						<li key={repo.name}>
							<a
								href={`https://github.com/yolo-labz/${repo.name}`}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-baseline justify-between rounded-lg border border-border bg-bg-card px-4 py-3 transition-colors hover:border-text-muted"
							>
								<span className="font-mono text-sm text-text">{repo.name}</span>
								<span className="font-mono text-xs text-text-muted">{repo.lang}</span>
							</a>
						</li>
					))}
				</ul>
				<div className="mt-6">
					<Link href="/about" className="font-mono text-sm text-accent hover:underline">
						{t("aboutLink")}
					</Link>
				</div>
			</motion.div>
		</section>
	);
}
