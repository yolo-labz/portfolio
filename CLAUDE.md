# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Prerequisites

Node >= 22, pnpm 10.28.2 (enforced via `packageManager` field).

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

## Architecture

Turborepo monorepo with pnpm workspaces. Three workspace groups:

- **`apps/web`** — Next.js 16 portfolio site (App Router, React 19, Tailwind CSS v4, Motion)
- **`packages/ui`** — Shared component library (Button, Card, Badge). Raw TypeScript source exports — no build step. Next.js transpiles it via `transpilePackages` in `next.config.ts`.
- **`projects/*`** — 5 portfolio project stubs with thin `package.json` wrappers for Turbo orchestration. These are mixed-stack (Python + JS); Python tooling lives in each project independently.

### Key Architectural Decisions

**Tailwind CSS v4**: No `tailwind.config.js`. Theme is defined via `@theme` directive in `apps/web/src/app/globals.css` using oklch color space. The `@source` directive includes `packages/ui/src` for class detection.

**Static data, no CMS**: All portfolio content lives in typed constants under `apps/web/src/data/` (projects.ts, skills.ts, experience.ts). Project deep-dive pages use `generateStaticParams` from this data.

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

**CI**: GitHub Actions on push/PR to `main`: lint → typecheck → build (sequential). Uses pnpm cache and `--frozen-lockfile`.

**Deploy**: Dokku on Proxmox VM (`192.168.1.184`), triggered on push to `main` via `deploy-dokku.yml` using `self-hosted` runner and `dokku/github-action@master`. App name: `portfolio`. Domain: `portfolio.home301server.com.br`.

- `Dockerfile.dokku` — 3-stage build: deps → build (standalone) → runner (non-root)
- `app.json` — Health checks (startup/liveness/readiness) on `/api/health`
- `output: "standalone"` in `next.config.ts` — required for Dokku Node.js deployment
- `scripts/setup-dokku.sh` — One-time Dokku app provisioning (domain, env vars, Dockerfile path)
- Secrets needed: `DOKKU_SSH_PRIVATE_KEY` on the `yolo-labz/portfolio` repo

## Content Guidelines

This portfolio is a sales tool for Upwork freelancing. When writing copy:
- Lead with measurable outcomes, not self-descriptions
- Use "data extraction" instead of "scraping" (Upwork flags scraping language)
- Avoid AI-sounding phrases ("passionate developer", "innovative solutions")

## Constitution

Design principles and governance rules are in `.specify/memory/constitution.md`. That document takes precedence over this file if they conflict. Key principles: Sell Don't Tell, Static-First, Monorepo Discipline, Visual Polish Over Feature Count, No AI Slop, Mixed-Stack Autonomy.

## Active Technologies
- TypeScript 6.0.2, React 19.2.4 + Next.js 16.2.1, Tailwind CSS 4.2.2, Motion 12.38.0 (001-production-ready-site)
- N/A (static site, no database) (001-production-ready-site)
- Python 3.12 (collector), TypeScript (site) + httpx, pydantic (collector); Next.js, Tailwind CSS v4, Fuse.js (site) (003-exec-job-board)
- JSON file committed to git (`data/jobs.json`) (003-exec-job-board)

## Recent Changes
- 001-production-ready-site: Added TypeScript 6.0.2, React 19.2.4 + Next.js 16.2.1, Tailwind CSS 4.2.2, Motion 12.38.0
