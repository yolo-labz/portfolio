# Implementation Plan: AI Document Processing Pipeline

**Branch**: `006-ai-document-processor` | **Date**: 2026-04-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-ai-document-processor/spec.md`

## Summary

Build a full-stack AI document processing pipeline: FastAPI backend that accepts PDF/image/DOCX uploads, extracts text (PyMuPDF + Tesseract OCR fallback), classifies documents via Claude Haiku, extracts structured fields via Claude Sonnet, stores everything in PostgreSQL (JSONB + full-text search), and serves results through a Next.js dashboard. Docker Compose for the stack. Located at `projects/ai-document-processor/`.

## Technical Context

**Language/Version**: Python 3.12 (API + pipeline), TypeScript (dashboard)
**Primary Dependencies**: FastAPI, anthropic SDK, PyMuPDF, pytesseract, pdf2image, python-docx, SQLAlchemy async (API); Next.js, Tailwind CSS v4 (dashboard)
**Storage**: PostgreSQL 16 with JSONB + TSVECTOR full-text search (Docker Compose)
**Testing**: Manual verification with sample documents
**Target Platform**: Dokku at `ai-docs.home301server.com.br`
**Project Type**: AI-powered full-stack web application
**Performance Goals**: < 10s end-to-end for single-page PDF, > 90% classification accuracy
**Constraints**: Requires ANTHROPIC_API_KEY, Tesseract in Docker, max 20MB uploads
**Scale/Scope**: 5 sample documents, 6 document types, 4 per-type field schemas

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Sell, Don't Tell | ✅ PASS | Before/after transformation is the demo: raw PDF → structured JSON. Classification confidence + field extraction visible. |
| II. Static-First | ⚠️ N/A | API-driven (like realestate-tracker). Demonstrates AI integration, not static content. |
| III. Monorepo Discipline | ✅ PASS | Self-contained at `projects/ai-document-processor/`. Own Docker Compose, own Python env, own dashboard. |
| IV. Visual Polish | ✅ PASS | Dark theme, upload drag-drop, type badges with confidence scores, clean field tables. |
| V. No AI Slop | ✅ PASS | The AI IS the feature here — Claude API for real document processing. README describes concrete capabilities. |
| VI. Mixed-Stack Autonomy | ✅ PASS | Python API + JS dashboard + PostgreSQL + Claude API. Own Dockerfiles. |

**Gate result**: PASS

## Project Structure

```text
projects/ai-document-processor/
├── api/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                    # FastAPI app
│   │   ├── config.py                  # Settings
│   │   ├── database.py                # Async engine
│   │   ├── models.py                  # SQLAlchemy Document
│   │   ├── schemas.py                 # Pydantic schemas
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   └── documents.py           # Upload, list, get, search
│   │   └── pipeline/
│   │       ├── __init__.py
│   │       ├── extractor.py           # Text extraction (PyMuPDF, OCR, DOCX)
│   │       ├── classifier.py          # Claude classification
│   │       ├── field_extractor.py     # Claude field extraction
│   │       └── processor.py           # Pipeline orchestrator
│   ├── Dockerfile                     # Python 3.12 + Tesseract + Poppler
│   └── pyproject.toml
├── dashboard/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx               # Upload zone + document list
│   │   │   ├── documents/[id]/page.tsx # Document detail
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── upload-zone.tsx
│   │   │   ├── document-list.tsx
│   │   │   ├── document-detail.tsx
│   │   │   └── field-table.tsx
│   │   └── lib/
│   │       ├── api.ts
│   │       └── types.ts
│   └── package.json
├── data/
│   └── samples/                       # 5 demo documents
├── docker-compose.yml
├── .env.example
├── Dockerfile.dokku
├── app.json
├── package.json                       # Turbo wrapper
└── README.md
```

## Implementation Order

### Step 1: API Foundation

1. Create pyproject.toml: fastapi, uvicorn, anthropic, pymupdf, pytesseract, pdf2image, Pillow, python-docx, python-magic, sqlalchemy[asyncio], asyncpg, pydantic, pydantic-settings
2. Create config.py: ANTHROPIC_API_KEY, DATABASE_URL, UPLOAD_DIR, MAX_FILE_SIZE
3. Create database.py: async engine, session, Base
4. Create models.py: SQLAlchemy Document with all columns, TSVECTOR, indexes
5. Create schemas.py: DocumentResponse, DocumentListResponse, UploadResponse
6. Create main.py: FastAPI app, CORS, routers, health check, static mount, lifespan table creation

### Step 2: Processing Pipeline

1. Create pipeline/extractor.py: extract_text(file_path, mime_type) → (text, page_count, ocr_used). PDF: PyMuPDF first, OCR fallback if < 50 chars. Image: Tesseract. DOCX: python-docx.
2. Create pipeline/classifier.py: classify_document(text) → (doc_type, confidence). Claude Haiku with json_schema output_config.
3. Create pipeline/field_extractor.py: extract_fields(text, doc_type) → dict. Per-type extraction prompts with json_schema. Claude Sonnet.
4. Create pipeline/processor.py: process_document(doc_id, file_path, mime_type, filename). Orchestrates: extract → classify → extract fields → update DB.

### Step 3: API Endpoints

1. Create routers/documents.py: POST /api/documents/upload (validate, save file, queue background task), GET /api/documents (list, paginated, searchable via TSVECTOR), GET /api/documents/{id} (full detail), GET /api/documents/search?q= (full-text search)

### Step 4: Docker Compose + API Dockerfile

1. Create api/Dockerfile: Python 3.12-slim + tesseract-ocr + poppler-utils + libmagic1
2. Create docker-compose.yml: db (postgres:16-alpine), api (depends_on db), dashboard (depends_on api)
3. Create .env.example

### Step 5: Sample Documents

1. Create/collect 5 sample documents in data/samples/:
   - invoice-simple.pdf (single page, clear layout)
   - invoice-complex.pdf (multiple line items, tax)
   - receipt.jpg (retail receipt photo)
   - contract.docx (consulting agreement)
   - scanned-invoice.pdf (image-based PDF for OCR demo)

### Step 6: Dashboard

1. Create dashboard/package.json, tsconfig, next.config, postcss
2. Create types.ts + api.ts
3. Create globals.css (dark theme)
4. Create layout.tsx
5. Create upload-zone.tsx (drag-drop with react-dropzone pattern)
6. Create document-list.tsx (cards with type badges, key fields, search)
7. Create field-table.tsx (renders extracted fields per type)
8. Create document-detail.tsx (full results: text + fields + metadata)
9. Create page.tsx (upload + list) and documents/[id]/page.tsx (detail)

### Step 7: Deployment

1. Create Dockerfile.dokku (combined FastAPI + static dashboard)
2. Create app.json (health checks)
3. Provision Dokku: create app, PostgreSQL, domain, SSL
4. Deploy and verify with sample documents

### Step 8: README + Verification

1. Create README.md: architecture diagram (Upload → Extract → Classify → Extract Fields → Store), tech stack, Docker Compose setup, API docs, sample demo screenshots
2. Update portfolio projects.ts with live demo URL
3. Verify all 4 user stories + 6 success criteria
4. Commit, push, PR, merge, clean up

## Complexity Tracking

| Note | Justification |
|------|--------------|
| Claude API dependency | Required for the AI feature — the whole point of this project. Haiku for classification ($0.001/doc), Sonnet for extraction ($0.005/doc). |
| Tesseract in Docker | Adds ~100MB to image but enables OCR for scanned documents. Essential demo capability. |
| Background processing | Non-blocking uploads are the professional pattern. Simple BackgroundTasks, no Celery. |
