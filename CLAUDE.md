# CLAUDE.md

Operational guidance for Claude Code when working in this repository.

Constitution at `.specify/memory/constitution.md` (v1.0.0, ratified 2026-03-31)
takes precedence over this file when they conflict. This file documents the
operational state of the repo; the constitution documents non-negotiable
principles.

## Prerequisites

- Node `>=22.0.0` (pinned via `.nvmrc` → `22`)
- pnpm `10.28.2` (enforced via root `packageManager` field)
- Python `3.12` (pinned via `.python-version`, for `projects/*` Python stacks)

## Current stack (resolved versions, from `pnpm-lock.yaml`)

| Concern        | Package              | Version  |
|----------------|----------------------|----------|
| Framework      | `next`               | 16.2.4   |
| UI runtime     | `react`              | 19.2.4   |
| UI runtime     | `react-dom`          | 19.2.4   |
| Type system    | `typescript`         | 6.0.3    |
| Styling        | `tailwindcss`        | 4.2.4    |
| Animation      | `motion`             | 12.38.0  |
| Monorepo       | `turbo`              | 2.9.6    |
| Lint + format  | `@biomejs/biome`     | 2.4.12   |
| Visual tests   | `@playwright/test`   | 1.59.1   |

Root `package.json` deps are written as `latest`. The lockfile is the source
of truth — always reason from `pnpm-lock.yaml`, never from the spec range.

## Build, lint, test, deploy

```bash
pnpm install                # install all workspace deps (--frozen-lockfile in CI)
pnpm dev                    # turbo dev (Next.js with --turbopack)
pnpm build                  # turbo build (all packages)
pnpm typecheck              # turbo typecheck (tsc --noEmit per workspace)
pnpm lint                   # biome check .
pnpm lint:fix               # biome check --write .
pnpm format                 # biome format --write .
pnpm clean                  # turbo clean + rm -rf node_modules
pnpm test:visual            # Playwright toHaveScreenshot suite
pnpm test:visual:update     # refresh visual baselines (review diff before commit)
pnpm test:visual:report     # open last Playwright HTML report
```

Scope a command to a workspace via `pnpm --filter @portfolio/web <cmd>`.

## Architecture

Turborepo + pnpm workspaces. Three workspace groups, one deployable target.

- `apps/web` — Next.js portfolio site (App Router, React 19, Tailwind v4,
  Motion). The only deployable application.
- `packages/ui` — Shared component library (`badge.tsx`, `button.tsx`,
  `card.tsx`, `utils.ts`, barrel `index.ts`). Raw TypeScript source — no
  build step. Next.js transpiles it via `transpilePackages` in
  `next.config.ts`.
- `projects/*` — Five portfolio project stubs with thin `package.json`
  wrappers for Turbo orchestration. Mixed-stack (Python + JS + Terraform);
  each project owns its toolchain.

### Project subfolders (`projects/*`)

| Slug                         | Stack                                      |
|------------------------------|--------------------------------------------|
| `ai-document-processor`      | FastAPI + Next.js dashboard + Postgres     |
| `automation-hub`             | Stub (orchestration only, no deployable)   |
| `exec-job-board`             | Python collector + Next.js site + JSON db  |
| `realestate-price-tracker`   | FastAPI + Next.js dashboard + Postgres     |
| `serverless-data-api`        | AWS Lambda (Python) + Terraform IaC        |

Each project carries its own `Dockerfile.dokku` + `app.json` where it ships
as a separately deployed Dokku app, independent of the portfolio site.

### Key architectural decisions

- **Tailwind CSS v4** — no `tailwind.config.js`. Theme via `@theme` directive
  in `apps/web/src/app/globals.css` using oklch color space. `@source`
  includes `packages/ui/src` for class detection.
- **Static data, no CMS** — all portfolio content in typed constants under
  `apps/web/src/data/` (`projects.ts`, `skills.ts`, `experience.ts`).
  Dynamic project pages use `generateStaticParams`.
