"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchDocuments } from "@/lib/api";
import type { Document, UploadResponse } from "@/lib/types";
import { UploadZone } from "@/components/upload-zone";
import { DocumentList } from "@/components/document-list";

export default function Home() {
	const [documents, setDocuments] = useState<Document[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const pollRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

	const loadDocuments = useCallback(async (search?: string) => {
		try {
			const res = await fetchDocuments(1, search);
			setDocuments(res.items);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadDocuments();
	}, [loadDocuments]);

	// Poll when documents are in-progress
	useEffect(() => {
		const hasInProgress = documents.some(
			(d) => d.status === "processing" || d.status === "uploaded",
		);

		if (hasInProgress) {
			pollRef.current = setInterval(() => {
				loadDocuments(searchQuery || undefined);
			}, 3000);
		}

		return () => {
			if (pollRef.current) clearInterval(pollRef.current);
		};
	}, [documents, loadDocuments, searchQuery]);

	// Debounced search
	const handleSearch = useCallback(
		(query: string) => {
			setSearchQuery(query);

			if (debounceRef.current) clearTimeout(debounceRef.current);
			debounceRef.current = setTimeout(() => {
				loadDocuments(query || undefined);
			}, 400);
		},
		[loadDocuments],
	);

	const handleUploadComplete = useCallback(
		(_response: UploadResponse) => {
			loadDocuments(searchQuery || undefined);
		},
		[loadDocuments, searchQuery],
	);

	const handleRefresh = useCallback(() => {
		loadDocuments(searchQuery || undefined);
	}, [loadDocuments, searchQuery]);

	return (
		<div className="space-y-8">
			<UploadZone onUploadComplete={handleUploadComplete} />

			{loading ? (
				<div className="flex justify-center py-12">
					<svg
						className="h-8 w-8 animate-spin text-accent"
						viewBox="0 0 24 24"
						fill="none"
					>
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
			) : (
				<DocumentList
					documents={documents}
					onRefresh={handleRefresh}
					searchQuery={searchQuery}
					onSearch={handleSearch}
				/>
			)}
		</div>
	);
}
