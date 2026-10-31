# Direction round: three candidates, one winner (31/10/2026)

Brief: Brain Storm D2 plus the "best of the best" addendum (Pedro, 31/10 18:2x). This
round ran after candidate 1 was already built, so per the lead's steer candidate 1 was
kept as it was and two genuinely distinct alternatives were added. Each alternative was
rendered as a static first-viewport key screen (desktop 1280×800, mobile 390×844) in the
pinned `mcr.microsoft.com/playwright:v1.62.1-noble` image with the site's real Inter and
JetBrains Mono files (`directions/render.mjs`). Copy is the real English catalogue text.

The brand fixes the families: Inter and JetBrains Mono (the yolo-labz wordmark is set in
JetBrains Mono), Catppuccin Mocha with an emerald primary. "Different type pairing"
therefore means a different **role split and scale** between the two families, not new
typefaces.

| | C1 Bench index (built) | C2 Ledger | C3 Stage |
|---|---|---|---|
| Type | Inter 600 display, Inter text, JetBrains Mono for data only | JetBrains Mono 500 display and labels (the wordmark's voice), Inter body | Inter 800 poster display at up to 5.6rem, -0.04em; mono only for repo names |
| Layout | 8/4 split: ten-row subgrid index beside the render | single 760px column, numbered log entries, small render inline | full-bleed stage: giant headline over a large render, case files on a band pinned to the fold |
| Colour | base `#1e1e2e` ground equal to the render plate, hairline rules, emerald for action and state only | crust `#11111b` ground, dashed rules, peach ordinals as the structural accent | mantle `#181825` ground, solid emerald band with dark text, pale pill CTA |
| Key screens | `c1-bench-{desktop,mobile}.png` | `c2-ledger-{desktop,mobile}.png` | `c3-stage-{desktop,mobile}.png` |

## Scores

Impeccable `critique` rubric (Nielsen 0-4). Heuristics 7 (flexibility/efficiency) and 10
(help/documentation) are `n/a` for a Persuade/Experience portfolio, so the maximum is
**32**. All three were scored by the same seat that built them; the independent pass is
the Design Tooling seat's review on the PR.

| # | Heuristic | C1 | C2 | C3 |
|---|---|---|---|---|
| 1 | Visibility of system status | 3 | 3 | 3 |
| 2 | Match with the real world | 3 | 2 | 3 |
| 3 | User control and freedom | 3 | 3 | 3 |
| 4 | Consistency and standards | 4 | 3 | 3 |
| 5 | Error prevention | 3 | 3 | 3 |
| 6 | Recognition rather than recall | 4 | 3 | 2 |
| 8 | Aesthetic and minimalist design | 3 | 2 | 2 |
| 9 | Error recovery | 3 | 3 | 3 |
| | **Total /32** | **26** | **22** | **22** |

Detector (`impeccable detect --json`): C1 source `[]`. C2: 8 findings, C3: 11. In both
alternatives the six contrast warnings are artefacts: the static detector resolved the
`background` shorthand as white, while the real pairs are the same Mocha pairs C1 ships
(Lighthouse accessibility 100). The rest are true: design-system drift (fonts, radius,
off-ramp sizes) and, for C3, `overused-font`.

## Why C1 wins

- **The work leads.** C1 shows all ten works in the first desktop viewport, which an
  executable check now asserts. C2 shows four or five; C3 shows four case files as
  truncated teasers and no repositories at all.
- **The render sits on its own ground.** The model's plate is `#1e1e2e`. On C2's crust
  and C3's mantle grounds the plate shows as a visible rectangle, and re-rendering on
  another plate would mean changing `model/params.json`, which the brief forbids.
- **Colour keeps its meaning.** C3's emerald band spends the action colour on decoration
  and leaves the CTA a pale pill. C2's peach ordinals read as the audit colour on
  numbers that are not audits.
- **Locked copy stays whole.** C3 splits the locked headline into a poster line plus a
  list, which drifts from the corpus. C1 and C2 keep the sentence.

What C1 takes from the losers without blending them: nothing structural. C2's case for
mono display is noted for the wordmark-adjacent header only (already mono). C1's known
weakness, taglines clipped to one line at desktop widths, is recorded for the critique pass.

### The mascot question (raised by the Design Tooling critique)

Does a green gremlin argue against a compliance-grade thesis? The seat's answer is no,
on balance. The render is the yolo-labz identity, which owns the repositories in the
index, so it signs the work rather than decorating it. It sits on a plate equal to the
ground, takes no colour from the action palette, and never carries text. The thesis
sentence and ten auditable rows carry the persuasion. If a buyer test says otherwise,
the plate column drops out at no cost to the index; no other layout depends on it.

## Reference bar (Experience / Persuade)

Recalled from prior knowledge and not re-visited in this session (the server browser
route was not used for this round). These set the bar; nothing is copied.

1. **rauno.me**: motion restraint. Interaction detail appears where the hand is (hover,
   focus, press) and nowhere else. Bar for C1: one authored entrance, state-driven
   detail on the rows, nothing on scroll.
2. **paco.me**: density and type rhythm in a list of work. Small type, one size step,
   generous line height, the list *is* the page. Bar: the index rows hold rhythm at one
   step with no decoration.
3. **linear.app**: Persuade on dark. Crisp hierarchy, one accent spent only on the
   action, sections that each make one claim. Bar: case files, services and contact
   each make one claim, and emerald appears only on action and state.
