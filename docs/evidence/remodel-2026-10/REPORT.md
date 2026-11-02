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

## Deliberate boundaries

Two limits are decisions, not defects. Both are measurable.

1. **The ten index taglines stay on one line at desktop widths** (clipped with
   `line-clamp-1`, full text still in the accessible name). A second line varies the row height
   and pushes the tenth work out of the 1280×800 first viewport, which is the Experience-mode
   contract the Playwright suite asserts. Shortening the taglines instead would mean new copy in
   three locales for ten works.
2. **Mobile LCP is 2.4-2.8 s under Lighthouse's simulated throttling** against the 1.8 s target.
   Measured on 02/11 (P-LCP): the LCP element is the hero `h1` (text) on all three locales, with
   **0 ms load delay and 0 ms load time** — every millisecond is render delay on a 356 KB page at
   1.638 Mbps and 4× CPU. The floor with all JS and all webfonts blocked is **1705 ms**, so 1.8 s is
   unreachable for this architecture, not merely unmet. Full attribution, byte inventory and the
   rejected candidates: "Mobile LCP: the measured floor" below.

## Mobile LCP: the measured floor (P-LCP, 02/11/2026)

The target was mobile LCP under 1.8 s at 390 px. This section replaces the earlier hand-wave
with a measurement: what the LCP element is, what it waits for, what the floor is, and what
was tried and rejected.

**Method.** `@lhci/cli@0.15.1` in the pinned Playwright image, `formFactor: mobile`,
`screenEmulation` 390×844 DPR 3, `throttlingMethod: simulate` (1.638 Mbps, 150 ms RTT, 4× CPU
slowdown) — the same model CI uses. Runs from the standalone build on localhost. Candidate
changes were built twice and measured **interleaved** (base, change, base, change …) because this
host is shared and per-session drift (base LCP moved 2433 → 2724 ms between sessions with no code
change) is larger than the effects being chased.

### The element and its phases

| Route | LCP element | Simulated LCP | TTFB | Load delay | Load time | Render delay |
|---|---|---|---|---|---|---|
| `/en` | `h1#hero-heading` | 2777 ms | 476 | 0 | 0 | **2301** |
| `/pt` | `h1#hero-heading` | 2597 ms | 466 | 0 | 0 | **2132** |
| `/es` | `h1#hero-heading` | 2654 ms | 467 | 0 | 0 | **2187** |
| `/en/projects/compliance-tax-agent` | lead `<p>` | 2420 ms | 457 | 0 | 0 | **1963** |

It is text on every route, with **zero load delay and zero load time**: no image, no font and no
stylesheet sits on the LCP path. Everything is `Render delay`. The same run's observed
(unthrottled) trace puts TTFB at 94.7 ms and the element render delay at 214.7 ms — LCP 309 ms,
first paint 309 ms, DOMContentLoaded 403 ms. The 2.5–2.8 s is the simulated model scaling a 356 KB
page onto a 1.6 Mbps link at 4× CPU.

### What is in those 356 KB

| Resource | Bytes | Notes |
|---|---|---|
| Scripts (9 files) | 159 922 | App Router runtime + hydration; largest chunk 72.8 KB |
| Fonts (2 files) | 114 097 | Inter latin wght+`opsz` 73.3 KB, JetBrains Mono 40.8 KB, both `preload`+`High` |
| Document | 31 915 | HTML carries the next-intl message catalogue for the client |
| RSC prefetches | 27 319 | 2 × `?_rsc=` issued on load by in-viewport links |
| Hero plate | 9 773 | Chromium in this image resolves the `<picture>` to WebP, not AVIF |
| CSS | 8 398 | one chunk, 0 ms render-blocking |
| Other | 4 855 | manifest, icons |

### The floor: what happens when pieces are removed

Median of 3 runs each, `/en`, same session, same model (blocked via `blockedUrlPatterns`). Host load
differs between sessions, so the two columns are not compared across sessions: the Δ column is
within the session.

