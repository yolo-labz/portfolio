# Research: AI Document Processing Pipeline

**Branch**: `006-ai-document-processor`
**Date**: 2026-04-02

## R1: Text Extraction Strategy

**Decision**: PyMuPDF (fitz) for PDF text extraction. Fallback to OCR (pdf2image + Pillow + Tesseract) when extracted text < 50 chars. python-docx for DOCX files.

**Rationale**: PyMuPDF is the fastest Python PDF extractor (~2700 pages/160s). The OCR fallback handles scanned/image-based PDFs automatically. Tesseract is free, Docker-friendly, and accurate enough (95%+) on clean printed documents.

**Alternatives rejected**: pdfplumber (slower), Apache Tika (Java dependency), cloud OCR APIs (cost, dependency).

## R2: AI Classification Model

**Decision**: Claude Haiku 4.5 for document classification.

**Rationale**: $1/MTok input — cheapest Claude model. Classification is a simple task (6 categories). Haiku is fast (< 1s response) and accurate enough for document type detection.

## R3: AI Field Extraction Model

**Decision**: Claude Sonnet 4.6 for structured field extraction.

**Rationale**: Better accuracy than Haiku on complex extraction tasks (line items, nested structures). The `output_config.format` with `json_schema` type (GA, no beta headers) guarantees valid JSON output matching the schema.

## R4: Structured Output Method

**Decision**: Use `output_config.format` with `json_schema` type (GA in Claude API).

**Rationale**: Guarantees output conforms to the JSON schema — no parsing failures. Cleaner than tool_use pattern. Supported on both Haiku and Sonnet.

## R5: Backend Architecture

**Decision**: FastAPI with BackgroundTasks for async processing. Upload returns immediately with document ID, processing runs in background.

**Rationale**: Non-blocking uploads. Client polls for completion. Simple to implement without Celery/Redis.

## R6: Database Schema

**Decision**: PostgreSQL with JSONB for `extracted_fields`, generated TSVECTOR column for full-text search.

**Rationale**: JSONB handles different field schemas per document type (invoice fields ≠ contract fields) without separate tables. Generated TSVECTOR with GIN index enables instant text search.

## R7: Web UI

**Decision**: Next.js with simple upload form (react-dropzone), document list, and detail view. No PDF viewer (too complex for a portfolio demo — show extracted text instead).

**Rationale**: Matches the monorepo pattern. react-dropzone is lightweight. Showing extracted text + structured fields is more impressive than a generic PDF viewer.

## R8: Docker Setup

**Decision**: Single API container with Tesseract + Poppler built in. PostgreSQL as a separate container. Next.js dashboard as a third container.

**Rationale**: Installing Tesseract in the API container is simpler than a separate OCR service. The API Dockerfile adds `tesseract-ocr`, `poppler-utils`, and `libmagic1` via apt-get.

## R9: Sample Documents

**Decision**: Include 5 sample documents in `data/samples/`: 2 invoices (simple + complex), 1 receipt image, 1 contract DOCX, 1 scanned PDF. Generated using free tools (Canva, Invoice Ninja) or hand-crafted.

**Rationale**: The demo must work immediately after `docker compose up` + uploading samples. Real-looking samples make the demo credible.

## R10: Deployment

**Decision**: Deploy to Dokku at `ai-docs.home301server.com.br`. PostgreSQL via Dokku postgres plugin. Same combined Dockerfile pattern as realestate-tracker (FastAPI serves static dashboard + API from single port).

**Rationale**: Proven pattern from realestate-tracker. Single container simplifies Dokku deployment.
