// Compact LCP attribution for the P-LCP evidence dir: reads the LHRs lhci wrote
// into <dir> and emits one small JSON with the element, both phase breakdowns
// (simulated and observed) and the byte inventory per run.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

const [dir, outFile, variant] = process.argv.slice(2);
const runs = [];
for (const f of readdirSync(dir).filter((x) => x.endsWith(".json")).sort()) {
	const r = JSON.parse(readFileSync(`${dir}/${f}`, "utf8"));
	const a = r.audits;
	const metrics = a.metrics.details.items[0];
	const lcpItems = a["largest-contentful-paint-element"]?.details?.items ?? [];
	const node = lcpItems[0]?.items?.[0]?.node ?? null;
	const simPhases = lcpItems[1]?.items ?? [];
	const observedPhases = a["lcp-phases-insight"]?.details?.items?.[0]?.items ?? [];
	const byType = {};
	for (const item of a["network-requests"].details.items) {
		const t = item.resourceType ?? "other";
		byType[t] = byType[t] ?? { requests: 0, bytes: 0 };
		byType[t].requests += 1;
		byType[t].bytes += item.transferSize ?? 0;
	}
	runs.push({
		url: r.finalDisplayedUrl,
		lcp_ms: Math.round(a["largest-contentful-paint"].numericValue),
		fcp_ms: Math.round(a["first-contentful-paint"].numericValue),
		tbt_ms: Math.round(a["total-blocking-time"].numericValue),
		cls: a["cumulative-layout-shift"].numericValue,
		scores: Object.fromEntries(
			Object.entries(r.categories).map(([k, v]) => [k, Math.round((v.score ?? 0) * 100)]),
		),
		observed_ms: {
			fcp: Math.round(metrics.observedFirstContentfulPaint),
			lcp: Math.round(metrics.observedLargestContentfulPaint),
			dcl: Math.round(metrics.observedDomContentLoaded),
		},
		lcp_element: node
			? { selector: node.selector, snippet: node.snippet?.slice(0, 160), nodeLabel: node.nodeLabel }
			: null,
		lcp_phases_ms: Object.fromEntries(simPhases.map((p) => [p.phase, Math.round(p.timing)])),
		lcp_observed_phases_ms: Object.fromEntries(
			observedPhases.map((p) => [p.phase, Math.round(p.duration)]),
		),
		blocked: r.configSettings.blockedUrlPatterns ?? [],
		bytes_by_type: byType,
		total_bytes: Object.values(byType).reduce((s, v) => s + v.bytes, 0),
	});
}
mkdirSync("docs/evidence/remodel-2026-10/lcp", { recursive: true });
const first = runs[0] ?? {};
writeFileSync(
	`docs/evidence/remodel-2026-10/lcp/${outFile}`,
	`${JSON.stringify(
		{
			variant,
			captured_at: new Date().toISOString(),
			method:
				"@lhci/cli 0.15.1 collect; formFactor mobile; screenEmulation 390x844 DPR3; throttlingMethod simulate (1.638 Mbps, 150 ms RTT, 4x CPU); standalone Next build on localhost; pinned Playwright image",
			blocked_url_patterns: first.blocked ?? [],
			form_factor: first.form_factor,
			throttling: first.throttling,
			lighthouse: first.lighthouse,
			runs,
		},
		null,
		1,
	)}\n`,
);
console.log(variant, "runs:", runs.map((r) => r.lcp_ms).join("/"), "->", outFile);
