# Tasks: Production-Ready Portfolio Site

**Input**: Design documents from `/specs/001-production-ready-site/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks grouped by user story. All file paths relative to `apps/web/src/`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1–US6)
- Exact file paths included in every task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Environment configuration, global styles, and shared assets needed by multiple stories

- [x] T001 Create site URL constant in `apps/web/src/lib/constants.ts` — export `SITE_URL` from `process.env.NEXT_PUBLIC_SITE_URL ?? "https://pedrobalbino.dev"`
- [x] T002 [P] Add `:focus-visible` global outline style in `apps/web/src/app/globals.css` — `outline: 2px solid var(--color-accent); outline-offset: 2px`
- [x] T003 [P] Add placeholder `resume.pdf` to `apps/web/public/resume.pdf` (single-page PDF with name and "Full resume available on request")

**Checkpoint**: Infrastructure ready — all user story phases can begin

---

## Phase 2: User Story 1 — Broken URL Handling (Priority: P1) 🎯 MVP

**Goal**: Visitors who land on invalid URLs see a branded 404 page; runtime errors show a recoverable error page

**Independent Test**: Navigate to `/nonexistent` and `/projects/invalid-slug` — both render a styled 404 inside the site layout with a link home

### Implementation for User Story 1

- [x] T004 [P] [US1] Create custom 404 page in `apps/web/src/app/not-found.tsx` — server component, render inside root layout, show "This page doesn't exist" message with link to homepage and link to projects, styled with theme colors (bg-bg-card, text-text-muted, accent link)
- [x] T005 [P] [US1] Create error boundary in `apps/web/src/app/error.tsx` — `"use client"` component, accept `error` and `unstable_retry` props, show "Something went wrong" with a retry button using `<Button>` from `@portfolio/ui`, log error to console in useEffect

**Checkpoint**: 404 and error handling complete. Navigating to any invalid URL shows a branded page.

---

## Phase 3: User Story 2 — Social Sharing Previews (Priority: P1)

**Goal**: Sharing any portfolio URL on LinkedIn/Slack/Twitter shows a rich card with branded image, title, and description

**Independent Test**: Visit `/opengraph-image` in browser — renders 1200x630 PNG. Visit `/projects/realestate-price-tracker/opengraph-image` — renders project-specific OG image. Browser tab shows custom favicon.

### Implementation for User Story 2

- [x] T006 [P] [US2] Create SVG favicon generator in `apps/web/src/app/icon.tsx` — `ImageResponse` (32x32), render "P" letter in accent color on dark background, export `size` and `contentType`
- [x] T007 [P] [US2] Create Apple touch icon in `apps/web/src/app/apple-icon.tsx` — `ImageResponse` (180x180 PNG), same branding as favicon but larger with rounded corners
- [x] T008 [P] [US2] Create static `favicon.ico` in `apps/web/src/app/favicon.ico` — 32x32 ICO file for legacy browsers (use a static file; `ImageResponse` outputs PNG not ICO, so this must be a pre-built asset)
- [x] T009 [P] [US2] Create global OG image in `apps/web/src/app/opengraph-image.tsx` — `ImageResponse` (1200x630), dark gradient background, "Pedro Balbino" in large text, "Software Engineer" subtitle in accent color, export `size`, `contentType`, `alt`
- [x] T010 [US2] Create per-project OG image in `apps/web/src/app/projects/[slug]/opengraph-image.tsx` — `ImageResponse` (1200x630), dark background, project title from `projects` data, tagline below, "pedrobalbino.dev" in corner, include `generateStaticParams` from projects array
- [x] T011 [P] [US2] Create manifest icon generators — `apps/web/src/app/icon-192.tsx` (192x192 PNG via `ImageResponse`, "P" on dark bg, same style as `icon.tsx`) and `apps/web/src/app/icon-512.tsx` (512x512 PNG via `ImageResponse`, same style)
- [x] T012 [US2] Create web manifest in `apps/web/src/app/manifest.ts` — export `MetadataRoute.Manifest` with name, short_name, description, start_url, display: standalone, background_color and theme_color `#1a1a2e`, icons array referencing `/icon-192` and `/icon-512` routes

