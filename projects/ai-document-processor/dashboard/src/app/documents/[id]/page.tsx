"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { DocumentDetail } from "@/components/document-detail";
import { fetchDocument } from "@/lib/api";
import type { Document } from "@/lib/types";

export default function DocumentPage() {
	const params = useParams<{ id: string }>();
	const [document, setDocument] = useState<Document | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const pollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

	const loadDocument = useCallback(async () => {
		try {
			const doc = await fetchDocument(params.id);
			setDocument(doc);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load document");
		} finally {
			setLoading(false);
		}
	}, [params.id]);

	useEffect(() => {
		loadDocument();
	}, [loadDocument]);

	// Poll while processing
	useEffect(() => {
		const shouldPoll = document?.status === "processing" || document?.status === "uploaded";

		if (shouldPoll) {
			pollRef.current = setInterval(loadDocument, 2000);
		}

		return () => {
			if (pollRef.current) clearInterval(pollRef.current);
		};
	}, [document?.status, loadDocument]);

	return (
		<div className="space-y-6">
			<Link
				href="/"
				className="inline-flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-accent"
			>
				<svg
					className="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth={2}
					stroke="currentColor"
				>
					<title>icon</title>
					<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
				</svg>
				Back to documents
			</Link>

			{loading ? (
				<div className="flex justify-center py-12">
					<svg className="h-8 w-8 animate-spin text-accent" viewBox="0 0 24 24" fill="none">
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
				</div>
			) : error ? (
				<div className="rounded-lg border border-status-failed/30 bg-status-failed/10 p-6">
					<p className="text-sm text-status-failed">{error}</p>
				</div>
			) : document ? (
				<>
					<h1 className="truncate font-mono text-xl font-semibold text-text">
						{document.filename}
					</h1>
					<DocumentDetail document={document} />
				</>
			) : null}
		</div>
	);
}
