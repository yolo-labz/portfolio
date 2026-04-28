# Visual-regression harness

Playwright `toHaveScreenshot()` against the built `@portfolio/web` Next.js
app. Layer 3 of `META-PLATFORM-PLAN-2026Q2.md`. Next.js / Turborepo / pnpm
variant of the harness that landed for the Hugo blog in
[phsb5321/blog#28](https://github.com/phsb5321/blog/pull/28).

Baselines live next to the spec at
`tests/visual/portfolio.spec.ts-snapshots/<page>-<project>.png`. They are
committed in-repo and gated by CI on every PR that touches `apps/`,
`packages/`, the spec, or its config.

## Why this exists

The blog shipped a silent visual regression in PR #26 (PaperMod theme
upstream change) that no automated check caught. The portfolio has the same
risk surface — Tailwind class drift, font fallback shift, motion component
animation timing — except the project page template fans out to 12+ project
detail pages, so the surface is wider. This harness pins it.

## Run / update baselines (Docker — canonical)

Seed and refresh baselines using the same image CI uses. This is the only
path that produces baselines CI will accept (font/freetype byte-stability):

```bash
docker run --rm --ipc=host \
  -v "$PWD:/work" -w /work \
  --user "$(id -u):$(id -g)" \
  -e HOME=/tmp \
  -e CI=true \
  --entrypoint bash \
  mcr.microsoft.com/playwright:v1.59.1-noble \
  -c '
    set -e
    # Activate corepack-pinned pnpm without writing to /root.
    corepack enable
    corepack prepare pnpm@10.28.2 --activate
    pnpm install --frozen-lockfile
    pnpm exec playwright test --update-snapshots
  '

git add tests/visual/portfolio.spec.ts-snapshots/
```

`fullPage: true` snapshots are committed in-repo. The `-noble` image pin is
load-bearing — bump it in lockstep with `@playwright/test` in `package.json`
and bump the same tag in `.github/workflows/visual-regression.yml`.

## Run locally without Docker (advisory only)

Useful for fast iteration, but pixel diffs against committed baselines are
expected because macOS / nix-darwin font rendering differs from the Noble
image's freetype + harfbuzz:

```bash
pnpm install
pnpm exec playwright install chromium
pnpm test:visual           # macOS — diffs vs CI baselines are normal
```

CI is the source of truth.

## How CI gates merges

`.github/workflows/visual-regression.yml` runs on every PR that touches
`apps/`, `packages/`, `tests/visual/`, the Playwright config, or the
lockfile. The job fails closed when a snapshot diff exceeds
`maxDiffPixelRatio: 0.02` (configured in `playwright.config.ts`).

The HTML report ships as a `playwright-report-<run-id>` artifact when the
run fails — open it from the failed check to inspect diffs.

## Adding a new route

1. Append `{ name, path }` to `PAGES` in `tests/visual/portfolio.spec.ts`.
2. Regenerate baselines via the Docker block above.
3. `git add tests/visual/portfolio.spec.ts-snapshots/<name>-*.png` and
   hand-check both `chromium-desktop` and `mobile` PNGs in the PR.

## Why `pnpm next start` instead of `pnpm next dev`

Dev mode (`next dev --turbopack`) injects HMR / Fast Refresh runtime that
shifts layout pixel-for-pixel between runs. Production build (`next build &&
next start`) mirrors what Dokku ships and is deterministic.
