# Portfolio Roadmap

**Goal:** Go from scaffolded monorepo to a deployed portfolio with 3-5 live projects
that can be added to the Upwork profile, replacing the single "Admission Project".

**Last updated:** 2026-03-31

---

## Phase 0 — Production-Ready Site (pre-deploy)

The portfolio site is built but not deployable. These are blockers.

- [ ] **0.1** Add `not-found.tsx` (custom 404 page)
- [ ] **0.2** Add `error.tsx` (error boundary)
- [ ] **0.3** Add favicon (favicon.ico + apple-touch-icon + web manifest)
- [ ] **0.4** Add `robots.txt` and `sitemap.ts` (Next.js generateSitemap)
- [ ] **0.5** Add OG image (static or via `next/og` at build time)
- [ ] **0.6** Add `resume.pdf` to `apps/web/public/` (header + hero link to it)
- [ ] **0.7** Add mobile nav toggle (current header overflows on small screens)
- [ ] **0.8** Add aria landmarks (nav, main, contentinfo) and skip-to-content link
- [ ] **0.9** Add JSON-LD structured data (Person + WebSite schema)
- [ ] **0.10** Add theme-color meta tag
- [ ] **0.11** Run Lighthouse audit — target 95+ on all four scores, fix what fails

**Estimated effort:** 1 session (~2-3 hours)

---

## Phase 1 — Deploy Portfolio Site

- [ ] **1.1** Deploy `apps/web` to Vercel (connect yolo-labz/portfolio repo)
- [ ] **1.2** Set custom domain (if available) or use vercel.app subdomain
- [ ] **1.3** Verify production build, check all routes, test mobile
- [ ] **1.4** Add Vercel Analytics (or Plausible/Umami for privacy-first)

**Depends on:** Phase 0
**Estimated effort:** 30 min

---

## Phase 2 — Build Priority Projects (3 of 5)

These three projects have the highest Upwork ROI. Each needs: working code, a
README with architecture diagram, and either a live demo or compelling
screenshots.

### 2A — Executive Job Board (`projects/exec-job-board`)

**Priority: HIGHEST** — directly proves the $300 in-progress Upwork contract.

- [ ] **2A.1** Python data collection scripts (public job board APIs)
- [ ] **2A.2** Data normalization + deduplication logic
- [ ] **2A.3** Next.js static site with search, filters, responsive cards
- [ ] **2A.4** GitHub Actions workflow: nightly collect → build → deploy
- [ ] **2A.5** RSS feed output
- [ ] **2A.6** Deploy to Vercel (live demo URL)
- [ ] **2A.7** README with architecture diagram
- [ ] **2A.8** Screenshot for Upwork portfolio

### 2B — Real Estate Price Tracker (`projects/realestate-price-tracker`)

**Priority: HIGH** — showcases data extraction + full-stack + dashboards.

- [ ] **2B.1** Python extraction pipeline (Playwright for dynamic content)
- [ ] **2B.2** FastAPI backend with REST endpoints
- [ ] **2B.3** PostgreSQL schema + SQLAlchemy models
- [ ] **2B.4** Next.js dashboard: charts (Recharts), map (Leaflet), filters
- [ ] **2B.5** Docker Compose for local dev (app + db + optional n8n)
- [ ] **2B.6** CSV/JSON export endpoints
- [ ] **2B.7** README with architecture diagram
- [ ] **2B.8** Screenshots of dashboard for Upwork portfolio
- [ ] **2B.9** Optional: deploy dashboard to Railway/Render with sample data

### 2C — Serverless Data API (`projects/serverless-data-api`)

**Priority: HIGH** — showcases AWS + Terraform + DevOps, aligns with AWS SA cert.

- [ ] **2C.1** Terraform modules: Lambda, API Gateway, DynamoDB, S3, IAM, CloudWatch
- [ ] **2C.2** Python Lambda handlers with validation (Pydantic)
- [ ] **2C.3** API key auth middleware
- [ ] **2C.4** Swagger/OpenAPI spec auto-generated
- [ ] **2C.5** GitHub Actions CI/CD: validate → plan → apply
- [ ] **2C.6** README with architecture diagram + `terraform plan` output sample
- [ ] **2C.7** Screenshot of API docs + CloudWatch dashboard for Upwork

