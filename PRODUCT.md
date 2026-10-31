# Product

<!-- impeccable:product-schema 1 -->

> Written 31/10/2026 by the Brain Storm D2 design seat. No interview channel was
> available in that session, so every fact below is **inferred from the repository
> and the D2 brief** (marked _inferred_) or **copied from a locked source** (marked
> _locked_, with its path). Correct any inferred line in place.

## Platform

web

## Users

- **Primary** _(inferred)_: an engineering lead or technical founder at a company
  running AI on regulated data (banking, tax, legal, education) who has to decide
  whether to bring in an outside architect. They arrive from a link, a profile or a
  repository, usually on a laptop, sometimes on a phone, and spend minutes, not hours.
  Their job: judge from evidence whether this person can design an AI system that
  survives an audit, then make contact.
- **Secondary** _(inferred)_: an engineer evaluating the yolo-labz open-source tools,
  who wants the repository, its boundary and its licence fast.

## Product Purpose

A personal portfolio that sells contract architecture work by showing the work.
Success: a qualified visitor reads one case study or one repository and sends a brief
to `pedrobalbino@proton.me`. _(locked: CLAUDE.md, Content Guidelines)_

## Positioning

**Compliance-Grade AI Architect for regulated LATAM & global workloads**: production
RAG, agent systems and MCP integrations whose audit trail, decision provenance and
cost ceiling are designed in. _(locked 06/05/2026, re-aligned 31/05/2026; copy comes
verbatim from the vault corpus `2. Areas/👷 Work/brand-identity/sales-positioning/`
`08-applied-about.md` + `07-applied-headlines.md`, never regenerated)_

The mechanism a neighbour cannot copy: every claim on the site links to a public
repository or to an anonymized decision record (constraint, decision, outcome).

## Operating Context

- Live at `portfolio.home301server.com.br`; every merge to `main` deploys (Dokku).
- Three locales with full parity: `en`, `pt`, `es` (next-intl, `localePrefix: always`).
- Client work is anonymized: no employer or client names, enforced by
  `.github/workflows/no-ai-slips.yml`.

## Capabilities and Constraints

- Static Next.js 16 site, typed content constants (`apps/web/src/data/`) plus
  message catalogs (`apps/web/messages/*.json`). No CMS, no database.
- Routes: `/[locale]`, `/[locale]/about`, `/[locale]/thesis`,
  `/[locale]/projects/[slug]`.
- CI gates: lint (biome + voice-lint + retirement), typecheck, build, Playwright
  `toHaveScreenshot` in the pinned image, Lighthouse budgets (a11y/BP/SEO ≥ 0.95),
  stealth terms, SonarQube, CodeQL.

## Brand Commitments

- Visual identity _(locked, CLAUDE.md)_: Catppuccin Mocha, hex-pinned, dark only;
  primary accent **emerald `#00c77a`** (never revert to mauve); peach `#fab387` =
  audit, yellow `#f9e2af` = compliance, blue `#89b4fa` = links; no gradients, no glows.
- Type _(locked)_: Inter (text) and JetBrains Mono (code, data, repository paths).
- The yolo-labz **programming gremlin** is the org mascot. Its renders come only from
  the reproducible model in `yolo-labz/.github` `model/` (`params.json` is the source
  of truth); never generated lettering, never a new pose.
- Voice: capability-first, never autobiographical; no availability or hiring-pitch
  framing; no em-dash in prose strings (`scripts/voice-lint.mjs`).

## Evidence on Hand

- Six yolo-labz flagship repositories with audited one-liners and qualifiers
  (`yolo-labz/.github` `docs/brand-positioning.md`, 28/09/2026).
- Four anonymized client case studies with constraint / decision / outcome records,
  plus the `ai-document-processor` demo (`apps/web/src/data/projects.ts`).
- Lighthouse baseline: `docs/evidence/level-up-2026-10/`.
- **Absent, never to be fabricated**: testimonials, client logos, adoption or star
  counts as proof, latency numbers for kokoro-speakd, any SLSA level, Sigstore or
  notarization claim (all marked unsupported or needs-measurement in the brand corpus).

## Product Principles

1. Proof before pitch: the work is on screen before any self-description.
2. Every claim resolves to a link or a decision record; unsupported claims are cut,
   not softened.
3. One action: send a brief. Everything else is reading.
4. Locale parity: no surface ships in one language only.

## Accessibility & Inclusion

WCAG 2.2 AA: text contrast ≥ 4.5:1, 44 px targets for primary links, visible focus,
320 px reflow without horizontal scroll, `prefers-reduced-motion` honoured, Lighthouse
accessibility 100 on the gated routes.
