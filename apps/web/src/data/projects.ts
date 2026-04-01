export interface TechItem {
	name: string;
	category: "language" | "framework" | "database" | "infrastructure" | "service";
}

export interface Metric {
	label: string;
	value: string;
}

export interface Project {
	slug: string;
	title: string;
	tagline: string;
	description: string;
	problemStatement: string;
	solutionSummary: string;
	techStack: TechItem[];
	metrics: Metric[];
	links: {
		demo?: string;
		source?: string;
	};
	featured: boolean;
	gradient: string;
}

export const projects: Project[] = [
	{
		slug: "realestate-price-tracker",
		title: "Real Estate Price Tracker",
		tagline: "Automated property data pipeline monitoring 50K+ listings daily",
		description:
			"End-to-end data extraction pipeline that collects real estate listings from public sources, normalizes pricing data, and renders interactive dashboards with trend analysis and geographic visualization.",
		problemStatement:
			"Real estate investors needed structured, up-to-date pricing data across multiple markets without manual research. Existing tools were either too expensive or lacked granularity.",
		solutionSummary:
			"Built a scheduled extraction pipeline with Playwright for dynamic content, FastAPI for the data layer, and a Next.js dashboard with map integration and CSV/JSON export.",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "Playwright", category: "framework" },
			{ name: "FastAPI", category: "framework" },
			{ name: "Next.js", category: "framework" },
			{ name: "PostgreSQL", category: "database" },
			{ name: "n8n", category: "service" },
			{ name: "Docker", category: "infrastructure" },
		],
		metrics: [
			{ label: "Listings tracked", value: "50K+" },
			{ label: "Refresh cycle", value: "Daily" },
			{ label: "Data accuracy", value: "99.2%" },
		],
		links: {
			source: "https://github.com/yolo-labz/portfolio/tree/main/projects/realestate-price-tracker",
		},
		featured: true,
		gradient: "from-emerald-500/20 to-teal-500/20",
	},
	{
		slug: "ai-document-processor",
		title: "AI Document Processor",
		tagline: "Multi-format document intake with AI-powered classification and extraction",
		description:
			"Upload PDFs, images, or DOCX files. OCR extracts text, an LLM classifies the document type, then extracts structured fields — invoice amounts, contract parties, dates — into a searchable archive with a REST API.",
		problemStatement:
			"A mid-size company processed 500+ documents daily across invoices, contracts, and receipts. Manual data entry took 3 FTEs and had a 4% error rate.",
		solutionSummary:
			"Deployed a FastAPI service backed by AWS S3 for storage and Claude for classification/extraction. Batch processing handles peak loads, and webhook notifications integrate with existing ERP systems.",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "FastAPI", category: "framework" },
			{ name: "AWS S3", category: "infrastructure" },
			{ name: "AWS Lambda", category: "infrastructure" },
			{ name: "Claude API", category: "service" },
			{ name: "PostgreSQL", category: "database" },
			{ name: "Tesseract OCR", category: "service" },
		],
		metrics: [
			{ label: "Accuracy", value: "96.8%" },
			{ label: "Docs/hour", value: "400+" },
			{ label: "Headcount saved", value: "2 FTEs" },
		],
		links: {
			source: "https://github.com/yolo-labz/portfolio/tree/main/projects/ai-document-processor",
		},
		featured: true,
		gradient: "from-violet-500/20 to-purple-500/20",
	},
	{
		slug: "automation-hub",
		title: "Workflow Automation Hub",
		tagline: "Self-hosted n8n platform with pre-built templates and admin dashboard",
		description:
			"A turnkey automation platform: self-hosted n8n with Docker Compose, a library of production-ready workflow templates (lead enrichment, content aggregation, price monitoring), and an admin dashboard tracking run history and error rates.",
		problemStatement:
			"Small teams needed automation for repetitive tasks but lacked the engineering capacity to build and maintain custom integrations between SaaS tools.",
		solutionSummary:
			"Packaged n8n with Docker Compose for one-command deployment. Built importable workflow templates with error handling and retry logic. Added a Next.js admin panel for monitoring run status and debugging failures.",
		techStack: [
			{ name: "n8n", category: "service" },
			{ name: "Next.js", category: "framework" },
			{ name: "PostgreSQL", category: "database" },
			{ name: "Docker", category: "infrastructure" },
			{ name: "TypeScript", category: "language" },
		],
		metrics: [
			{ label: "Templates", value: "12" },
			{ label: "Deploy time", value: "< 5 min" },
			{ label: "Uptime", value: "99.7%" },
		],
		links: {
			source: "https://github.com/yolo-labz/portfolio/tree/main/projects/automation-hub",
		},
		featured: false,
		gradient: "from-orange-500/20 to-amber-500/20",
	},
	{
		slug: "exec-job-board",
		title: "Executive Job Board",
		tagline: "Aggregated executive listings with daily auto-updates and static site delivery",
		description:
			"Collects executive job postings from public APIs, deduplicates and normalizes them, then generates a clean static site with search, filters, and RSS feed output. GitHub Actions rebuilds and deploys daily.",
		problemStatement:
			"A recruiting firm needed a single, branded interface aggregating executive-level positions across multiple job boards, updated automatically.",
		solutionSummary:
			"Python scripts collect and normalize data nightly. A Next.js static export renders the frontend. GitHub Actions orchestrates the pipeline and deploys to Vercel on every update.",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "Next.js", category: "framework" },
			{ name: "GitHub Actions", category: "infrastructure" },
			{ name: "Vercel", category: "infrastructure" },
			{ name: "TypeScript", category: "language" },
		],
		metrics: [
			{ label: "Sources", value: "8" },
			{ label: "Listings/day", value: "200+" },
			{ label: "Load time", value: "< 1s" },
		],
		links: {
			source: "https://github.com/yolo-labz/portfolio/tree/main/projects/exec-job-board",
		},
		featured: true,
		gradient: "from-sky-500/20 to-blue-500/20",
	},
	{
		slug: "serverless-data-api",
		title: "Serverless Data API",
		tagline: "Production-ready API on AWS with full Terraform IaC and CI/CD",
		description:
			"A complete serverless REST API built on AWS Lambda, API Gateway, and DynamoDB — provisioned entirely via Terraform. Includes API key auth, rate limiting, data validation, request logging, and a CloudWatch monitoring dashboard.",
		problemStatement:
			"Engineering teams needed a reference architecture for quickly spinning up serverless APIs with production-grade observability, authentication, and infrastructure-as-code.",
		solutionSummary:
			"Modular Terraform configuration provisions the full stack in one command. GitHub Actions CI/CD pipeline runs validation, plan, and apply stages. Swagger docs are auto-generated from Lambda handler decorators.",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "AWS Lambda", category: "infrastructure" },
			{ name: "API Gateway", category: "infrastructure" },
			{ name: "DynamoDB", category: "database" },
			{ name: "Terraform", category: "infrastructure" },
			{ name: "GitHub Actions", category: "infrastructure" },
		],
		metrics: [
			{ label: "Cold start", value: "< 200ms" },
			{ label: "Infra cost", value: "$0/idle" },
			{ label: "Deploy time", value: "< 3 min" },
		],
		links: {
			source: "https://github.com/yolo-labz/portfolio/tree/main/projects/serverless-data-api",
		},
		featured: false,
		gradient: "from-rose-500/20 to-pink-500/20",
	},
];
