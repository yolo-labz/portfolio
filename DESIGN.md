---
name: pedro.balbino portfolio
description: Compliance-grade AI architecture, shown as an index of work beside the yolo-labz gremlin at its keyboard.
colors:
  ground: "#1e1e2e"
  ground-raised: "#181825"
  crust: "#11111b"
  surface: "#313244"
  rule: "#45475a"
  overlay: "#6c7086"
  text: "#cdd6f4"
  text-muted: "#a6adc8"
  primary: "#00c77a"
  primary-hover: "#00db8c"
  link: "#89b4fa"
  audit: "#fab387"
  compliance: "#f9e2af"
typography:
  display:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "clamp(1.65rem, 4vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.025em"
  heading:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.33
    letterSpacing: "0.025em"
  data:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  none: "0"
  sm: "2px"
spacing:
  row: "8px"
  group: "24px"
  section: "112px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.ground}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "36px"
  index-row:
    textColor: "{colors.text}"
    borderBottom: "1px solid {colors.rule}"
    minHeight: "44px"
  link:
    textColor: "{colors.link}"
    textDecoration: "underline, 4px offset"
---

# Design

## Overview

The site is a bench, not a résumé. The first viewport is an **index of work**: ten
ruled rows (four anonymized client case files, six yolo-labz repositories) beside the
yolo-labz programming gremlin, rendered from its reproducible Blender model, typing at
its keyboard. Everything after the index persuades: decision records, the open-source
shelf, the engagement ladder, and a close whose action is the e-mail address itself.

Modes per surface: **Experience** for the first viewport and the work index;
**Persuade** for case files, services and contact; **Read** for the case-study pages,
About and Thesis.

The pre-remodel look (dot-grid ground, figure stamps, animated stat counters, cards with
coloured edges, scroll-triggered fades on every section) is retired. It is anti-reference
only; see `docs/evidence/remodel-2026-10/before/`.

## Colors

Catppuccin Mocha, hex-pinned, dark only, with the locked emerald primary. Colour carries
meaning and nothing else:

- **Emerald `#00c77a`**: the one action (Send a brief), the active or hovered index row,
  the outcome line of a decision record.
- **Peach `#fab387`**: the audit trail: "Case file" labels and every *constraint* line.
- **Blue `#89b4fa`**: links that leave the page, "Repository" labels, *decision* lines.
- **Yellow `#f9e2af`**: compliance badges only (reserved).
- **Mauve** exists only inside the gremlin render (pupils, glyphs); never in UI chrome.

Structure is drawn with 1 px rules in `#45475a` on the `#1e1e2e` ground. Services sits on
`#181825` (mantle) as the only raised band. The gremlin plate is exactly `#1e1e2e`, so the
render needs no frame, card or shadow.

Tokens are written in OKLCH (`apps/web/src/app/globals.css`): each is the exact
equivalent of the pinned hex above and round-trips to it. The neutrals carry Mocha's
lavender-blue tint (hue ≈ 280) on purpose; no pure grey exists in the system.
Under `prefers-contrast: more`, muted text takes the body colour and rules take overlay.

## Typography

Inter is a deliberate brand choice, locked in `CLAUDE.md` and the vault identity, not a
default; the detector's `overused-font` rule is waived in `apps/web/.impeccable/config.json`
for that reason. The distinct voice is the split: Inter for text, JetBrains Mono for data: repository names, stacks, the e-mail address,
periods. Inter loads with its `opsz` axis and `font-optical-sizing: auto`, so headings
get the display cut. Sizes come from one fluid modular scale, `text-step-1` … `-6`:
ratio 1.125 at 360 px growing to 1.2 at 1280 px, each a `clamp()`. Use: step-4 index
thesis and section headings, step-5 page titles, step-6 the contact close, step-2
in-page headings, step-1 ledes. Display headings are semibold (600) with tight tracking
(-0.02 to -0.03em) and `text-wrap: balance`; body is 16 px at 1.625 with a 50ch measure (Inter's ch is wide, so ≈ 70 characters per line, enforced globally for `main p`).
Labels are 12 px medium. Tabular figures apply to tables and dates only: Inter's `tnum` also widens punctuation,
which opened gaps around hyphens in prose. Paragraphs use `text-wrap: pretty`.

## Elevation

Flat. No shadows, no glows, no gradients, no blur behind the header (it is opaque
`#1e1e2e` with a bottom rule). Depth comes from the rule grid and the one raised band.

## Components

- **Index row** (signature): subgrid row of name, one-line tagline, kind label and an
  arrow. Hover or keyboard focus turns the name and arrow emerald and draws a 1 px
  emerald rule left-to-right under the row (300 ms, ease-out). Rows are links ≥ 44 px.
- **Decision record**: definition list with three rows, *Constraint* (peach),
  *Decision* (blue), *Outcome* (emerald); text at 50ch.
- **Case-study template** (`components/project/project-detail.tsx`): back link, title +
  tagline, then a 4/8 split: a sticky facts column (kind, metrics, stack in mono, source
  links) and the body (decision record first, then problem, solution, overview), then a
  previous/next walk in index order, then the contact close.
- **Primary action**: emerald fill, `#1e1e2e` text, 2 px radius, header only. Elsewhere
  the action is an underlined link or the large mono address.
- **Icons**: three authored 16 px line arrows (`components/shared/icons.tsx`), 1.5 stroke,
  round caps, `currentColor`. No text glyph stands in for an icon.

## States

Focus is designed, not default: a 2 px emerald ring, 3 px offset, 2 px radius, on every
focusable element, and links also light their underline. The 404 is localized, says
what happened in one line, and lists all ten works; the error page offers retry and the
index. Layout shift is zero: images carry dimensions, fonts are self-hosted with
fallback metrics, and the only entrance animates transform and clip-path.

## Motion

One authored moment: on first paint the index rows type themselves in, each row wiping
from the left (`clip-path`) with a 6 px rise, staggered 45 ms, 520 ms, expo-out. Rows are
visible by default (no opacity start), the animation is pure CSS (no client JS on the LCP
path), and under `prefers-reduced-motion: reduce` it is not applied at all. The mobile
drawer is the only Motion (JS) animation and runs under `MotionConfig reducedMotion="user"`.
Cross-document view transitions (`@view-transition`) cross-fade full navigations in
browsers that support them, 180 ms, off under reduced motion. Client-side route changes
are not transitioned yet: React's `<ViewTransition>` is canary-only in 19.2.

## Imagery

Only renders from `yolo-labz/.github` `model/` (`params.json` is the source of truth).
Shipped: `apps/web/public/brand/gremlin-hero-{804,402}.webp`, cropped from
`gremlin-hero.png` (sha256 `e2b29966…95eb`, byte-identical across two `make model`
runs on 31/10/2026). Provenance and the regeneration recipe: `apps/web/public/brand/README.md`.
Never generated lettering, never a new pose, never a filter or glow on the render.

## Do's and Don'ts

### Do:

- Put work on screen before any self-description.
- Link every claim to a repository or a decision record.
- Keep all three locales (en, pt, es) in step in the same change.

### Don't:

- Don't reintroduce stat counters, figure stamps, dot grids, side-stripe cards or
  scroll-fade on every section.
- Don't use mauve in UI chrome or revert the emerald primary.
- Don't invent metrics, logos, testimonials or adoption numbers.
