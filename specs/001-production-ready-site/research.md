# Research: Production-Ready Portfolio Site

**Branch**: `001-production-ready-site`
**Date**: 2026-03-31

## R1: 404 Page Strategy

**Decision**: Use `app/not-found.tsx` (standard, not experimental `global-not-found`).

**Rationale**: The portfolio has a single root layout. `not-found.tsx` renders inside that layout (Header/Footer intact), which is the desired behavior. The experimental `global-not-found.tsx` requires duplicating the entire HTML document and has known CSS issues (vercel/next.js#82379). Not worth the complexity.

**Alternatives considered**:
- `experimental.globalNotFound`: Rejected — still experimental in Next.js 16.2, requires duplicated layout, Tailwind CSS loading bug.

## R2: Error Boundary Pattern

**Decision**: Use `app/error.tsx` as a `"use client"` component with `unstable_retry` prop.

**Rationale**: In Next.js 16.2, the error boundary's retry function was renamed from `reset` to `unstable_retry`. The error boundary wraps children of the layout, so Header/Footer remain visible during errors.

**Alternatives considered**:
- `global-error.tsx`: Only needed if the root layout itself can throw. For a static portfolio, it cannot. Skip.

## R3: Favicon Approach

**Decision**: Use file-based conventions: `app/favicon.ico` (32x32), `app/icon.tsx` (SVG via ImageResponse), `app/apple-icon.tsx` (180x180 PNG via ImageResponse).

**Rationale**: Programmatic generation via `icon.tsx` ensures the favicon matches the brand (teal accent "P" on dark background) without manual asset creation. Next.js auto-generates the appropriate `<link>` tags. No need for a separate `/public/favicon/` directory.

**Alternatives considered**:
- Static `.ico` + `.png` files: Requires manual creation of multiple sizes. More reliable but less maintainable.
- `metadata.icons` in layout: Conflicts with file-based approach. Pick one — file-based is simpler.

## R4: OG Image Generation

**Decision**: Use `app/opengraph-image.tsx` (global) and `app/projects/[slug]/opengraph-image.tsx` (per-project) via `next/og` `ImageResponse`.

**Rationale**: Build-time generation (static). No runtime cost. `ImageResponse` in Next.js 16.2 is 2-20x faster. Dimensions: 1200x630 PNG (universal standard for OG + Twitter).

**Alternatives considered**:
- Static `.png` files: Would need manual creation for each project. Not scalable.
- `@vercel/og`: Deprecated in favor of `next/og`.

**Constraint**: `ImageResponse` supports only flexbox layout (no CSS grid). Only `ttf`/`otf` fonts (not woff). 500KB bundle limit per image.

## R5: robots.txt and Sitemap

**Decision**: Use `app/robots.ts` and `app/sitemap.ts` (Next.js metadata API).

**Rationale**: Both are statically generated at build time. The sitemap pulls from the `projects` data array, so it's always in sync. No external sitemap generation tools needed.

**Alternatives considered**:
- Static `public/robots.txt`: Loses the ability to reference `NEXT_PUBLIC_SITE_URL` dynamically.
- `next-sitemap` package: Overkill for a 10-page static site.

## R6: Structured Data / JSON-LD

**Decision**: Inline `<script type="application/ld+json">` in layout (global Person + WebSite) and project pages (CreativeWork). Use `@graph` pattern for multiple entities. Sanitize with `.replace(/</g, "\\u003c")`.

**Rationale**: Next.js docs explicitly recommend this pattern. No need for `schema-dts` types — the schema is simple enough to type manually. The `@graph` pattern allows multiple entities in a single block.

**Alternatives considered**:
- `schema-dts` package: Adds a dependency for type checking ~20 lines of JSON. Not worth it.
- `next-seo` package: Deprecated patterns, unnecessary for App Router.

## R7: Mobile Navigation

**Decision**: Hamburger button on `md:hidden`, slide-in drawer from right using Motion `AnimatePresence`. Scroll lock via `document.body.style.overflow`. Focus trap via manual keyboard handling. Backdrop click and Escape key to close.

**Rationale**: This is the standard pattern for portfolio sites. The drawer gives enough space for nav items + Resume link with 44px+ touch targets. Motion provides smooth enter/exit transitions matching the site's animation language.

**Alternatives considered**:
- Bottom sheet: Unusual for navigation, more suited to mobile apps.
- Full-screen overlay: Too heavy for 5 nav items.
- CSS-only hamburger: No animation, no scroll lock, no focus trap. Insufficient for accessibility.

## R8: Accessibility Implementation

**Decision**: Skip-to-content link (sr-only, visible on focus), `aria-labelledby` on all `<section>` elements, `:focus-visible` global style, focus trap in mobile drawer.

**Rationale**: WCAG 2.1 AA compliance. These are the minimum requirements that Lighthouse tests for. The existing `useReducedMotion` hook already handles motion preferences.

**Key detail**: Add `:focus-visible` outline in `globals.css` rather than per-component. Use `outline: 2px solid var(--color-accent); outline-offset: 2px;`.

## R9: Web Manifest

**Decision**: Use `app/manifest.ts` to generate `manifest.webmanifest`. Include 192x192 and 512x512 icons, theme color matching `--color-bg`.

**Rationale**: Needed for PWA install prompts and Android Chrome's address bar color. Minimal effort.

## R10: Environment Variable for Domain

**Decision**: Use `NEXT_PUBLIC_SITE_URL` env var (default: `https://pedrobalbino.dev`) for sitemap, robots.txt, and JSON-LD `url` fields.

**Rationale**: Allows easy domain change without code modification. Set in Vercel environment variables during deployment.
