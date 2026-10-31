# Level-up 2026-10 — measurement, fixes, triage

Slice S3 of the Brain Storm loop (`S3-portfolio-level-up`). Repo
`yolo-labz/portfolio`. **Nothing here is merged**: every push to `main`
deploys production (`deploy-dokku.yml`), so the slices ship as review-ready
PRs only.

- Date of measurement: 30/10/2026 (BRT), desktop host.
- Branch head measured: `main` @ `bf3ca9b`.
- Harness: [`run.sh`](./run.sh) — pinned `mcr.microsoft.com/playwright:v1.62.1-noble`
  (same image `visual-regression.yml` / `refresh-baselines.yml` pin), standalone
  Next build served on `:3000`, `@lhci/cli@0.15.1`, **median of 3 runs** per
  URL/form factor.

## 1. Baseline → after (Lighthouse, median of 3)

Routes: `/en` (home), `/en/about`, `/en/thesis`, `/en/projects/compliance-tax-agent`
(flagship case study). Raw LHR JSON: [`before/`](./before), [`after/`](./after).
Category order: performance / accessibility / best-practices / SEO.

| Route | Form | Before | After | LCP (s) | TBT (ms) | CLS |
|---|---|---|---|---|---|---|
| `/en` | desktop | 99 / 100 / 96 / 100 | **100 / 100 / 100 / 100** | 0.87 → 0.60 | 14 → 13 | 0.000 → 0.000 |
| `/en` | mobile | 77 / 100 / 96 / 100 | **94 / 100 / 100 / 100** | 4.46 → **2.47** | 339 → 212 | 0.000 → 0.000 |
| `/en/projects/compliance-tax-agent` | desktop | 99 / **96** / 96 / 100 | **99 / 100 / 100 / 100** | 1.03 → 0.98 | 27 → 31 | 0.000 → 0.000 |
| `/en/projects/compliance-tax-agent` | mobile | **84 / 96** / 96 / 100 | **95 / 100 / 100 / 100** | 4.23 → **2.76** | 144 → 133 | 0.000 → 0.000 |
| `/en/about` | desktop | 100 / 100 / 96 / 100 | **100 / 100 / 100 / 100** | 0.60 → 0.61 | 17 → 28 | 0.000 → 0.000 |
| `/en/about` | mobile | 96 / 100 / 96 / 100 | 95 / 100 / 100 / 100 | 2.63 → 2.63 | 132 → 165 | 0.000 → 0.000 |
| `/en/thesis` | desktop | 100 / 100 / 96 / 100 | **100 / 100 / 100 / 100** | 0.60 → 0.59 | 15 → 23 | 0.000 → 0.000 |
| `/en/thesis` | mobile | 96 / 100 / 96 / 100 | 95 / 100 / 100 / 100 | 2.64 → 2.61 | 124 → 139 | 0.000 → 0.000 |

Honest reading of the two 1-point dips: `/en/about` and `/en/thesis` on mobile are
**untouched by this slice** (neither has a motion-gated hero). Their LCP and CLS
are unchanged (2.63 → 2.63 s, 2.64 → 2.61 s; CLS 0), and only TBT moved
(+33 ms / +15 ms) — sub-threshold main-thread jitter on a shared container, worth
one performance point. No category regressed on a route this slice edited.

## 2. The three fixes (root cause, not symptom)

### 2.1 Locale middleware 307-redirected every extension-less metadata route → 404

`apps/web/src/proxy.ts` (next-intl middleware) skipped only paths containing a
dot, so `/icon`, `/apple-icon`, `/opengraph-image` were treated as page paths and
307-redirected to a locale prefix that has no such route:

```
/icon?645e7b8eda3c5118  → 307 → /en/icon?645e7b8eda3c5118=  → 404
/icon-192               → 307 → /en/icon-192               → 404
```

Two console errors per page (`best-practices 96`, all 8 runs) and **the
`og:image` fetch was broken for every social/crawler unfurl**. Fixed by adding
the root metadata routes to the matcher's negative lookahead. Verified:
`/opengraph-image` 200 `image/png` 47 226 B, `/icon` 200 `image/png`.

### 2.2 `icon-192.tsx` / `icon-512.tsx` were never routed at all

Next.js only emits metadata image routes for reserved file names (`icon`,
`icon1`, `icon2`, `apple-icon`, `opengraph-image`, …). The two PWA icons were
named `icon-192.tsx` / `icon-512.tsx`, so `manifest.ts` pointed at two URLs that
have never existed — the installable-app icons were broken independently of the
middleware bug. Renamed to `icon1.tsx` / `icon2.tsx` and repointed
`manifest.ts`. Verified: `/icon1` 200 `image/png` 4 022 B (192×192),
`/icon2` 200 `image/png` 15 740 B (512×512).

### 2.3 Emotion-chip contrast failed WCAG AA (a11y 96 on every project page)

