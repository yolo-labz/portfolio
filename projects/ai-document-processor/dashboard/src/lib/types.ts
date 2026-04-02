export interface Document {
	id: string;
	filename: string;
	file_size: number;
	mime_type: string;
	status: "uploaded" | "processing" | "completed" | "failed" | "ai_pending";
	error_message: string | null;
	document_type: string | null;
	confidence: number | null;
	raw_text: string | null;
	extracted_fields: Record<string, unknown>;
	page_count: number | null;
	ocr_used: boolean;
	processing_time_ms: number | null;
	model_used: string | null;
	created_at: string;
	updated_at: string;
}

export interface UploadResponse {
	id: string;
	status: string;
	filename: string;
}

export interface DocumentListResponse {
	items: Document[];
	total: number;
	page: number;
	page_size: number;
}