- **Server-first** — page components are server components. Section
  components using Motion or hooks are client components (`"use client"`).
  `use-reduced-motion.ts` respects `prefers-reduced-motion`.
- **UI package pattern** — polymorphic `as` prop
  (`<Button as="a" href="…">`) instead of Radix-style `asChild`. Import via
  `@portfolio/ui`.
- **App Router segments** — `apps/web/src/app/` carries `page.tsx`,
  `about/`, `api/`, `projects/[slug]/`, plus `manifest.ts`, `sitemap.ts`,
  `robots.ts`, `opengraph-image.tsx`, dynamic icons.

### Path aliases

- `@/*` → `apps/web/src/*` (configured in `apps/web/tsconfig.json`)
- `@portfolio/ui` → `packages/ui` (workspace dependency)

## Code style

Biome (`biome.json`) is the single source of truth for lint + format. No
ESLint, no Prettier. Highlights:

- Tabs for indentation, 100-char line width.
- Double quotes, always semicolons.
- `useConst` is an **error**.
- `noExplicitAny` and `noNonNullAssertion` are **warnings**.
- `*.py`, `*.css`, `**/__pycache__`, `**/.venv`, `**/.next`, `**/.turbo`
  excluded from Biome.

Python tooling lives inside each `projects/*` member that ships Python —
ruff per project, no root-level Python environment.

## CI and deployment

Workflows under `.github/workflows/`:

