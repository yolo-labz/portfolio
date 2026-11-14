# Design canon

The design system is one source for the org: tokens, the written pages (colour, type, spacing, components,
the mark, voice) and the nine page rules that used to live here. It lives in
[`yolo-labz/.github` `design/`](https://github.com/yolo-labz/.github/tree/main/design); read
[`design/docs/components.md`](https://github.com/yolo-labz/.github/blob/main/design/docs/components.md) for the rules,
each with its failing example.

This repository vendors the generated tokens in `apps/web/src/design/` (`design-source.json` records the revision)
and `scripts/check-design-tokens.mjs` fails `pnpm lint` when the copy differs from the source or a colour is
written by hand. To change a token, change it in `.github`, then run `node scripts/check-design-tokens.mjs --vendor <rev>` here.

## Where each rule is done right in this repository

| Rule | Example here |
| --- | --- |
| 1 An index is a register | `apps/web/src/components/home/work-index.tsx` |
| 2 No cards | `apps/web/src/components/home/case-files.tsx` |
| 3 One wayfinding device | the case-study `CONTENTS` rail |
| 5 One share artefact | `apps/web/src/app/opengraph-image.png` = `.github/og-card.png`, checked by `scripts/check-share-card.py` |
| 6 Every page family ships the card | `apps/web/src/lib/share.ts` `pageMeta()` |
| 7 Targets are honest | `apps/web/src/components/layout/header.tsx` |
| 8 Brand art from the brand files | `scripts/make-share-card.py`, `apps/web/public/brand/` |
| 9 A quality claim needs a sample | `docs/evidence/` (CLS record, mobile LCP floor) |

## What wins when documents disagree

| Question | Authority | Enforced by |
| --- | --- | --- |
| What a page claims, how the org is positioned | `yolo-labz/.github` `docs/brand-positioning.md` | `check-profile` |
| The site's own category (*Compliance-Grade AI Architect*) | `.specify/memory/constitution.md` and [`positioning-decision.md`](./positioning-decision.md) | review |
| Tokens and the page rules | `yolo-labz/.github` `design/` | `check-design-tokens.mjs`, review |
| What this site's file says about itself | `DESIGN.md` | review |
| Which image the share card must be | `share-cards.json` policy | `check-profile.py share-cards` |

**Share card, decided 08/11/2026** ([`share-card-decision.md`](./share-card-decision.md), option A): this site ships its
own card, the site's sentence on the brand frame, not the org card. The policy owns which file ships; this repository
owns what that file says. When the org card moves and the staleness rule fires, re-render with `scripts/make-share-card.py`.
