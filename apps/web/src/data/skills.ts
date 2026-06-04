// Prose (domain names, descriptions, technology labels) moved into the i18n
// "Skills" message namespace — consumed via `t.raw("domains")` in skills-matrix.
// Ordered by recruiter/buyer weight for the Compliance-Grade AI Architect category:
// Regulated AI leads — it is the category's defining skill, not a bonus.
// This interface stays the source-of-truth shape for the t.raw cast.
export interface SkillDomain {
	domain: string;
	description: string;
	technologies: string[];
}
