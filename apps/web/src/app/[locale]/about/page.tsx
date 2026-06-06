import { Card } from "@portfolio/ui";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

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

function statusPill(status: ClaimStatus, labels: { backed: string; pending: string }) {
	if (status === "backed") {
		return (
			<span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-xs text-emerald-300">
				{labels.backed}
			</span>
		);
	}
	return (
		<span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-xs text-amber-300">
			{labels.pending}
		</span>
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
		<section className="mx-auto w-full max-w-5xl px-6 py-24">
			<header className="space-y-6">
				<p className="font-mono text-sm text-accent">{t("eyebrow")}</p>
				<h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">{t("category")}</h1>
				<p className="max-w-3xl text-lg leading-relaxed text-text">{t("diagnostic")}</p>
				<p className="max-w-3xl text-base leading-relaxed text-text-muted">{t("summary")}</p>
			</header>

			<div className="mt-16 space-y-6">
				<div className="flex items-end justify-between gap-4">
					<div>
						<h2 className="text-2xl font-semibold tracking-tight">{t("claimEvidenceHeading")}</h2>
						<p className="mt-2 max-w-2xl text-sm text-text-muted">{t("claimEvidenceIntro")}</p>
					</div>
				</div>

				<Card className="overflow-hidden p-0">
					<div className="overflow-x-auto">
						<table className="w-full border-collapse text-left text-sm">
							<thead className="border-b border-border bg-surface/40 font-mono text-xs uppercase tracking-wide text-text-muted">
								<tr>
									<th scope="col" className="px-5 py-3">
										{t("tableHeaderClaim")}
									</th>
									<th scope="col" className="px-5 py-3">
										{t("tableHeaderEvidence")}
									</th>
									<th scope="col" className="px-5 py-3">
										{t("tableHeaderStatus")}
									</th>
								</tr>
							</thead>
							<tbody>
								{claimEvidenceMap.map((row, i) => (
									<tr
										key={row.url + claims[i]}
										className="border-b border-border/50 align-top last:border-b-0"
									>
										<td className="px-5 py-4 text-text">{claims[i]}</td>
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
													{t("evidenceAnonymized")}
												</span>
											)}
											<div className="mt-1 font-mono text-[10px] uppercase tracking-wide text-text-muted">
												{row.evidenceType}
											</div>
										</td>
										<td className="px-5 py-4">{statusPill(row.status, statusLabels)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</Card>
			</div>

			<div className="mt-16 space-y-6">
				<div>
					<h2 className="text-2xl font-semibold tracking-tight">{t("codeQualityHeading")}</h2>
					<p className="mt-2 max-w-2xl text-sm text-text-muted">{t("codeQualityIntro")}</p>
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