**Checkpoint**: All social sharing metadata in place. OG images generate at build time. Favicon visible in browser tab.

---

## Phase 4: User Story 3 — Mobile Navigation (Priority: P1)

**Goal**: On viewports < 768px, a hamburger menu opens a slide-in drawer with all nav links, proper scroll locking, and keyboard support

**Independent Test**: Resize viewport to 375px. Desktop nav hidden. Tap hamburger — drawer slides in from right with all links at 44px+ touch targets. Tap link — drawer closes, page scrolls to section. Press Escape — drawer closes.

### Implementation for User Story 3

- [x] T013 [US3] Extract `navItems` to `apps/web/src/lib/navigation.ts` — move the `navItems` const from `header.tsx` into a shared module, export it so both `header.tsx` and `mobile-nav.tsx` can import it
- [x] T014 [US3] Create mobile navigation drawer in `apps/web/src/components/layout/mobile-nav.tsx` — `"use client"` component with:
  - Hamburger button visible only on `md:hidden`, min 44x44px, `aria-label` and `aria-expanded`
  - Motion `AnimatePresence` + `motion.nav` for drawer slide-in from right (`initial: {x: "100%"}`, `animate: {x: 0}`)
  - Backdrop with `motion.div` fade, onClick closes
  - Scroll lock via `document.body.style.overflow = "hidden"` in useEffect, cleanup on unmount
  - Escape key handler via `useEffect` with `keydown` listener
  - Focus trap: on open, focus first link; on Tab past last item, wrap to first
  - `role="dialog"` and `aria-modal="true"` on drawer
  - Import `navItems` from `@/lib/navigation` + Resume link, each with `min-h-11 py-3` for 44px+ touch targets
  - onClick on any link calls `setOpen(false)`
- [x] T015 [US3] Modify header in `apps/web/src/components/layout/header.tsx` — import `navItems` from `@/lib/navigation`, wrap desktop `<ul>` in `className="hidden items-center gap-6 md:flex"`, import and render `<MobileNav />` after the desktop nav, add `aria-label="Main navigation"` to `<nav>` element

**Checkpoint**: Mobile nav fully functional. All links reachable on 375px viewport. Keyboard accessible.

---

## Phase 5: User Story 4 — Accessibility (Priority: P2)

**Goal**: Site is navigable by keyboard and screen reader. Skip-to-content link, ARIA landmarks, focus indicators all present.

**Independent Test**: Tab from page top — skip-to-content link appears on focus and jumps to main content. All sections announced by screen reader via heading labels.

### Implementation for User Story 4

- [x] T016 [US4] Add skip-to-content link and main wrapper in `apps/web/src/app/layout.tsx` — add `<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-bg">Skip to main content</a>` before `<Header />`, wrap `{children}` in `<main id="main-content">`
- [x] T017 [P] [US4] Add `aria-labelledby` to hero section in `apps/web/src/components/sections/hero-metrics.tsx` — add `id="hero-heading"` to the `<h1>`, add `aria-labelledby="hero-heading"` to the `<section>`
- [x] T018 [P] [US4] Add `aria-labelledby` to projects section in `apps/web/src/components/sections/project-showcase.tsx` — add `id="projects-heading"` to `<h2>`, add `aria-labelledby="projects-heading"` to `<section>`
- [x] T019 [P] [US4] Add `aria-labelledby` to skills section in `apps/web/src/components/sections/skills-matrix.tsx` — add `id="skills-heading"` to `<h2>`, add `aria-labelledby="skills-heading"` to `<section>`
- [x] T020 [P] [US4] Add `aria-labelledby` to experience section in `apps/web/src/components/sections/experience-timeline.tsx` — add `id="experience-heading"` to `<h2>`, add `aria-labelledby="experience-heading"` to `<section>`
- [x] T021 [P] [US4] Add `aria-labelledby` to contact section in `apps/web/src/components/sections/contact-cta.tsx` — add `id="contact-heading"` to `<h2>`, add `aria-labelledby="contact-heading"` to `<section>` (note: this section uses `<motion.div>` — ensure `aria-labelledby` is on the wrapping `<section>`)

