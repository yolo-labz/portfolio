import type { Document, DocumentListResponse, UploadResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function uploadDocument(file: File): Promise<UploadResponse> {
	try {
		const formData = new FormData();
		formData.append("file", file);

		const response = await fetch(`${API_URL}/api/documents/upload`, {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			const error = await response.json().catch(() => ({}));
			throw new Error(error.detail || `Upload failed: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		if (error instanceof Error) throw error;
		throw new Error("Upload failed: unknown error");
	}
}

export async function fetchDocuments(
	page: number = 1,
	search?: string,
): Promise<DocumentListResponse> {
	try {
		const params = new URLSearchParams({ page: String(page), page_size: "20" });
		if (search) params.set("search", search);

		const response = await fetch(`${API_URL}/api/documents?${params}`);

		if (!response.ok) {
			throw new Error(`Fetch failed: ${response.statusText}`);
		}

		return await response.json();
	} catch {
		return { items: [], total: 0, page: 1, page_size: 20 };
	}
}

export async function fetchDocument(id: string): Promise<Document> {
	try {
		const response = await fetch(`${API_URL}/api/documents/${id}`);

		if (!response.ok) {
			throw new Error(`Fetch failed: ${response.statusText}`);
		}

		return await response.json();
	} catch (error) {
		if (error instanceof Error) throw error;
		throw new Error("Failed to fetch document");
	}
}
