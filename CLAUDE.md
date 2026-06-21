# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Prerequisites

Node >= 22, pnpm 10.28.2 (enforced via `packageManager` field).

**Local environment reality (read before running anything):**

- This is a normal git repo on `main`, **live in production**: `deploy-dokku.yml` deploys the `portfolio` app to `portfolio.home301server.com.br` on every push to `main`, so a merged PR ships. Work through feature branches + worktrees (`git worktree add ../portfolio-NNN-slug -b NNN-slug origin/main`) — never edit `main` directly, never force-push over remote history. Local `git config` is `Pedro H S Balbino <30302237+phsb5321@users.noreply.github.com>`. **Never add a `Co-Authored-By: Pedro` trailer** (Pedro forbids self-co-authorship).
- Bare `pnpm` may not be on PATH. If so, invoke through corepack: `corepack pnpm <cmd>` (resolves to 10.28.2). Node is v22.
- If `pnpm install` hasn't been run, deps aren't present locally — hand-write type-correct code and let CI build/deploy verify it.

## Build & Dev Commands

```bash
pnpm install              # install all workspace deps
pnpm dev                  # start dev server (Turbopack)
pnpm build                # build all packages via Turbo
pnpm typecheck            # tsc --noEmit across all workspaces
pnpm lint                 # biome check .
pnpm lint:fix             # biome check --write .
pnpm format               # biome format --write .
pnpm clean                # remove node_modules, .turbo, dist
```

To run a command in a specific workspace: `pnpm --filter @portfolio/web dev`

### Per-project commands (`projects/*`)

The Turbo `package.json` wrappers are thin (most `build`/`lint`/`typecheck` are `echo` no-ops); real tooling is self-contained per project:

```bash
pnpm --filter @portfolio/exec-job-board collect          # python -m collector.main → data/jobs.json
cd projects/exec-job-board/site && pnpm dev              # Next.js site
cd projects/realestate-price-tracker && docker compose up # FastAPI + Postgres + dashboard
cd projects/realestate-price-tracker && docker compose --profile seed up seed
cd projects/serverless-data-api/infra && terraform fmt -recursive && terraform validate
cd projects/ai-document-processor && docker compose up   # api + dashboard
```

## Architecture

Turborepo monorepo with pnpm workspaces. Three workspace groups:

- **`apps/web`** — Next.js 16 portfolio site (App Router, React 19, Tailwind CSS v4, Motion). Section components in `src/components/sections/` (hero-metrics, project-showcase, proof-band, services-ladder, skills-matrix, experience-timeline, contact-cta) are the homepage building blocks.
- **`packages/ui`** — Shared component library (Button, Card, Badge). Raw TypeScript source exports — no build step. Next.js transpiles it via `transpilePackages` in `next.config.ts`.
- **`projects/*`** — 5 self-contained portfolio projects, each a thin `package.json` wrapper (Turbo orchestration only) over its own language tooling. Biome ignores `*.py`; Python uses ruff per-project. Workspace globs also pull in `projects/*/site` and `projects/*/dashboard` as real Next.js workspaces.
  - `exec-job-board` — Python collector (httpx/pydantic) + Next.js `site` (Fuse.js search). Spec 003.
  - `realestate-price-tracker` — FastAPI/SQLAlchemy `api` + Next.js `dashboard` (Recharts/React-Leaflet) + Postgres, via `docker compose`. Spec 004.
  - `serverless-data-api` — Terraform `infra` + Python Lambda `lambda_src` + `openapi.yaml`, DynamoDB. Spec 005.
  - `ai-document-processor` — `api` + `dashboard` via `docker compose`. Spec 006.
  - `automation-hub` — README-only stub (no code yet).

### Key Architectural Decisions