**Checkpoint**: Full keyboard navigation works. Skip-to-content functional. All landmarks labeled.

---

## Phase 6: User Story 5 — Search Engine Discoverability (Priority: P2)

**Goal**: Search engines can crawl and index all pages. Structured data provides rich snippets.

**Independent Test**: Visit `/robots.txt` — allows all, references sitemap. Visit `/sitemap.xml` — lists homepage + 5 project URLs. Paste homepage into Google Rich Results Test — detects Person + WebSite schemas.

### Implementation for User Story 5

- [x] T022 [P] [US5] Create robots.txt in `apps/web/src/app/robots.ts` — export default function returning `MetadataRoute.Robots` with `rules: { userAgent: "*", allow: "/" }` and `sitemap: "${SITE_URL}/sitemap.xml"` using constant from `lib/constants.ts`
- [x] T023 [P] [US5] Create sitemap in `apps/web/src/app/sitemap.ts` — export default function returning `MetadataRoute.Sitemap` with homepage entry (priority 1) + all project slugs mapped from `projects` data array (priority 0.8, changeFrequency "monthly"), using `SITE_URL` for URLs
- [x] T024 [US5] Add JSON-LD structured data to layout in `apps/web/src/app/layout.tsx` — add `<script type="application/ld+json">` in `<body>` with `@graph` containing `WebSite` (url, name) and `Person` (name: "Pedro Henrique Souza Balbino", jobTitle: "Software Engineer", knowsAbout array, sameAs array with GitHub/Upwork/LinkedIn URLs), sanitize with `.replace(/</g, "\\u003c")`
- [x] T025 [US5] Add JSON-LD structured data to project pages in `apps/web/src/app/projects/[slug]/page.tsx` — add `<script type="application/ld+json">` with `CreativeWork` schema (name from project.title, description from project.description, author Person ref, url using SITE_URL), sanitize output
- [x] T026 [US5] Add theme-color meta to metadata export in `apps/web/src/app/layout.tsx` — add `themeColor: "#1a1a2e"` (matching `--color-bg` oklch value) to the existing `metadata` object, also add `metadataBase: new URL(SITE_URL)` for proper OG URL resolution

**Checkpoint**: robots.txt, sitemap.xml, and JSON-LD all serve correctly. Rich Results Test detects schemas.

---

## Phase 7: User Story 6 — Lighthouse 95+ (Priority: P2)

**Goal**: All four Lighthouse scores at 95+ on homepage and project pages

**Independent Test**: Run `pnpm build && pnpm start`, then Lighthouse audit on `http://localhost:3000`

### Implementation for User Story 6

- [x] T027 [US6] Audit and fix Lighthouse issues — run `pnpm build && pnpm start`, audit with Lighthouse, address any scores below 95:
  - Performance: verify LCP < 2.5s (hero text is LCP candidate, fonts must load fast), CLS < 0.1 (no layout shifts from font swap or dynamic content)
  - Accessibility: verify all items from US4 pass automated checks, check color contrast ratios on `text-muted` against `bg` and `bg-card`
  - Best Practices: verify no console errors, HTTPS redirect configured (Vercel handles this)
  - SEO: verify meta description present, OG tags present, robots.txt accessible, canonical URL set via `metadataBase`

**Checkpoint**: Lighthouse 95+ on all four scores for homepage and at least one project page.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final verification, build validation, cleanup

