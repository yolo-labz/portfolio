import { useTranslations } from "next-intl";
import type { SkillDomain } from "@/data/skills";

// Read surface (About): one ruled row per problem domain; the stack is data, so mono.
export function SkillsMatrix() {
	const t = useTranslations("Skills");
	const skills = t.raw("domains") as SkillDomain[];

	return (
		<section id="skills" aria-labelledby="skills-heading" className="mt-20">
			<h2 id="skills-heading" className="text-step-3 font-semibold tracking-[-0.02em]">
				{t("heading")}
			</h2>
			<p className="mt-2 text-text-muted">{t("intro")}</p>

			<dl className="mt-8 border-t border-border">
				{skills.map((domain) => (
					<div
						key={domain.domain}
						className="grid gap-x-10 gap-y-2 border-b border-border py-6 md:grid-cols-[12rem_1fr]"
					>
						<dt className="font-semibold text-text">{domain.domain}</dt>
						<dd>
							<p className="text-sm leading-relaxed text-text-muted">{domain.description}</p>
							<p className="mt-3 font-mono text-xs leading-relaxed text-text">
								{domain.technologies.join(" · ")}
							</p>
						</dd>
					</div>
				))}
			</dl>
		</section>
	);
}
