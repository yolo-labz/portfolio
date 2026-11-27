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

// Featured projects (featured: true) are the org's flagship cards: one real public
// repo each, a one-liner taken from the brand-positioning corpus
// (yolo-labz/.github docs/brand-positioning.md, the six named flagships), and
// metrics that restate that corpus' required qualifiers rather than implying a
// guarantee. A card that cannot link a public repo is not a flagship card, so the
// anonymized client case studies stay in the array as deep dives with
// featured: false. The rest render in a compact "open-source & demos" shelf.
// No card may carry an invented number: corpus claims marked unsupported (SLSA
// level, notarization, latency tokens) or needs-measurement (timings, adoption)
// are stated as boundaries, not as results.
//
// PROSE (tagline/description/problemStatement/solutionSummary + the optional
// constraint/decision/outcome arc) is NOT here — it is localized in next-intl
// messages under Projects.<slug>.*. This array is structure only: slug, title,
// techStack, metric VALUES, links, featured, hasArc.
export const projects: Project[] = [
	{
		slug: "compliance-tax-agent",
		title: "Compliance-grade tax-filing agent: Brazilian IRPF",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "Typed-tool agent loop", category: "framework" },
			{ name: "Forced citation + span validation", category: "framework" },
			{ name: "Append-only audit ledger", category: "service" },
			{ name: "LGPD · 5-year replay", category: "service" },
		],
		metrics: [
			{ label: "My role", value: "extraction + validation, on a 6-engineer team" },
			{ label: "Agent ceiling", value: "≤40 typed-tool turns / filing" },
			{ label: "Output attestation", value: "every number re-validated against its source span" },
			{ label: "Audit", value: "LGPD · append-only decision ledger" },
		],
		links: {},
		featured: false,
		hasArc: true,
	},
	{
		slug: "event-driven-retail",
		title: "Event-driven retail commerce backend",
		techStack: [
			{ name: "Go", category: "language" },
			{ name: "TypeScript", category: "language" },
			{ name: "Kafka", category: "service" },
			{ name: "PostgreSQL", category: "database" },
			{ name: "Outbox · idempotency", category: "framework" },
		],
		metrics: [
			{ label: "My role", value: "backend engineer · payment + marketplace integrations" },
			{ label: "Architecture", value: "BFF + Broker + Dispatcher · event-driven" },
			{ label: "Delivery", value: "transactional outbox + idempotency keys" },
			{ label: "Stack", value: "Go · TypeScript" },
		],
		links: {},
		featured: false,
		hasArc: true,
	},
	{
		slug: "legal-domain-rag",
		title: "Legal-domain RAG: per-jurisdiction retrieval, citations that hold",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "AWS Bedrock", category: "service" },
			{ name: "AWS Lambda", category: "service" },
			{ name: "pgvector · per-jurisdiction", category: "database" },
			{ name: "Citation validator", category: "framework" },
		],
		metrics: [
			{ label: "Stage", value: "proof-of-concept (2024)" },
			{ label: "Retrieval", value: "per-jurisdiction indexes, no cross-regime bleed" },
			{ label: "Citations", value: "deterministically validated, never from memory" },
			{ label: "Cost", value: "serverless, usage-tracked" },
		],
		links: {},
		featured: false,
		hasArc: true,
	},
	{
		slug: "multilingual-rag",
		title: "Multilingual education chatbot: grounded retrieval, PT/EN",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "Azure OpenAI", category: "service" },
			{ name: "LangChain", category: "framework" },
			{ name: "pgvector", category: "database" },
			{ name: "Frozen-eval harness", category: "framework" },
		],
		metrics: [
			{ label: "My role", value: "backend + data layer (consultant)" },
			{ label: "Scale", value: "699K+ enrollment records" },
			{ label: "Release gate", value: "frozen-eval, no silent regression" },
			{ label: "Retrieval", value: "grounded, bilingual PT/EN" },
		],
		links: {},
		featured: false,
		hasArc: true,
	},
	{
		slug: "ai-document-processor",
		title: "ai-document-processor: auditable document extraction pipeline",
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
		links: {
			demo: "https://ai-docs.home301server.com.br",
			source: "https://github.com/yolo-labz/portfolio/tree/main/projects/ai-document-processor",
		},
		featured: false,
		hasArc: true,
	},
	{
		slug: "wa",
		title: "wa: WhatsApp daemon with an auditable trust boundary",
		techStack: [
			{ name: "Go", category: "language" },
			{ name: "whatsmeow", category: "framework" },
			{ name: "modernc.org/sqlite", category: "database" },
			{ name: "JSON-RPC", category: "service" },
			{ name: "NixOS", category: "infrastructure" },
		],
		metrics: [
			{ label: "Scope", value: "single-user · QR-paired · unofficial Multi-Device" },
			{ label: "Controls", value: "allowlist checked before the rate limiter" },
			{ label: "Send safety", value: "default-deny · per-sec/min/day limits · warmup ramp" },
			{ label: "License", value: "Apache-2.0" },
		],
		links: { source: "https://github.com/yolo-labz/wa" },
		featured: true,
		hasArc: true,
	},
	{
		slug: "serverless-data-api",
		title: "serverless-data-api: the boring layers tutorials skip",
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
		links: {
			source: "https://github.com/yolo-labz/portfolio/tree/main/projects/serverless-data-api",
		},
		featured: false,
		hasArc: true,
	},
	{
		slug: "exec-job-board",
		title: "exec-job-board: multi-source data aggregation pipeline",
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
		slug: "claude-mac-chrome",
		title: "claude-mac-chrome: Chrome automation for Claude Code on macOS",
		techStack: [
			{ name: "Bash", category: "language" },
			{ name: "AppleScript", category: "language" },
			{ name: "TypeScript", category: "language" },
			{ name: "cliclick", category: "service" },
			{ name: "macOS", category: "infrastructure" },
		],
		metrics: [
			{ label: "Platform", value: "macOS · Bash 4+ · jq · Apple Events" },
			{ label: "Addressing", value: "Local State catalog + stable window/tab IDs" },
			{ label: "Boundary", value: "IDs last for the window/tab lifetime, not across restart" },
			{ label: "License", value: "MIT" },
		],
		links: { source: "https://github.com/yolo-labz/claude-mac-chrome" },
		featured: true,
	},
	{
		slug: "linkedin-chrome-copilot",
		title: "linkedin-chrome-copilot: per-locale LinkedIn form automation",
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
		title: "kokoro-speakd: persistent Kokoro TTS daemon",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "ONNX Runtime", category: "framework" },
			{ name: "Kokoro 82M", category: "service" },
			{ name: "launchd / systemd", category: "infrastructure" },
		],
		metrics: [
			{ label: "Interface", value: "single-user Unix socket · line-delimited JSON" },
			{ label: "Playback", value: "interruptible; a queued ack is not audible start" },
			{
				label: "Boundary",
				value: "no latency guarantee; synthesis depends on text, hardware, load",
			},
			{ label: "License", value: "MIT" },
		],
		links: { source: "https://github.com/yolo-labz/kokoro-speakd" },
		featured: true,
	},
	{
		slug: "claude-classroom-submit",
		title: "claude-classroom-submit: autonomous Google Classroom turn-in",
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
		title: "fand: Apple Silicon thermal daemon",
		techStack: [
			{ name: "Rust", category: "language" },
			{ name: "SMC", category: "service" },
			{ name: "launchd", category: "infrastructure" },
		],
		metrics: [
			{ label: "Platform", value: "macOS · Apple Silicon · SMC sensors" },
			{ label: "Control", value: "curve output reduces to forced minimum or auto" },
			{ label: "Boundary", value: "arbitrary RPM targets are read-only on Apple Silicon" },
			{ label: "License", value: "MIT" },
		],
		links: { source: "https://github.com/yolo-labz/fand" },
		featured: true,
	},
	{
		slug: "anthropic-throttle-proxy",
		title: "anthropic-throttle-proxy: fleet-wide pacing and request admission",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "aiohttp", category: "framework" },
			{ name: "Per-bearer queues", category: "framework" },
			{ name: "Prometheus metrics", category: "service" },
			{ name: "Dokku", category: "infrastructure" },
		],
		metrics: [
			{ label: "Pacing", value: "fair per-bearer queues · AIMD live ceiling" },
			{ label: "Default", value: "queue mode off · fair/reactive enable admission" },
			{ label: "Boundary", value: "no monetary cap and no extra subscription capacity" },
			{ label: "License", value: "MIT" },
		],
		links: { source: "https://github.com/yolo-labz/anthropic-throttle-proxy" },
		featured: true,
	},
	{
		slug: "chrome-bridge",
		title: "chrome-bridge: extension plus localhost relay for Chromium automation",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "Chrome MV3 extension", category: "framework" },
			{ name: "chrome.debugger · CDP", category: "service" },
			{ name: "Localhost relay", category: "service" },
			{ name: "Linux · macOS", category: "infrastructure" },
		],
		metrics: [
			{ label: "Interface", value: "cb CLI → relay on 127.0.0.1 → extension" },
			{ label: "Input", value: "chrome.debugger · DevTools Protocol dispatch" },
			{ label: "Boundary", value: "no separate event-trust or fingerprint guarantee" },
			{ label: "License", value: "MIT" },
		],
		links: { source: "https://github.com/yolo-labz/chrome-bridge" },
		featured: true,
	},
	{
		slug: "fleet-refusal-guard",
		title: "Agent output guard: measured over 76,474 messages",
		techStack: [
			{ name: "TypeScript", category: "language" },
			{ name: "pi extension", category: "framework" },
			{ name: "Two-direction fixture", category: "service" },
		],
		metrics: [
			{ label: "Corpus", value: "76,474 agent messages" },
			{ label: "False flags", value: "127 before, 1 after" },
			{ label: "True refusals", value: "9 of 9 and 3 of 3 still caught" },
			{ label: "Cost", value: "5 files, about 350 added lines" },
		],
		links: {},
		featured: false,
		hasArc: true,
	},
	{
		slug: "fleet-workspace-guard",
		title: "Agent workspace guard: closing the last pane needs a name",
		techStack: [
			{ name: "TypeScript", category: "language" },
			{ name: "Python", category: "language" },
			{ name: "systemd timer", category: "infrastructure" },
			{ name: "herdr", category: "service" },
		],
		metrics: [
			{
				label: "Loss",
				value: "1 workspace deleted, 2 hours before anyone noticed (fleet of 84 seats)",
			},
			{ label: "Fix shipped", value: "same afternoon, under 5 hours" },
			{ label: "Healer", value: "every 5 minutes, 4 brakes, 13 test cases" },
			{ label: "Cost", value: "2 changes, about 850 added lines" },
		],
		links: {},
		featured: false,
		hasArc: true,
	},
	{
		slug: "fleet-silent-reload",
		title: "Silent failure: a reload that reported success for four days",
		techStack: [
			{ name: "Nix", category: "language" },
			{ name: "Shell", category: "language" },
			{ name: "Ghostty", category: "service" },
			{ name: "systemd", category: "infrastructure" },
		],
		metrics: [
			{ label: "Silent for", value: "4 days, 5 to 9 November 2026" },
			{ label: "Callers affected", value: "3" },
			{ label: "Old match, decoy cases failed", value: "3" },
			{ label: "Cost", value: "7 files, 82 added lines" },
		],
		links: {},
		featured: false,
		hasArc: true,
	},
	{
		slug: "throttle-gateway-incident",
		title: "Throttle gateway: a concurrency ceiling that fell from 64 to 1",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "aiohttp", category: "framework" },
			{ name: "AIMD pacing", category: "service" },
			{ name: "systemd", category: "infrastructure" },
		],
		metrics: [
			{ label: "Collapse", value: "ceiling 64 to 1 in 5 min 18 s, pinned for about 2 h" },
			{ label: "Refused", value: "16 queue-timeout 503s, 1 agent session lost" },
			{ label: "Recovery", value: "17 after 10 min, 59 after 38 min" },
			{ label: "Still open", value: "at a ceiling of 2 the third request is refused" },
		],
		links: {
			source:
				"https://github.com/yolo-labz/anthropic-throttle-proxy/blob/71ed5c3f11ca485b424d19cadb04d50808f43614/docs/incidents/2026-10-19-free-lane-collapse.md",
		},
		featured: false,
		hasArc: true,
	},
	{
		slug: "quality-gates-selftest",
		title: "quality-gates: three gates the fleet pins, none of them had CI",
		techStack: [
			{ name: "Bash", category: "language" },
			{ name: "Node.js", category: "language" },
			{ name: "GitHub Actions", category: "infrastructure" },
			{ name: "Gherkin AST", category: "service" },
		],
		metrics: [
			{ label: "Before", value: "0 workflows, 0 runs, suites on no pull request" },
			{ label: "Added", value: "27 discrimination cases for alignment-gate" },
			{ label: "Found", value: "a shell bug and a switch that did nothing" },
			{ label: "Cost", value: "139 and 214 added lines in two pull requests" },
		],
		links: { source: "https://github.com/yolo-labz/quality-gates/pull/7" },
		featured: false,
		hasArc: true,
	},
	{
		slug: "noctalia-appmenu",
		title: "noctalia-appmenu: an application menu across toolkit boundaries",
		techStack: [
			{ name: "Rust", category: "language" },
			{ name: "QML", category: "language" },
			{ name: "AT-SPI", category: "service" },
			{ name: "D-Bus", category: "service" },
			{ name: "niri IPC", category: "service" },
		],
		metrics: [
			{ label: "Stage", value: "v1.0.36 published release" },
			{ label: "Architecture", value: "AT-SPI → Rust bridge → QML widget" },
			{ label: "Scope", value: "niri only · AT-SPI and desktop fallback" },
			{ label: "Boundary", value: "No fresh toolkit compatibility or latency audit" },
		],
		links: { source: "https://github.com/yolo-labz/noctalia-appmenu" },
		featured: false,
	},
	{
		slug: "deps-train",
		title: "deps-train: dependency updates with commit-bound merge decisions",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "GitHub CLI", category: "service" },
			{ name: "GitHub REST API", category: "service" },
		],
		metrics: [
			{ label: "Runtime", value: "one Python file · gh CLI" },
			{ label: "Merge guard", value: "exact evaluated head SHA" },
			{ label: "Recovery", value: "branch deleted only after confirmed merge" },
			{ label: "Audit", value: "one JSONL decision record per PR" },
		],
		links: { source: "https://github.com/yolo-labz/deps-train" },
		featured: false,
	},
	{
		slug: "zellij-vertical-tabs",
		title: "zellij-vertical-tabs: a bounded-event terminal sidebar",
		techStack: [
			{ name: "Rust", category: "language" },
			{ name: "WebAssembly", category: "infrastructure" },
			{ name: "Zellij", category: "service" },
		],
		metrics: [
			{ label: "Event scope", value: "tab events without PaneUpdate subscription" },
			{ label: "Constraint", value: "16 MB guest memory cap documented in README" },
			{ label: "Recovery", value: "live tab manifest with freshness touch" },
			{ label: "Interface", value: "scrolling sidebar with focus visibility" },
		],
		links: { source: "https://github.com/yolo-labz/zellij-vertical-tabs" },
		featured: false,
	},
];

