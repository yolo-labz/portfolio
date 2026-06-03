import { Card } from "@portfolio/ui";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
	title: "About — Pedro Balbino",
	description:
		"Compliance-Grade AI Architect for regulated LATAM & global workloads. Production RAG, agent systems, and MCP integrations with audit trails and decision provenance — every claim mapped to verifiable evidence.",
};

type ClaimStatus = "backed" | "unbacked-anonymized-pending";

interface ClaimEvidence {
	claim: string;
	evidenceType: string;
	url: string;
	status: ClaimStatus;
}

const category = "Compliance-Grade AI Architect for Regulated LATAM & Global Workloads";

const diagnostic =
	"Most AI stacks fail audit at the same three seams — prompt provenance, retrieval lineage, output attestation. The fix is architectural, not procedural: a three-plane topology — data, control, compliance — with the compliance plane as a sidecar and a hash-chained audit ledger anchored to a public transparency log.";

const aboutSummary =
	"Production proof spans a 100K+ DAU multilingual RAG (+40% knowledge-base precision), a 10K+ transactions/day event-driven retail backend, a tier-1 LATAM legal-domain RAG (−60% manual documentation), and a Brazilian IRPF tax-compliance agent (0 hallucinated numerical fields across 18 months, ≤40 turns per filing). Open-source: six public Claude Code plugins on github.com/yolo-labz — SLSA L2 + Sigstore signed, dual-format SBOMs.";

const claimEvidenceMap: ClaimEvidence[] = [
	{
		claim: "Claude Code plugins shipped",
		evidenceType: "public-repo",
		url: "https://github.com/yolo-labz/wa",
		status: "backed",
	},
	{
		claim: "Chrome/macOS workflow tooling",
		evidenceType: "public-repo",
		url: "https://github.com/yolo-labz/claude-mac-chrome",
		status: "backed",
	},
	{
		claim: "LinkedIn copilot",
		evidenceType: "public-repo",
		url: "https://github.com/yolo-labz/linkedin-chrome-copilot",
		status: "backed",
	},
	{
		claim: "WhatsApp daemon (Go, hexagonal)",
		evidenceType: "public-repo",
		url: "https://github.com/yolo-labz/wa",
		status: "backed",
	},
	{
		claim: "TTS daemon (Python, ONNX, PyPI)",
		evidenceType: "public-repo",
		url: "https://github.com/yolo-labz/kokoro-speakd",
		status: "backed",
	},
	{
		claim: "Apple Silicon thermal daemon (Rust)",
		evidenceType: "public-repo",
		url: "https://github.com/yolo-labz/fand",
		status: "backed",
	},
	{
		claim: "Multi-host NixOS fleet (152 modules, 153 PRs)",
		evidenceType: "anonymized-writeup",
		url: "https://blog.home301server.com.br/tags/nixos/",
		status: "unbacked-anonymized-pending",
	},
	{
		claim: "Compliance-grade RAG for tier-1 LATAM banking",
		evidenceType: "anonymized-writeup",
		url: "https://blog.home301server.com.br/posts/2026-04-26-compliance-grade-rag-tier1-banking",
		status: "unbacked-anonymized-pending",
	},
	{
		claim: "Event-driven retail backend (BFF + Broker + Dispatcher)",
		evidenceType: "anonymized-writeup",
		url: "https://blog.home301server.com.br/posts/2026-05-17-event-driven-retail-bff-broker",
		status: "unbacked-anonymized-pending",
	},
	{
		claim: "AWS Bedrock + Lambda for legal-domain RAG",
		evidenceType: "anonymized-writeup",
		url: "https://blog.home301server.com.br/posts/2026-05-31-aws-bedrock-lambda-legal-rag",
		status: "unbacked-anonymized-pending",
	},
	{
		claim: "Multilingual education chatbot — intent routing + escalation",
		evidenceType: "anonymized-writeup",
		url: "https://blog.home301server.com.br/posts/2026-06-14-multilingual-edu-chatbot",
		status: "unbacked-anonymized-pending",
	},
	{
		claim: "AI-IRPF tax-compliance LLM agent",
		evidenceType: "anonymized-writeup",
		url: "https://blog.home301server.com.br/posts/2026-06-21-ai-irpf-tax-compliance-llm-agent",
		status: "unbacked-anonymized-pending",
	},
];

interface SonarRepo {
	slug: string;
	label: string;
	language: string;
}

const SONAR_HOST = "https://sonarqube.home301server.com.br";

const sonarRepos: SonarRepo[] = [
	{ slug: "wa", label: "wa", language: "Go" },
	{ slug: "claude-mac-chrome", label: "claude-mac-chrome", language: "Bash" },
	{ slug: "linkedin-chrome-copilot", label: "linkedin-chrome-copilot", language: "Bash" },
	{ slug: "kokoro-speakd", label: "kokoro-speakd", language: "Python" },
	{ slug: "claude-classroom-submit", label: "claude-classroom-submit", language: "Python" },
	{ slug: "fand", label: "fand", language: "Rust" },
];

