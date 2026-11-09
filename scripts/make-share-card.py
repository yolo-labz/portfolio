#!/usr/bin/env python3
"""Render the site's share card: the site's own sentence on the brand frame.

WHY: docs/share-card-decision.md, Option A. A share of this site used to carry the
org card ("Small tools. Deliberate automation."), a sentence the site never makes.
The portfolio family now ships its own card, drawn from the copy the home page
already says, on the same 1200x630 Mocha frame and the same published gremlin plate
(apps/web/public/brand, from yolo-labz/.github `model/`). No new claim: every line
is quoted from messages/en.json (Hero) and the page <title>.

The card is typeset (real font, `rsvg-convert`), never generated lettering, and is
written to both places it must be identical in:
  .github/og-card.png                      what the share-card policy declares
  apps/web/src/app/opengraph-image.png     what /opengraph-image.png serves

Usage
    python3 scripts/make-share-card.py           # render and write both files
    python3 scripts/make-share-card.py --check   # re-render; exit 1 if either differs

`--check` needs the same fonts (Inter) the card was rendered with; CI only checks
size, mime and the policy (scripts/check-share-card.py). ponytail: no font pinning,
so a re-render on a machine without Inter falls back to DejaVu and `--check` fails —
pin a font file in the repo if the card ever has to be rebuilt in CI.
"""

from __future__ import annotations

import argparse
import base64
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLATE = ROOT / "apps/web/public/brand/gremlin-hero-804x770-dark.png"
OUTPUTS = (ROOT / ".github/og-card.png", ROOT / "apps/web/src/app/opengraph-image.png")
MESSAGES = ROOT / "apps/web/messages/en.json"

WIDTH, HEIGHT = 1200, 630
FONT = "Inter, DejaVu Sans, sans-serif"
# Mocha ground (= the plate colour, so the render needs no frame) and the site's
# own accent: the emerald the home <h1> uses for the three seams.
BASE, TEXT, SUBTEXT, MUTED, ACCENT = "#1e1e2e", "#cdd6f4", "#a6adc8", "#6c7086", "#00c77a"
NAME = "Pedro Balbino"
ROLE = "Compliance-Grade AI Architect"  # the site <title> after the em dash
HOST = "portfolio.home301server.com.br"


def thesis_lines() -> tuple[list[str], list[str]]:
    """The home <h1>, split where the card can hold it. Read, not retyped."""
    hero = json.loads(MESSAGES.read_text(encoding="utf-8"))["Hero"]
    lead, seams = hero["headingLead"], hero["headingSeams"]
    # "AI stacks fail their first audit at three seams:" / "prompt provenance, ..."
    cut = lead.index(" at ")
    head, tail = seams.split(", ", 1)
    return [lead[:cut], lead[cut + 1 :]], [f"{head},", tail]


def card_svg() -> str:
    plate = base64.b64encode(PLATE.read_bytes()).decode()
    plate_h = 540
    plate_w = round(plate_h * 804 / 770)
    lead, seams = thesis_lines()

    def text(y: int, size: int, fill: str, content: str, weight: int = 400) -> str:
        return (
            f'  <text x="64" y="{y}" font-family="{FONT}" font-size="{size}" '
            f'font-weight="{weight}" letter-spacing="-0.01em" fill="{fill}">{content}</text>'
        )

    rows = [
        text(140, 68, TEXT, NAME, weight=700),
        f'  <rect x="64" y="168" width="176" height="4" fill="{ACCENT}"/>',
        text(232, 34, TEXT, ROLE),
    ]
    y = 312
    for line, fill in [(s, SUBTEXT) for s in lead] + [(s, ACCENT) for s in seams]:
        rows.append(text(y, 28, fill, line))
        y += 40
    rows.append(text(574, 20, MUTED, HOST))
    return "\n".join(
        [
            (
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
                f'width="{WIDTH}" height="{HEIGHT}" viewBox="0 0 {WIDTH} {HEIGHT}">'
            ),
            f'  <rect width="{WIDTH}" height="{HEIGHT}" fill="{BASE}"/>',
            (
                f'  <image x="{WIDTH - 24 - plate_w}" y="{HEIGHT - plate_h}" width="{plate_w}" '
                f'height="{plate_h}" xlink:href="data:image/png;base64,{plate}"/>'
            ),
            *rows,
            "</svg>",
            "",
        ]
    )


def render() -> bytes:
    with tempfile.TemporaryDirectory() as tmp:
        svg = Path(tmp) / "card.svg"
        png = Path(tmp) / "card.png"
        svg.write_text(card_svg(), encoding="utf-8")
        subprocess.run(["rsvg-convert", "-o", str(png), str(svg)], check=True, timeout=60)
        return png.read_bytes()


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(prog="make-share-card")
    parser.add_argument("--check", action="store_true", help="fail if a committed card differs")
    args = parser.parse_args(argv)

    card = render()
    if args.check:
        stale = [str(p.relative_to(ROOT)) for p in OUTPUTS if not p.is_file() or p.read_bytes() != card]
        if stale:
            print(f"make-share-card: FAIL re-render differs from {', '.join(stale)}", file=sys.stderr)
            return 1
        print(f"make-share-card: PASS {len(card)} B, both copies match the render")
        return 0
    for path in OUTPUTS:
        path.write_bytes(card)
    print(f"make-share-card: wrote {len(card)} B to {', '.join(str(p.relative_to(ROOT)) for p in OUTPUTS)}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
