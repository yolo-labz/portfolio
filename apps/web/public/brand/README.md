# Brand renders: provenance

| File | Source | Transform |
|---|---|---|
| `gremlin-hero.png` | `yolo-labz/.github` @ `de5ebee`, `make model` → `build/gremlin-hero.png` | none (900×900, sha256 `e2b299662490508e6679c10a46980ae5d9e9b378facacafe643c9278359695eb`) |
| `gremlin-hero-804.webp` | `gremlin-hero.png` | `magick gremlin-hero.png -crop 804x770+10+98 +repage -quality 88` |
| `gremlin-hero-402.webp` | `gremlin-hero.png` | same crop, then `-resize 402x385` |

The model (Blender Workbench, flat albedo, palette from `model/params.json`) rendered
`gremlin-hero.png` byte-identically in two consecutive `make model THREADS=4` runs on
31/10/2026. The crop removes only empty `#1e1e2e` plate, which equals the site's
`--color-bg`. Never retouch, letter, filter or regenerate these outside `model/`.

Regenerate: in a clone of `yolo-labz/.github`, `make model`, then re-run the two
`magick` lines above from this directory.