const sonarMetrics: Array<{ key: string; alt: string }> = [
	{ key: "alert_status", alt: "Quality Gate" },
	{ key: "sqale_rating", alt: "Maintainability" },
	{ key: "reliability_rating", alt: "Reliability" },
	{ key: "security_rating", alt: "Security" },
];

function sonarBadgeUrl(slug: string, metric: string) {
	return `${SONAR_HOST}/api/project_badges/measure?project=yolo-labz_${slug}&metric=${metric}`;
}

function sonarDashboardUrl(slug: string) {
	return `${SONAR_HOST}/dashboard?id=yolo-labz_${slug}`;
}

function statusPill(status: ClaimStatus) {
	if (status === "backed") {
		return (
			<span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-xs text-emerald-300">
				backed
			</span>
		);
	}
	return (
		<span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-xs text-amber-300">
			writeup pending
		</span>
	);
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<section className="mx-auto w-full max-w-5xl px-6 py-24">
			<header className="space-y-6">
				<p className="font-mono text-sm text-accent">About</p>
				<h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">{category}</h1>
				<p className="max-w-3xl text-lg leading-relaxed text-text">{diagnostic}</p>
				<p className="max-w-3xl text-base leading-relaxed text-text-muted">{aboutSummary}</p>
			</header>

			<div className="mt-16 space-y-6">
				<div className="flex items-end justify-between gap-4">
					<div>
						<h2 className="text-2xl font-semibold tracking-tight">Claim → Evidence</h2>
						<p className="mt-2 max-w-2xl text-sm text-text-muted">
							Every headline claim maps to a verifiable artifact. Public repositories link straight
							to the source. Rows marked "writeup pending" are anonymized architecture writeups
							publishing on a rolling cadence — client work stays behind the curtain until the
							writeup is cleared.
						</p>
					</div>
				</div>

				<Card className="overflow-hidden p-0">
					<div className="overflow-x-auto">
						<table className="w-full border-collapse text-left text-sm">
							<thead className="border-b border-border bg-surface/40 font-mono text-xs uppercase tracking-wide text-text-muted">
								<tr>
									<th scope="col" className="px-5 py-3">
										Claim
									</th>
									<th scope="col" className="px-5 py-3">
										Evidence
									</th>
									<th scope="col" className="px-5 py-3">
										Status
									</th>
								</tr>
							</thead>
							<tbody>
								{claimEvidenceMap.map((row) => (
									<tr
										key={row.url + row.claim}
										className="border-b border-border/50 align-top last:border-b-0"
									>
										<td className="px-5 py-4 text-text">{row.claim}</td>
										<td className="px-5 py-4">
											{row.status === "backed" ? (
												<a
													href={row.url}
													target="_blank"
													rel="noopener noreferrer"
													className="break-all font-mono text-xs text-accent hover:underline"
												>
													{row.url.replace(/^https?:\/\//, "")}
												</a>
											) : (
												<span className="font-mono text-xs text-text-muted">
													anonymized writeup
												</span>
											)}
											<div className="mt-1 font-mono text-[10px] uppercase tracking-wide text-text-muted">
												{row.evidenceType}
											</div>
										</td>
										<td className="px-5 py-4">{statusPill(row.status)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</Card>
			</div>

			<div className="mt-16 space-y-6">
				<div>
					<h2 className="text-2xl font-semibold tracking-tight">Code quality</h2>
					<p className="mt-2 max-w-2xl text-sm text-text-muted">
						Every plugin runs Sonar quality + security gates per release; the dashboard is public.
						Badges link straight to the live scan — no screenshots, no caching.
					</p>
				</div>

				<Card className="p-0">
					<ul className="divide-y divide-border/60">
						{sonarRepos.map((repo) => (
							<li
								key={repo.slug}
								className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
							>
								<div className="flex items-baseline gap-3">
									<a
										href={sonarDashboardUrl(repo.slug)}
										target="_blank"
										rel="noopener noreferrer"
										className="font-mono text-sm text-accent hover:underline"
									>
										{repo.label}
									</a>
									<span className="font-mono text-[10px] uppercase tracking-wide text-text-muted">
										{repo.language}
									</span>
								</div>
								<div className="flex flex-wrap items-center gap-2">
									{sonarMetrics.map((m) => (
										<a
											key={m.key}
											href={sonarDashboardUrl(repo.slug)}
											target="_blank"
											rel="noopener noreferrer"
											aria-label={`${repo.label} ${m.alt}`}
											className="inline-flex"
										>
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img
												src={sonarBadgeUrl(repo.slug, m.key)}
												alt={`${repo.label} — ${m.alt}`}
												loading="lazy"
												className="h-5"
											/>
										</a>
									))}
								</div>
							</li>
						))}
					</ul>
				</Card>
			</div>
		</section>
	);
}
