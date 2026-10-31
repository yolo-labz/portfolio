---
version: 1
slug: "src-app-locale-page-tsx"
primary_target: "src/app/[locale]/page.tsx"
related_targets: ["src/app/[locale]/projects/[slug]/page.tsx"]
---

# Surface: home (`/[locale]`) and the case-study route (`/[locale]/projects/[slug]`)

Mode: **Experience** for the first viewport and the work index; **Persuade** for the
services and contact close. Case-study pages are **Read**.

Audience and job: an engineering lead at a regulated-AI shop deciding, from evidence,
whether to send a brief. Action: send a brief (mailto). Proof: the ten works (four
anonymized client case files, six yolo-labz repositories) and their decision records.
Constraints: Catppuccin Mocha hex-pinned, emerald `#00c77a` primary, no gradients or
glows, Inter + JetBrains Mono, gremlin renders only from `yolo-labz/.github` `model/`.

Unattended run (Brain Storm D2, 31/10/2026): no decision page could be answered, so the
world is the brief-pinned one and the composition below was chosen by the seat. Build
path: code-led (no image generation on this machine).

## Direction contract

THESIS: The site is a bench, not a résumé. The gremlin sits at its keyboard and the
index of work it has produced fills the first viewport; refuses the headline + stat row
+ two buttons hero and the grid of equal cards.

OWN-WORLD: Mocha base `#1e1e2e` ground that the gremlin plate shares pixel for pixel, so
the render has no box. Hairline rules (`#45475a`) and ruled rows, never cards with
coloured edges. Emerald only for the action and the active row. Mono only for repo
paths, stacks and data. Mauve lives only in the gremlin's pupils.

STORY: In one screen the visitor sees what was built, for whom (anonymized) and where to
check it; one scroll gives a decision record; the close asks for a brief.

FIRST VIEWPORT: Header 56 px, "Send a brief" emerald at right. Left 7/12: one-sentence
thesis (locked headline, 30-40 px) then the work index, ten ruled rows: name, one-line
what, kind (case file / repository), arrow. Right 5/12: the gremlin hero render
~440 px, keyboard edge aligned to the index's last row, as if typing it. Mobile: render
112 px beside the thesis, index full width.

FORM: ruled index + workbench plate (code-led; signature interaction: hovering or
focusing a row lights it emerald and surfaces its constraint line; reduced motion makes
it instant). seed:9d9c0d6fa070bfc6

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
