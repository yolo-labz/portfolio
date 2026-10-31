import { useTranslations } from "next-intl";
import type { ExperienceEntry } from "@/data/experience";

// Read surface (About): a ruled record, period in the margin, deliverables as prose rows.
export function ExperienceTimeline() {
	const t = useTranslations("Experience");
	const experience = t.raw("entries") as ExperienceEntry[];

	return (
		<section id="experience" aria-labelledby="experience-heading" className="mt-20">
			<h2 id="experience-heading" className="text-step-3 font-semibold tracking-[-0.02em]">
				{t("heading")}
			</h2>
			<p className="mt-2 text-text-muted">{t("intro")}</p>

			<ol className="mt-8 border-t border-border">
				{experience.map((entry) => (
					<li
						key={`${entry.company}-${entry.period}`}
						className="grid gap-x-10 gap-y-2 border-b border-border py-8 md:grid-cols-[12rem_1fr]"
					>
						<p className="font-mono text-xs text-text-muted tabular-nums md:pt-1">{entry.period}</p>
						<div>
							<h3 className="font-semibold">{entry.role}</h3>
							<p className={`mt-1 text-sm ${entry.current ? "text-accent" : "text-text-muted"}`}>
								{entry.company}
							</p>
							<ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-muted marker:text-overlay">
								{entry.deliverables.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
						</div>
					</li>
				))}
			</ol>
		</section>
	);
}