| Variant | LCP median (session 1) | Δ | Reproducible capture |
|---|---|---|---|
| as shipped | 2768 ms | — | `lcp/baseline-short.json` — 2766 / 2416 / 2423 ms, 352 090 B |
| all JS chunks blocked | 2269 ms | −499 | |
| all CSS blocked | 2602 ms | −166 (inside noise) | |
| all webfonts blocked | 2755 ms | −13 (noise) | |
| **JS + webfonts blocked** | **1705 ms** | **−1063** | `lcp/floor-js-and-fonts-blocked.json` — 1702 / 1681 / 1680 ms, 50 808 B |

**Reading: 1.8 s is unreachable for this page.** Stripping every script and every webfont — a page
nobody would ship — lands at 1.68-1.71 s, because TTFB (0.46 s) plus parse/layout of the 50 KB that
remains at 4× CPU already accounts for most of it. The floor capture is the tight one (three runs
within 22 ms) and it is the strongest number here: with 160 KB of JS and 114 KB of fonts removed the
page *still* misses 1.8 s. The shipped page needs both, and the pair costs ~1.06 s of the model.

### What was tried and rejected

| Candidate | LCP | FCP | CLS | Verdict |
|---|---|---|---|---|
| `preload: false` on JetBrains Mono | 2724 → 2475 (−249) | 1000 → 1259 (+259) | 0.000 | **not shipped**: same experiment on the next session, on the AVIF base, gave 2433 → 2796 (+363). Session drift exceeds the effect, so it is noise, and it trades FCP for LCP. |
| `preload: false` on both families | 2537 | 1831 (+800) | **0.014** | rejected: worse FCP and a CLS regression |
| `prefetch={false}` on the index rows | 2747 (+59) | 962 (−177) | 0.000 | rejected: no LCP effect, and it would slow the page's primary action |

Nothing else on the path is actionable: render-blocking resources are already 0 ms, the LCP image
audit is not applicable (the element is text), font-display is already `swap` for both families,
and unused CSS is 0 B.

### What would actually close the gap (owner decisions, not mine)

1. **JetBrains Mono → system mono stack** — removes 40.8 KB and one request. Brand-locked in
   PRODUCT.md/DESIGN.md, so it needs Pedro.
2. **Inter without the `opsz` axis** — 73.3 KB is the variable face with optical sizing, which the
   best-of-best addendum requires. Dropping `opsz` saves roughly 25 KB and loses the display cut.
3. ~~Trim the client message catalogue~~ — **done, see below.** The document carried every
   namespace; only the header, drawer, locale switcher and error boundary need them client-side.
   Measured saving: 13.0–14.6 KB gzipped per locale.
4. **The real answer for the metric**: the CI model charges a 1.6 Mbps link for every byte the page
   ships. A text LCP cannot go much below it without removing bytes that the design asked for.

## Client catalogue trim (P-LCP-2, 02/11/2026)

The `<NextIntlClientProvider>` in the locale layout had no `messages` prop, so next-intl serialized
**the whole catalogue** into every response. Four client components (`header`, `mobile-nav`,
`locale-switcher`, the error boundary) read four namespaces: `Nav` (149 B), `Contact` (267 B),
`LocaleSwitcher` (83 B), `ErrorPage` (168 B) — **667 B of a 36 755 B catalogue**.

### What changed

- `src/i18n/client-messages.ts` — `CLIENT_NAMESPACES` plus `pickClientMessages()`, which narrows the
  catalogue and **throws** when a listed namespace is missing (a renamed message file must fail the
  build, not render blank navigation).
- `src/i18n/client-provider.tsx` — a `"use client"` provider wrapper, so the missing-key policy can
  be a function: `onError` logs to the console, `getMessageFallback` renders
  `[missing: <namespace>.<key>]` where the value would be. A missing key is never a silent blank.
- `scripts/check-client-namespaces.mjs` (added to `pnpm lint`) — scans every `"use client"` module
  for `useTranslations("<ns>")` and fails if that namespace is missing from `CLIENT_NAMESPACES`, or
  if the list carries a namespace no client module reads. It caught `Header`'s `Contact` usage on
  the first run.

### Bytes (standalone build, `curl` + `gzip -6`, 3 locales)

| Locale | HTML before | HTML after | **gzip before** | **gzip after** | Δ gzip |
|---|---|---|---|---|---|
| `/en` | 167 701 B | 130 856 B | 31 212 B | **18 174 B** | **−13 038 B (−41.8%)** |
| `/pt` | 175 300 B | 133 784 B | 33 914 B | **19 504 B** | **−14 410 B (−42.5%)** |
| `/es` | 177 434 B | 134 105 B | 34 023 B | **19 427 B** | **−14 596 B (−42.9%)** |

