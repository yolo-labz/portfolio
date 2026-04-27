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
		company: "Stefanini LATAM",
		period: "Jul 2025 — Present",
		current: true,
		deliverables: [
			"Shipped AI-native automation agents for a LATAM education platform serving 1M+ learners",
			"Architected RAG pipeline on Azure OpenAI with audit-trail logging for regulated workloads",
			"Deployed multi-cloud Terraform modules (Azure + GCP) reducing provisioning time below 10 min",
			"Cut cloud spend 30% via Lambda right-sizing and reserved-capacity planning",
		],
	},
	{
		role: "Systems Software Engineer",
		company: "Ultracon (GlobalHitss / America Movil)",
		period: "Oct 2024 — Sep 2025",
		current: false,
		deliverables: [
			"Designed serverless ETL on AWS Lambda + Step Functions for tier-1 telecom billing data",
			"Published Terraform modules provisioning multi-region infra in under 10 minutes",
			"Rolled out CloudWatch observability stack: dashboards, alarms, automated incident response",
			"Hardened release pipeline with Sigstore + SLSA provenance for regulated supply chain",
		],
	},
	{
		role: "Senior Software Engineer",
		company: "loomi",
		period: "Jul 2021 — Oct 2024",
		current: false,
		deliverables: [
			"Delivered 12+ production systems across e-commerce, fintech, and logistics verticals",
			"Built event-driven BFF + Broker + Dispatcher handling 50K+ SKU updates/hour",
			"Mentored 4 engineers through code review, architecture sessions, and release gates",
			"Introduced GitHub Actions matrix CI with gitleaks + OSV-Scanner for supply-chain hygiene",
		],
	},
];
