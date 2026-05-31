export interface ExperienceEntry {
	role: string;
	company: string;
	period: string;
	current: boolean;
	deliverables: string[];
}

// Client/employer names are anonymized per the stealth canon — public surfaces
// carry capability + scale, never identifiable employer names.
export const experience: ExperienceEntry[] = [
	{
		role: "Compliance-Grade AI Architect / Cloud Architect",
		company: "Tier-1 IT services group · LATAM",
		period: "Jul 2025 — Present",
		current: true,
		deliverables: [
			"Architected compliance-grade RAG on Azure OpenAI — decision provenance, audit-trail logging, and frozen-eval regression checks for regulated workloads",
			"Shipped a multilingual education assistant serving 100K+ daily active users — +40% knowledge-base precision after rollout",
			"Stood up multi-cloud Terraform (Azure + GCP) cutting environment provisioning below 10 minutes",
			"Cut cloud spend 30% via Lambda right-sizing and reserved-capacity planning",
		],
	},
	{
		role: "Systems Software Engineer",
		company: "Telecom carrier · LATAM",
		period: "Oct 2024 — Sep 2025",
		current: false,
		deliverables: [
			"Designed serverless ETL on AWS Lambda + Step Functions for tier-1 telecom billing data",
			"Published Terraform modules provisioning multi-region infrastructure in under 10 minutes",
			"Rolled out a CloudWatch observability stack — dashboards, alarms, automated incident response",
			"Hardened the release pipeline with Sigstore + SLSA provenance for a regulated supply chain",
		],
	},
	{
		role: "Senior Software Engineer",
		company: "Product engineering studio · e-commerce / fintech / logistics",
		period: "Jul 2021 — Oct 2024",
		current: false,
		deliverables: [
			"Delivered 12+ production systems across e-commerce, fintech, and logistics",
			"Built an event-driven BFF + Broker + Dispatcher clearing 10K+ transactions/day with the outbox pattern and idempotency keys",
			"Introduced GitHub Actions matrix CI with gitleaks + OSV-Scanner for supply-chain hygiene",
			"Set the architecture and release-gate standards adopted across multiple squads",
		],
	},
];
