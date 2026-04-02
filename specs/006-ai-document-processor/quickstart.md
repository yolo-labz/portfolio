# Quickstart: AI Document Processing Pipeline

**Branch**: `006-ai-document-processor`

## Prerequisites

- Docker + Docker Compose
- Anthropic API key (get at console.anthropic.com)

## Setup

```bash
cd projects/ai-document-processor

# Copy env and add your API key
cp .env.example .env
# Edit .env: set ANTHROPIC_API_KEY=sk-ant-...

# Start all services
docker compose up -d

# Open dashboard
open http://localhost:3000

# API docs
open http://localhost:8000/docs
```

## Demo

1. Open `http://localhost:3000`
2. Drag-and-drop a sample document from `data/samples/`
3. Watch the pipeline process: extraction → classification → field extraction
4. View structured results on the document detail page

## API Testing

```bash
# Upload a document
curl -X POST http://localhost:8000/api/documents/upload \
  -F "file=@data/samples/invoice-simple.pdf"

# Check status
curl http://localhost:8000/api/documents/{id}

# List all documents
curl http://localhost:8000/api/documents

# Search
curl "http://localhost:8000/api/documents?search=Acme"
```

## Verification

- [ ] `docker compose up -d` starts all 3 services
- [ ] Upload sample invoice PDF → classified as "Invoice" with > 90% confidence
- [ ] Upload sample receipt JPEG → OCR extracts text, classified as "Receipt"
- [ ] Upload sample contract DOCX → classified as "Contract"
- [ ] Document list shows all uploads with type badges
- [ ] Document detail shows extracted text + structured fields
- [ ] Search by keyword returns matching documents
- [ ] `/health` returns `{"status": "healthy"}`

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `ANTHROPIC_API_KEY` | Yes | Claude API authentication |
| `POSTGRES_USER` | No (default: docproc) | DB user |
| `POSTGRES_PASSWORD` | No (default: docproc) | DB password |
| `POSTGRES_DB` | No (default: docproc) | DB name |
| `NEXT_PUBLIC_API_URL` | No (default: http://localhost:8000) | API base URL |