// The home index and the case-study prev/next walk share one order: the four
// anonymized client case files (decision records), then the six yolo-labz
// flagship repositories. Everything else lives on the open-source shelf.
const caseFileSlugs = [
	"compliance-tax-agent",
	"event-driven-retail",
	"legal-domain-rag",
	"multilingual-rag",
] as const;

// Records from running my own agent fleet, and two from public repositories. They are decision records like the client
// case files, but they are not in the home index (its ten rows are a layout contract)
// and not on the open-source shelf; the home page shows them in their own section.
export const fleetCaseSlugs = [
	"fleet-refusal-guard",
	"fleet-workspace-guard",
	"fleet-silent-reload",
	"throttle-gateway-incident",
	"quality-gates-selftest",
] as const;

export type WorkKind = "caseFile" | "repository";

export interface WorkEntry {
	project: Project;
	kind: WorkKind;
	/** Short display name: the repo slug, or the case title before its " — " subtitle. */
	name: string;
}

const bySlug = (slug: string) => {
	const project = projects.find((p) => p.slug === slug);
	if (!project) throw new Error(`work index: unknown project ${slug}`);
	return project;
};

export const workIndex: WorkEntry[] = [
	...caseFileSlugs.map((slug) => {
		const project = bySlug(slug);
		return {
			project,
			kind: "caseFile" as const,
			name: project.title.split(": ")[0] ?? project.title,
		};
	}),
	...projects
		.filter((p) => p.featured)
		.map((project) => ({ project, kind: "repository" as const, name: project.slug })),
];
