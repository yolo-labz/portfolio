# Brand hero

These five files are the served hero from `yolo-labz/.github`
(`profile/assets/brand/hero/`). They are copied byte for byte: do not retouch,
letter, filter or re-encode them here. The 402 px plate shares the 804 px crop
window, so phones see the same framing.

| File | Bytes | sha256 |
|---|---|---|
| `gremlin-hero-804x770.avif` | 10500 | `a54235d56c07e2ec8da7152192c851cfc822d86bd38176bdc79b6b9ad119e1e6` |
| `gremlin-hero-804x770.webp` | 20652 | `eaf15272e90ecb2e3bd91b2ac150d72e719ab08ce24c3c81806229e942db7167` |
| `gremlin-hero-804x770.png` | 39097 | `ab6423565c3628036de518fa397b9267b8c6c15073946ca29dbbcec3dd1a70a4` |
| `gremlin-hero-402x385.avif` | 5437 | `fdcf3e52865d7bca72e7d6a6a04786a336aec99e6b8ac7c84e077f03fc8f353f` |
| `gremlin-hero-402x385.webp` | 10228 | `feb419f6353a172640f5bf7ca78f695cc1b8cdfb0a7653022762c6ba0c747f31` |

The values are quoted from the published `hero/manifest.json`, and the files here
were re-hashed against it after copying. Verify with:

```bash
sha256sum apps/web/public/brand/gremlin-hero-*
```

The alt text is the manifest's `alt.hero`, translated per locale (`renderAlt`).

## Wiring

`work-index.tsx` renders a `<picture>`: AVIF first, then WebP, then the PNG
fallback in `<img>`. `width="804" height="770"` reserves the box, so there is no
layout shift on decode.

## Updating

Copy the five files from `profile/assets/brand/hero/` in `yolo-labz/.github`
unchanged. `gremlin-hero-804x770-dark.png` (39097 B, `ab642356…70a4`) stays as the
input of `scripts/make-share-card.py`; the page no longer serves it.
