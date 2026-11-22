# Brand hero: provenance

The served hero is `gremlin-hero-at-keyboard-*`: the gremlin in goggles and a
hoodie, at a keyboard, one finger on a key. Source: the reference-set render
`hero-candidate-key-press.png` (22/11/2026, 1254 × 1254, accepted by the lead
against the canonical turnaround sheet), matted to transparent with `rembg`
(u2net, alpha matting), trimmed with a 4 % margin, padded to the 804:770 canvas
and scaled to 804 × 770 and 402 × 385. The soft floor shadow is dropped.

| File | Bytes | sha256 |
|---|---|---|
| `gremlin-hero-at-keyboard-804x770.avif` | 21260 | see `sha256sum` |
| `gremlin-hero-at-keyboard-804x770.webp` | 77818 | see `sha256sum` |
| `gremlin-hero-at-keyboard-804x770.png` | 177752 | see `sha256sum` |
| `gremlin-hero-at-keyboard-402x385.avif` | 11075 | see `sha256sum` |
| `gremlin-hero-at-keyboard-402x385.webp` | 32640 | see `sha256sum` |

Verify with:

```bash
sha256sum apps/web/public/brand/gremlin-hero-at-keyboard-*
```

The alt text is per locale in `apps/web/messages/*.json` (`renderAlt`).

## Wiring

`work-index.tsx` renders a `<picture>`: AVIF first, then WebP, then the PNG
fallback in `<img>`. `width="804" height="770"` reserves the box, so there is no
layout shift on decode.

## Share card

`gremlin-hero-804x770-dark.png` (the Blender plate) is kept as the input of
`scripts/make-share-card.py`. The share card is a model render; the hero is not.
