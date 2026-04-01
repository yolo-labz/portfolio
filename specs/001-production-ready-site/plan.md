# Implementation Plan: Production-Ready Portfolio Site

**Branch**: `001-production-ready-site` | **Date**: 2026-03-31 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-production-ready-site/spec.md`

## Summary

Make the portfolio site deployable by adding error pages, favicons, OG images, SEO metadata, mobile navigation, accessibility improvements, and structured data. All changes are within `apps/web/`. No new dependencies. No data model changes. Target: Lighthouse 95+ on all four scores.

## Technical Context

**Language/Version**: TypeScript 6.0.2, React 19.2.4
**Primary Dependencies**: Next.js 16.2.1, Tailwind CSS 4.2.2, Motion 12.38.0
**Storage**: N/A (static site, no database)
**Testing**: Manual verification (Lighthouse, keyboard nav, viewport testing)
**Target Platform**: Static web, deployed to Vercel
**Project Type**: Web application (static portfolio)
**Performance Goals**: Lighthouse 95+ on all four scores, LCP < 2.5s, CLS < 0.1
**Constraints**: No new runtime dependencies, no CMS, no client-side API calls
**Scale/Scope**: 8 routes (1 homepage + 5 project pages + 404 + error)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Sell, Don't Tell | ✅ PASS | 404 page guides visitors back to projects. OG images present brand. JSON-LD helps search visibility. |
| II. Static-First | ✅ PASS | All new files are statically generated (OG images at build time, sitemap from data constants, no runtime fetching). |
| III. Monorepo Discipline | ✅ PASS | All changes within `apps/web/`. No changes to `packages/ui` or `projects/*`. Build/lint/typecheck will pass. |
| IV. Visual Polish | ✅ PASS | Mobile nav uses Motion animations with reduced-motion support. Focus outlines use accent color. Lighthouse 95+ target enforced. |
| V. No AI Slop | ✅ PASS | 404 copy is terse and functional ("This page doesn't exist"). No filler text. |
| VI. Mixed-Stack Autonomy | ✅ PASS | N/A — no changes to project stubs. |

**Gate result**: PASS — proceed to implementation.

## Project Structure

### Documentation (this feature)

```text
specs/001-production-ready-site/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: technical decisions
├── data-model.md        # Phase 1: file inventory + schemas
├── quickstart.md        # Phase 1: verification guide
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (files to create or modify)

```text
apps/web/
├── public/
│   └── resume.pdf                          # NEW: placeholder resume
├── src/app/
│   ├── not-found.tsx                       # NEW: custom 404
│   ├── error.tsx                           # NEW: error boundary
│   ├── robots.ts                           # NEW: robots.txt
│   ├── sitemap.ts                          # NEW: sitemap.xml
│   ├── manifest.ts                         # NEW: web manifest
│   ├── favicon.ico                         # NEW: legacy favicon
│   ├── icon.tsx                            # NEW: SVG favicon
│   ├── apple-icon.tsx                      # NEW: Apple touch icon
│   ├── opengraph-image.tsx                 # NEW: global OG image
│   ├── layout.tsx                          # MODIFY: skip-to-content, JSON-LD, theme-color, main wrapper
│   ├── page.tsx                            # NO CHANGE
│   ├── globals.css                         # MODIFY: :focus-visible style
│   └── projects/[slug]/
│       ├── page.tsx                        # MODIFY: add CreativeWork JSON-LD
│       └── opengraph-image.tsx             # NEW: per-project OG image
├── src/components/
│   ├── layout/
│   │   ├── header.tsx                      # MODIFY: hide desktop nav on mobile, add MobileNav
│   │   ├── mobile-nav.tsx                  # NEW: hamburger + drawer
│   │   └── footer.tsx                      # NO CHANGE
│   ├── sections/
│   │   ├── hero-metrics.tsx                # MODIFY: add aria-labelledby
│   │   ├── project-showcase.tsx            # MODIFY: add aria-labelledby
│   │   ├── skills-matrix.tsx               # MODIFY: add aria-labelledby
│   │   ├── experience-timeline.tsx         # MODIFY: add aria-labelledby
│   │   └── contact-cta.tsx                 # MODIFY: add aria-labelledby
│   └── project/
│       └── project-detail.tsx              # NO CHANGE
└── src/lib/
    └── constants.ts                        # NEW: SITE_URL constant
```

**Structure Decision**: All changes are within the existing `apps/web/` Next.js application. No new workspace packages. New files follow Next.js App Router conventions (metadata routes, file-based icons, special files).

## Implementation Order

### Step 1: Infrastructure (env var, constants, focus styles)

**Files**: `lib/constants.ts`, `globals.css`

1. Create `lib/constants.ts` with `SITE_URL` from `process.env.NEXT_PUBLIC_SITE_URL ?? "https://pedrobalbino.dev"`
2. Add `:focus-visible` outline style to `globals.css`
3. Add placeholder `resume.pdf` to `public/`

### Step 2: Error Pages (404 + error boundary)

**Files**: `app/not-found.tsx`, `app/error.tsx`

1. Create `not-found.tsx` — server component, renders inside root layout, styled with theme colors, link to homepage
2. Create `error.tsx` — client component, `unstable_retry` prop, styled consistently

### Step 3: Metadata Routes (robots, sitemap, manifest)

**Files**: `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts`

1. `robots.ts` — allow all, reference sitemap URL using `SITE_URL`
2. `sitemap.ts` — homepage + all project slugs from `projects` data array
3. `manifest.ts` — name, icons, theme color

### Step 4: Favicons and OG Images

**Files**: `app/favicon.ico`, `app/icon.tsx`, `app/apple-icon.tsx`, `app/opengraph-image.tsx`, `app/projects/[slug]/opengraph-image.tsx`

1. Generate `favicon.ico` (32x32, "P" on dark bg)
2. `icon.tsx` — SVG favicon via `ImageResponse`
3. `apple-icon.tsx` — 180x180 PNG via `ImageResponse`
4. `opengraph-image.tsx` — 1200x630 global OG: name, title, accent color
5. `projects/[slug]/opengraph-image.tsx` — per-project OG with project title and tagline, uses `generateStaticParams`

### Step 5: Mobile Navigation

**Files**: `components/layout/mobile-nav.tsx`, `components/layout/header.tsx`

1. Create `mobile-nav.tsx` — hamburger button (`md:hidden`), Motion `AnimatePresence` drawer, scroll lock, backdrop click, Escape key, focus trap
2. Modify `header.tsx` — wrap desktop `<ul>` in `hidden md:flex`, add `<MobileNav />`, add `aria-label="Main navigation"` to `<nav>`

### Step 6: Accessibility (landmarks + skip-to-content)

**Files**: `app/layout.tsx`, all `sections/*.tsx`

1. Modify `layout.tsx` — add skip-to-content `<a>` before Header, wrap `{children}` in `<main id="main-content">`
2. Modify each section component — add `id` to heading, add `aria-labelledby` to `<section>`

### Step 7: Structured Data + SEO Meta

**Files**: `app/layout.tsx`, `app/projects/[slug]/page.tsx`

1. Add JSON-LD `<script>` to `layout.tsx` body — `@graph` with `Person` + `WebSite`
2. Add JSON-LD `<script>` to project page — `CreativeWork` schema
3. Add `<meta name="theme-color" content="#1a1a2e" />` via metadata export

### Step 8: Build Verification

1. `pnpm build` — must succeed with all new routes
2. `pnpm lint` — must pass
3. `pnpm typecheck` — must pass
4. Manual verification per `quickstart.md` checklist

## Complexity Tracking

No constitution violations. No complexity justifications needed.