| Workflow              | Trigger                       | Purpose                                           |
|-----------------------|-------------------------------|---------------------------------------------------|
| `ci.yml`              | push/PR → `main`              | lint → typecheck → build (sequential)             |
| `visual-regression.yml`| PR → `main`                  | Playwright `toHaveScreenshot` baselines           |
| `no-ai-slips.yml`     | PR → `main` (self-hosted)     | banned-phrases gate (see Constitution V)          |
| `sonar.yml`           | push/PR → `main`              | SonarQube static analysis                         |
| `terraform.yml`       | changes under `projects/serverless-data-api/infra` | Terraform fmt/validate     |
| `collect-jobs.yml`    | schedule                      | `exec-job-board` collector run                    |
| `deploy-dokku.yml`    | push → `main` (self-hosted)   | deploy to Dokku app `portfolio`                   |
| `release.yml`         | tag push `v*.*.*`             | tagged release + SLSA L2 + dual SBOM (PR #27)     |
| `scorecard.yml`       | weekly + push → `main`        | OSSF Scorecard SARIF upload (PR #27)              |

**Site deploy.** `deploy-dokku.yml` ships `apps/web` to Dokku on a Proxmox VM
(self-hosted runner). App name `portfolio`. Domain
`portfolio.home301server.com.br`. Required secret on the repo:
`DOKKU_SSH_PRIVATE_KEY`. Build artifact path: `Dockerfile.dokku` — 3-stage
(deps → build → non-root runner) with Next.js `output: "standalone"`. Health
checks (startup / liveness / readiness) on `/api/health` via `app.json`. One-
time provisioning script: `scripts/setup-dokku.sh`.

**Tagged releases.** Tagging `vX.Y.Z` triggers `release.yml`:

1. `SOURCE_DATE_EPOCH = git log -1 --format=%ct` for reproducible archives.
2. `pnpm --filter @portfolio/web build`.
3. Pack `apps/web/{.next,public}` into `dist/portfolio-vX.Y.Z.tar.gz` with
   `tar --sort=name --owner=0 --group=0 --numeric-owner --mtime=@$SDE`.
4. Dual SBOM via `syft` (CycloneDX 1.7 + SPDX 2.3).
5. `actions/attest-build-provenance@v4.1.0` + `actions/attest-sbom@v2.1.0`
   over the tarball (SLSA L2).
6. `softprops/action-gh-release` publishes tarball + `.sha256` + both SBOMs.

Consumer verification:

```bash
gh attestation verify portfolio-vX.Y.Z.tar.gz --owner yolo-labz
```

Never re-tag a release — `slsa-verifier` binds provenance to the commit SHA
at signing time. Cut `vX.Y.Z+1` on botched publishes.

## Active sprint (open PRs as of 2026-05-28)

Verify against `gh pr list --repo yolo-labz/portfolio --state open` before
acting; these were draft at the time of writing.

- **PR #25** — `ci(security): SHA-pin all GitHub Actions + add dependabot.yml`
  — full-SHA pins on every workflow + `.github/dependabot.yml` for
  npm + actions + pip maintenance with `# vX.Y.Z` comment preservation.
- **PR #26** — `docs: add MIT LICENSE + README` — MIT license + repository
  README footer linking back to the live site.
- **PR #27** — `feat(release): tagged release path + SLSA L2 + dual SBOM +
  Scorecard` — adds `release.yml` and `scorecard.yml` (see CI table above).

This PR (#28) ships the documentation refresh that anchors the three above.

## Content rules

This portfolio is a sales surface. When authoring or editing copy:

- **Capability-first framing.** Lead with what was built and the measurable
  outcome — never autobiographical narration.
- **No client / employer names.** Anonymize all third-party references.
- **No stealth-incompatible status.** Do not advertise current employment,
  availability windows, or hiring-platform status.
- **Use "data extraction"** in any platform-facing copy. The word
  "scraping" is flagged by Upwork and has triggered prior catalog rejections.
- **Banned AI-slop phrases.** "Passionate developer", "innovative
  solutions", "cutting-edge", "leveraging the power of", "synergy",
  "drive impactful results" — see Constitution Principle V for the
  complete list.
- **Concrete metrics only.** "Processed 5 TB/day" passes; "scalable big
  data" fails.

## Spec workflow

Specs live at `specs/NNN-<slug>/` and follow the speckit template:
`spec.md` → `plan.md` → `research.md` → `data-model.md` → `quickstart.md`
→ `tasks.md` (plus `checklists/`). Current specs in-tree:

- `001-production-ready-site`
- `003-exec-job-board`
- `004-realestate-price-tracker`
- `005-serverless-data-api`
- `006-ai-document-processor`

Cross-repo orchestration (audit, consolidation, multi-PR sprint planning)
lives in the operator's notes vault, not in this tree.

## Working in this repo (Claude Code rules)

- **PR-only workflow.** Never push to `main`. Branch naming:
  `NNN-short-slug` matching the PR number from
  `gh pr list --state all --limit 1`.
- **One concern per PR.** Refresh, license, SHA-pinning, and release path
  ship as separate PRs (#25 / #26 / #27 / #28) — keep that boundary.
- **CI must be green before merge.** `ci.yml`, `visual-regression.yml`,
  `no-ai-slips.yml`, and `sonar.yml` are required.
- **Constitution beats CLAUDE.md.** If you find a conflict, follow
  `.specify/memory/constitution.md` and open an amendment PR to reconcile.

## Cross-references

- Constitution: `.specify/memory/constitution.md` (v1.0.0).
- Specs: `specs/NNN-<slug>/` in this repo; portfolio-consolidation sprint
  spec `024-yolo-labz-portfolio-consolidation-2026Q2` in operator notes.
- Release-engineering canon (SHA-pin policy, dual SBOM, SLSA L2 path,
  Scorecard targets) lives in the operator's release-engineering ruleset;
  PR #27 is the first portfolio-side application.
- Sibling org repos under `yolo-labz/`: `wa`, `claude-mac-chrome`,
  `linkedin-chrome-copilot`, `kokoro-speakd`, `claude-classroom-submit`,
  `fand`, `homebrew-tap`, `chrome-bridge`, `dot-github`. Share the same
  release-engineering canon.
