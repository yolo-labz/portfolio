"use client";

import Link from "next/link";
import type { Document } from "@/lib/types";

interface DocumentListProps {
	documents: Document[];
	onRefresh: () => void;
	searchQuery: string;
	onSearch: (query: string) => void;
}

function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function timeAgo(dateStr: string): string {
	const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
	if (seconds < 60) return "just now";
	if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
	if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
	return `${Math.floor(seconds / 86400)}d ago`;
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

export function DocumentList({ documents, onRefresh, searchQuery, onSearch }: DocumentListProps) {
	return (
		<div className="space-y-4">
			<div className="flex items-center gap-3">
				<input
					type="text"
					placeholder="Search documents..."
					value={searchQuery}
					onChange={(e) => onSearch(e.target.value)}
					className="flex-1 rounded-md border border-border bg-bg-card px-4 py-2 text-sm text-text placeholder-text-muted outline-none transition-colors focus:border-accent"
				/>
				<button
					type="button"
					onClick={onRefresh}
					className="rounded-md border border-border bg-bg-card px-4 py-2 text-sm text-text-muted transition-colors hover:border-accent hover:text-text"
				>
					Refresh
				</button>
			</div>

			{documents.length === 0 ? (
				<div className="rounded-lg border border-border bg-bg-card p-12 text-center">
					<p className="text-text-muted">No documents yet. Upload one to get started.</p>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{documents.map((doc) => (
						<Link
							key={doc.id}
							href={`/documents/${doc.id}`}
							className="group rounded-lg border border-border bg-bg-card p-4 transition-colors hover:border-accent/50"
						>
							<div className="mb-3 flex items-start justify-between gap-2">
								<p className="truncate text-sm font-medium text-text group-hover:text-accent">
									{doc.filename}
								</p>
							</div>

							<div className="mb-3 flex flex-wrap gap-2">
								{doc.document_type && (
									<span
										className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${typeBadgeClass(doc.document_type)}`}
									>
										{doc.document_type}
									</span>
								)}
								<span
									className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(doc.status)}`}
								>
									{doc.status.replace("_", " ")}
								</span>
							</div>

							<div className="flex items-center justify-between text-xs text-text-muted">
								<span>{formatFileSize(doc.file_size)}</span>
								<div className="flex items-center gap-2">
									{doc.confidence !== null && (
										<span className="text-status-completed">
											{Math.round(doc.confidence * 100)}%
										</span>
									)}
									<span>{timeAgo(doc.created_at)}</span>
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
