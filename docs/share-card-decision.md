# Decision needed: which sentence does a share of this site carry?

**Status:** **decided 08/11/2026 — Option A**, implemented as below. The rest of this record is the
proposal as filed on 02/11, kept unchanged.

**As implemented (differs from step 1–2 of "If A" on purpose):** the site card *replaces the bytes* of
`.github/og-card.png` instead of adding `.github/og-card-<site>.png`. The portfolio gate
(`.github/workflows/share-card.yml`) pins the policy at a full `.github` SHA and path-filters on
`.github/og-card.png`; a new filename would leave that gate checking the old org copy until the
workflow's pin and path filter are edited too (a hand workflow edit goes over SSH, not the fleet
token; `.github` `docs/merging-workflow-prs.md`). Keeping the path keeps the gate on the file that
actually ships with no workflow change at all. The policy change in `yolo-labz/.github` is therefore an annotation of
the `portfolio` family (it is a site card, re-render it, never copy the org card over it), not a path
change. The card is rendered by `scripts/make-share-card.py`, and `scripts/check-share-card.py` now
also fails when `apps/web/src/app/opengraph-image.png` differs from the declared card.
**Owner of the call:** Pedro (the share-card policy lives in `yolo-labz/.github`, not here).
**Decides:** the image the `portfolio` family is required to serve, and therefore the sentence a share
card shows.

## The observation

The site says one thing; the card it is required to serve says another.

| Where | What it says |
| --- | --- |
| Site `<h1>` (`/en`) | “AI stacks fail their first audit at three seams: prompt provenance, retrieval lineage, output attestation.” |
| Site `<title>` / `og:title` | “Pedro Balbino — Compliance-Grade AI Architect” |
| Site `meta[description]` | “Compliance-grade AI architecture for regulated LATAM & global workloads…” |
| **Served `og:image`** | `https://portfolio.home301server.com.br/opengraph-image.png` → **200**, `image/png`, 90 622 B, sha256 `30918b317993e1ee…` — byte-identical to `.github/og-card.png`, whose copy reads **“yolo-labz · Small tools. Deliberate automation. · Open-source tools for scripting messaging, browser workflows and local services.”** |

Affected URLs: `/en`, `/pt`, `/es`, `/about`, `/thesis` — every page family that resolves the family
card. Project pages are unaffected: they serve their own generated per-slug card.

**What a reader sees today:** pasting any of those URLs into Slack, LinkedIn, X or WhatsApp produces a
card whose large text is the *org* sentence about scripting messaging and browser workflows — a
sentence this site never makes. The mismatch is deliberate (it is what the policy requires and the gate
enforces), which is exactly why it needs a decision rather than a bug fix.

Why it happened: `profile/assets/brand/share-cards.json` in `yolo-labz/.github` maps
`portfolio → yolo-labz/portfolio : .github/og-card.png`, naming the org card. The site's positioning is
the compliance-grade architect line. Both are true statements about the same owner, about different
things.

## Option A — re-point the mapping at a site card (**recommended**)

The `portfolio` family gets its own card, drawn from the site's positioning; the org card stays the
org card.

**Files touched**
- `yolo-labz/portfolio`: new `.github/og-card.html` / `.github/og-card.png` (site sentence, same
  1200×630 frame and Mocha ground) — or a second pair alongside the current one.
- `yolo-labz/.github`: one line in `profile/assets/brand/share-cards.json` (family `image` path, and
  the canonical-card reference if it moves).
- `yolo-labz/portfolio`: `docs/design-canon.md` tension paragraph → becomes a decided rule.

**Cost / risk:** page baselines do **not** change (the card is not rendered in any page; the Playwright
goldens and Lighthouse budgets are untouched). The `share-card` gate keeps passing as long as the
declared file exists at the declared size/mime. One new binary artefact to keep fresh. `brand-positioning.md`
does not move — this option *preserves* the split between org copy and site copy.

## Option B — adopt the org sentence on the site

The site stops calling itself “Compliance-Grade AI Architect” and positions as “open-source tools for
scripting messaging, browser workflows and local services”.

**Files touched:** the site copy in three locales (`apps/web/src/lib/share.ts` title/description, the
home `Hero` messages, `about`/`thesis` intro copy), `DESIGN.md`/`PRODUCT.md` descriptions,
`.github/og-card.png` stays as-is, and the canon's rule 5 is satisfied trivially.

**Cost / risk:** this is a repositioning of the whole site, not a card change. It discards the
differentiating claim (regulated-work auditability) in favour of the org's tool sentence, which the
portfolio content — four decision records from regulated work — no longer matches. It changes the home
hero, so **Playwright baselines and Lighthouse content budgets must be regenerated**, and
`brand-positioning.md` must be updated to say the portfolio shares the org sentence, otherwise the two
documents contradict each other again in a week.

## Recommendation

**Option A.** The site's claim is the stronger, more specific one, and it is the one the content
supports; the org sentence belongs to the org profile and to the six tool repositories it describes.
The policy already supports per-family images, so A is a policy edit plus one artefact, while B is a
site rewrite that also moves visual baselines. B remains coherent — it is simply a bigger decision than
a share card, and if the intent is “the portfolio is the org's shop window”, B is the honest way to say
it, not a card swap.

Precedence, restated so the next reader knows who owns what: **brand-positioning wins what a page
claims, `docs/design-canon.md` wins structure and behaviour, `DESIGN.md` wins how the system is built,
and the share-card policy wins which image ships** — this record asks the policy's owner to change the
fourth, nothing else.

## The exact change each answer implies

**If A:**
1. Add the site card to this repo (`.github/og-card-<site>.png`, 1200×630, text = the site sentence).
2. `share-cards.json`: `{"name":"portfolio","repo":"yolo-labz/portfolio","image":".github/og-card-<site>.png", ...}`.
3. Here: copy it to `apps/web/src/app/opengraph-image.png`, update `SHARE_IMAGE.alt` in
   `apps/web/src/lib/share.ts`, `check-profile.py share-cards` → 0 violations, deploy, re-verify the
   served sha equals the policy file, and rewrite the canon's tension paragraph as a rule.

**If B:**
1. Rewrite the hero/description/positioning copy in `en`/`pt`/`es` to the org sentence.
2. Regenerate Playwright goldens and the Lighthouse content expectations.
3. Update `DESIGN.md`, `PRODUCT.md` and `brand-positioning.md` so all three agree.
4. No card or policy change; the canon's tension paragraph is deleted and rule 5 stands alone.

## One-line ask

> **Share cards for this site: keep the org sentence (do nothing), or give the portfolio family its own site card (Option A)?**
