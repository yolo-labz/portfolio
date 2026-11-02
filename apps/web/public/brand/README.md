# Brand renders: provenance

These five files are the published hero plates from `yolo-labz/.github`
(`profile/assets/brand/renders/`, produced by `make renders`). They are copied
byte-for-byte; do not retouch, letter, filter or re-encode them outside `model/`.
The plate colour is exactly `#1e1e2e` (Mocha base = `--color-bg`), so the render
needs no frame, and `ortho_scale` is fitted to the content plus a 6% margin, so
`width`/`height` come straight from the filename with no crop correction.

| File | Bytes | sha256 |
|---|---|---|
| `gremlin-hero-804x770-dark.png` | 72209 | `770fcdfa8d550ef0f37cb1a74ec8078518ec4ca628f25d2d03383e3df005d6ef` |
| `gremlin-hero-804x770-dark.webp` | 20740 | `7dde69d5dff81424f5c45d93b33d23e50d91a7811aba70ac29cf57c8855183b9` |
| `gremlin-hero-804x770-dark.avif` | 9139 | `bc380a7ceb1fa840071c1df979a8c01be564c8ddbfb45281d426e43561aa9359` |
| `gremlin-hero-402x385-dark.webp` | 9618 | `4f21cdbd86c27a003a8be3ceeba8ca9a51922c396a1b3b1478e6a9028d07fdcb` |
| `gremlin-hero-402x385-dark.avif` | 5245 | `f72d0a08c00206d3498ddc9bb7bbaf6a67812322445ff6cb7a39c46dfaf86d6f` |

Everything above is quoted from the published `renders/manifest.json`, and the
files in this directory were re-hashed against it after download (all five match
byte count and sha256). Verify with:

```bash
sha256sum apps/web/public/brand/gremlin-hero-*
```

`gremlin-hero-402x385-dark.webp` / `.avif` are the 402 px sources for phones;
they match the 804 px plate's optical size because both are fitted frames.

## Wiring

`work-index.tsx` renders a `<picture>`: AVIF first, then WebP, then the PNG
fallback in `<img>`. AVIF is 5-13 KB per plate against 9-21 KB WebP and 29-138 KB
PNG. `width="804" height="770"` reserves the box, so there is no layout shift on
decode.

## Regenerate

In a clone of `yolo-labz/.github`: `make renders` (and `make renders-verify` to
check the manifest). Copy the dark 804x770 and 402x385 plates here unchanged. The
older hand-cropped `gremlin-hero{,-804,-402}.webp` files were replaced by these
plates on 02/11/2026; they remain in git history.