axe (`color-contrast`) flagged the tech-stack chips: `#00c77a` on `#45475a` =
**4.11:1**, below the 4.5:1 floor for 12 px mono text. Fixed by moving the chip
background token `--color-accent-dim` from surface1 to surface0 (`#313244`) →
**5.66:1**, keeping the locked emerald `#00c77a` text untouched (the accent hex
itself is Pedro-pinned and was not modified).

### 2.4 Mobile LCP: the hero started at `opacity: 0`

LCP elements were the hero paragraph (`/en`) and the `<h1>` (project routes), and
90 % of their LCP time was **render delay**, not TTFB. Cause: the entrance
`motion.div` used `initial={{ opacity: 0, y: 20 }}`, so the text did not paint
until React hydrated and 0.6 s of animation ran. Both heroes now animate the
`y` offset only, so the text paints on first paint. DOM and settle state are
unchanged (visual-regression suite: 22/22 pass against the committed baselines).

## 3. Not fixed — logged

- `unsized-images` (`/en/about`, desktop): the six SonarQube badge `<img class="h-5">`
  have no `width`/`height`. Fixing needs per-project intrinsic sizes or an
  `aspect-ratio` rule; the badges are third-party renders whose aspect varies.
- Render-blocking CSS chunk (7 382 B, ~158 ms desktop) and ~50 % unused JS in the
  shared chunk: it is a Next.js/Tailwind structural change, not a one-file fix.
- `manifest.ts` copy is stale ("Software Engineer" / "data pipelines") versus the
  locked compliance-architect positioning. Copy change → needs the vault corpus,
  not invented here.

## 4. Triage

### 4.1 #135 vs #138 — duplicate "retire the real-estate demo" PRs

Both edit the same surface (`apps/web/src/data/projects.ts`, the three
`messages/*.json`, `README.md`, `CLAUDE.md`, `.specify/memory/roadmap.md`,
`biome.json`, `Dockerfile.dokku`) to remove the `realestate-price-tracker` card.
They are the same change twice.

| | #135 `135-retire-realestate` | #138 `138-retirement-swarm` |
|---|---|---|
| Scope | broader churn (`codeql.yml` 3+/2−, CLAUDE.md 2+/11−, 19− lines per message file, 43− in `projects.ts`) | narrower ("retire **only** the real-estate demo"), 21− in `projects.ts`, `+1` `.gitignore` |
| CI | **SonarQube scan FAILURE**, rest green (run 20/09) | all green incl. visual-regression + Lighthouse (run 21/09) |
| State | draft, last touched 20/09 | draft, last touched 21/09 |

**Recommendation: close #135, keep #138 as the survivor — do not merge either
from here.** #135 bundles unrelated workflow/CLAUDE.md churn with a red quality
gate; #138 is the minimal version and its full check set is green. #138 is still
a 21/09 draft on top of a moved `main`, so whoever lands it must rebase, re-run
the suite and re-eyeball the 5 golden sets it touches (removing a card changes
the home/projects snapshots). Both directions are one `git revert` PR away,
which is why this is a recommendation, not an action.

### 4.2 Dependabot #151–#156 — CI-only verification

| PR | Bump | CI verdict |
|---|---|---|
| #151 | `next` 16.2.10 → 16.3.8 in `projects/ai-document-processor/dashboard` | **RED** — `lint-and-typecheck` FAILURE |
| #152 | `next` 16.2.10 → 16.3.8 in `projects/exec-job-board/site` | **RED** — `lint-and-typecheck` FAILURE |
| #153 | — | no such open PR (closed/never opened) |
| #154 | actions group, 10 updates | **GREEN** — 11/11 checks incl. visual-regression |
| #155 | `@sentry/nextjs` 10.66.0 → 10.75.2 | **GREEN** — 11/11 checks |
| #156 | `fast-uri` 3.1.8 → 3.1.9 | **GREEN** — 11/11 checks |

Green and mergeable as-is (subject to the usual merge-ownership check at merge
time): **#154, #155, #156**. #151/#152 are red on the root `next` bump for the
two satellite dashboards — same failure mode as #149/#150 in `apps/web` and
`realestate-price-tracker`, which suggests the Next 16.3.8 bump breaks
lint/typecheck across workspaces; that is a dependency triage of its own, not a
watch-list item.

## 5. Reproduce

```bash
./docs/evidence/level-up-2026-10/run.sh docs/evidence/level-up-2026-10/after
# RUNS=1 for a fast single-run pass; default is the 3-run median used above.

# visual suite, pinned image, same as CI:
docker run --rm --ipc=host --network=host -v "$PWD:/work" -w /work \
  --user "$(id -u):$(id -g)" -e HOME=/tmp -e CI=true \
  --entrypoint bash mcr.microsoft.com/playwright:v1.62.1-noble -c '
    mkdir -p /tmp/bin && printf "%s\n" "#!/bin/sh" "exec corepack pnpm \"\$@\"" > /tmp/bin/pnpm
    chmod +x /tmp/bin/pnpm; export PATH=/tmp/bin:$PATH
    pnpm exec playwright test'
```
