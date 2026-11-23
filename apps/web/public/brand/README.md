# Brand hero: provenance

The served hero is `gremlin-typing.svg`: the flat, angled gremlin typing on a
keyboard. Source: `outputs/logo-svg-2026-11-23/v6/gremlin-typing.svg` in the
mascot-system project (traced from the v5 reference by `tools/vectorize.py`,
k=7; pupils, claws and keyboard fixed in v6; lead-reviewed 2026-11-23).
Viewbox 1265.8 × 1181.8, transparent background. The v6 head crop
(`gremlin-head-from-v6.svg`) is not wired anywhere on the site.
The raster hero (`gremlin-hero-at-keyboard-*`, 22/11/2026) is removed.

Verify with:

```bash
sha256sum apps/web/public/brand/gremlin-typing.svg
```

The alt text is per locale in `apps/web/messages/*.json` (`renderAlt`).

## Wiring

`work-index.tsx` renders one `<img src="/brand/gremlin-typing.svg">`.
`width="804" height="751"` (viewBox ratio at 804 px wide) reserves the box, so
there is no layout shift.

## Share card

`gremlin-hero-804x770-dark.png` (the Blender plate) is kept as the input of
`scripts/make-share-card.py`. The share card is a model render; the hero is not.

## Weight (open)

The present largest file is `gremlin-hero-804x770.png` at 39,097 B. The new
set is over the 20 % budget. Steps tried on the PNG (colours → bytes): 256 →
177,752 (shipped; near-lossless); 128 → 145,288; 64 → 109,674; 32 → 87,626
(visible banding); 24 → 77,214; 16 → 58,949 (visible banding). WebP q80 is
77,818 B (present 20,652) and AVIF q40 (ImageMagick/libheif, alpha kept) is 24,605 B (present 10,500). A
decision is open on the fallback size and the format quality.
