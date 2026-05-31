import { ContactCTA } from "@/components/sections/contact-cta";
import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { HeroMetrics } from "@/components/sections/hero-metrics";
import { ProjectShowcase } from "@/components/sections/project-showcase";
import { ProofBand } from "@/components/sections/proof-band";
import { ServicesLadder } from "@/components/sections/services-ladder";
import { SkillsMatrix } from "@/components/sections/skills-matrix";

export default function Home() {
	return (
		<main>
			<HeroMetrics />
			<ProjectShowcase />
			<ServicesLadder />
			<SkillsMatrix />
			<ExperienceTimeline />
			<ProofBand />
			<ContactCTA />
		</main>
	);
}
