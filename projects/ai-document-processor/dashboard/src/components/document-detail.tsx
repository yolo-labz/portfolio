"use client";

import { useState } from "react";
import type { Document } from "@/lib/types";
import { FieldTable } from "./field-table";

interface DocumentDetailProps {
	document: Document;
}

function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function statusBadgeClass(status: Document["status"]): string {
	switch (status) {
		case "processing":
		case "uploaded":
			return "bg-status-processing/20 text-status-processing animate-pulse-subtle";
		case "completed":
			return "bg-status-completed/20 text-status-completed";
		case "failed":
			return "bg-status-failed/20 text-status-failed";
		case "ai_pending":
			return "bg-status-pending/20 text-status-pending";
		default:
			return "bg-status-pending/20 text-status-pending";
	}
}

function typeBadgeClass(docType: string | null): string {
	switch (docType?.toLowerCase()) {
		case "invoice":
			return "bg-type-invoice/20 text-type-invoice";
		case "contract":
			return "bg-type-contract/20 text-type-contract";
		case "receipt":
			return "bg-type-receipt/20 text-type-receipt";
		case "letter":
			return "bg-type-letter/20 text-type-letter";
		case "report":
			return "bg-type-report/20 text-type-report";
		default:
			return "bg-type-letter/20 text-type-letter";
	}
}

export function DocumentDetail({ document: doc }: DocumentDetailProps) {
	const [showFullText, setShowFullText] = useState(false);

	if (doc.status === "processing" || doc.status === "uploaded") {
		return (
			<div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-border bg-bg-card p-12">
				<svg className="h-10 w-10 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
					<title>icon</title>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					/>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
					/>
				</svg>
				<p className="text-text-muted">Processing document...</p>
			</div>
		);
	}

	if (doc.status === "failed") {
		return (
			<div className="rounded-lg border border-status-failed/30 bg-status-failed/10 p-6">
				<h3 className="mb-2 font-medium text-status-failed">Processing Failed</h3>
				<p className="text-sm text-text-muted">
					{doc.error_message || "An unknown error occurred during processing."}
				</p>
			</div>
		);
	}

	if (doc.status === "ai_pending") {
		return (
			<div className="rounded-lg border border-status-pending/30 bg-status-pending/10 p-6">
				<h3 className="mb-2 font-medium text-status-pending">AI Processing Pending</h3>
				<p className="text-sm text-text-muted">
					API key not configured. Set ANTHROPIC_API_KEY to enable AI classification.
				</p>
			</div>
		);
	}

	const rawTextPreview =
		doc.raw_text && doc.raw_text.length > 500 && !showFullText
			? `${doc.raw_text.slice(0, 500)}...`
			: doc.raw_text;

	return (
		<div className="space-y-6">
			{/* Status Header */}
			<div className="flex flex-wrap items-center gap-3">
				<span
					className={`rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClass(doc.status)}`}
				>
					{doc.status.replace("_", " ")}
				</span>
				{doc.document_type && (
					<span
						className={`rounded-full px-3 py-1 text-xs font-medium ${typeBadgeClass(doc.document_type)}`}
					>
						{doc.document_type}
					</span>
				)}
				{doc.confidence !== null && (
					<span className="text-sm text-text-muted">
						Confidence:{" "}
						<span className="font-mono text-status-completed">
							{Math.round(doc.confidence * 100)}%
						</span>
					</span>
				)}
				{doc.processing_time_ms !== null && (
					<span className="text-sm text-text-muted">
						Processed in{" "}
						<span className="font-mono">{(doc.processing_time_ms / 1000).toFixed(2)}s</span>
					</span>
				)}
			</div>

			{/* Extracted Fields */}
			{doc.extracted_fields && Object.keys(doc.extracted_fields).length > 0 && (
				<section>
					<h2 className="mb-3 text-lg font-medium text-text">Extracted Fields</h2>
					<FieldTable fields={doc.extracted_fields} documentType={doc.document_type || ""} />
				</section>
			)}

			{/* Raw Text */}
			{doc.raw_text && (
				<section>
					<h2 className="mb-3 text-lg font-medium text-text">Raw Text</h2>
					<div className="rounded-lg border border-border bg-bg-card p-4">
						<pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-text-muted">
							{rawTextPreview}
						</pre>
						{doc.raw_text.length > 500 && (
							<button
								type="button"
								onClick={() => setShowFullText(!showFullText)}
								className="mt-3 text-xs font-medium text-accent hover:underline"
							>
								{showFullText ? "Show less" : "Show more"}
							</button>
						)}
					</div>
				</section>
			)}

			{/* Metadata */}
			<section>
				<h2 className="mb-3 text-lg font-medium text-text">Metadata</h2>
				<div className="overflow-hidden rounded-lg border border-border bg-bg-card">
					<table className="w-full text-left text-sm">
						<tbody>
							{[
								["Filename", doc.filename],
								["File Size", formatFileSize(doc.file_size)],
								["Page Count", doc.page_count !== null ? String(doc.page_count) : "\u2014"],
								["OCR Used", doc.ocr_used ? "Yes" : "No"],
								["Model Used", doc.model_used || "\u2014"],
								[
									"Created",
									new Date(doc.created_at).toLocaleString("en-US", {
										dateStyle: "medium",
										timeStyle: "short",
									}),
								],
							].map(([label, value]) => (
								<tr key={label} className="border-b border-border/50 last:border-0">
									<td className="w-1/3 px-4 py-2.5 text-text-muted">{label}</td>
									<td className="px-4 py-2.5 font-mono text-text">{value}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}
