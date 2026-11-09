# Design canon — how a design decision is settled here

This is an arbitration document, not a style guide. It exists because the same questions get
re-litigated: *should the home page lead with an essay? is this a card? where does the node go? is the
share image the generated one or the file?* Each rule below **has already settled a real argument in
this repository**, and each one names what would violate it, so a review can point at a rule instead
of an opinion.

`DESIGN.md` records the system as built (colour, type, grid, motion). This file records the
**decisions that outrank taste**, and the gate that enforces each one. If the two ever disagree, this
file wins and `DESIGN.md` is corrected in the same PR.

To add a rule: bring the argument it settled, the file or route that gets it right, and a failing
example. A rule with no failing example is decoration and does not belong here.

## Structure

### 1. An index page is a register, not an essay

The index exists to list the work; a thesis may open it in **one** paragraph, never three.
**Why:** a reader who lands on an index wants the entries, and the register is the design's own claim.
**Right:** `apps/web/src/components/home/work-index.tsx` — one lede sentence, then `SELECTED WRITING`.
**Violates:** the 02/11 home, where the first entry started at ~735 px on an 844 px phone because two
extra paragraphs of positioning copy sat above the register (blog#196).

### 2. No cards

Depth comes from 1 px rules and one tonal band. A filled, inset, rounded block around a single entry
is a card whatever it is called.
**Why:** the system's authority comes from type and rules; panels are the generic template answer.
**Right:** `apps/web/src/components/home/case-files.tsx` — hairline rows, one raised band for services.
**Violates:** the 02/11 lead entry: a mantle-filled panel with an 8 px radius that also failed to line
up with the section rule above it (blog#196), and six `border-l-2` cards on the pre-remodel portfolio.

### 3. One wayfinding device: the mauve node on a quiet rail

The node marks position; the rail is what it sits on. Never two devices, never a node without its rail.
**Why:** a single device is learnable; a floating dot reads as a bullet or a typo.
**Right:** the case-study `CONTENTS` rail (`nav.post-rail`, hollow nodes inline before each `h2`).
**Violates:** the 02/11 article, where the h1's node hung in empty space at ≥1440 and the node vanished
entirely at 390 — the device behaved three different ways on three page types (blog#196).

### 4. A register row's meta is one line, separators trailing, and never crosses the rail

Date, reading time and category share one line; the separator belongs to the item that follows.
**Why:** meta that wraps mid-row produces a line that begins with "·" and reads as a mistake.
**Right:** `.lead-meta` in the blog's `20-index.css`, sitting in the title's column beside the rail.
**Violates:** the 02/11 1440 render where the meta straddled the rail and the node landed on the
reading time, producing `● min` (blog#196).

## Share surface

### 5. The share surface is one artefact

The image the site serves is the image the policy declares — byte for byte — and its URL must resolve.
**Why:** the card is the brand seen by people who never open the site; two artefacts drift silently,
and a 404 renders no image at all.
**Right:** `apps/web/src/app/opengraph-image.png` = `.github/og-card.png` (sha256 `b5716757…`), served
at `/opengraph-image.png`; policy in `yolo-labz/.github` `profile/assets/brand/share-cards.json`;
`scripts/check-share-card.py` fails when the two files differ.
**Violates:** a `next/og` card that images something the declared file does not (02/11), or pointing
`og:image` at an extensionless URL that returns 404 (portfolio#184 → #185).

### 6. Every page family ships the large card, its alt, a canonical and hreflang

Not just the pages with a custom generator.
**Why:** home, about and thesis are the shared pages; missing metadata is invisible until someone
pastes a link.
**Right:** `apps/web/src/lib/share.ts` → `pageMeta()`, used by the locale layout, `about`, `thesis`
and the project page.
**Violates:** 02/11 live head: `og:title`/`og:description` with **no** `og:image` and
`twitter:card=summary` on all three locales and `/about`; `link[rel=canonical]` null everywhere
(portfolio#182).

## Interaction

### 7. Interactive targets are 24×24 honestly

Size or padding makes the target, not the spacing around it.
**Why:** the WCAG 2.5.8 spacing exception is a legal minimum, not a design; 17 px-tall nav links are
hard to hit on a touchscreen.
**Right:** `apps/web/src/components/layout/header.tsx` — `inline-flex min-h-6 items-center` on every
header link, inside the unchanged 56 px masthead.
**Violates:** 02/11 live measurement of `Projects 54×17`, `Services 57×17`, `Thesis 44×17`,
`About 39×17` (portfolio#176).

## Claims about quality

### 8. Brand art comes from published brand files, never from type

Art is published by `yolo-labz/.github`: the hero is the adopted GPT master (08/11/2026,
`profile/assets/brand/hero/`), cards come from `model/`; generated lettering is not brand art.
**Why:** the gremlin is reproducible and provenance-tracked; a card drawn with text by hand has
neither provenance nor a way back to the source.
**Right:** `scripts/make-share-card.py` — the published plate plus typeset site copy → `og-card.png`,
and the AVIF plates in `apps/web/public/brand/`.
**Right:** `.github/og-card.render.*` → `og-card.png`, and the hero files in
`apps/web/public/brand/` copied byte-for-byte from `hero/manifest.json`.
**Violates:** replacing a published card with a `next/og` composition (02/11, reverted in #184).

### 9. A quality claim needs a sample, not an anecdote

Performance and stability claims carry N, the distribution, and a bound. Rare-and-bounded is a valid
closing state; "fixed" after six clean loads is not.
**Why:** the alternative is patching typography to chase noise, or declaring victory on one good run.
**Right:** `docs/evidence/` — the CLS record (1 shift in 10 loads before, 0 in 36 after, ≤ 9.5 % upper
bound at ~3 px of travel) and the mobile-LCP floor measurement.
**Violates:** closing a one-in-ten 0.0037 shift as eliminated, or shipping a `font-display` change with
no named shifting element.

## What wins when documents disagree

| Question | Authority | Enforced by |
| --- | --- | --- |
| What a page claims, and how the org is positioned | `yolo-labz/.github` `docs/brand-positioning.md` | `check-profile` (claims, share cards, a11y alt) |
| The site's own category (*Compliance-Grade AI Architect*) | `.specify/memory/constitution.md` + the vault corpus ([`positioning-decision.md`](./positioning-decision.md), option C) | review (constitution Principle I) |
| How a page is structured, and how it behaves | this file | review + the gates below |
| How the system is built (colour, type, grid, motion) | `DESIGN.md` | `check-design-tokens`, review |
| Which image the share card must be | `share-cards.json` policy | `check-profile.py share-cards` → 0 violations |

**Share card, decided 08/11/2026 (Option A of [`docs/share-card-decision.md`](./share-card-decision.md)):**
this site ships its **own** card — the site's sentence (name, *Compliance-Grade AI Architect*, the home
`<h1>`) on the brand frame — not the org card. The policy still owns which file ships
(`share-cards.json` → `.github/og-card.png`); this repository owns what that file says. Never copy the
org card over it: when the org card moves and the staleness rule fires, re-render with
`scripts/make-share-card.py`.

## Gate map

| Rule | Gate | Command |
| --- | --- | --- |
| 1, 2, 4 | none automatic — review | cite the rule in the PR |
| 3 | visual regression | `playwright toHaveScreenshot` |
| 5, 8 | share-card | `python3 scripts/check-profile.py share-cards` (0 violations) |
| 6 | build + review | live head check on a deploy |
| 7 | accessibility | `lighthouse + a11y budgets` (axe `target-size`) |
| 9 | none automatic — evidence in `docs/evidence/` | — |