- [x] T028 Run `pnpm build` and verify all routes generate — must see 8 routes (/, /_not-found, /projects/[slug] x5, plus metadata routes)
- [x] T029 Run `pnpm lint` and fix any Biome violations introduced by new files
- [x] T030 Run `pnpm typecheck` and fix any TypeScript errors
- [x] T031 Run full verification checklist from `specs/001-production-ready-site/quickstart.md` — test 404, mobile nav, keyboard nav, OG images, metadata routes
- [x] T032 Commit all changes to `001-production-ready-site` branch

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (US1 — 404/Error)**: Depends on T002 (focus styles) for consistent styling
- **Phase 3 (US2 — Social)**: Depends on T001 (SITE_URL constant)
- **Phase 4 (US3 — Mobile Nav)**: No dependencies on other stories
- **Phase 5 (US4 — Accessibility)**: No dependencies on other stories
- **Phase 6 (US5 — SEO)**: Depends on T001 (SITE_URL constant)
- **Phase 7 (US6 — Lighthouse)**: Depends on ALL previous phases (audits everything)
- **Phase 8 (Polish)**: Depends on all previous phases

### User Story Independence

- **US1 (404/Error)**: Fully independent — can ship alone as MVP
- **US2 (Social)**: Fully independent — can ship without US1
- **US3 (Mobile Nav)**: Fully independent — can ship without US1/US2
- **US4 (Accessibility)**: Fully independent — touches different files per section
- **US5 (SEO)**: Independent but shares `layout.tsx` edits with US4 (T016 and T024/T026)
- **US6 (Lighthouse)**: Depends on all — it's the integration verification

### Parallel Opportunities

**Within Phase 1**: T001, T002, T003 are all parallel (different files)

**Within Phase 3 (US2)**: T006, T007, T008, T009, T011 are all parallel (different files); T010 depends on T009 pattern; T012 depends on T011

**Within Phase 5 (US4)**: T017, T018, T019, T020, T021 are all parallel (different section files)

**Within Phase 6 (US5)**: T022, T023 are parallel (different files); T024-T026 are sequential (shared layout.tsx)

**Cross-phase**: US1 (Phase 2), US3 (Phase 4), and US4 sections (T017-T021) can all run in parallel

---

## Parallel Example: Phase 5 (Accessibility Sections)

```text
# Launch all section aria-labelledby additions in parallel:
T017 [P] [US4] hero-metrics.tsx
T018 [P] [US4] project-showcase.tsx
T019 [P] [US4] skills-matrix.tsx
T020 [P] [US4] experience-timeline.tsx
T021 [P] [US4] contact-cta.tsx
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: US1 — 404/Error (T004-T005)
3. **STOP and VALIDATE**: Navigate to invalid URLs, verify branded 404
4. Commit and move to next story

### Incremental Delivery

1. Setup → US1 (404) → US3 (Mobile Nav) → **test on mobile** → commit
2. US2 (Social) → **test OG with opengraph.xyz** → commit
3. US4 (Accessibility) + US5 (SEO) → **keyboard test + Rich Results Test** → commit
4. US6 (Lighthouse audit) → fix any issues → commit
5. Polish (T026-T030) → final commit

### Recommended Single-Agent Order

T001 → T002 → T003 → T004+T005 → T006+T007+T008+T009+T011 → T010 → T012 → T013 → T014 → T015 → T016 → T017+T018+T019+T020+T021 → T022+T023 → T024 → T025 → T026 → T027 → T028 → T029 → T030 → T031 → T032

---

## Notes

- All file paths are within `apps/web/src/` — no changes to `packages/ui` or `projects/*`
- No new npm dependencies required — `next/og` ImageResponse is built into Next.js 16
- `layout.tsx` is modified by T016 (skip-to-content), T024 (JSON-LD), and T026 (theme-color) — apply sequentially
- `favicon.ico` (T008) may be difficult to generate programmatically — a minimal static 32x32 ICO is acceptable
- The `unstable_retry` prop name in error.tsx is specific to Next.js 16.2 — if upgrading, check for rename
