# Data Model: Production-Ready Portfolio Site

**Branch**: `001-production-ready-site`
**Date**: 2026-03-31

## Entities

This feature adds no new data entities to the application. It consumes the existing
`Project`, `SkillDomain`, and `ExperienceEntry` types from `apps/web/src/data/`.

## New Files (by type)

### Next.js Metadata Convention Files

| File | Type | Purpose |
|------|------|---------|
| `app/not-found.tsx` | Server Component | Custom 404 page |
| `app/error.tsx` | Client Component | Error boundary with retry |
| `app/robots.ts` | Metadata Route | robots.txt generation |
| `app/sitemap.ts` | Metadata Route | sitemap.xml generation |
| `app/manifest.ts` | Metadata Route | Web manifest generation |
| `app/favicon.ico` | Static File | Legacy favicon (32x32) |
| `app/icon.tsx` | Image Route | SVG favicon via ImageResponse |
| `app/apple-icon.tsx` | Image Route | Apple touch icon (180x180) |
| `app/opengraph-image.tsx` | Image Route | Global OG image (1200x630) |
| `app/projects/[slug]/opengraph-image.tsx` | Image Route | Per-project OG (1200x630) |

### Component Files

| File | Type | Purpose |
|------|------|---------|
| `components/layout/mobile-nav.tsx` | Client Component | Hamburger + drawer |

### Modified Files

| File | Change |
|------|--------|
| `app/layout.tsx` | Add skip-to-content link, JSON-LD script, theme-color meta, `<main id="main-content">` wrapper |
| `app/globals.css` | Add `:focus-visible` global style |
| `components/layout/header.tsx` | Hide desktop nav on mobile, add `<MobileNav />`, add `aria-label` |
| `components/sections/*.tsx` | Add `aria-labelledby` + heading `id` attributes |
| `app/projects/[slug]/page.tsx` | Add CreativeWork JSON-LD script |
| `public/resume.pdf` | Placeholder PDF file |

## JSON-LD Schemas

### Homepage (layout.tsx)

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "url": "NEXT_PUBLIC_SITE_URL",
      "name": "Pedro Balbino — Software Engineer"
    },
    {
      "@type": "Person",
      "name": "Pedro Henrique Souza Balbino",
      "jobTitle": "Software Engineer",
      "knowsAbout": ["Python", "TypeScript", "AWS", "Terraform", "Data Pipelines"],
      "sameAs": ["github", "upwork", "linkedin"]
    }
  ]
}
```

### Project Pages

```json
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "project.title",
  "description": "project.description",
  "author": { "@type": "Person", "name": "Pedro Henrique Souza Balbino" }
}
```
