# AI Pipeline Checklist: AI Document Processing Pipeline

**Purpose**: Validate requirements quality for the AI classification, field extraction, file processing, and data storage pipeline before implementation
**Created**: 2026-04-02
**Feature**: [spec.md](../spec.md)

## Requirement Completeness

- [ ] CHK001 Are the specific Claude API model versions for classification and extraction specified in the FRs? [Gap] The spec says "AI language model" (FR-004) without naming models. The plan specifies Haiku for classification and Sonnet for extraction — should this be in the spec or is it an implementation detail?
- [ ] CHK002 Are the exact JSON schemas for each document type's extracted fields fully specified? [Completeness, Spec §FR-005] FR-005 lists field names per type but doesn't define data types, required vs optional, or array structures for line_items.
- [ ] CHK003 Are retry/fallback requirements defined for Claude API failures? [Gap] Edge cases mention "Claude API unavailable → ai_pending status" but no FR specifies retry policy, timeout, or maximum retry count.
- [ ] CHK004 Are requirements defined for what text is sent to the Claude API? [Gap] Is the full raw_text sent, or is it truncated/chunked? Are there token limits documented?
- [ ] CHK005 Are requirements defined for prompt engineering artifacts? [Gap] Should the classification and extraction prompts be versioned, documented, or configurable? Or are they implementation details?
- [ ] CHK006 Are upload progress/status notification requirements specified? [Completeness, Spec §FR-014] FR-014 says processing is async and client "polls for completion" — is polling interval defined? Is there a timeout after which the client stops polling?
- [ ] CHK007 Are requirements defined for the sample documents content? [Gap, Spec §FR-010] FR-010 says "3-5 sample documents" but doesn't specify what data they contain. Do they need realistic vendor names, amounts, and dates for demo credibility?
- [ ] CHK008 Are file cleanup/retention requirements defined? [Gap] Are uploaded files kept indefinitely? Is there a maximum storage limit or cleanup policy?

## Requirement Clarity

- [ ] CHK009 Is "confidence > 90%" (US1.1) a hard requirement or an expectation? [Clarity, Spec §US1] If the model returns 85% confidence on a correctly classified invoice, does the acceptance scenario fail?
- [ ] CHK010 Is "under 10 seconds end-to-end" (SC-001) qualified for what conditions? [Clarity, Spec §SC-001] Network latency to Claude API varies. Is this measured locally via Docker Compose, or on the deployed Dokku instance?
- [ ] CHK011 Is the OCR fallback threshold (< 50 chars) specified as a requirement or just in the plan? [Clarity, Spec §FR-003] FR-003 says "OCR fallback for scanned PDFs" but the 50-char threshold is only in the research, not the spec.
- [ ] CHK012 Is "80% of expected fields correctly extracted" (SC-003) defined with a field-level accuracy metric? [Clarity, Spec §SC-003] Does 80% mean 4 out of 5 fields present, or 80% of field values are correct?
- [ ] CHK013 Is the status lifecycle fully specified? [Clarity, Spec §Edge Cases] The spec mentions statuses: processing, completed, failed, ai_pending. Is "uploaded" (initial state before processing starts) also a status?

## Requirement Consistency

- [ ] CHK014 Are the document type enums consistent between spec and data model? [Consistency] FR-004 lists: Invoice, Contract, Receipt, Letter, Report, Unknown. The data model enum must match exactly.
- [ ] CHK015 Are the extracted field names consistent between FR-005 and the JSONB schema in data-model.md? [Consistency] FR-005 uses "vendor" but data model uses "vendor_name". FR-005 says "amount" but data model says "total_amount".
- [ ] CHK016 Is the async processing pattern consistent between spec and plan? [Consistency, Spec §FR-014 vs Plan §Step 2] Both say BackgroundTasks, but does the UI need WebSocket/SSE, or is polling sufficient?

## Acceptance Criteria Quality

- [ ] CHK017 Can "classification accuracy exceeds 90% on sample documents" (SC-002) be objectively measured? [Measurability, Spec §SC-002] With only 5 samples, one misclassification = 80%. Is this a useful metric at such small scale?
- [ ] CHK018 Can "at least 80% of expected fields correctly extracted" (SC-003) be measured without a ground truth dataset? [Measurability, Spec §SC-003] Are the expected fields for each sample document documented somewhere as the ground truth to compare against?

## Scenario Coverage

- [ ] CHK019 Are requirements defined for concurrent uploads? [Coverage, Gap] What happens when multiple files are uploaded simultaneously? Do they process in parallel or queue?
- [ ] CHK020 Are requirements defined for duplicate document uploads? [Coverage, Gap] If the same file is uploaded twice, are two separate documents created?
- [ ] CHK021 Are requirements defined for password-protected PDFs? [Coverage, Gap] PyMuPDF can handle some encrypted PDFs but not all. What error does the user see?
- [ ] CHK022 Are requirements defined for very large documents (100+ pages)? [Coverage, Gap] SC-001 says < 10s for single-page. What about multi-page? Is there a page limit?
- [ ] CHK023 Are requirements defined for non-English documents? [Coverage, Gap] Tesseract defaults to English. Should non-English documents be rejected or processed with reduced accuracy?
- [ ] CHK024 Are requirements defined for the document detail view layout? [Coverage, Spec §FR-008] FR-008 says "document detail view showing all extracted data" but doesn't specify: side-by-side (text vs fields)? Tabs? Scrollable sections?

## Non-Functional Requirements

- [ ] CHK025 Are API rate limiting requirements defined? [Gap] The Claude API has rate limits. Should the processing pipeline throttle requests?
- [ ] CHK026 Are cost monitoring requirements defined? [Gap] Each document costs ~$0.006 in Claude API calls. Should there be a processing budget limit or counter?
- [ ] CHK027 Are accessibility requirements specified for the upload zone? [Gap, Spec §FR-012] FR-012 says "keyboard-navigable" but drag-and-drop inherently requires a mouse. Is there a keyboard-accessible file picker fallback?
- [ ] CHK028 Are error message requirements defined for each failure mode? [Gap] What specific messages does the user see for: OCR failure, AI classification failure, API timeout, file corruption?

## Dependencies & Assumptions

- [ ] CHK029 Is the ANTHROPIC_API_KEY dependency validated as a hard requirement? [Assumption] The assumptions say "required". What happens when running without it — does the system crash, or does it skip AI processing and store raw text only?
- [ ] CHK030 Is the assumption "Claude Haiku for classification" validated against accuracy needs? [Assumption] SC-002 requires > 90% accuracy. Has Haiku been tested on document classification tasks at this accuracy level?

## Notes

- Focus areas: AI Pipeline, File Processing, Data/Storage
- Depth: Standard (pre-implementation gate)
- Audience: Implementing agent
- 30 items across 7 categories
- Key findings: Field name inconsistencies between spec and data model (CHK015), missing retry policy for Claude API (CHK003), undefined ground truth for accuracy metrics (CHK018), no concurrent upload handling (CHK019)
