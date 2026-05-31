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
	// Narrative-arc fields — rendered on featured deep-dive pages so the page shows
	// the decision and the tradeoff, not just the result.
	constraint?: string;
	decision?: string;
	outcome?: string;
}

// Featured projects (featured: true) carry the compliance-architecture thesis and
// render full case-study cards. The rest render in a compact "open-source & demos"
// shelf. Client work is anonymized; every featured metric is either locked-verified
// (positioning corpus) or stated in the public repo it links to.
export const projects: Project[] = [
	{
		slug: "compliance-tax-agent",
		title: "Compliance-grade tax-filing agent — Brazilian IRPF",
		tagline:
			"A typed-tool LLM agent for regulated tax filings, where a single hallucinated number is a compliance failure — not a UX bug.",
		description:
			"An LLM agent that prepares and validates Brazilian income-tax (IRPF) filings under a strict compliance regime. Instead of a free-form chat loop, it runs a typed-tool loop bounded at ≤40 turns per filing: each step is a schema-validated tool call, retrieval is scoped to the filing year, and every emitted number is forced to cite — then re-validated against its source span before it can land in the return. The decision log is hash-chained and anchored to a transparency log, so any filing can be replayed years later.",
		problemStatement:
			"A regulated tax-filing agent cannot hallucinate a single numerical field, and every output has to be replayable for a five-year audit window under LGPD — on-premise, with no data egress. General-purpose RAG fails this twice: it can't prove where a number came from, and it can't bound how long it 'thinks'.",
		solutionSummary:
			"A typed-tool loop capped at ≤40 turns per filing instead of an unbounded agent; per-year retrieval scoping where the router rejects any cross-year hit; forced citation with post-hoc span validation so the model's arithmetic is never trusted blind; 80 deterministic anomaly rules catch out-of-policy values before they land; and a hash-chained audit ledger anchored to a public transparency log. Per-field retry (instead of re-running the whole filing) cut LLM cost ~80%. Rejected alternatives: a single large-context prompt (no provenance) and an open-ended agent loop (no audit ceiling).",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "Typed-tool agent loop", category: "framework" },
			{ name: "pgvector", category: "database" },
			{ name: "PostgreSQL", category: "database" },
			{ name: "Hash-chained audit ledger", category: "service" },
			{ name: "LGPD · 5-year replay", category: "service" },
		],
		metrics: [
			{ label: "Hallucinated numerical fields", value: "0 / 18 months in production" },
			{ label: "Throughput", value: "~10K filings/day at peak" },
			{ label: "Agent ceiling", value: "≤40 typed-tool turns / filing" },
			{ label: "Cost", value: "−80% via per-field (not per-filing) retry" },
		],
		links: {},
		featured: true,
		constraint:
			"LGPD plus a five-year audit-replay mandate, on-premise, zero data egress. One hallucinated numerical field is a regulatory failure, not a bug ticket.",
		decision:
			"Bound the agent at ≤40 typed-tool turns per filing rather than let it run open-ended; scope retrieval per filing year and reject cross-year hits at the router; force every number to cite and re-validate it against its source span before it lands. Rejected a single large-context prompt (no provenance) and an unbounded loop (no audit ceiling).",
		outcome:
			"Zero hallucinated numerical fields across 18 months in production, ~10K filings/day at peak, 80 deterministic anomaly rules gating every value, and ~80% lower LLM cost from per-field retry — every field replayable to the source span that produced it.",
	},
	{
		slug: "event-driven-retail",
		title: "Event-driven retail backend — clearing 10K+ transactions/day",
		tagline:
			"A multi-channel commerce backend where every state change is idempotent and auditable — Go + TypeScript on Kafka, outbox pattern, exactly-once effects.",
		description:
			"An event-driven backend clearing 10K+ transactions/day (~250 orders/min at peak) across multiple commerce surfaces, carved out of a 1M+ LOC Rails monolith over an 18-month strangler-fig migration. A BFF fronts the channels; a broker fans domain events out to dispatchers; the outbox pattern guarantees an event is published exactly once per committed transaction, and idempotency keys make every downstream effect safe to retry. Checkout p99 stayed ≤500ms under load, with a BACEN Circular 3.978/2020-traceable audit path throughout.",
		problemStatement:
			"Multi-channel commerce means the same order can arrive twice, a partner webhook can fire three times, and a network blip can drop an event mid-flight — yet the ledger has to stay exactly right and auditable under load.",
		solutionSummary:
			"BFF + Broker + Dispatcher: the broker decouples producers from consumers, the transactional outbox publishes each event exactly once per committed write, and idempotency keys dedupe at every effect boundary. Kafka carries the event log; Go and TypeScript services consume it. Retries are safe by construction, so partner flakiness degrades gracefully instead of corrupting state.",
		techStack: [
			{ name: "Go", category: "language" },
			{ name: "TypeScript", category: "language" },
			{ name: "Kafka", category: "service" },
			{ name: "PostgreSQL", category: "database" },
			{ name: "Outbox · idempotency", category: "framework" },
		],
		metrics: [
			{ label: "Throughput", value: "10K+ tx/day · ~250 orders/min peak" },
			{ label: "Checkout", value: "p99 ≤ 500ms under load" },
			{ label: "Migration", value: "1M+ LOC monolith · 18-month strangler-fig" },
			{ label: "Audit", value: "BACEN 3.978 trace · outbox exactly-once" },
		],
		links: {},
		featured: true,
		constraint:
			"A 1M+ LOC monolith couldn't scale checkout under load and lacked a regulator-traceable audit path — and the cutover couldn't stop the business selling. The same order can arrive twice and a partner webhook can fire repeatedly, yet the ledger must stay exactly right (checkout p99 ≤500ms, BACEN 3.978-traceable) across an 18-month migration.",
		decision:
			"Strangler-fig the monolith — carve domain capabilities into a BFF + Broker + Dispatcher instead of a big-bang rewrite. Decouple producers from consumers with the broker, publish via a transactional outbox (exactly-once per committed write), and make every downstream effect idempotent so retries are safe by construction. Rejected a big-bang rewrite (the business can't stop selling), synchronous point-to-point calls (cascading failure), and at-least-once delivery without dedupe (double effects).",
		outcome:
			"A 1M+ LOC monolith migrated over 18 months without halting sales: 10K+ transactions/day (~250 orders/min peak), checkout p99 ≤500ms, BACEN 3.978-traceable, with retry-safe exactly-once effects so partner flakiness degrades gracefully instead of corrupting the ledger.",
	},
	{
		slug: "legal-domain-rag",
		title: "Legal-domain RAG — −60% manual documentation, citations that hold",
		tagline:
			"Per-jurisdiction retrieval with a deterministic citation validator, so every answer is grounded in a real source — AWS Bedrock + Lambda + pgvector.",
		description:
			"A legal-tech automation pipeline doing retrieval-augmented generation across a 15M-document corpus spanning 5 jurisdictions. Each jurisdiction gets its own pgvector index so retrieval never bleeds across legal regimes, and a deterministic citation validator checks that every cited passage actually exists and supports the claim before the answer is returned. Serverless on AWS Bedrock + Lambda, so cost tracks usage instead of idle capacity.",
		problemStatement:
			"In legal work a fabricated or mis-attributed citation is malpractice, and an answer grounded in the wrong jurisdiction is worse than no answer — but the manual documentation effort to do it by hand doesn't scale.",
		solutionSummary:
			"Per-jurisdiction pgvector indexes keep retrieval inside the correct legal regime. A deterministic citation validator verifies every cited span exists and supports the statement before generation returns — the model is never trusted to cite from memory. AWS Bedrock handles inference; Lambda keeps it serverless and cost-bounded.",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "AWS Bedrock", category: "service" },
			{ name: "AWS Lambda", category: "service" },
			{ name: "pgvector · per-jurisdiction", category: "database" },
			{ name: "Citation validator", category: "framework" },
		],
		metrics: [
			{ label: "Corpus", value: "15M documents · 5 jurisdictions" },
			{ label: "Manual documentation", value: "−60% effort" },
			{ label: "Citations", value: "deterministically validated, never from memory" },
			{ label: "Cost", value: "serverless, usage-tracked" },
		],
		links: {},
		featured: true,
		constraint:
			"A fabricated citation is malpractice and a cross-jurisdiction answer is worse than none — but manual documentation doesn't scale.",
		decision:
			"Isolate retrieval per jurisdiction so a query can't pull from the wrong regime, and gate generation behind a deterministic citation validator that confirms every cited span exists and supports the claim. Rejected a single shared index (cross-regime bleed) and trusting model-generated citations (hallucination risk).",
		outcome:
			"−60% manual documentation effort across a 15M-document, 5-jurisdiction corpus, with every citation deterministically validated against the source — never generated from memory.",
	},
	{
		slug: "multilingual-rag",
		title: "Multilingual RAG at 100K+ DAU — +40% knowledge-base precision",
		tagline:
			"Grounded retrieval with frozen-eval regression checks for a multilingual user base — AWS Bedrock + pgvector, precision measured before every rollout.",
		description:
			"A retrieval-augmented assistant serving 100K+ daily active users across a multilingual population. Grounded retrieval keeps answers tied to the knowledge base, and a frozen evaluation set gates every rollout — precision is measured on held-out questions before a change ships, so the knowledge base improves monotonically instead of regressing silently. AWS Bedrock + pgvector under the hood.",
		problemStatement:
			"A 100K-DAU multilingual assistant can't regress silently: a prompt or model change that helps one language can quietly degrade another, and nobody notices until the users do.",
		solutionSummary:
			"Grounded retrieval anchors answers to the knowledge base rather than the model's memory. A frozen-eval regression suite measures precision on a held-out question set before any rollout, so a change that improves one cohort can't silently degrade another. AWS Bedrock for inference, pgvector for retrieval.",
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
		constraint:
			"At 100K DAU across many languages, a change that helps one cohort can silently degrade another — and you only find out from the users.",
		decision:
			"Ground every answer in the knowledge base and gate rollouts behind a frozen evaluation set, so precision is measured on held-out questions before shipping. Rejected ungated prompt iteration (silent regressions) and ungrounded generation (hallucination at scale).",
		outcome:
			"+40% knowledge-base precision at 100K+ daily active users, with a frozen-eval gate that blocks silent regressions before they reach users.",
	},
	{
		slug: "ai-document-processor",
		title: "ai-document-processor — auditable document extraction pipeline",
		tagline:
			"A format-agnostic ingestion pipeline where every extracted field traces back to the source span it came from — PDF/DOCX/image → OCR → classify → extract → queryable JSONB.",
		description:
			"Upload PDFs, images, or DOCX files. The pipeline extracts text (OCR fallback for scanned input), a cheap model classifies the document type with a confidence score, a focused model pulls structured fields (vendor, amount, dates, line items) into clean JSON, and results land in PostgreSQL with JSONB + TSVECTOR full-text search. Next.js dashboard, Docker Compose orchestration, one command to bring the stack up. Runs without an API key (text extraction only) so the demo path is free.",
		problemStatement:
			"A regulated-document pipeline has to be format-agnostic (text PDF, scanned PDF, JPEG, DOCX), type-aware (invoice vs contract vs receipt), and queryable downstream — without hand-rolling a parser per format or buying a SaaS that can't be self-hosted.",
		solutionSummary:
			"A two-tier AI pipeline: a cheap model classifies, a focused model extracts based on type, and every extracted field is traced to the source span it came from. PyMuPDF + Tesseract handle text/OCR fallback. PostgreSQL JSONB stores extracted fields alongside TSVECTOR for free-text search. ~$0.006 per document.",
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
		constraint:
			"Self-hostable, format-agnostic, and type-aware — extraction has to be queryable downstream and auditable per field, not a black box.",
		decision:
			"Split the work: a cheap classifier first, then a focused extractor keyed to the document type, with a free no-API-key text path so the system degrades instead of failing. Store JSONB + TSVECTOR so downstream queries hit one table.",
		outcome:
			"A live, self-hostable pipeline at ~$0.006/document where every extracted field is traceable to its source span and searchable in full text.",
	},
	{
		slug: "wa",
		title: "wa — WhatsApp daemon with an auditable trust boundary",
		tagline:
			"A persistent agent channel that treats the inbound message body as an untrusted audit perimeter — Go, hexagonal, Sigstore-signed.",
		description:
			"A persistent WhatsApp session wrapped in a daemon (`wad`) with a thin CLI client (`wa`) that issues commands over a JSON-RPC unix socket. SQLite ratchet store, allowlist + rate limiter + warmup ramp before the first send. Inbound messages are wrapped in <channel> tags so a downstream agent cannot trust a message body to mutate the allowlist or trigger sends. Apache-2.0, GoReleaser to GitHub Releases + homebrew-tap + flake.nix.",
		problemStatement:
			"Giving an autonomous agent a real WhatsApp channel turns every inbound message body into an injection surface: a crafted message must never be able to mutate the allowlist or trigger a send. And a partner-API library leaking across the codebase makes the trust boundary impossible to audit.",
		solutionSummary:
			"Hexagonal layering enforced by golangci-lint, so domain and app code physically cannot import the WhatsApp library — it is quarantined to adapters. Inbound messages arrive wrapped in <channel> tags, so the agent can't trust a body to mutate state. Default-deny allowlist + per-second/minute/day rate limits + a 25/50/100% warmup ramp before the first send. SQLite ratchet store on modernc.org/sqlite — CGO_ENABLED=0, no CGO build chain.",
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
		constraint:
			"An autonomous agent with a real WhatsApp channel makes every inbound message body an injection surface — and a partner-API library leaking across the codebase makes the trust boundary impossible to audit.",
		decision:
			"Quarantine the WhatsApp library to adapters and let golangci-lint fail the build if domain/app code imports it; wrap inbound bodies in <channel> tags so they can't be trusted to mutate state; default-deny the allowlist and ramp sends 25/50/100% on a fresh session.",
		outcome:
			"A daemon whose trust boundary is auditable: the library is contained, the message body can't escalate privilege, and every release is Sigstore-signed at SLSA L2.",
	},
	{
		slug: "serverless-data-api",
		title: "serverless-data-api — the boring layers tutorials skip",
		tagline:
			"Production-grade serverless CRUD with IAM least-privilege, API-key usage plans, PITR, and a teardown that leaves zero orphans — all in Terraform.",
		description:
			"A production-ready serverless CRUD API provisioned entirely via Terraform. API Gateway with API-key auth and 1000-req/day rate limiting fronts a Python 3.12 Lambda on arm64 with AWS Powertools, backed by a single-table DynamoDB design with PITR. A CloudWatch dashboard with 8 widgets covers invocations, latency, errors, and capacity. `terraform apply` brings it up; `terraform destroy` removes every resource — no orphans.",
		problemStatement:
			"Serverless tutorials almost always skip the boring layers: IAM least-privilege, API-key + usage-plan auth, structured logging, and a teardown story. The result is demos that can't be cloned into production without a rewrite.",
		solutionSummary:
			"Five composable Terraform modules (dynamodb, iam, lambda, api_gateway, monitoring) wire 15 resources end to end. The Lambda execution role is least-privilege scoped to the table's ARN. The API Gateway usage plan caps at 1000 req/day with burst 10. GitHub Actions runs fmt + validate + plan on every PR. Idle cost is $0 (or $3/month with the CloudWatch dashboard kept on).",
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
		constraint:
			"A serverless API that can be cloned straight into production — IAM least-privilege, auth, observability, and a clean teardown — not a demo that needs a rewrite first.",
		decision:
			"Scope the Lambda role to the table ARN (never a wildcard), gate the API behind an API-key usage plan, cap at 1000 req/day, and make `terraform destroy` leave zero orphans. Provision every layer as a reusable module so the pattern is copyable.",
		outcome:
			"15 resources across 5 modules, least-privilege IAM, PITR, and a teardown that removes everything — at $0/month idle.",
	},
	{
		slug: "exec-job-board",
		title: "exec-job-board — multi-source data aggregation pipeline",
		tagline:
			"Four divergent public APIs normalized behind one Pydantic schema, deduped by content hash, and served as a zero-backend static site — refreshed daily by cron.",
		description:
			"An automated daily pipeline collects executive-tier listings from 4 public data APIs (JSearch, Adzuna, The Muse, USAJobs), normalizes them into a unified Pydantic schema, deduplicates via SHA-256 content hashing, and emits a single `jobs.json` consumed by a Next.js static site at build time. Fuse.js client-side fuzzy search + 4-dimension filtering, sub-200ms response, zero runtime backend cost.",
		problemStatement:
			"Aggregating data across 4 third-party APIs with divergent response schemas, rate limits, and auth models — without a backend that has to be kept warm — is the canonical 'glue code nobody wants to maintain' problem.",
		solutionSummary:
			"One adapter per source isolates response-shape drift. Pydantic v2 enforces the unified schema at the seam. SHA-256 over (title, employer, location, posted_date) handles dedupe. A GitHub Actions cron runs the collector daily, commits the JSON, and redeploys the static site. The site falls back to a curated 30-row seed when the API output is missing — the demo never breaks.",
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
		tagline:
			"Three layers most demo stacks fake one of: filtered + paginated REST, indexed aggregate queries, and a map/charts frontend that stays responsive under every filter combination.",
		description:
			"A full-stack dashboard tracking real-estate market data. FastAPI serves REST endpoints with filterable pagination, aggregate stats, and CSV/JSON export. A Next.js dashboard renders interactive Recharts line/bar charts and a React-Leaflet map with color-coded markers. PostgreSQL 16 with indexed queries, 800 synthetic listings across 6 neighborhoods, stitched together via Docker Compose.",
		problemStatement:
			"A market dashboard needs three layers wired correctly: filtered + paginated REST, indexed aggregate queries, and an interactive frontend with map + charts that stays responsive under filter combinations — and most demo stacks pick one and fake the rest.",
		solutionSummary:
			"SQLAlchemy async + asyncpg for non-blocking PostgreSQL access. Indexed columns on (neighborhood, price, posted_date) keep aggregates under a few ms. A seed script generates Gaussian-distributed prices around per-neighborhood medians. A single `docker compose up` brings PostgreSQL + API + dashboard online; CSV/JSON export endpoints respect the same filters as the live UI.",
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
		tagline:
			"Drives React/Ember SPAs that reject synthetic events, by sending real OS pointer events at computed screen coordinates.",
		description:
			"Reads Chrome's Local State authoritative profile catalog and matches profiles to open windows via emails embedded in tab titles. Stable window/tab IDs across opens. Combined with cliclick + pbcopy, it drives single-page apps that reject programmatic events.",
		problemStatement:
			"LinkedIn, Calendly, and Upwork single-page apps gate programmatic clicks via `event.isTrusted === true`. Browser extensions can't bypass it; Playwright via remote-debugging-port works but disrupts the user session.",
		solutionSummary:
			"macOS-native automation: cliclick at computed screen coords (window bounds + viewport rect) sends real OS pointer events with isTrusted=true. Chrome profile detection via Local State JSON. AppleScript orchestrates window + tab focus. Combined with pbcopy + Cmd+V for React contenteditable input.",
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
		tagline:
			"Materializes and saves per-locale (PT/EN/ES) profile slots behind isTrusted-gated Save buttons, with a two-phase confirm on any send.",
		description:
			"Per-locale profile-edit forms (PT/EN/ES) gated behind separate URLs with isTrusted=true Save buttons. The plugin enumerates positions, materializes drafts, and saves each locale slot via execCommand('insertText') + a Save-button event-chain click — Chrome stays in the background, browser session intact.",
		problemStatement:
			"LinkedIn's 2026 profile editor stores 3 locale slots per position (PT/EN/ES) behind separate URLs. The Save button discriminates isTrusted=true events, breaking synthetic dispatches; the Algolia typeahead in the skills section ignores synthetic input.",
		solutionSummary:
			"A Bash 3.2 plugin sibling to claude-mac-chrome. Reads positions via owner-view DOM scrape, drives per-locale /edit/forms/<id>/?language=<lang>&country=<cc> saves via AppleScript JS-injection. cliclick fallback for paths gated on real OS pointer events. Audit log per action; two-phase confirm on any Send equivalent.",
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
		tagline:
			"Loads the TTS model once and serves synthesis over a unix socket — sub-200ms warm response instead of a 3-5s per-call cold load.",
		description:
			"Loads the Kokoro 82M model once at daemon start and exposes a unix socket for repeat synthesis requests. Native macOS launchd + Linux systemd integration. PyPI-published with PEP 740 attestations.",
		problemStatement:
			"Per-request model load adds 3-5s latency to every TTS call. Claude Code session-level voice feedback needs sub-second response.",
		solutionSummary:
			"Daemon architecture: the model is held in memory, requests arrive via unix socket, with optional GPU acceleration via ONNX Runtime. Distributed via PyPI Trusted Publishing with PEP 740 build-provenance attestations.",
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
		tagline:
			"Skips the cross-origin Drive Picker iframe entirely — uploads via rclone, attaches and turns in via the Classroom REST API.",
		description:
			"Uploads a file to Drive via rclone, finds the target assignment by query, attaches the Drive file via studentSubmissions.modifyAttachments, and finalizes with studentSubmissions.turnIn — all via REST API.",
		problemStatement:
			"Browser automation hits the Drive Picker iframe sandbox; programmatic file selection is blocked by cross-origin policy. Manual submit takes ~2 minutes per assignment.",
		solutionSummary:
			"Skip the browser entirely. rclone uploads to Drive, the Classroom REST API attaches + turns in. OAuth 2.0 refresh-token flow stored at ~/.config/claude-classroom-submit/tokens.json.",
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
		tagline:
			"Ramps fans on temperature-driven curves before thermal throttling starts, with zero-downtime SIGHUP config reload — Rust + launchd.",
		description:
			"Reads SMC sensors via direct system calls, applies user-configured fan curves, and supports per-machine overrides. Hot-reload on SIGHUP. Rust 1.84 with exact-pin dependencies for reproducible builds.",
		problemStatement:
			"Apple Silicon fan defaults are too conservative under sustained CPU + GPU load (Claude Code + Docker + browser + ffmpeg). Fans don't ramp up until thermal throttling has already started.",
		solutionSummary:
			"A userspace daemon polls the SMC, applies aggressive curves before throttle, and reloads config without restart. Distributed as a universal2 binary via brew + GitHub Releases.",
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
		tagline:
			"Short, copy-pasteable patterns from the stacks I ship — each one is problem, working snippet, tradeoff, anti-pattern.",
		description:
			"Eight capability-first code recipes — Claude Code plugin skills, Chrome multi-profile automation, pgvector + BM25 hybrid RAG, Sigstore attestation verification, NixOS flake overlays, parallel Azure/GCP Terraform modules, sops-nix secrets, and polyglot lefthook pre-commit hooks. Each recipe is one directory: problem, working snippet, tradeoff, anti-pattern.",
		problemStatement:
			"Reviewers and collaborators need fast evidence that a stack claim is backed by actual code — not marketing copy, and not full apps. Long-form writeups are the wrong resolution for 'show me how you'd wire hybrid search'.",
		solutionSummary:
			"A public repo of short, self-contained recipes under recipes/<topic>/README.md. No build step, no shared framework. Each recipe stands alone at 200–500 words: problem, snippet, tradeoff, anti-pattern, reference. MIT, with a SonarQube + Dependabot + lefthook baseline.",
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
