from __future__ import annotations

import logging
import os
import uuid

import magic
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, UploadFile
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models import Document
from app.pipeline.processor import process_document
from app.schemas import DocumentListResponse, DocumentResponse, UploadResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/documents", tags=["documents"])

EXTENSION_MAP: dict[str, str] = {
    "application/pdf": ".pdf",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
}


@router.post("/upload", response_model=UploadResponse)
async def upload_document(
    file: UploadFile,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> UploadResponse:
    """Upload a document for processing."""
    # Read file content
    content = await file.read()
    file_size = len(content)

    # Validate file size
    if file_size > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=(
                f"File too large. Maximum size is "
                f"{settings.MAX_FILE_SIZE // (1024 * 1024)}MB"
            ),
        )

    if file_size == 0:
        raise HTTPException(status_code=400, detail="Empty file")

    # Detect MIME type from content
    mime_type = magic.from_buffer(content, mime=True)

    if mime_type not in settings.ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type: {mime_type}",
        )

    # Save file
    file_id = uuid.uuid4()
    ext = EXTENSION_MAP.get(mime_type, "")
    file_path = os.path.join(settings.UPLOAD_DIR, f"{file_id}{ext}")

    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    with open(file_path, "wb") as f:
        f.write(content)

    # Create database record
    doc = Document(
        id=file_id,
        filename=file.filename or "unknown",
        file_path=file_path,
        file_size=file_size,
        mime_type=mime_type,
        status="uploaded",
    )
    db.add(doc)
    await db.flush()

    # Queue background processing
    background_tasks.add_task(
        process_document,
        doc_id=str(file_id),
        file_path=file_path,
        mime_type=mime_type,
        filename=file.filename or "unknown",
    )

    logger.info("Document %s uploaded: %s (%s)", file_id, file.filename, mime_type)

    return UploadResponse(
        id=str(file_id),
        status="uploaded",
        filename=file.filename or "unknown",
    )


@router.get("", response_model=DocumentListResponse)
async def list_documents(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
) -> DocumentListResponse:
    """List documents with pagination and optional search."""
    query = select(Document)
    count_query = select(func.count()).select_from(Document)

    if search:
        search_filter = Document.raw_text.ilike(f"%{search}%")
        query = query.where(search_filter)
        count_query = count_query.where(search_filter)

    # Get total count
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Get paginated results
    offset = (page - 1) * page_size
    query = query.order_by(Document.created_at.desc()).offset(offset).limit(page_size)
    result = await db.execute(query)
    documents = result.scalars().all()

    return DocumentListResponse(
        items=[DocumentResponse.model_validate(doc) for doc in documents],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{doc_id}", response_model=DocumentResponse)
async def get_document(
    doc_id: str,
    db: AsyncSession = Depends(get_db),
) -> DocumentResponse:
    """Get a single document by ID."""
    result = await db.execute(
        select(Document).where(Document.id == doc_id)
    )
    doc = result.scalar_one_or_none()

    if doc is None:
        raise HTTPException(status_code=404, detail="Document not found")

    return DocumentResponse.model_validate(doc)
