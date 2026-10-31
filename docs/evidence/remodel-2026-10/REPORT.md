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

## Lighthouse (median of 3, same host, same session)

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

## Gates

| Gate | Result |
|---|---|
| Lighthouse 100/100/100/100 | CI (`lighthouse.yml`) now asserts a11y, BP and SEO at 1.0 as errors, CLS ≤ 0.02 as an error and Performance at 1.0 as a warning on the four redesigned templates. Local numbers above were taken on a host at load 60-157, so the CI run on the PR is the measurement of record. |
| axe 0 | `axe.mjs`, axe-core 4.14.0, all WCAG 2.0-2.2 A/AA rules + best-practice, 8 routes × desktop and mobile: **0 violations** (`AXE_TOTAL=0`). Fixed on the way: pt/es shelf links whose accessible name did not contain the visible label. |
| Impeccable detector | `detect --json apps/web/src` → **0 findings** |
| CLS | 0.000 on every route and form factor in the Lighthouse pairs above |
| Mobile LCP < 1.8 s | Not met locally (≈ 2.6 s under 4× CPU throttle on the loaded host); see CI. |

Adjacent debt found, not fixed here: `/<locale>/<unknown>` returns status 404 but the
HTML is Next's `__next_error__` shell, and the localized 404 renders only after
hydration. It is the same on `origin/main` (checked against the main build), so it is
not a regression of this change.

## Acceptance (31/10/2026)

| Command | Exit |
|---|---|
| `pnpm lint` (biome + voice-lint + retirement) | 0 |
| `pnpm typecheck` | 0 |
| `pnpm --filter @portfolio/web build` | 0 |
| `pnpm exec playwright test` (49 passed, 1 skipped: desktop-only contract on mobile) | 0 |
| `impeccable detect --json src/components src/app` → `[]` | 0 |
| `docs/evidence/remodel-2026-10/run.sh` (both trees) | 0 |

New executable checks (`tests/visual/portfolio.spec.ts`): first viewport holds all ten
index rows and the render with non-empty alt, rows ≥ 44 px; reduced motion removes the
index entrance (`animation-name: none`).
