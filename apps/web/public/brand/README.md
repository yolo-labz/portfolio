# Brand hero: provenance

The served hero is `gremlin-hero-at-keyboard-*`: the gremlin in goggles and a
hoodie, at a keyboard, one finger on a key. Source: the reference-set render
`hero-candidate-key-press.png` (22/11/2026, 1254 × 1254, accepted by the lead
against the canonical turnaround sheet), matted to transparent with `rembg`
(u2net, alpha matting), trimmed with a 4 % margin, padded to the 804:770 canvas
and scaled to 804 × 770 and 402 × 385. The soft floor shadow is dropped.

| File | Bytes | sha256 |
|---|---|---|
| `gremlin-hero-at-keyboard-804x770.avif` | 24605 | see `sha256sum` |
| `gremlin-hero-at-keyboard-804x770.webp` | 63402 | see `sha256sum` (WebP q64; SSIM 0.9867 vs q80; size above 60000 target) |
| `gremlin-hero-at-keyboard-402x385.avif` | 10909 | see `sha256sum` |
| `gremlin-hero-at-keyboard-402x385.webp` | 31086 | see `sha256sum` (WebP q76; SSIM 0.9862 vs q80) |

Verify with:

```bash
sha256sum apps/web/public/brand/gremlin-hero-at-keyboard-*
```

The alt text is per locale in `apps/web/messages/*.json` (`renderAlt`).

## Wiring

`work-index.tsx` renders a `<picture>`: AVIF first, then WebP. The `<img>` src is the 804 WebP (no PNG fallback). `width="804" height="770"` reserves the box, so there is no
layout shift on decode.

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
