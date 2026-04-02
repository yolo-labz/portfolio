from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UploadResponse(BaseModel):
    id: str
    status: str
    filename: str


class DocumentResponse(BaseModel):
    id: str
    filename: str
    file_path: str
    file_size: int
    mime_type: str
    status: str
    error_message: str | None = None
    document_type: str | None = None
    confidence: float | None = None
    raw_text: str | None = None
    extracted_fields: dict = {}
    page_count: int | None = None
    ocr_used: bool = False
    processing_time_ms: int | None = None
    model_used: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class DocumentListResponse(BaseModel):
    items: list[DocumentResponse]
    total: int
    page: int
    page_size: int