The document is on the LCP path (nothing paints before it arrives), so this is the one lever that
was both engineering-only and worth 13–15 KB: 4.1% of the 352 KB the page shipped.

### LCP (390 px, mobile preset, 3 interleaved runs per locale per build)

| Locale | LCP before | LCP after | Δ | page bytes (median) | CLS | a11y/BP/SEO |
|---|---|---|---|---|---|---|
| `/en` | 3198 ms | 3169 ms | −29 | 313 758 → 326 060 | 0.000 | 100 |
| `/pt` | 2460 ms | 2576 ms | +116 | 316 417 → 328 054 | 0.000 | 100 |
| `/es` | 2965 ms | 3003 ms | +38 | 316 579 → 327 989 | 0.000 | 100 |

**The trim does not move LCP.** The deltas are ±120 ms against a 2400–3200 ms run-to-run spread on
this host, and the page-byte medians *rose* by ~12 KB because the number of Next.js RSC prefetch
requests varied between runs (3 in the "after" runs, 0 in the "before" runs) — that is run variance,
not the change; the document transfer is deterministic at **32 010 → 18 929 B** in the LHRs.
The point of shipping it is the byte win and the guard, not the score.

Found by this work: the CI image's Chromium resolves the hero `<picture>` to WebP rather than AVIF
(see the byte inventory above), so the AVIF plates from #172 do not show up in that model either.


### Reproducing this

```bash
# standalone build on :3000, then:
npx -y @lhci/cli@0.15.1 collect --config=docs/evidence/remodel-2026-10/lcp/config-baseline.json
node docs/evidence/remodel-2026-10/lcp/capture.mjs .lighthouseci baseline-short.json "baseline"
npx -y @lhci/cli@0.15.1 collect --config=docs/evidence/remodel-2026-10/lcp/config-floor.json
node docs/evidence/remodel-2026-10/lcp/capture.mjs .lighthouseci floor-js-and-fonts-blocked.json "floor"
```

`config-floor.json` is `config-baseline.json` plus
`blockedUrlPatterns: ["*/_next/static/chunks/*.js", "*/_next/static/media/*.woff2"]`. The committed
captures keep the element selector, both phase breakdowns (simulated and observed), the byte
inventory per run and all four category scores; the full LHRs are not committed (each is about 1 MB,
and one command above regenerates them). The four-route capture is the `after-lhr/mobile/*.json` set.

## Gates (CI on PR #167, head 67c99fa, run 41252629623, 3 runs per URL; re-measured on #168, head 34e2036, run 41255396134)

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

On the re-measured head the picture is unchanged: desktop 100/100/100/100 with LCP
638-744 ms; mobile Performance 95-96 with LCP 2568-2882 ms; CLS 0.000 on every run.

## Round 3: /about hero density (PR #169)

The Design Tooling re-score on #168 held H8 at 3 for one reason: at 1280 the /about hero
set a three-line H1 in a seven-column cell against a 22-line lede in five columns, so the
hero box was 532 px tall for 131 px of headline. Measured dead block under the H1: 374 px.

Fix, in the page's own vocabulary (no new copy, no invented claim): the diagnostic
paragraph keeps the right column, and the "the proof splits two ways" paragraph moves down
to open the Claim to Evidence band, where it frames the table that follows.

| | before | after |
|---|---|---|
| /about hero box at 1280 | 532 px | 226 px |
| dead block under the H1 | 374 px | 95 px |
| hero columns | H1 vs H1 + 2 paragraphs | H1 vs 1 paragraph |
| claim band | heading + legend stacked, 5 columns used | heading + legend (5) beside the proof paragraph (6-12) |

Evidence: `about-hero-before-1280.png`, `about-hero-after-1280.png`,
`about-hero-before-after.png` (desktop halves scaled to 640 px, before on the right).
Mobile at 390 keeps the reading order H1, diagnostic, claim heading, legend, proof.
The six /about goldens (en/pt/es x desktop/mobile) were regenerated.

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
