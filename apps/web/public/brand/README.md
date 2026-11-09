# Brand hero: provenance

These five files are the served hero from `yolo-labz/.github`
(`profile/assets/brand/hero/`, cut by `publish.py`), per the hero decision adopted
on 08/11/2026 (`profile/assets/brand/hero-decision/README.md`): the GPT master for
every hero slot. They are copied byte-for-byte; do not retouch, letter, filter or
re-encode them here. The 402 px plate shares the 804 px crop window, so phones
see the same framing.

| File | Bytes | sha256 |
|---|---|---|
| `gremlin-hero-gpt-804x770.avif` | 14318 | `32d6e47f45bcd38afb5a33007ef97c23eefd8b9862a9ba52c72d63785015560e` |
| `gremlin-hero-gpt-804x770.webp` | 28762 | `66ad1491640b1be50b1cbad80e3e5066b5a7c967c86574df57c1e627c45439eb` |
| `gremlin-hero-gpt-804x770.png` | 489167 | `d04b5272b0901d4798c3bde68fd460562b84adefccf59a6860164cdfb29d1f7b` |
| `gremlin-hero-gpt-402x385.avif` | 6881 | `89116e28d4f24119b02005c04ce42af5342c1a9a86cba87c26f6049b9227584f` |
| `gremlin-hero-gpt-402x385.webp` | 12606 | `58d8d6aa408a2bc114207ae190dd2cf2dcbccf8b432f4d6750df342689729bed` |

Everything above is quoted from the published `hero/manifest.json`, and the files
here were re-hashed against it after copying. Verify with:

```bash
sha256sum apps/web/public/brand/gremlin-hero-*
```

The alt text is the manifest's `alt.hero`, translated per locale (`renderAlt`).

## Wiring

`work-index.tsx` renders a `<picture>`: AVIF first, then WebP, then the PNG
fallback in `<img>`. `width="804" height="770"` reserves the box, so there is no
layout shift on decode.

## Regenerate

In a clone of `yolo-labz/.github`: `python3 profile/assets/brand/hero/publish.py`
(and `--verify`). Copy the five files above here unchanged. The Blender plates
(`gremlin-hero-*-dark.*`) served until 08/11/2026 remain in git history, except
`gremlin-hero-804x770-dark.png` (72209 B, `770fcdfa…d6ef`): the page no longer serves
it, but it stays as the input of `scripts/make-share-card.py`, because the share card
remains a model render (the decision covers the hero and avatar only).