**Tailwind CSS v4**: No `tailwind.config.js`. Theme lives in the `@theme` directive in `apps/web/src/app/globals.css`. Palette is **Catppuccin Mocha, hex-pinned** (NOT oklch, NOT `ctp-*` classes) per the vault's `VISUAL-IDENTITY.md`, **except the primary accent**, which is **emerald `#00c77a`** — the pre-relaunch hue (`oklch(0.72 0.19 160)`, hex-pinned), restored 01/06/2026 per Pedro because Catppuccin mauve read as generic "AI purple". **Do NOT revert the accent to mauve `#cba6f7`** — the emerald is intentional (the vault `VISUAL-IDENTITY.md` still says mauve; that propagation is Pedro-gated). Color carries meaning, not decoration: emerald `#00c77a` = primary/CTA, peach `#fab387` = audit, yellow `#f9e2af` = compliance, blue `#89b4fa` = links. **No gradients, no glows** (banned — the hero uses an engineering-notebook dot-grid instead). The `@source` directive pulls `packages/ui/src` for class detection. Fonts: Inter (sans) + JetBrains Mono (mono) wired via `apps/web/src/lib/fonts.ts` CSS variables. Dark-only (`color-scheme: dark`).

**Static data, no CMS**: All portfolio content lives in typed constants under `apps/web/src/data/` (`projects.ts`, `skills.ts`, `experience.ts`). The `Project` interface splits content two ways: `featured: true` projects render full case-study deep-dive pages (carrying the compliance-architecture thesis via narrative-arc fields `constraint` / `decision` / `outcome`); `featured: false` projects render in a compact "open-source & demos" shelf. Deep-dive pages use `generateStaticParams` over the featured set. Routes: `/` (home), `/about`, `/thesis`, `/projects/[slug]`.

**Client/Server split**: Page components are server components. Section components that use Motion animations or hooks are client components (`"use client"`). The `useReducedMotion` hook respects `prefers-reduced-motion`.

**UI package pattern**: Components accept a polymorphic `as` prop (e.g., `<Button as="a" href="...">`) instead of Radix-style `asChild`. Import with `@portfolio/ui`.

### Path Aliases

- `@/*` → `apps/web/src/*` (configured in `apps/web/tsconfig.json`)
- `@portfolio/ui` → `packages/ui` (workspace dependency)

## Code Style

Biome handles both linting and formatting (no ESLint or Prettier):
- **Tabs** for indentation, **100-char** line width
- **Double quotes**, **always semicolons**
- `useConst` is an error; `noExplicitAny` and `noNonNullAssertion` are warnings

## CI & Deployment

Six workflows under `.github/workflows/`:

- `ci.yml` — push/PR to `main`: lint → typecheck → build (sequential). pnpm cache + `--frozen-lockfile`.
- **`no-ai-slips.yml`** — HARD GATE (sole stealth gate; the `no-employer-name-leak.yml` named in its header comment does **not** exist). Greps public-surface files (`.md`/`.yml`/`.ts(x)`/`.js(x)`/`.json`/`.html`) for forbidden framing (job-search / open-to-work / recruiter / CV-tailor / career-retrospective) and a literal employer-name blocklist: Gauge, Pierson, Sciensa, Pearson, ASA-Bank/ASA-Investments, Stefanini(-Gauge), Ultracon, GlobalHitss, America-Movil, loomi. Per-line opt-out: append `# stealth-allow` (or `// `, `<!-- -->`). Skips `specs/[0-9]*`, `.specify`, `CHANGELOG.md`, fixtures, drafts. The blocklist itself is the source of truth — extend it there when a new client/employer name needs banning. Fails CI silently if copy drifts.
- `sonar.yml` — SonarQube scan (harden-runner, full history for blame coverage). Token: `PROJECT_ANALYSIS_TOKEN` (per-project scope, never `USER_TOKEN`).
- `terraform.yml` — `fmt -check` + `init -backend=false` validate, scoped to `projects/serverless-data-api/infra/**`.
- `collect-jobs.yml` — daily cron `0 6 * * *`: runs exec-job-board Python collector, commits `data/jobs.json` if changed, then deploys `exec-job-board` Dokku app. Secrets: `JSEARCH_API_KEY`, `ADZUNA_*`, `THEMUSE_API_KEY`, `USAJOBS_*`.
- `deploy-dokku.yml` — push to `main` deploys the `portfolio` app.

**Deploy**: Dokku on Proxmox VM (`192.168.1.184`), `self-hosted` runner + `dokku/github-action@master`. Multiple apps, not one:

- `portfolio` (this site) → `portfolio.home301server.com.br`, via `deploy-dokku.yml`.
- `exec-job-board` → deployed by `collect-jobs.yml` after each data refresh.
- `realestate-price-tracker` + `ai-document-processor` ship their own `Dockerfile.dokku`/`docker-compose.yml`.

