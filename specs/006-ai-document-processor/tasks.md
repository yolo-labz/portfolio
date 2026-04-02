# Tasks: AI Document Processing Pipeline

**Input**: Design documents from `/specs/006-ai-document-processor/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested.

**Organization**: Tasks grouped by user story. File paths relative to `projects/ai-document-processor/`.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup

**Purpose**: Project skeleton, dependencies, directories

- [ ] T001 Create `projects/ai-document-processor/api/pyproject.toml` — dependencies: fastapi, uvicorn[standard], anthropic, pymupdf, pytesseract, pdf2image, Pillow, python-docx, python-magic, python-multipart, sqlalchemy[asyncio], asyncpg, pydantic, pydantic-settings
- [ ] T002 [P] Create `projects/ai-document-processor/api/app/__init__.py` and `api/app/routers/__init__.py` and `api/app/pipeline/__init__.py` (all empty)
- [ ] T003 [P] Create `projects/ai-document-processor/.env.example` — ANTHROPIC_API_KEY=sk-ant-..., POSTGRES_USER=docproc, POSTGRES_PASSWORD=docproc, POSTGRES_DB=docproc, NEXT_PUBLIC_API_URL=http://localhost:8000
- [ ] T004 [P] Create `projects/ai-document-processor/data/samples/` directory with `.gitkeep`
- [ ] T005 Initialize `projects/ai-document-processor/dashboard/` — package.json (next, react, react-dom, tailwindcss, @tailwindcss/postcss, typescript), tsconfig.json, next.config.ts (output: standalone), postcss.config.mjs
- [ ] T006 Update `projects/ai-document-processor/package.json` — Turbo wrapper: `"dev": "docker compose up"`, `"build": "echo 'Build via Docker'"`, `"seed": "echo 'Upload sample docs via UI'"`

**Checkpoint**: Skeleton ready.

---

## Phase 2: Foundational (API Core + Pipeline)

**Purpose**: Database, models, text extraction, AI integration — blocks all user stories

- [ ] T007 Create `api/app/config.py` — Pydantic Settings: ANTHROPIC_API_KEY (optional — system works without it, skips AI), DATABASE_URL (from POSTGRES_* vars), UPLOAD_DIR (default /app/uploads), MAX_FILE_SIZE (20MB), ALLOWED_MIME_TYPES list
- [ ] T008 [P] Create `api/app/database.py` — async engine, session factory, get_db dependency, Base
- [ ] T009 [P] Create `api/app/models.py` — SQLAlchemy `Document` model: id (UUID), filename, file_path, file_size, mime_type, status (uploaded/processing/completed/failed/ai_pending), error_message, document_type (invoice/contract/receipt/letter/report/unknown), confidence (float), raw_text, extracted_fields (JSONB default {}), page_count, ocr_used (bool), processing_time_ms, model_used, created_at, updated_at. Generated TSVECTOR column `text_search` from raw_text. Indexes: status, document_type, created_at DESC, GIN on text_search, GIN on extracted_fields.
- [ ] T010 [P] Create `api/app/schemas.py` — Pydantic: `UploadResponse` (id, status, filename), `DocumentResponse` (all fields, model_config from_attributes), `DocumentListResponse` (items list, total, page, page_size), `DocumentSearchResult` (id, filename, document_type, confidence, snippet, created_at)
- [ ] T011 Create `api/app/pipeline/extractor.py` — `async def extract_text(file_path: str, mime_type: str) -> tuple[str, int, bool]` returning (text, page_count, ocr_used). Logic: PDF → PyMuPDF text, if < 50 chars → pdf2image pages → Pillow grayscale+threshold → pytesseract. Image → Pillow preprocess → pytesseract. DOCX → python-docx paragraphs joined. Handles errors gracefully (returns empty text on failure).
- [ ] T012 [P] Create `api/app/pipeline/classifier.py` — `async def classify_document(text: str) -> tuple[str, float]` returning (doc_type, confidence). Uses anthropic client with Haiku model, `output_config.format` json_schema forcing response to `{document_type: enum, confidence: number, reasoning: string}`. If ANTHROPIC_API_KEY not set, returns ("unknown", 0.0). Retry 2x with 5s backoff on API errors. Truncate text to 4000 chars for classification.
- [ ] T013 [P] Create `api/app/pipeline/field_extractor.py` — `async def extract_fields(text: str, doc_type: str) -> dict`. Per-type JSON schemas: invoice (vendor_name, invoice_number, invoice_date, due_date, subtotal, tax, total_amount, currency, line_items), contract (parties, effective_date, expiration_date, term, governing_law), receipt (store, total, currency, date, payment_method, items), letter/report (sender, recipient, date, subject, summary). Uses Sonnet with `output_config.format` json_schema. If ANTHROPIC_API_KEY not set, returns {}. Retry 2x. Truncate text to 8000 chars.
- [ ] T014 Create `api/app/pipeline/processor.py` — `async def process_document(doc_id: str, file_path: str, mime_type: str, db_session)`. Orchestrates: (1) update status→processing, (2) extract_text, (3) classify_document, (4) extract_fields based on doc_type, (5) update DB with all results + processing_time_ms, (6) set status→completed. On error: set status→failed with error_message. If no API key: set status→ai_pending after text extraction.
- [ ] T015 Create `api/app/main.py` — FastAPI app, CORS middleware, include documents router at /api, health check at /health and /api/health, lifespan for table creation, static files mount for dashboard (if /app/static exists), UPLOAD_DIR mkdir on startup

**Checkpoint**: API starts, health check works, pipeline components ready.

---

## Phase 3: User Story 1 — Before/After Demo (Priority: P1) 🎯 MVP

**Goal**: Upload a document, get classification + extracted fields displayed

**Independent Test**: Upload sample invoice → see "Invoice" classification with fields in JSON

### Implementation

- [ ] T016 [US1] Create `api/app/routers/documents.py` — endpoints:
  - `POST /api/documents/upload` — validate mime_type and file_size, save to UPLOAD_DIR, create Document row (status=uploaded), queue BackgroundTasks(process_document), return UploadResponse (id, status, filename)
  - `GET /api/documents/{id}` — fetch by UUID, return DocumentResponse (all fields including extracted_fields)
  - `GET /api/documents` — paginated list, params: page (default 1), page_size (default 20), search (optional full-text query using text_search TSVECTOR). Return DocumentListResponse.

**Checkpoint**: API accepts uploads, processes async, returns results.

---

## Phase 4: User Story 2 — Browse Processed Documents (Priority: P1)

**Goal**: Dashboard showing upload zone + document list + document detail

### Implementation

- [ ] T017 [US2] Create `dashboard/src/lib/types.ts` — TypeScript interfaces: Document (matching DocumentResponse), UploadResponse, DocumentListResponse
- [ ] T018 [P] [US2] Create `dashboard/src/lib/api.ts` — functions: uploadDocument(file: File), fetchDocuments(page, search?), fetchDocument(id). Use NEXT_PUBLIC_API_URL env var. Handle errors gracefully.
- [ ] T019 [P] [US2] Create `dashboard/src/app/globals.css` — dark oklch theme matching portfolio palette
- [ ] T020 [P] [US2] Create `dashboard/src/app/layout.tsx` — Inter + JetBrains Mono fonts, metadata "AI Document Processor", dark theme, header "Document Processor" + subtitle "Upload, classify, and extract structured data"
- [ ] T021 [US2] Create `dashboard/src/components/upload-zone.tsx` — `"use client"`, drag-and-drop zone (onDragOver/onDrop handlers + hidden file input), accepts PDF/JPEG/PNG/DOCX, shows accepted types and max size, calls uploadDocument on drop, shows upload progress/status, on success redirects to document detail or adds to list
- [ ] T022 [US2] Create `dashboard/src/components/document-list.tsx` — `"use client"`, fetches documents from API on mount, renders cards: filename, document_type badge (color-coded: invoice=accent, contract=blue, receipt=yellow, letter=gray), confidence %, upload date (relative), 1-2 key extracted fields. Search input at top (debounced, queries API). Link each card to `/documents/{id}`.
- [ ] T023 [US2] Create `dashboard/src/components/field-table.tsx` — renders extracted_fields dict as a clean key-value table. Handles nested objects (line_items → sub-table). Null values shown as "—". Formats currency values, dates.
- [ ] T024 [US2] Create `dashboard/src/components/document-detail.tsx` — `"use client"`, fetches single document by ID. Shows: status badge, document_type + confidence, processing_time_ms, ocr_used indicator, FieldTable for extracted_fields, collapsible raw_text section, metadata (filename, file_size, page_count, created_at).
- [ ] T025 [US2] Create `dashboard/src/app/page.tsx` — `"use client"`, layout: UploadZone at top + DocumentList below. Poll for updates every 3s if any document has status "processing".
- [ ] T026 [US2] Create `dashboard/src/app/documents/[id]/page.tsx` — `"use client"`, renders DocumentDetail component. Poll for completion if status is "processing". Back link to main page.

**Checkpoint**: Full dashboard works — upload, see list, click into detail view.

---

## Phase 5: User Story 3 — Multi-Format Validation (Priority: P2)

**Note**: Already handled by T016 (upload validation) and T011 (extractor with OCR fallback). This phase verifies edge cases.

- [ ] T027 [US3] Ensure `api/app/routers/documents.py` returns clear error messages: "Unsupported format. Accepted: PDF, JPEG, PNG, DOCX" for bad types, "File too large. Maximum size: 20MB" for oversized files. Verify these error messages are user-friendly in the API response.

**Checkpoint**: Invalid uploads rejected with clear messages.

---

## Phase 6: User Story 4 — Architecture & Docker (Priority: P2)

**Goal**: Docker Compose works end-to-end, README documents everything

### Implementation

- [ ] T028 [US4] Create `api/Dockerfile` — `FROM python:3.12-slim`, `RUN apt-get update && apt-get install -y --no-install-recommends tesseract-ocr tesseract-ocr-eng poppler-utils libmagic1 curl && rm -rf /var/lib/apt/lists/*`, install deps from pyproject.toml, copy app/, EXPOSE 8000, CMD uvicorn
- [ ] T029 [P] [US4] Create `dashboard/Dockerfile` — node:22-alpine, pnpm install, pnpm build (standalone), node server.js on port 3000
- [ ] T030 [US4] Create `docker-compose.yml` — services: db (postgres:16-alpine, health check), api (build ./api, depends_on db, env from .env, uploads volume, health check), dashboard (build ./dashboard, depends_on api, env NEXT_PUBLIC_API_URL=http://api:8000). Volumes: pgdata, uploads.
- [ ] T031 [US4] Create 5 sample documents in `data/samples/`:
  - `invoice-simple.pdf` — single page, clear text: vendor "Acme Consulting", amount $1,500, date 2026-03-15
  - `invoice-complex.pdf` — multiple line items, tax, subtotal
  - `receipt.jpg` — retail receipt image (photo of printed receipt)
  - `contract.docx` — short consulting agreement between two parties
  - `scanned-invoice.pdf` — image-based PDF (no selectable text, tests OCR)
  (Create these as realistic-looking synthetic documents)
- [ ] T032 [US4] Create `README.md` — sections: title + description, "What This Demonstrates" (5 bullets: AI classification, structured extraction, OCR, multi-format pipeline, Docker orchestration), Mermaid architecture (Upload → Text Extraction → Claude Classification → Claude Field Extraction → PostgreSQL → Dashboard), tech stack table, Docker Compose quickstart, API endpoints table, sample demo flow, cost analysis ($0.006/doc with Haiku+Sonnet)

**Checkpoint**: `docker compose up` starts everything. README is complete.

---

## Phase 7: Deployment

- [ ] T033 Create `Dockerfile.dokku` — combined build: dashboard static export + FastAPI serving both (same pattern as realestate-tracker). Include Tesseract + Poppler in the image.
- [ ] T034 Create `app.json` — Dokku health checks on /health
- [ ] T035 Provision Dokku: create `ai-docs` app, create PostgreSQL service, link, set domain `ai-docs.home301server.com.br`, set env vars (ANTHROPIC_API_KEY, POSTGRES_*), SSL cert, ports
- [ ] T036 Deploy to Dokku and verify with sample document upload

**Checkpoint**: Live at `ai-docs.home301server.com.br`.

---

## Phase 8: Polish & Cross-Cutting

- [ ] T037 Verify all 4 user stories on deployed site
- [ ] T038 Update `apps/web/src/data/projects.ts` — add live demo URL for ai-document-processor
- [ ] T039 Commit all changes, push, create PR, merge, clean up branch

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies
- **Phase 2 (Foundation)**: Depends on Phase 1
- **Phase 3 (US1 — API endpoints)**: Depends on Phase 2 (pipeline + models)
- **Phase 4 (US2 — Dashboard)**: Depends on Phase 3 (API must exist)
- **Phase 5 (US3 — Validation)**: Depends on Phase 3
- **Phase 6 (US4 — Docker + README)**: Depends on Phase 2 for Docker, Phase 4 for README
- **Phase 7 (Deploy)**: Depends on Phase 6
- **Phase 8 (Polish)**: Depends on all

### Parallel Opportunities

**Phase 1**: T002, T003, T004 all parallel
**Phase 2**: T008, T009, T010 parallel; T012, T013 parallel
**Phase 4**: T017, T018, T019, T020 parallel; then T021-T024 after foundation

### Recommended Single-Agent Order

T001 → T002+T003+T004 → T005 → T006 → T007 → T008+T009+T010 → T011 → T012+T013 → T014 → T015 → T016 → T017+T018+T019+T020 → T021 → T022 → T023 → T024 → T025 → T026 → T027 → T028+T029 → T030 → T031 → T032 → T033 → T034 → T035 → T036 → T037 → T038 → T039

---

## Implementation Strategy

### MVP First

1. Phase 1-2: API + pipeline (T001-T015)
2. Phase 3: Upload endpoint (T016)
3. **STOP**: Upload a sample invoice via curl, verify classification + extraction

### Full Build

4. Phase 4: Dashboard (T017-T026)
5. Phase 5-6: Validation + Docker + README (T027-T032)
6. Phase 7-8: Deploy + polish + merge (T033-T039)

---

## Notes

- The pipeline runs in BackgroundTasks — no Celery/Redis needed
- Claude API calls use `output_config.format` with `json_schema` (GA) for guaranteed structured output
- If ANTHROPIC_API_KEY is missing, the system still extracts text and stores it — AI classification is skipped
- Sample documents in `data/samples/` are synthetic — don't include real business documents
- The combined Dockerfile.dokku follows the same pattern as realestate-tracker (FastAPI serves static dashboard)
- Tesseract + Poppler add ~100MB to the Docker image but are essential for OCR demo
