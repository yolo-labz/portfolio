export interface SkillDomain {
	domain: string;
	description: string;
	technologies: string[];
}

export const skills: SkillDomain[] = [
	{
		domain: "Data Extraction",
		description: "High-volume, reliable data collection from any source",
		technologies: [
			"Playwright",
			"Puppeteer",
			"Selenium",
			"BeautifulSoup",
			"Scrapy",
			"httpx",
			"Rotating Proxies",
		],
	},
	{
		domain: "Backend Systems",
		description: "APIs, services, and data layers that scale",
		technologies: [
			"FastAPI",
			"Django",
			"Node.js",
			"Express",
			"PostgreSQL",
			"Redis",
			"SQLAlchemy",
		],
	},
	{
		domain: "Frontend",
		description: "Fast, accessible interfaces with modern tooling",
		technologies: [
			"Next.js",
			"React",
			"TypeScript",
			"Tailwind CSS",
			"Framer Motion",
			"Recharts",
		],
	},
	{
		domain: "Cloud & Infrastructure",
		description: "AWS-native architectures with IaC and CI/CD",
		technologies: [
			"AWS Lambda",
			"ECS",
			"S3",
			"API Gateway",
			"Terraform",
			"Docker",
			"GitHub Actions",
			"CloudWatch",
		],
	},
	{
		domain: "Automation & Orchestration",
		description: "Workflow engines and scheduled pipelines",
		technologies: [
			"n8n",
			"Celery",
			"Apache Airflow",
			"Make (Integromat)",
			"cron",
			"GitHub Actions",
		],
	},
	{
		domain: "AI & Machine Learning",
		description: "Applied AI for document processing and classification",
		technologies: [
			"Claude API",
			"OpenAI API",
			"LangChain",
			"Tesseract OCR",
			"pandas",
			"scikit-learn",
		],
	},
];