Portfolio-site deploy specifics:
- `Dockerfile.dokku` — 3-stage build: deps → build (standalone) → runner (non-root)
- `app.json` — health checks (startup/liveness/readiness) on `/api/health`
- `output: "standalone"` in `next.config.ts` — required for Dokku Node.js deployment
- `scripts/setup-dokku.sh` — one-time app provisioning (domain, env vars, Dockerfile path)
- Secret: `DOKKU_SSH_PRIVATE_KEY` on the `yolo-labz/portfolio` repo

## Content Guidelines

This portfolio is a sales tool. The **locked positioning category** (06/05/2026, re-aligned 31/05/2026) is **"Compliance-Grade AI Architect for regulated LATAM & global workloads"** — production RAG, agent systems, MCP integrations with audit trails, decision provenance, and cost ceilings. It is **not** generic "Senior SWE" or "Upwork data-extraction". The target is high-ROI PJ contracts; plugins (`wa`, `claude-mac-chrome`, etc.) are credibility garnish on the shelf, **not** the product. The 5 featured case studies (compliance-tax-agent, event-driven-retail, legal-domain-rag, multilingual-rag, ai-document-processor) carry the thesis.

**Copy is derived, not generated.** Positioning text comes verbatim from the locked, stealth-linted vault corpus — `Notes/2. Areas/👷 Work/brand-identity/sales-positioning/08-applied-about.md` + `07-applied-headlines.md`. Do **not** regenerate it (regeneration fragments the load-bearing numbers: 0/18mo IRPF hallucinations, 100K DAU, 10K tx/day). Visual decisions trace to the vault `VISUAL-IDENTITY.md`. See memory `portfolio-compliance-architect-overhaul` for the full wiring + gotchas.

When writing copy:
- Lead with measurable outcomes, not self-descriptions. Metrics must be locked-verified (from the corpus) or stated in the public repo the project links to — never invented.
- Avoid AI-sounding phrases ("passionate developer", "innovative solutions").
- Capability-first, never autobiographical: no job-search / open-to-work / recruiter / "what I learned" / "why I switched" framing, no employer names. `no-ai-slips.yml` enforces this — drift fails CI. Legitimate uses (e.g. an audit doc quoting a banned term) opt out per-line with `# stealth-allow`.
- The homepage "every claim auditable" band links **only** to live public repos + `/about` — never to future-dated blog writeups (they 404 and invert the thesis).
- Contact: `pedrobalbino@proton.me`; LinkedIn `in/balbinopedro`.

## Constitution

Design principles and governance rules are in `.specify/memory/constitution.md`. That document takes precedence over this file if they conflict. Key principles: Sell Don't Tell, Static-First, Monorepo Discipline, Visual Polish Over Feature Count, No AI Slop, Mixed-Stack Autonomy.

## Active Technologies
- TypeScript 6.0.2, React 19.2.4 + Next.js 16.2.1, Tailwind CSS 4.2.2, Motion 12.38.0 (001-production-ready-site)
- N/A (static site, no database) (001-production-ready-site)
- Python 3.12 (collector), TypeScript (site) + httpx, pydantic (collector); Next.js, Tailwind CSS v4, Fuse.js (site) (003-exec-job-board)
- JSON file committed to git (`data/jobs.json`) (003-exec-job-board)
- Python 3.12 (API + pipeline), TypeScript (dashboard) + FastAPI, SQLAlchemy (async), asyncpg (API); Next.js, Recharts, React-Leaflet, Tailwind CSS v4 (dashboard) (004-realestate-price-tracker)
- PostgreSQL 16 (Docker Compose) (004-realestate-price-tracker)
- Python 3.12 (Lambda handlers), HCL (Terraform) + AWS Lambda Powertools v2, Pydantic v2 (Lambda); Terraform >= 1.7 (IaC) (005-serverless-data-api)
- DynamoDB (single-table, on-demand, zero idle cost) (005-serverless-data-api)
- Python (api), TypeScript (dashboard) — containerized via docker compose (006-ai-document-processor)

## Recent Changes
- 001-production-ready-site: Added TypeScript 6.0.2, React 19.2.4 + Next.js 16.2.1, Tailwind CSS 4.2.2, Motion 12.38.0
