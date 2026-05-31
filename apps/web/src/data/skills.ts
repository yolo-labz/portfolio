export interface SkillDomain {
	domain: string;
	description: string;
	technologies: string[];
}

// Ordered by recruiter/buyer weight for the Compliance-Grade AI Architect category.
// Regulated AI leads — it is the category's defining skill, not a bonus.
export const skills: SkillDomain[] = [
	{
		domain: "Regulated AI & compliance",
		description:
			"RAG with retrieval lineage, hash-chained audit ledgers, and decision provenance — mapped to LGPD, BCB 4.893, and the EU AI Act Art. 12 logging mandate.",
		technologies: [
			"LGPD",
			"BCB 4.893",
			"EU AI Act Art. 12",
			"Audit-trail design",
			"Decision provenance",
			"RAG evaluation",
			"PII controls",
		],
	},
	{
		domain: "AI agents & RAG",
		description:
			"Production RAG pipelines, typed-tool agent loops with bounded turns, and Model Context Protocol integrations — grounded retrieval with frozen-eval regression checks.",
		technologies: [
			"Claude Code",
			"Anthropic SDK",
			"Azure OpenAI",
			"AWS Bedrock",
			"RAG",
			"MCP",
			"pgvector",
			"LangGraph",
		],
	},
	{
		domain: "Backend",
		description:
			"Polyglot services that hold under load: Go daemons, TypeScript APIs, Python pipelines, Rust binaries — event-driven with outbox + idempotency.",
		technologies: [
			"Go",
			"TypeScript",
			"Node.js",
			"Python",
			"FastAPI",
			"Rust",
			"PostgreSQL",
			"Kafka",
		],
	},
	{
		domain: "Cloud",
		description:
			"Multi-cloud deployments on AWS, Azure, and GCP — serverless and container workloads sized to a cost ceiling, not left to drift.",
		technologies: [
			"AWS Lambda",
			"AWS Bedrock",
			"Azure App Service",
			"Azure AKS",
			"Azure OpenAI",
			"GCP Cloud Run",
			"GCP Cloud SQL",
		],
	},
	{
		domain: "Infra-as-Code",
		description:
			"Declarative infrastructure across cloud and bare-metal fleets — reproducible, with a teardown story that leaves zero orphans.",
		technologies: ["Terraform", "Helm", "Kubernetes", "NixOS", "Docker", "Docker Compose"],
	},
	{
		domain: "Release engineering",
		description:
			"Supply-chain hardening as a first-class deliverable: reproducible builds, signed provenance, dual-format SBOMs.",
		technologies: [
			"GitHub Actions",
			"Sigstore",
			"SLSA L2",
			"gitleaks",
			"OSV-Scanner",
			"Dependabot",
			"Syft",
		],
	},
];
