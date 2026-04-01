import { HeroMetrics } from "@/components/sections/hero-metrics";
import { ProjectShowcase } from "@/components/sections/project-showcase";
import { SkillsMatrix } from "@/components/sections/skills-matrix";
import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { ContactCTA } from "@/components/sections/contact-cta";

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
