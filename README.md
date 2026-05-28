# portfolio

Turborepo monorepo: Next.js 16 portfolio site + mixed-stack project stubs.

Live at [pedro.home301server.com.br](https://pedro.home301server.com.br/).

## Stack

- Node.js >=22, pnpm 10.28.2, TypeScript 6.0.3
- Next.js 16.2.4 (App Router, React 19.2.4, Tailwind CSS 4.2.4)
- Turborepo 2.9.6 task graph + remote caching
- Python 3.12 in `projects/` subprojects (pyenv-pinned via `.python-version`)
- Biome 2.4.12 (lint + format)
- Playwright 1.59.1 visual-regression CI
- Dokku continuous deploy on push to `main` (Dockerfile.dokku)

## Layout

```
apps/web/                       # Next.js portfolio site (the only deployable app)
packages/ui/                    # shared component library, raw TS source (no build step)
projects/                       # portfolio project subfolders
├── ai-document-processor/
├── automation-hub/
├── exec-job-board/
├── realestate-price-tracker/
└── serverless-data-api/
scripts/                        # setup-dokku.sh + ops scripts
.github/workflows/              # ci, deploy-dokku, no-ai-slips, sonar, terraform,
                                # visual-regression, collect-jobs
specs/                          # spec-driven-development feature specs
.specify/memory/constitution.md # repo principles (Sell-Don't-Tell, No AI Slop, etc.)
```

Workspace boundaries are governed by `.specify/memory/constitution.md` Principle III
(Monorepo Discipline): `apps/web` is the only deployable; `packages/ui` exports raw
TS via `transpilePackages`; `projects/*` are thin wrappers around their own toolchains.

## Run locally

```bash
pnpm install --frozen-lockfile
pnpm dev          # Turborepo dev task graph (Next.js dev server on apps/web)
pnpm lint         # Biome check
pnpm typecheck    # tsc --noEmit across workspaces
pnpm build        # Turborepo build of all apps + packages
pnpm test:visual  # Playwright visual-regression suite
```

## CI

Every push and PR runs:

- `ci.yml`            lint, typecheck, build
- `visual-regression.yml`  Playwright screenshot diff against committed baselines
- `no-ai-slips.yml`   bans the banned-phrase list from `.specify/memory/constitution.md` §V
- `sonar.yml`         SonarCloud static analysis
- `deploy-dokku.yml`  on push to `main`, deploy `apps/web` to Dokku

## License

MIT — see [LICENSE](./LICENSE).

---

## Services

Compliance-grade AI architecture for regulated workloads — async-first, USD-denominated, LATAM-based / EN-fluent. See [blog.home301server.com.br/services](https://blog.home301server.com.br/services/).

## Related

- [`yolo-labz/wa`](https://github.com/yolo-labz/wa) - WhatsApp daemon
- [`yolo-labz/.github`](https://github.com/yolo-labz/.github) - org profile + supply-chain story
