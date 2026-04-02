# Data Model: AI Document Processing Pipeline

**Branch**: `006-ai-document-processor`
**Date**: 2026-04-02

## Database Schema

### `documents` table

| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | UUID PK | No | gen_random_uuid() |
| filename | TEXT | No | Original upload filename |
| file_path | TEXT | No | Path on disk |
| file_size | INTEGER | No | Bytes |
| mime_type | TEXT | No | application/pdf, image/jpeg, etc. |
| status | ENUM | No | uploaded, processing, completed, failed, ai_pending |
| error_message | TEXT | Yes | Error details if failed |
| document_type | ENUM | Yes | invoice, contract, receipt, letter, report, unknown |
| confidence | REAL | Yes | 0-100% classification confidence |
| raw_text | TEXT | Yes | Full extracted text |
| extracted_fields | JSONB | No | Default '{}'. Per-type structured fields |
| page_count | INTEGER | Yes | Number of pages/images |
| ocr_used | BOOLEAN | No | Default false. Whether OCR was needed |
| processing_time_ms | INTEGER | Yes | Total pipeline duration |
| model_used | TEXT | Yes | e.g. "haiku-4.5 + sonnet-4.6" |
| created_at | TIMESTAMPTZ | No | Default now() |
| updated_at | TIMESTAMPTZ | No | Default now() |

**Indexes**: status, document_type, created_at DESC, GIN on text_search (generated TSVECTOR), GIN on extracted_fields

### Extracted Fields Schemas (JSONB)

**Invoice**:
```json
{
  "vendor_name": "Acme Corp",
  "invoice_number": "INV-2026-001",
  "invoice_date": "2026-03-15",
  "due_date": "2026-04-15",
  "subtotal": 1500.00,
  "tax": 120.00,
  "total_amount": 1620.00,
  "currency": "USD",
  "line_items": [
    {"description": "Consulting hours", "quantity": 10, "unit_price": 150.00, "amount": 1500.00}
  ]
}
```

**Contract**:
```json
{
  "parties": ["Acme Corp", "Pedro Balbino"],
  "effective_date": "2026-01-01",
  "expiration_date": "2026-12-31",
  "term": "12 months",
  "governing_law": "State of Texas"
}
```

**Receipt**:
```json
{
  "store": "Best Buy",
  "total": 89.99,
  "currency": "USD",
  "date": "2026-03-20",
  "payment_method": "Credit Card",
  "items": [{"description": "USB-C Cable", "amount": 24.99}]
}
```

## File Inventory

### FastAPI Backend (`projects/ai-document-processor/api/`)

| File | Purpose |
|------|---------|
| `app/main.py` | FastAPI app, CORS, routers, health check |
| `app/config.py` | Settings (DATABASE_URL, ANTHROPIC_API_KEY, UPLOAD_DIR) |
| `app/database.py` | Async engine + session |
| `app/models.py` | SQLAlchemy Document model |
| `app/schemas.py` | Pydantic request/response schemas |
| `app/routers/documents.py` | Upload, list, get, search endpoints |
| `app/pipeline/extractor.py` | Text extraction (PyMuPDF, OCR, DOCX) |
| `app/pipeline/classifier.py` | Claude classification |
| `app/pipeline/field_extractor.py` | Claude field extraction per document type |
| `app/pipeline/processor.py` | Orchestrator: extract → classify → extract fields → store |
| `Dockerfile` | Python 3.12 + Tesseract + Poppler |
| `pyproject.toml` | Dependencies |

### Web Dashboard (`projects/ai-document-processor/dashboard/`)

| File | Purpose |
|------|---------|
| `src/app/page.tsx` | Dashboard: upload zone + document list |
| `src/app/documents/[id]/page.tsx` | Document detail view |
| `src/app/layout.tsx` | Root layout, fonts, metadata |
| `src/app/globals.css` | Dark theme |
| `src/components/upload-zone.tsx` | Drag-and-drop file upload |
| `src/components/document-list.tsx` | Cards with type badges + key fields |
| `src/components/document-detail.tsx` | Full results: text + fields + metadata |
| `src/components/field-table.tsx` | Extracted fields display |
| `src/lib/api.ts` | API client |
| `src/lib/types.ts` | TypeScript interfaces |
| `package.json` | Next.js, Tailwind |

### Infrastructure

| File | Purpose |
|------|---------|
| `docker-compose.yml` | PostgreSQL + API + Dashboard |
| `.env.example` | ANTHROPIC_API_KEY, POSTGRES_*, etc. |
| `data/samples/` | 5 sample documents for demo |
| `Dockerfile.dokku` | Combined build for Dokku |
| `app.json` | Dokku health checks |
| `README.md` | Architecture, setup, screenshots |