**Estimated effort for Phase 2:** 3-5 sessions (~15-25 hours total)

---

## Phase 3 — Build Remaining Projects (2 of 5)

Lower priority — build after the first 3 are on the Upwork profile.

### 3A — AI Document Processor (`projects/ai-document-processor`)

- [ ] **3A.1** FastAPI upload service (PDF, images, DOCX)
- [ ] **3A.2** OCR pipeline (Tesseract for images, PyMuPDF for PDFs)
- [ ] **3A.3** Claude API integration for classification + field extraction
- [ ] **3A.4** PostgreSQL storage + search
- [ ] **3A.5** Simple web UI for upload + results viewing
- [ ] **3A.6** Docker Compose for local dev
- [ ] **3A.7** README with architecture diagram
- [ ] **3A.8** Screenshots of upload flow + extracted data for Upwork

### 3B — Workflow Automation Hub (`projects/automation-hub`)

- [ ] **3B.1** Docker Compose: n8n + PostgreSQL + admin dashboard
- [ ] **3B.2** 3-5 n8n workflow templates (importable JSON)
- [ ] **3B.3** Next.js admin panel: workflow run history, error rates, stats
- [ ] **3B.4** One-command deployment script
- [ ] **3B.5** README with architecture diagram + workflow screenshots
- [ ] **3B.6** Screenshots for Upwork portfolio

**Estimated effort for Phase 3:** 2-3 sessions (~10-15 hours total)

---

## Phase 4 — Upwork Profile Updates

These are actions on the Upwork platform itself.

- [ ] **4.1** Upload 3-5 portfolio pieces (screenshots + descriptions + links)
- [ ] **4.2** Fix project catalog: replace gallery image (remove "Custom Web Scraper" text)
- [ ] **4.3** Update profile title: "Web Scraping & Automation Engineer" →
      "Data Extraction & Automation Engineer" (or similar)
- [ ] **4.4** Fix Loomi employment end date (shows "Present", should show Oct 2024)
- [ ] **4.5** Decide on Machine Learning specialized profile (publish or ignore before
      May 28, 2026 cutoff when specialized profiles are retired)
- [ ] **4.6** Request testimonials from completed job clients
- [ ] **4.7** Update profile bio to reference portfolio site URL

**Depends on:** Phase 2 (need at least 3 projects done)
**Estimated effort:** 1 session (~1-2 hours, manual Upwork UI work)

---

## Phase 5 — Polish & Iterate

After the portfolio is live and projects are uploaded.

- [ ] **5.1** Add contact form with server action (Resend or similar)
- [ ] **5.2** Add pre-commit hooks (Biome via lint-staged)
- [ ] **5.3** Add basic test setup (Vitest for UI components)
- [ ] **5.4** Add case study pages with longer narratives for top 2 projects
- [ ] **5.5** Monitor proposal conversion rate — adjust portfolio emphasis based on
      which projects get the most client attention
- [ ] **5.6** Consider adding a blog section (technical writing as credibility signal)

---

## Dependency Graph

```
Phase 0 (site fixes)
    └──▶ Phase 1 (deploy site)
              └──▶ Phase 2 (build 3 projects) ─────┐
                        └──▶ Phase 4 (Upwork uploads) │
              └──▶ Phase 3 (build 2 more projects) ──┘
                                                       └──▶ Phase 5 (polish)
```

## Milestone Targets

| Milestone | Definition of Done | Target |
|-----------|-------------------|--------|
| **Site Live** | Portfolio deployed with all Phase 0 items, Lighthouse 95+ | End of Week 1 |
| **First 3 Projects** | exec-job-board, realestate-tracker, serverless-api built with READMEs + screenshots | End of Week 3 |
| **Upwork Updated** | 3+ portfolio pieces uploaded, title fixed, catalog resubmitted | End of Week 3 |
| **Full Portfolio** | All 5 projects built, deployed where applicable | End of Week 5 |
| **Polished** | Contact form, tests, case studies, analytics | Ongoing |
