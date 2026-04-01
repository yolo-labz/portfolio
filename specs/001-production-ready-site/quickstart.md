# Quickstart: Production-Ready Portfolio Site

**Branch**: `001-production-ready-site`

## Setup

```bash
git checkout 001-production-ready-site
pnpm install
```

## Development

```bash
pnpm dev
# Open http://localhost:3000
```

## Verification

After implementing all changes, verify:

```bash
# 1. Build succeeds
pnpm build

# 2. Lint passes
pnpm lint

# 3. Type check passes
pnpm typecheck

# 4. Test 404 page
# Navigate to http://localhost:3000/nonexistent
# Navigate to http://localhost:3000/projects/nonexistent

# 5. Test mobile nav
# Resize browser to 375px width, verify hamburger appears

# 6. Test keyboard nav
# Press Tab from top of page, verify skip-to-content appears

# 7. Test OG images
# Visit http://localhost:3000/opengraph-image (should render PNG)
# Visit http://localhost:3000/projects/realestate-price-tracker/opengraph-image

# 8. Test metadata routes
# Visit http://localhost:3000/robots.txt
# Visit http://localhost:3000/sitemap.xml
# Visit http://localhost:3000/manifest.webmanifest

# 9. Lighthouse audit (production only)
pnpm build && pnpm start
# Run Lighthouse on http://localhost:3000
```

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_SITE_URL` | `https://pedrobalbino.dev` | Base URL for sitemap, robots.txt, JSON-LD |
