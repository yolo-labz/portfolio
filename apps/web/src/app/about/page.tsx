import type { Metadata } from "next";
import { Card } from "@portfolio/ui";

export const metadata: Metadata = {
	title: "About — Pedro Balbino",
	description:
		"Senior SWE shipping AI-native automation: Claude Code plugins, Chrome/macOS workflow tooling, WhatsApp + LinkedIn copilots. Claims mapped to evidence.",
};

type ClaimStatus = "backed" | "unbacked-anonymized-pending";

interface ClaimEvidence {
	claim: string;
	evidenceType: string;
	url: string;
	status: ClaimStatus;
}

const lockedNarrative =
	"Senior SWE — AI-native automation specialist. Claude Code plugins, Chrome/macOS workflow tooling, WhatsApp/LinkedIn copilots.";

const aboutSummary =
	"Engineer shipping six public Claude Code plugins under yolo-labz (wa, claude-mac-chrome, linkedin-chrome-copilot, kokoro-speakd, claude-classroom-submit, fand). Recent work: AI-native automation for compliance-heavy domains — Python/Go backend, Azure OpenAI agents, multi-cloud Terraform. Maintains 4-host NixOS fleet (152 modules, 153 PRs) with SLSA L2 supply-chain hardening.";

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

export default function AboutPage() {
	return (
		<section className="mx-auto w-full max-w-5xl px-6 py-24">
			<header className="space-y-6">
				<p className="font-mono text-sm text-accent">About</p>
				<h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{lockedNarrative}</h1>
				<p className="max-w-3xl text-lg leading-relaxed text-text-muted">{aboutSummary}</p>
			</header>

			<div className="mt-16 space-y-6">
				<div className="flex items-end justify-between gap-4">
					<div>
						<h2 className="text-2xl font-semibold tracking-tight">Claim → Evidence</h2>
						<p className="mt-2 max-w-2xl text-sm text-text-muted">
							Every headline claim maps to a verifiable artifact: a public repo, or an anonymized
							writeup on the blog. Rows marked "writeup pending" publish on the dates encoded in the
							URL.
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
											<a
												href={row.url}
												target="_blank"
												rel="noopener noreferrer"
												className="break-all font-mono text-xs text-accent hover:underline"
											>
												{row.url.replace(/^https?:\/\//, "")}
											</a>
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
		</section>
	);
}
