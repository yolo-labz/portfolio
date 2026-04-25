export interface SkillDomain {
	domain: string;
	description: string;
	technologies: string[];
}

export const skills: SkillDomain[] = [
	{
		domain: "AI agents & automation",
		description: "RAG pipelines, Claude Code plugins, LLM-driven workflow copilots",
		technologies: [
			"Claude Code",
			"Anthropic SDK",
			"Azure OpenAI",
			"RAG",
			"LangChain",
			"MCP",
			"Bedrock",
		],
	},
	{
		domain: "Backend",
		description: "Polyglot services: Go daemons, TypeScript APIs, Python pipelines, Rust binaries",
		technologies: ["Go", "TypeScript", "Node.js", "Python", "FastAPI", "Rust", "PostgreSQL"],
	},
	{
		domain: "Cloud",
		description:
			"Multi-cloud deployments on AWS, Azure, and GCP with serverless + container workloads",
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
		description: "Declarative infrastructure across cloud and bare-metal fleets",
		technologies: ["Terraform", "Helm", "Kubernetes", "NixOS", "Docker", "Docker Compose"],
	},
	{
		domain: "Release engineering",
		description: "Supply-chain hardening, reproducible builds, signed provenance",
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
	{
		domain: "macOS / Chrome automation",
		description:
			"Workflow tooling for operators: Chrome profile orchestration, macOS input synthesis",
		technologies: ["cliclick", "AppleScript", "Playwright", "Puppeteer", "claude-mac-chrome"],
	},
];
