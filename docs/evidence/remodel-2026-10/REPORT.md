# Portfolio remodel (D2), 31/10/2026: evidence

Brief: Brain Storm `loop/briefs/D2-portfolio-remodel.md`. Toolkit: Impeccable 4.7.0
(`context` → init `PRODUCT.md` → surface brief → build → `detect` → `document`
`DESIGN.md`). Unattended seat run: the decision round could not be answered, so the
composition was chosen by the seat and recorded in
`apps/web/.impeccable/surfaces/src-app-locale-page-tsx.md` (seed:9d9c0d6fa070bfc6).

Direction round (best-of-best addendum): three candidates rendered and scored in
[`directions.md`](directions.md); C1 "Bench index" won 26/32 against 22 and 22.

## What changed

| Surface | Mode | Before | After |
|---|---|---|---|
| Home first viewport | Experience | eyebrow, headline, paragraph, 4 animated stat counters (incl. unsupported "SLSA L2 · Sigstore-signed") | headline + the ten-row work index (4 case files, 6 repos) beside the gremlin render; all ten rows inside 1280×800 (asserted) |
| Case files | Persuade | proof band + card grid | four decision records: constraint / outcome, verbatim from the locked case data |
| Open-source shelf | Persuade | bordered cards | ruled 2×2 shelf; same four repos, same keyboard disclosure |
| Services, contact | Persuade | cards + fade-ins | ruled ladder; the close's action is the address itself |
| Case-study template | Read | single column, fig stamps | facts column (sticky) + decision record first, prev/next walk in index order, contact close |
| About | Read | pills, cards | ruled claim table, experience + skills as ruled records, contact close |
| Header, footer | n/a | blurred translucent bar, "Contact" link | opaque bar, emerald "Send a brief"; footer with claim map + address |

Removed: `HeroMetrics`, `ProofBand`, `ProjectShowcase`, `FigStamp`, `AnimatedCounter`,
`useIntersection`, `useReducedMotion`, the dot-grid ground, scroll-fade on every section.
Claim truth (brand-positioning.md): the About summary no longer calls the six repos
"Sigstore-signed Claude Code plugins" (en/pt/es).

Screens: `before-shots/` are the `origin/main` Playwright goldens; `after-shots/` the
regenerated goldens (same pinned image). First viewport side by side:
`first-viewport-before-after.png`, `first-viewport-mobile-before-after.png`.

## Lighthouse, local and relative only (median of 3, same loaded host, same session)

`run.sh` builds the standalone bundle in `mcr.microsoft.com/playwright:v1.62.1-noble`.
Before = `origin/main` @ `28df28a` (`before-lhr/`); after = this branch (`after-lhr/`).
The host load average was 60 to 157 during both runs, so absolute Performance scores
are depressed and noisy; compare the pairs, not the level.

| Form | Route | Perf | A11y | BP | SEO | LCP ms | TBT ms | CLS |
|---|---|---|---|---|---|---|---|---|
| desktop | /en | 69 → 78 | 100 → 100 | 100 → 100 | 100 → 100 | 1081 → 826 | 651 → 447 | 0.000 → 0.000 |
| desktop | /en/about | 83 → 100 | 100 → 100 | 100 → 100 | 100 → 100 | 563 → 574 | 374 → 54 | 0.000 → 0.000 |
| desktop | /en/thesis | 100 → 100 | 100 → 100 | 100 → 100 | 100 → 100 | 564 → 583 | 56 → 20 | 0.000 → 0.000 |
| desktop | /en/projects/compliance-tax-agent | 99 → 93 | 100 → 100 | 100 → 100 | 100 → 100 | 945 → 515 | 75 → 160 | 0.000 → 0.000 |
| mobile | /en | 71 → 81 | 100 → 100 | 100 → 100 | 100 → 100 | 2277 → 2628 | 1903 → 626 | 0.000 → 0.000 |
| mobile | /en/about | 76 → 81 | 100 → 100 | 100 → 100 | 100 → 100 | 2674 → 2704 | 908 → 625 | 0.000 → 0.000 |
| mobile | /en/thesis | 66 → 68 | 100 → 100 | 100 → 100 | 100 → 100 | 2765 → 3744 | 2028 → 986 | 0.054 → 0.000 |
| mobile | /en/projects/compliance-tax-agent | 68 → 83 | 100 → 100 | 100 → 100 | 100 → 100 | 2580 → 2616 | 3151 → 530 | 0.000 → 0.000 |

Accessibility, Best Practices and SEO hold at 100 on every route and form factor. Total
blocking time falls on 7 of 8 pairs (the client stat counters and section fade-ins are
gone); the home page gains about 54 KB of WebP for the render.

## Craft layer (best-of-best addendum)

- OKLCH tokens, exact round-trips of the pinned hex values; tinted neutrals (hue ≈ 280).
- Fluid modular scale `text-step-1…6` (`clamp()`, ratio 1.125 → 1.2); Inter `opsz` axis
  with `font-optical-sizing: auto`.
- `prefers-reduced-motion` (entrance removed, drawer via `MotionConfig`) and
  `prefers-contrast: more` (muted → body colour, rules → overlay), both asserted in tests.
- Designed focus ring; localized 404 listing all ten works; localized error page.
- Cross-document view transitions; client-side route transitions wait for a stable
  React `<ViewTransition>` (marked `ponytail:` in `globals.css`).
- Favicon mark moved off its gradient and off-palette colours onto emerald on base.

## Gates (CI on PR #167, head 67c99fa, run 41252629623, 3 runs per URL)

