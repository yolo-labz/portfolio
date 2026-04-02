from __future__ import annotations

import asyncio
import logging
import time

from sqlalchemy import select

from app.config import settings
from app.database import async_session_factory
from app.models import Document
from app.pipeline.classifier import classify_document
from app.pipeline.extractor import extract_text
from app.pipeline.field_extractor import extract_fields

logger = logging.getLogger(__name__)


async def process_document(
    doc_id: str,
    file_path: str,
    mime_type: str,
    filename: str,
) -> None:
    """Background task: extract text, classify, extract fields, store results."""
    async with async_session_factory() as session:
        try:
            # Fetch the document row
            result = await session.execute(
                select(Document).where(Document.id == doc_id)
            )
            doc = result.scalar_one_or_none()
            if doc is None:
                logger.error("Document %s not found", doc_id)
                return

            # Mark as processing
            doc.status = "processing"
            await session.commit()

            start_time = time.monotonic()

            # Step 1: Extract text (sync, run in thread)
            raw_text, page_count, ocr_used = await asyncio.to_thread(
                extract_text, file_path, mime_type
            )

            if not raw_text.strip():
                doc.status = "failed"
                doc.error_message = "Could not extract text"
                doc.processing_time_ms = int(
                    (time.monotonic() - start_time) * 1000
                )
                await session.commit()
                return

            doc.raw_text = raw_text
            doc.page_count = page_count
            doc.ocr_used = ocr_used

            api_key = settings.ANTHROPIC_API_KEY

            if not api_key:
                # No API key -- save text extraction results and mark pending
                doc.status = "ai_pending"
                doc.processing_time_ms = int(
                    (time.monotonic() - start_time) * 1000
                )
                await session.commit()
                logger.info(
                    "Document %s text extracted, AI pending (no API key)",
                    doc_id,
                )
                return

            # Step 2: Classify
            doc_type, confidence = await classify_document(raw_text, api_key)
            doc.document_type = doc_type
            doc.confidence = confidence

            # Step 3: Extract fields
            fields = await extract_fields(raw_text, doc_type, api_key)
            doc.extracted_fields = fields

            # Finalize
            elapsed_ms = int((time.monotonic() - start_time) * 1000)
            doc.processing_time_ms = elapsed_ms
            doc.model_used = "claude-haiku-4-5-20251001 / claude-sonnet-4-6-20250514"
            doc.status = "completed"
            await session.commit()

            logger.info(
                "Document %s processed in %dms: type=%s confidence=%.1f",
                doc_id,
                elapsed_ms,
                doc_type,
                confidence,
            )

        except Exception as exc:
            logger.exception("Failed to process document %s", doc_id)
            try:
                doc.status = "failed"
                doc.error_message = str(exc)[:2000]
                await session.commit()
            except Exception:
                logger.exception(
                    "Failed to update error status for document %s", doc_id
                )
