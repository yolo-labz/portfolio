export interface TechItem {
	name: string;
	category: "language" | "framework" | "database" | "infrastructure" | "service";
}

export interface Metric {
	// `label` is short prose and is translated in next-intl messages
	// (Projects.<slug>.metrics[]); `value` carries the load-bearing numbers and
	// stays here verbatim, locale-independent.
	label: string;
	value: string;
}

export interface Project {
	slug: string;
	// `title` is the project NAME (mostly proper/technical, e.g. "wa") — kept here,
	// not localized. All per-project PROSE (tagline, description, problemStatement,
	// solutionSummary, constraint/decision/outcome) lives in next-intl messages
	// under the "Projects" namespace, keyed by slug. See apps/web/messages.
	title: string;
	techStack: TechItem[];
	metrics: Metric[];
	links: {
		demo?: string;
		source?: string;
	};
	featured: boolean;
	// `hasArc` marks featured projects that carry a narrative-arc record
	// (constraint / decision / outcome prose in messages) so the deep-dive page can
	// render the decision block without trusting message-key presence at runtime.
	hasArc?: boolean;
}

// Featured projects (featured: true) carry the compliance-architecture thesis and
// render full case-study cards. The rest render in a compact "open-source & demos"
// shelf. Client work is anonymized; every featured metric is either locked-verified
// (positioning corpus) or stated in the public repo it links to.
//
// PROSE (tagline/description/problemStatement/solutionSummary + the optional
// constraint/decision/outcome arc) is NOT here — it is localized in next-intl
// messages under Projects.<slug>.*. This array is structure only: slug, title,
// techStack, metric VALUES, links, featured, hasArc.
export const projects: Project[] = [
	{
		slug: "compliance-tax-agent",
		title: "Compliance-grade tax-filing agent — Brazilian IRPF",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "Typed-tool agent loop", category: "framework" },
			{ name: "Forced citation + span validation", category: "framework" },
			{ name: "Append-only audit ledger", category: "service" },
			{ name: "LGPD · 5-year replay", category: "service" },
		],
		metrics: [
			{ label: "Hallucinated numerical fields", value: "0 / 18 months in production" },
			{ label: "Agent ceiling", value: "≤40 typed-tool turns / filing" },
			{ label: "Output attestation", value: "every number re-validated against its source span" },
			{ label: "Audit", value: "LGPD · 5-year decision replay" },
		],
		links: {},
		featured: true,
		hasArc: true,
	},
	{
		slug: "event-driven-retail",
		title: "Event-driven retail backend — clearing 10K+ transactions/day",
		techStack: [
			{ name: "Go", category: "language" },
			{ name: "TypeScript", category: "language" },
			{ name: "Kafka", category: "service" },
			{ name: "PostgreSQL", category: "database" },
			{ name: "Outbox · idempotency", category: "framework" },
		],
		metrics: [
			{ label: "Throughput", value: "10K+ transactions/day" },
			{ label: "Architecture", value: "BFF + Broker + Dispatcher · event-driven" },
			{ label: "Delivery", value: "transactional outbox + idempotency keys" },
			{ label: "Consumers", value: "Go + TypeScript off a shared event log" },
		],
		links: {},
		featured: true,
		hasArc: true,
	},
	{
		slug: "legal-domain-rag",
		title: "Legal-domain RAG — −60% manual documentation, citations that hold",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "AWS Bedrock", category: "service" },
			{ name: "AWS Lambda", category: "service" },
			{ name: "pgvector · per-jurisdiction", category: "database" },
			{ name: "Citation validator", category: "framework" },
		],
		metrics: [
			{ label: "Manual documentation", value: "−60% effort" },
			{ label: "Retrieval", value: "per-jurisdiction indexes — no cross-regime bleed" },
			{ label: "Citations", value: "deterministically validated, never from memory" },
			{ label: "Cost", value: "serverless, usage-tracked" },
		],
		links: {},
		featured: true,
		hasArc: true,
	},
	{
		slug: "multilingual-rag",
		title: "Multilingual RAG at 100K+ DAU — +40% knowledge-base precision",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "AWS Bedrock", category: "service" },
			{ name: "pgvector", category: "database" },
			{ name: "Frozen-eval harness", category: "framework" },
			{ name: "RAG", category: "service" },
		],
		metrics: [
			{ label: "Scale", value: "100K+ daily active users" },
			{ label: "Knowledge-base precision", value: "+40% after rollout" },
			{ label: "Release gate", value: "frozen-eval — no silent regression" },
			{ label: "Retrieval", value: "grounded, multilingual" },
		],
		links: {},
		featured: true,
		hasArc: true,
	},
	{
		slug: "ai-document-processor",
		title: "ai-document-processor — auditable document extraction pipeline",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "FastAPI", category: "framework" },
			{ name: "Claude Haiku · Sonnet", category: "service" },
			{ name: "Tesseract · PyMuPDF", category: "service" },
			{ name: "PostgreSQL 16", category: "database" },
			{ name: "Next.js 16", category: "framework" },
			{ name: "Docker Compose", category: "infrastructure" },
		],
		metrics: [
			{ label: "Cost per document", value: "~$0.006" },
			{ label: "Provenance", value: "every field traced to a source span" },
			{ label: "Formats", value: "PDF · scanned PDF · JPEG · PNG · DOCX" },
			{ label: "Storage", value: "JSONB + full-text TSVECTOR" },
		],
		links: { demo: "https://ai-docs.home301server.com.br" },
		featured: true,
		hasArc: true,
	},
	{
		slug: "wa",
		title: "wa — WhatsApp daemon with an auditable trust boundary",
		techStack: [
			{ name: "Go", category: "language" },
			{ name: "whatsmeow", category: "framework" },
			{ name: "modernc.org/sqlite", category: "database" },
			{ name: "JSON-RPC", category: "service" },
			{ name: "NixOS", category: "infrastructure" },
		],
		metrics: [
			{
				label: "Trust boundary",
				value: "<channel>-tagged inbound — body can't mutate the allowlist",
			},
			{ label: "Send safety", value: "default-deny · per-sec/min/day limits · 25/50/100% warmup" },
			{ label: "Supply chain", value: "SLSA L2 + Sigstore · verify via gh attestation verify" },
			{ label: "License", value: "Apache-2.0" },
		],
		links: { source: "https://github.com/yolo-labz/wa" },
		featured: false,
		hasArc: true,
	},
	{
		slug: "serverless-data-api",
		title: "serverless-data-api — the boring layers tutorials skip",
		techStack: [
			{ name: "Terraform", category: "infrastructure" },
			{ name: "Python", category: "language" },
			{ name: "AWS Lambda · arm64", category: "service" },
			{ name: "API Gateway", category: "service" },
			{ name: "DynamoDB · single-table", category: "database" },
			{ name: "CloudWatch", category: "service" },
			{ name: "GitHub Actions", category: "service" },
		],
		metrics: [
			{ label: "Access control", value: "IAM least-privilege scoped to the table ARN" },
			{ label: "Resilience", value: "DynamoDB PITR · teardown leaves 0 orphans" },
			{ label: "Provisioned", value: "15 resources · 5 reusable modules" },
			{ label: "Idle cost", value: "$0/month (no dashboard)" },
		],
		links: {},
		featured: false,
		hasArc: true,
	},
	{
		slug: "exec-job-board",
		title: "exec-job-board — multi-source data aggregation pipeline",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "httpx", category: "framework" },
			{ name: "Pydantic v2", category: "framework" },
			{ name: "Next.js 16", category: "framework" },
			{ name: "Fuse.js", category: "service" },
			{ name: "GitHub Actions", category: "service" },
			{ name: "Dokku", category: "infrastructure" },
		],
		metrics: [
			{ label: "Sources", value: "4 public APIs, one schema" },
			{ label: "Pipeline cadence", value: "daily 06:00 UTC" },
			{ label: "Search latency", value: "< 200 ms client-side" },
			{ label: "Runtime cost", value: "$0 (SSG)" },
		],
		links: { demo: "https://exec-job-board.home301server.com.br" },
		featured: false,
	},
	{
		slug: "realestate-price-tracker",
		title: "realestate-price-tracker — full-stack market dashboard",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "FastAPI", category: "framework" },
			{ name: "SQLAlchemy async · asyncpg", category: "framework" },
			{ name: "PostgreSQL 16", category: "database" },
			{ name: "Next.js 16", category: "framework" },
			{ name: "Recharts · React-Leaflet", category: "service" },
			{ name: "Docker Compose", category: "infrastructure" },
		],
		metrics: [
			{ label: "Dataset", value: "800 listings · 6 neighborhoods" },
			{ label: "Endpoints", value: "list · geo · stats · CSV · JSON" },
			{ label: "Aggregates", value: "indexed, sub-millisecond" },
			{ label: "License", value: "MIT" },
		],
		links: { demo: "https://realestate-tracker.home301server.com.br" },
		featured: false,
	},
	{
		slug: "claude-mac-chrome",
		title: "claude-mac-chrome — Chrome automation for Claude Code on macOS",
		techStack: [
			{ name: "Bash", category: "language" },
			{ name: "AppleScript", category: "language" },
			{ name: "TypeScript", category: "language" },
			{ name: "cliclick", category: "service" },
			{ name: "macOS", category: "infrastructure" },
		],
		metrics: [
			{ label: "Profile detection", value: "deterministic, via Local State" },
			{ label: "Bypasses", value: "isTrusted gate on React/Ember SPAs" },
		],
		links: { source: "https://github.com/yolo-labz/claude-mac-chrome" },
		featured: false,
	},
	{
		slug: "linkedin-chrome-copilot",
		title: "linkedin-chrome-copilot — per-locale LinkedIn form automation",
		techStack: [
			{ name: "Bash", category: "language" },
			{ name: "AppleScript", category: "language" },
			{ name: "TypeScript", category: "language" },
			{ name: "claude-mac-chrome", category: "infrastructure" },
		],
		metrics: [
			{ label: "Locale slots", value: "PT · EN · ES per position" },
			{ label: "Safety", value: "per-action audit log · two-phase send confirm" },
		],
		links: { source: "https://github.com/yolo-labz/linkedin-chrome-copilot" },
		featured: false,
	},
	{
		slug: "kokoro-speakd",
		title: "kokoro-speakd — persistent Kokoro TTS daemon",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "ONNX Runtime", category: "framework" },
			{ name: "Kokoro 82M", category: "service" },
			{ name: "launchd / systemd", category: "infrastructure" },
		],
		metrics: [
			{ label: "Model load", value: "once per daemon" },
			{ label: "Warm latency", value: "< 200 ms" },
			{ label: "PyPI provenance", value: "PEP 740 attestations" },
		],
		links: { source: "https://github.com/yolo-labz/kokoro-speakd" },
		featured: false,
	},
	{
		slug: "claude-classroom-submit",
		title: "claude-classroom-submit — autonomous Google Classroom turn-in",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "Google Classroom API", category: "service" },
			{ name: "rclone", category: "infrastructure" },
			{ name: "OAuth 2.0", category: "service" },
		],
		metrics: [
			{ label: "Submit time", value: "< 5 s" },
			{ label: "Manual time saved", value: "~2 min / submission" },
		],
		links: { source: "https://github.com/yolo-labz/claude-classroom-submit" },
		featured: false,
	},
	{
		slug: "fand",
		title: "fand — Apple Silicon thermal daemon",
		techStack: [
			{ name: "Rust", category: "language" },
			{ name: "SMC", category: "service" },
			{ name: "launchd", category: "infrastructure" },
		],
		metrics: [
			{ label: "Reload", value: "SIGHUP, zero downtime" },
			{ label: "Build", value: "exact-pin reproducible" },
		],
		links: { source: "https://github.com/yolo-labz/fand" },
		featured: false,
	},
	{
		slug: "pedro-portfolio-recipes",
		title: "pedro-portfolio-recipes — capability-first code recipes",
		techStack: [
			{ name: "Bash", category: "language" },
			{ name: "SQL", category: "language" },
			{ name: "Nix", category: "language" },
			{ name: "Terraform", category: "infrastructure" },
			{ name: "GitHub Actions", category: "service" },
		],
		metrics: [
			{ label: "Recipes", value: "8 self-contained" },
			{ label: "Baseline", value: "SonarQube · lefthook · Dependabot" },
		],
		links: { source: "https://github.com/yolo-labz/pedro-portfolio-recipes" },
		featured: false,
	},
];
