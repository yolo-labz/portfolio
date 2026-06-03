import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { FigStamp } from "@/components/shared/fig-stamp";

export const metadata: Metadata = {
	title: "Regulated AI fails its first audit at the retrieval layer — Pedro Balbino",
	description:
		"A working argument for designing the audit trail before the prompt: prompt provenance, retrieval lineage, and output attestation are the primary architectural constraint for regulated AI — not the model.",
};

export default async function ThesisPage({ params }: { params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<article className="mx-auto w-full max-w-3xl px-6 pt-32 pb-24">
			<FigStamp n="00" label="position · regulated AI architecture" />
			<h1 className="mt-3 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
				Regulated AI fails its first audit at the retrieval layer — not the model.
			</h1>
			<p className="mt-5 text-lg leading-relaxed text-text-muted">
				A working argument for designing the audit trail before the prompt.
			</p>

			<div className="mt-12 space-y-6 text-base leading-relaxed text-text-muted [&_strong]:font-semibold [&_strong]:text-text">
				<p>
					Most regulated-AI projects budget their risk in the wrong place. The model gets the
					scrutiny — which vendor, which eval, which guardrail — while the part that actually fails
					the audit ships as an afterthought: how a given output can be reconstructed, six months
					later, from the inputs that produced it. In regulated workloads that reconstruction is not
					a nice-to-have. <strong>It is the deliverable.</strong>
				</p>
				<p>
					Audits fail at three seams, and they are always the same three.{" "}
					<strong>Prompt provenance:</strong> which exact prompt, template version, and system
					context produced this output? <strong>Retrieval lineage:</strong> which documents were
					retrieved, at which versions, and why those and not others?{" "}
					<strong>Output attestation:</strong> can you prove the answer was derived from the
					retrieved evidence rather than the model's parametric memory? A stack that can't answer
					all three under examination is not "mostly compliant". It is undocumented.
				</p>
				<p>
					A better model closes none of those seams. A larger context window makes provenance
					harder, not easier, because more of the input becomes implicit. An agent with more
					autonomy makes lineage harder, because the path from question to answer stops being
					inspectable. The capabilities the field optimizes for — bigger context, more autonomy,
					more fluency — trade directly against auditability. Which means audit-trail design can't
					be retrofitted onto a system optimized for the opposite. It has to be a constraint from
					the first diagram.
				</p>
				<p>
					The shape that survives an audit is a <strong>three-plane topology</strong>. A data plane
					carries the primary flow — ingest, retrieve, infer. A control plane holds orchestration,
					agent state, and configuration as first-class, versioned objects. A compliance plane runs
					alongside as a sidecar — not inline boxes bolted into the flow, but an append-only ledger
					that taps the other two planes and records signed, hash-chained events. The compliance
					plane is the only one whose output the auditor reads. Designing it last means designing
					the system to lie to itself about what happened.
				</p>
				<p>
					Concretely: a tax-compliance agent that prepares regulated filings runs as a typed-tool
					loop bounded at a fixed turn ceiling, not an open-ended chain — because an unbounded agent
					has no audit ceiling. Retrieval is scoped per filing period and the router rejects
					cross-period hits, because lineage that can pull from anywhere can't be reconstructed.
					Every emitted number is forced to cite and is re-validated against its source span before
					it lands, because output attestation is cheaper to enforce at write time than to prove
					after the fact. The result over eighteen months in production:{" "}
					<strong>zero hallucinated numerical fields</strong>. Not because the model is incapable of
					hallucinating — because the architecture never trusts it to.
				</p>
				<p>
					The discipline transfers. LGPD, BCB 4.893, and the EU AI Act Art. 12 logging mandate all
					ask the same question in different words: show me how this decision was made, and prove
					the record wasn't edited after. The systems that answer cleanly are the ones where someone
					drew the compliance plane before they wrote the first prompt.
				</p>
			</div>

			<div className="mt-12 border-t border-border/60 pt-6">
				<a
					href="https://blog.home301server.com.br"
					target="_blank"
					rel="noopener noreferrer"
					className="font-mono text-sm text-accent hover:underline"
				>
					Anonymized architecture writeups &rarr;
				</a>
			</div>
		</article>
	);
}
