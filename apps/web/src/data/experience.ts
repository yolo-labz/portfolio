export interface ExperienceEntry {
	role: string;
	company: string;
	period: string;
	current: boolean;
	deliverables: string[];
}

export const experience: ExperienceEntry[] = [
	{
		role: "Senior AI Developer / Cloud Architect",
		company: "Stefanini LATAM (Gauge)",
		period: "Jul 2025 — Present",
		current: true,
		deliverables: [
			"Architected AI-powered content platform for Pearson serving 1M+ users across LATAM",
			"Built data ingestion pipeline processing 5TB+ daily across distributed microservices",
			"Reduced cloud spend by 30% through Lambda optimization and reserved capacity planning",
		],
	},
	{
		role: "Systems Software Engineer",
		company: "Ultracon (GlobalHitss / America Movil)",
		period: "Oct 2024 — Sep 2025",
		current: false,
		deliverables: [
			"Designed serverless ETL pipelines on AWS for telecom billing data normalization",
			"Implemented Terraform modules provisioning multi-region infrastructure in < 10 min",
			"Led observability initiative: CloudWatch dashboards, alarms, and automated incident response",
		],
	},
	{
		role: "Senior Software Engineer",
		company: "loomi",
		period: "Jul 2021 — Oct 2024",
		current: false,
		deliverables: [
			"Delivered 12+ client projects spanning e-commerce, fintech, and logistics verticals",
			"Built real-time inventory sync system handling 50K+ SKU updates/hour",
			"Mentored 4 junior engineers through code review and architecture sessions",
		],
	},
];
