import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactCTA } from "@/components/sections/contact-cta";
import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { SkillsMatrix } from "@/components/sections/skills-matrix";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ locale: string }>;
}): Promise<Metadata> {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("About");

	return {
		title: t("metaTitle"),
		description: t("metaDescription"),
	};
}

type ClaimStatus = "backed" | "unbacked-anonymized-pending";

// Structural rows: url + evidenceType + status stay in the page. The human-readable
// `claim` label is localized — pulled from the "About.claims" message array, indexed
// parallel to this map (keep the two in the same order).
interface ClaimEvidence {
	evidenceType: string;
	url: string;
	status: ClaimStatus;
}

const claimEvidenceMap: ClaimEvidence[] = [
	{
		evidenceType: "public-repo",
		url: "https://github.com/yolo-labz/claude-classroom-submit",
		status: "backed",
	},
	{
		evidenceType: "public-repo",
		url: "https://github.com/yolo-labz/claude-mac-chrome",
		status: "backed",
	},
	{
		evidenceType: "public-repo",
		url: "https://github.com/yolo-labz/linkedin-chrome-copilot",
		status: "backed",
	},
	{
		evidenceType: "public-repo",
		url: "https://github.com/yolo-labz/wa",
		status: "backed",
	},
	{
		evidenceType: "public-repo",
		url: "https://github.com/yolo-labz/kokoro-speakd",
		status: "backed",
	},
	{
		evidenceType: "public-repo",
		url: "https://github.com/yolo-labz/fand",
		status: "backed",
	},
	{
		evidenceType: "anonymized-writeup",
		url: "https://blog.home301server.com.br/tags/nixos/",
		status: "unbacked-anonymized-pending",
	},
	{
		evidenceType: "anonymized-writeup",
		url: "https://blog.home301server.com.br/posts/2026-04-26-compliance-grade-rag-tier1-banking",
		status: "unbacked-anonymized-pending",
	},
	{
		evidenceType: "anonymized-writeup",
		url: "https://blog.home301server.com.br/posts/2026-05-17-event-driven-retail-bff-broker",
		status: "unbacked-anonymized-pending",
	},
	{
		evidenceType: "anonymized-writeup",
		url: "https://blog.home301server.com.br/posts/2026-05-31-aws-bedrock-lambda-legal-rag",
		status: "unbacked-anonymized-pending",
	},
	{
		evidenceType: "anonymized-writeup",
		url: "https://blog.home301server.com.br/posts/2026-06-14-multilingual-edu-chatbot",
		status: "unbacked-anonymized-pending",
	},
	{
		evidenceType: "anonymized-writeup",
		url: "https://blog.home301server.com.br/posts/2026-06-21-ai-irpf-tax-compliance-llm-agent",
		status: "unbacked-anonymized-pending",
	},
];

function statusPill(status: ClaimStatus, labels: { backed: string; pending: string }) {
	if (status === "backed") {
		return (
			<span className="inline-flex items-center text-xs font-medium text-accent">
				{labels.backed}
			</span>
		);
	}
	return (
		<span className="inline-flex items-center text-xs font-medium text-warn">{labels.pending}</span>
	);
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	setRequestLocale(locale);
	const t = await getTranslations("About");

	// Localized claim labels, indexed parallel to `claimEvidenceMap`.
	const claims = t.raw("claims") as string[];
	const statusLabels = { backed: t("statusBacked"), pending: t("statusPending") };

	return (
		<>
			<section className="mx-auto w-full max-w-6xl px-6 pt-24 pb-20 sm:pt-28">
				<header className="grid gap-8 lg:grid-cols-12 lg:gap-12">
					<h1 className="text-step-5 leading-[1.1] font-semibold tracking-[-0.025em] text-balance lg:col-span-7">
						{t("category")}
					</h1>
					<div className="space-y-5 lg:col-span-5 lg:pt-2">
						<p className="max-w-[50ch] text-step-1 leading-relaxed text-text">{t("diagnostic")}</p>
						<p className="max-w-[50ch] text-base leading-relaxed text-text-muted">{t("summary")}</p>
					</div>
				</header>

				<div className="mt-16 space-y-6">
					<div className="flex items-end justify-between gap-4">
						<div>
							<h2 className="text-step-3 font-semibold tracking-[-0.02em]">
								{t("claimEvidenceHeading")}
							</h2>
							<p className="mt-2 max-w-[50ch] text-sm text-text-muted">{t("claimEvidenceIntro")}</p>
						</div>
					</div>

					<div className="border-y border-border">
						<div className="overflow-x-auto">
							<table className="w-full border-collapse text-left text-sm">
								<thead className="border-b border-border text-xs text-text-muted">
									<tr>
										<th scope="col" className="py-3 pr-5">
											{t("tableHeaderClaim")}
										</th>
										<th scope="col" className="py-3 pr-5">
											{t("tableHeaderEvidence")}
										</th>
										<th scope="col" className="py-3 pr-5">
											{t("tableHeaderStatus")}
										</th>
									</tr>
								</thead>
								<tbody>
									{claimEvidenceMap.map((row, i) => (
										<tr
											key={row.url + claims[i]}
											className="border-b border-border align-top last:border-b-0"
										>
											<td className="py-4 pr-5 text-text">{claims[i]}</td>
											<td className="py-4 pr-5">
												{row.status === "backed" ? (
													<a
														href={row.url}
														target="_blank"
														rel="noopener noreferrer"
														className="break-all font-mono text-xs text-link underline underline-offset-4"
													>
														{row.url.replace(/^https?:\/\//, "")}
													</a>
												) : (
													<span className="font-mono text-xs text-text-muted">
														{t("evidenceAnonymized")}
													</span>
												)}
												<div className="mt-1 font-mono text-xs uppercase tracking-wide text-text-muted">
													{row.evidenceType}
												</div>
											</td>
											<td className="py-4 pr-5">{statusPill(row.status, statusLabels)}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>

				<ExperienceTimeline />
				<SkillsMatrix />
			</section>
			<ContactCTA />
		</>
	);
}
