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
		slug: "wa",
		title: "wa — WhatsApp daemon for AI workflows",
		tagline: "Hexagonal Go daemon with append-only safety, JSON-RPC unix socket, NixOS module",
		description:
			"Persistent WhatsApp session wrapped in a daemon (`wad`) with a thin CLI client (`wa`) that issues commands via JSON-RPC. SQLite ratchet store, allowlist + rate limiter + warmup ramp before the first send. Inbound messages wrapped in <channel> tags so a downstream agent cannot trust message body to mutate allowlist or trigger sends.",
		problemStatement:
			"AI agents need WhatsApp surface to run end-to-end recruitment, support, and family workflows — but every commercial WhatsApp API is locked behind partner approval, and direct whatsmeow integration leaks the library across the codebase.",
		solutionSummary:
			"Hexagonal architecture: domain/app code cannot import whatsmeow (golangci-lint enforces). Daemon owns state. CLI is dumb. Allowlist default-deny + per-second/per-minute/per-day rate limits + 25/50/100% warmup ramp on fresh sessions. Apache-2.0, GoReleaser to GitHub Releases + homebrew-tap + flake.nix. macOS notarized via rcodesign from a Linux runner.",
		techStack: [
			{ name: "Go", category: "language" },
			{ name: "whatsmeow", category: "framework" },
			{ name: "modernc.org/sqlite", category: "database" },
			{ name: "JSON-RPC", category: "service" },
			{ name: "NixOS", category: "infrastructure" },
		],
		metrics: [
			{ label: "Lines of Go", value: "61K+" },
			{ label: "Hexagonal layers", value: "domain · app · adapters" },
			{ label: "Distribution", value: "GitHub Releases · brew · flake" },
			{ label: "License", value: "Apache-2.0" },
		],
		links: { source: "https://github.com/yolo-labz/wa" },
		featured: true,
		gradient: "from-emerald-500/20 to-teal-500/20",
	},
	{
		slug: "claude-mac-chrome",
		title: "claude-mac-chrome — Chrome automation for Claude Code on macOS",
		tagline: "Multi-profile Chrome control via Local State catalog + cliclick + osascript",
		description:
			"Reads Chrome's Local State authoritative profile catalog and matches profiles to open windows via emails embedded in tab titles. Stable window/tab IDs across opens. Combined with cliclick + pbcopy, drives React/Ember single-page apps that reject programmatic events.",
		problemStatement:
			"LinkedIn, Calendly, Upwork single-page apps gate programmatic clicks via `event.isTrusted === true`. Browser extensions can't bypass it. Playwright via remote-debugging-port works but disrupts user session.",
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
			{ label: "Plugin LOC", value: "3.5K+" },
			{ label: "Profile detection", value: "deterministic" },
			{ label: "Bypasses", value: "isTrusted gate on React/Ember SPAs" },
		],
		links: { source: "https://github.com/yolo-labz/claude-mac-chrome" },
		featured: true,
		gradient: "from-blue-500/20 to-cyan-500/20",
	},
	{
		slug: "linkedin-chrome-copilot",
		title: "linkedin-chrome-copilot — Chrome automation for LinkedIn workflows",
		tagline: "Per-locale form fills, profile audit, message-triage routing — Claude Code plugin",
		description:
			"Per-locale profile-edit forms (PT/EN/ES) gated behind separate URLs with `isTrusted=true` Save buttons. Plugin enumerates positions, materializes drafts, and saves each locale slot via `execCommand('insertText')` + Save-button event-chain click — Chrome stays background, browser session intact.",
		problemStatement:
			"LinkedIn's profile editor in 2026 stores 3 locale slots per position (PT/EN/ES) behind separate URLs. The Save button discriminates `isTrusted=true` events, breaking Playwright synthetic dispatches. Algolia typeahead in skills section ignores synthetic input.",
		solutionSummary:
			"Bash 3.2 plugin sibling to claude-mac-chrome. Reads positions via owner-view DOM scrape, drives per-locale `/edit/forms/<id>/?language=<lang>&country=<cc>` saves via AppleScript JS-injection. cliclick fallback for paths gated on real OS pointer events. Audit log per action; two-phase confirm on any Send equivalent.",
		techStack: [
			{ name: "Bash", category: "language" },
			{ name: "AppleScript", category: "language" },
			{ name: "TypeScript", category: "language" },
			{ name: "claude-mac-chrome", category: "infrastructure" },
		],
		metrics: [
			{ label: "Plugin LOC", value: "2.8K+" },
			{ label: "Locale slots", value: "PT · EN · ES per position" },
			{ label: "Plugin tier", value: "Claude Code marketplace" },
		],
		links: { source: "https://github.com/yolo-labz/linkedin-chrome-copilot" },
		featured: true,
		gradient: "from-purple-500/20 to-pink-500/20",
	},
	{
		slug: "kokoro-speakd",
		title: "kokoro-speakd — persistent Kokoro TTS daemon",
		tagline: "ONNX TTS daemon for Claude Code — model loaded once, served via unix socket",
		description:
			"Loads the Kokoro 82M model once at daemon start, exposes a unix socket for repeat synthesis requests. Native macOS launchd + Linux systemd integration. PyPI-published with PEP 740 attestations.",
		problemStatement:
			"Per-request model load adds 3-5s latency to every TTS call. Claude Code session-level voice feedback needs sub-second response.",
		solutionSummary:
			"Daemon architecture: model held in memory, requests via unix socket, optional GPU acceleration via ONNX Runtime. Distributed via PyPI Trusted Publishing with PEP 740 build provenance attestations.",
		techStack: [
			{ name: "Python", category: "language" },
			{ name: "ONNX Runtime", category: "framework" },
			{ name: "Kokoro 82M", category: "service" },
			{ name: "launchd / systemd", category: "infrastructure" },
		],
		metrics: [
			{ label: "Model load", value: "once per daemon" },
			{ label: "PyPI attestations", value: "PEP 740" },
			{ label: "Cold-call latency", value: "< 200 ms (warm)" },
		],
		links: { source: "https://github.com/yolo-labz/kokoro-speakd" },
		featured: false,
		gradient: "from-amber-500/20 to-orange-500/20",
	},
	{
		slug: "claude-classroom-submit",
		title: "claude-classroom-submit — autonomous Google Classroom turn-in",
		tagline: "Bypasses cross-origin Drive Picker iframe via Classroom REST API + OAuth 2.0",
		description:
			"Uploads file to Drive via rclone, finds target assignment by query, attaches the Drive file via studentSubmissions.modifyAttachments, finalizes with studentSubmissions.turnIn — all via REST API.",
		problemStatement:
			"Browser automation hits the Drive Picker iframe sandbox; programmatic file selection blocked by cross-origin policy. Manual submit takes ~2 minutes per assignment.",
		solutionSummary:
			"Skip the browser entirely. rclone uploads to Drive, Classroom REST API attaches + turns in. OAuth 2.0 refresh-token flow stored at `~/.config/claude-classroom-submit/tokens.json`.",
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
		gradient: "from-rose-500/20 to-red-500/20",
	},
	{
		slug: "fand",
		title: "fand — Apple Silicon thermal daemon",
		tagline: "Temperature-driven fan curves with SIGHUP reload, Rust + launchd",
		description:
			"Reads SMC sensors via direct system calls, applies user-configured fan curves, supports per-machine overrides. Hot-reload on SIGHUP. Rust 1.84 with exact-pin dependencies for reproducible builds.",
		problemStatement:
			"Apple Silicon fan management defaults are too conservative under sustained CPU + GPU load (Claude Code + Docker + browser + ffmpeg). Fans don't ramp up until thermal throttling already started.",
		solutionSummary:
			"Userspace daemon polls SMC at 1Hz, applies aggressive curves before throttle, reloads config without restart. Distributed as universal2 binary via brew + GitHub Releases.",
		techStack: [
			{ name: "Rust", category: "language" },
			{ name: "SMC", category: "service" },
			{ name: "launchd", category: "infrastructure" },
		],
		metrics: [
			{ label: "Sensor poll", value: "1 Hz" },
			{ label: "Reload", value: "SIGHUP, zero downtime" },
			{ label: "Build", value: "exact-pin reproducible" },
		],
		links: { source: "https://github.com/yolo-labz/fand" },
		featured: false,
		gradient: "from-slate-500/20 to-gray-500/20",
	},
	{
		slug: "pedro-portfolio-recipes",
		title: "pedro-portfolio-recipes — code recipes",
		tagline: "Short, copy-pasteable patterns from the stacks I ship",
		description:
			"Eight capability-first code recipes — Claude Code plugin skills, Chrome multi-profile automation, pgvector + BM25 hybrid RAG, Sigstore attestation verification, NixOS flake overlays, parallel Azure/GCP Terraform modules, sops-nix secrets, and polyglot lefthook pre-commit hooks. Each recipe is one directory with problem, working snippet, tradeoff, and anti-pattern.",
		problemStatement:
			"Reviewers and collaborators need fast evidence that a stack claim is backed by actual code — not marketing copy and not full apps. Long-form writeups are the wrong resolution for 'show me how you'd wire hybrid search' or 'what does your pre-commit look like'.",
		solutionSummary:
			"A public repo of short, self-contained recipes under `recipes/<topic>/README.md`. No build step, no shared framework. Each recipe stands alone at 200–500 words: problem statement, snippet, tradeoff, anti-pattern, reference. MIT licensed, SonarQube + Dependabot + lefthook baseline per yolo-labz Tier-1.",
		techStack: [
			{ name: "Bash", category: "language" },
			{ name: "SQL", category: "language" },
			{ name: "Nix", category: "language" },
			{ name: "Terraform", category: "infrastructure" },
			{ name: "GitHub Actions", category: "service" },
		],
		metrics: [
			{ label: "Recipes seeded", value: "8" },
			{ label: "License", value: "MIT" },
			{ label: "Baseline", value: "SonarQube · lefthook · Dependabot" },
		],
		links: { source: "https://github.com/yolo-labz/pedro-portfolio-recipes" },
		featured: false,
		gradient: "from-lime-500/20 to-emerald-500/20",
	},
];

// Cache-bust: dokku rebuild trigger 2026-04-27 (portfolio#12 stealth fix forced rebuild)