| Template | Desktop P/A/BP/SEO | Mobile P/A/BP/SEO (median) | Mobile LCP (3 runs) | CLS max |
|---|---|---|---|---|
| /en | **100/100/100/100** ×3 | 94/100/100/100 | 2728, 2887, 2902 ms | 0 |
| /en/about | **100/100/100/100** ×3 | 95/100/100/100 | 2715, 2731, 2901 ms | 0 |
| /en/thesis | **100/100/100/100** ×3 | 98/100/100/100 | 2417, 2437, 2719 ms | 0 |
| /en/projects/compliance-tax-agent | **100/100/100/100** ×3 | 98/100/100/100 | 2419, 2432, 2717 ms | 0 |

- **Lighthouse 100×4: met on desktop for all four templates, every run.** In CI,
  accessibility, best practices and SEO fail the build below 100 on both form factors,
  and CLS fails it above 0.02.
- **axe: 0.** `axe.mjs` ran axe-core 4.14.0 with all WCAG 2.0-2.2 A/AA rules plus
  best-practice over 8 routes at desktop and mobile widths. On the way it fixed pt/es
  shelf links whose accessible name did not contain the visible label.
- **Impeccable detector: 0** (`detect --json apps/web/src`). The brand-locked Inter
  `overused-font` finding is waived in config, with the reason in DESIGN.md.
- **CLS: 0.000** on every run.
- **Mobile LCP < 1.8 s: not met (2.4-2.9 s). Measured reason:**
  - In the observed trace, first paint and LCP are the same frame at **158 ms**. The h1
    paints with everything else; nothing is late on the device.
  - The 2.4-2.9 s comes from Lighthouse's *simulated* throttling (lantern):
    - At 1.47 Mbps with a 4× CPU slowdown, lantern charges LCP with every request
      started before the observed paint.
    - On /en those requests total about 360 KB: document 32, CSS 8, fonts 114, render 10
      and Next/React JS 196. That alone is about 2 s of transfer, plus TTFB.
  - This PR cut that JS from ≈ 259 KB to ≈ 196 KB gzip:
    - `motion/react` left the bundle; the drawer now animates in CSS.
    - The Sentry browser SDK loads only when a DSN is baked into the build, and none is in prod.
    - Effect on mobile Performance: from 86-96 to 94-98. Effect on TBT: from 400-1000 ms to 42-133 ms.
  - Reaching 1.8 s under lantern would mean shipping under about 220 KB before first
    paint. That means no client React on these pages, an architecture change outside
    this brief.
  - The remaining mobile Performance points (2-6) have the same cause.
  - Inter's `opsz` axis (the optical-sizing requirement) costs about 25 KB of that
    budget (≈ 0.14 s simulated). It is kept by choice.

## Independent critique (Design Tooling seat wT:pC, advisory)

[PR #167 comment](https://github.com/yolo-labz/portfolio/pull/167#issuecomment-6550216157):
0 slop, Nielsen 23/32 against a live baseline of 20/32 (the seat's own score was 26/32).
The responses:

| Finding | Response |
|---|---|
| `max-w-[65ch]` measured 86-88 characters | One global measure: `main p, main dd, .list-disc > li` at 50ch, with the same value in the classes. Re-measured at 1280 on /en, the case study, /about and /thesis: no prose block exceeds 75 characters (`main p` max 72). |
| Case-study column overflow | The facts column was already `lg:sticky lg:top-24`. Verified: after a 1200px scroll it holds at y = 96. The static first-viewport rule flags the long right column by design; the decision record is the first thing in it. |
| Hyphen gaps | Confirmed and caused by this PR: global `tabular-nums` made Inter swap punctuation to tabular widths. Now scoped to `table, time`; the mobile render shows normal hyphens. |
| `overused-font` (Inter) | Waived as `ignoreValues` in `.impeccable/config.json`, with the reason recorded in DESIGN.md (brand-locked). |
| Stragglers | `p { text-wrap: pretty }`. |
| Target size under 24px | Locale buttons and Sonar badge links now have `min-h-6` (and `min-w-6`). |
| Mascot vs. thesis | Answered in `directions.md`. |

Post-merge follow-up (PR #168, from the live critique):
- The case-file sidebar is the sticky grid item (`lg:sticky lg:top-20 lg:self-start`).
- `text-wrap: pretty` now also covers `dd` and `li`.
- The Inter ignore moved to the repo-root `.impeccable/config.json`.
- The /about "Code quality" section is removed. All six SonarQube projects exist but are
  **private** (checked through `api/projects/search`), so every badge rendered "Project has
  not been found", and the copy's "the dashboard is public" was false. To restore it, make
  the projects public in Sonar, then revert this hunk.

 `/<locale>/<unknown>` returns status 404 but the
HTML is Next's `__next_error__` shell, and the localized 404 renders only after
hydration. It is the same on `origin/main` (checked against the main build), so it is
not a regression of this change.

## Acceptance (31/10/2026)

| Command | Exit |
|---|---|
| `pnpm lint` (biome + voice-lint + retirement) | 0 |
| `pnpm typecheck` | 0 |
| `pnpm --filter @portfolio/web build` | 0 |
| `pnpm exec playwright test` (all passed, none skipped; CI `playwright toHaveScreenshot` green) | 0 |
| `impeccable detect --json apps/web/src` → `[]` | 0 |
| `axe.mjs` → `AXE_TOTAL=0` | 0 |
| CI on PR #167: 10/10 checks pass | 0 |
| `docs/evidence/remodel-2026-10/run.sh` (both trees) | 0 |

New executable checks (`tests/visual/portfolio.spec.ts`): first viewport holds all ten
index rows and the render with non-empty alt, rows ≥ 44 px; reduced motion removes the
index entrance (`animation-name: none`); localized 404 per locale (status 404, ten work
links); `prefers-contrast: more` raises muted text; the mobile drawer opens as a modal
dialog with focus inside and closes on Escape with focus returned.
