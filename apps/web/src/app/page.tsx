import { ContactCTA } from "@/components/sections/contact-cta";
import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { HeroMetrics } from "@/components/sections/hero-metrics";
import { ProjectShowcase } from "@/components/sections/project-showcase";
import { SkillsMatrix } from "@/components/sections/skills-matrix";

export default function Home() {
	return (
		<main>
			<HeroMetrics />
			<ProjectShowcase />
			<SkillsMatrix />
			<ExperienceTimeline />
			<ContactCTA />
		</main>
	);
}
