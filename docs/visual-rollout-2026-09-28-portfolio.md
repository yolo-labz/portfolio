# Visual rollout — portfolio presentation consumer

**Recovered 30/10/2026 · GPT/OpenAI · local acceptance verified; draft delivery only.**

Original layout: GPT-6 Astra. Recovery and verification: GPT-6.1 Sol.
No merge, deployment, image generation or publication is authorized by this report.

## Custody and scope

- Repo: `yolo-labz/portfolio`.
- Worktree: `/home/notroot/Documents/Code/yolo-labz/portfolio-20260928-org-showcase`.
- Branch: `20260928-org-showcase`; base: `bf3ca9b3f3fdc890387c5c84601a96f47bc14376`.
- Coordinator: `home-projects` / `w8:p6`; slice: portfolio presentation consumer.
- Draft PR: [#143](https://github.com/yolo-labz/portfolio/pull/143), assigned to verified account `phsb5321`.
- Restored commits: `0f50b9e` (original shelf) → `10841d7` (reclaim rescue). Recovery adds evidence and a scoped speech-summary correction; current remote checks are linked below.
- Spec → plan → tasks: [`specs/20260928-org-showcase/`](../specs/20260928-org-showcase/).
- Only the existing open-source shelf is redesigned. Featured case studies, personal
  positioning, all catalogue entries, palette, dependencies and deployment remain unchanged.
  This is not a resumption of the retirement work in #135/#138.

## Implementation

The former ten-row list did not distinguish a starting point from the rest of the
catalogue, or a project explanation from source code. `OrganizationShowcase` now
reuses `Card`, `Badge`, `FigStamp`, localized `Link` and the existing project data:

- Four capability entry points: `wa` (messaging), `serverless-data-api`
  (infrastructure), `kokoro-speakd` (speech), `fand` (system tooling).
- Two-column desktop / single-column mobile cards, localized summaries,
  stack labels, separately named project/source links and 44px link targets.
- The speech card uses a new EN/PT/ES `ProjectShowcase.speechSummary`, rather
  than repeating the historical, unmeasured latency claim. The copy lane's M01
  finding is resolved on this shelf only; shared `Projects` prose is unchanged.
- Native keyboard-operable disclosure for the remaining six catalogue entries;
  the count is data-derived and remains compatible with a future retirement landing.
- Compact EN/PT/ES organization labels; no added metrics, uptime claims or ranking.
- Existing emerald/Mocha typography and colors; no substitute image, logo or full rebrand.

Key paths:

- `apps/web/src/components/sections/organization-showcase.tsx`
- `apps/web/src/components/sections/project-showcase.tsx` (only the shelf replaced)
- `apps/web/messages/{en,pt,es}.json` (`ProjectShowcase` labels and speech summary only)
- `tests/visual/organization-showcase.spec.ts`

## Actual renders and provenance

All PNGs below are **actual screenshots of a local production build**, not captures
of the deployed site, GPT-generated art or approved brand masters. Chromium **151.0.7922.34**, Playwright **1.62.1**,
image `mcr.microsoft.com/playwright:v1.62.1-noble`, digest
`sha256:dcc5531e97840b9b5e794f2814476b21571c5124a3fca2267d73041f56e7580e`.

- [Desktop, EN](../tests/visual/organization-showcase.spec.ts-snapshots/showcase-en-chromium-desktop.png)
- [Mobile, PT](../tests/visual/organization-showcase.spec.ts-snapshots/showcase-pt-mobile.png)
- [320px, expanded catalogue](../tests/visual/organization-showcase.spec.ts-snapshots/showcase-320-expanded-mobile.png)
- EN/PT/ES × desktop/mobile, plus two 320px proofs:
  `tests/visual/organization-showcase.spec.ts-snapshots/`.
- Full-page renders: the six `home*.png` baselines in
  `tests/visual/portfolio.spec.ts-snapshots/`. All sixteen non-home baselines are unchanged.
- Source/PNG hashes and dimensions: [`render-manifest.json`](evidence/visual-rollout-2026-09-28-portfolio/render-manifest.json).

Desktop viewport 1280×800; mobile 390×844; narrow proof 320×844. Section-only images
are tightly cropped to the section, with the fixed header removed in the isolated
test page and its anchor inset reset to avoid compositing/clipping. Assertions
verify the capture style. Full-page tests still include the unmodified header.
Final desktop, PT mobile and expanded 320px PNGs were opened and inspected: all
cards and the disclosure are visible, text wraps, no image stretching or distorted
crop. The section contains no raster artwork.

### GPT Image Lab dependency

Read the Lectrice/Proso pipeline methods, but did not invoke a generator, clear a
composer, manipulate a project, attach to a shared identity, or spawn a worker.

p9 handoff: `/home/notroot/Documents/Code/yolo-labz/github-profile-010-gpt-gremlin-art/profile/assets/brand/exploration/2026-09-28/`.
The earlier [`p9-generation-status.json`](evidence/visual-rollout-2026-09-28-portfolio/p9-generation-status.json)
is **historical failure evidence**, not current status. On 30/10/2026, the producer's
`check.py` passed for all three genuine generated images: anchor 1254×1254, wide
1774×887, square 1254×1254. Public sidecars pin prompts, reference lineage and
confirmed sends. Exact backend model is not exposed; none is inferred.

Current producer commit: `637a7fbd3f47127f157d0e0dbbccc807bff57c87`.
[Labelled contact sheet](https://github.com/yolo-labz/.github/blob/637a7fbd3f47127f157d0e0dbbccc807bff57c87/profile/assets/brand/exploration/2026-09-28/contact-sheet.png).
[Consumer hash/usage record](evidence/visual-rollout-2026-09-28-portfolio/recovery-2026-10-30/art-handoff.json).

Actual contact-sheet pixels were inspected: recognizable green gremlin and
keyboard; the wide image has substantial empty space, and the circular avatar
clips the ears. Soft shading/keycap/anatomy drift is disclosed by the producer.
These remain **exploration, not approved masters**. No image was imported into the
site: the compact project-selection shelf benefits from text and direct links,
not a new mascot/identity treatment or a cropped illustration. This is an explicit
fit decision, not a still-blocked generation claim. Source visibility is not an
art license; broader artwork publication/identity use remains separately gated.
Zero new image sends, no private receipts copied, and no production-art replacement.

## Executable acceptance

| Check | Result |
| --- | --- |
| `corepack pnpm install --frozen-lockfile` | PASS; no manifest/lockfile changes |
| `corepack pnpm lint` | PASS; zero hard voice failures, 39 pre-existing advisories |
| `corepack pnpm typecheck --concurrency=1` | PASS, 7/7 Turbo tasks |
| `corepack pnpm build --concurrency=1` | PASS, 8/8 Turbo tasks |
| Explicit TypeScript check of both browser specs | PASS |
| Pinned browser full suite, `playwright test --workers=1` | **30/30 PASS**, no retries |
| Scoped checks | Four selected projects, every remaining link, exact localized destinations, keyboard Enter/Space/Tab, visible 2px focus, ≥44px link height, all sampled text contrast ≥4.5:1, no 320px clipping |
| Snapshot boundary | Six homepage baselines refreshed; sixteen unrelated baselines unchanged; original 2% tolerance unchanged |
| `git diff --check` | PASS |
| Scope oracle | No diff in `.github`, `package.json`, `pnpm-lock.yaml`, `projects.ts`, `globals.css` |

Commands:

```bash
corepack pnpm lint
corepack pnpm typecheck --concurrency=1
corepack pnpm build --concurrency=1
corepack pnpm exec tsc --noEmit --skipLibCheck --target ES2022 \
  --module ESNext --moduleResolution bundler tests/visual/*.ts
# Existing production-server harness builds/serves the site automatically:
corepack pnpm exec playwright test organization-showcase.spec.ts
```

For byte-stable browser verification, after the build and copying `public`/`.next/static`
into the standalone bundle, run in the pinned image with only this worktree mounted:

```bash
docker run --rm --cpus=2 --memory=2g --pids-limit=256 --shm-size=256m \
  --user "$(id -u):$(id -g)" -e HOME=/tmp \
  -v "$PWD:/work" -w /work mcr.microsoft.com/playwright:v1.62.1-noble bash -c '
  set -eu
  PORT=3000 HOSTNAME=127.0.0.1 node apps/web/.next/standalone/apps/web/server.js &
  server=$!; trap "kill $server" EXIT
  for i in $(seq 1 30); do
    curl -fsS http://localhost:3000/api/health >/dev/null 2>&1 && break
    sleep 1
  done
  node node_modules/@playwright/test/cli.js test --workers=1
'
```

Evidence: [`acceptance.txt`](evidence/visual-rollout-2026-09-28-portfolio/acceptance.txt)
(final 30/30 run), `local-checks.txt` and `web-rebuild.txt` in the same directory.
The container uses its own network and server; no shared port or browser is taken over.

### Failures retained, not hidden

The first full-page pass exposed a 4% PT mobile difference: the old test's 300ms
smooth-scroll cycle was still moving when capture started. The shared settle now
visits each section instantly (so middle sections are not left blank), returns to
top, waits for animations, and asserts `scrollY === 0`. No tolerance was raised.
Two earlier full-suite runs also passed 30/30. Another run hit a screenshot
capture timeout under an extra 1-CPU Docker cap; its trace showed screenshot
capture taking ~36 seconds, after navigation/settling had completed. Removing only
that local resource cap yielded the recorded final 30/30 run, with no test timeout
or assertion changes. Raw receipts and the timeout trace remain alongside acceptance.

Limits: the contrast check is scoped computed-style WCAG text contrast, not a full
axe audit. Existing infrastructure wrapper tasks are echoes, not backend/service
tests. Existing Sentry, tracing and Biome schema advisories are not claimed fixed.

## Recovery verification — 30/10/2026

The linked worktree was restored clean at `10841d7`, one commit ahead of PR #143's
`0f50b9e`. Both main and the remote branch were inspected before writing; no
completed push was repeated. The parent transcript was readable. The
`portfolio-20260928-org-showcase.residue-20261030` directory was left untouched.
The project-context registry has no `portfolio` entry; the existing repo report,
spec/plan/tasks, actual files and live GitHub state were used instead. No canonical
vault save-state or sibling checkout was edited.

### Real changes versus capture noise

- The rescue log `acceptance-hydration.txt` records **3 failed / 3 passed**;
  it is retained as failure history, not presented as acceptance.
- The unmodified restored head was rerun first: **30/30 PASS**, zero retries.
- Side-by-side mobile inspection shows that `0f50b9e` captured blank case-study
  and skills sections. The rescue capture restores that actual content while
  preserving the page position; this is not a different smooth-scroll offset.
  [Before](evidence/visual-rollout-2026-09-28-portfolio/recovery-2026-10-30/pre-rescue-home-mobile-overview.png)
  / [rescued](evidence/visual-rollout-2026-09-28-portfolio/recovery-2026-10-30/rescue-home-mobile-overview.png)
  / [final](evidence/visual-rollout-2026-09-28-portfolio/recovery-2026-10-30/final-home-mobile-overview.png).
- After the scoped speech-summary correction, all fourteen owned homepage/section
  goldens were regenerated, even where the changed text fell below the 2% matcher
  threshold. The sixteen unrelated page baselines and screenshot tolerances are
  unchanged. No product CSS or motion behavior was changed to pass a screenshot.
- Final full suite: **30/30 PASS**, then **12/12 PASS** across two independent
  runs of EN/PT/ES × desktop/mobile. Every pair is **byte-identical to each other
  and its committed golden**, stronger evidence than merely passing the 2% budget.
- `scripts/verify-home-proof.py` checks the actual attached PNG bytes and fails on
  missing captures, retries, skips, runner errors or mismatching hashes. Planted
  skipped-test, missing-capture and corrupted-image probes were all rejected.
- Current desktop, PT mobile and full-home overviews were opened and inspected.
  The cards remain readable; project/source actions and catalogue disclosure are
  present. No raster was imported, so there is no new crop or image-contrast risk.

Evidence directory: [`recovery-2026-10-30/`](evidence/visual-rollout-2026-09-28-portfolio/recovery-2026-10-30/).
`final-local-checks.txt` records lint, **7/7** type tasks, **8/8** build tasks and
browser-spec TypeScript acceptance. `final-suite.txt` records the thirty-test run.
`stability-results.json.gz` retains the actual repeat-run JSON/PNG receipt;
`stability-verdict.json` contains all six hash comparisons and
`stability-negative-controls.json` records the falsifiers. Recheck the archived
receipt with:

```bash
python3 scripts/verify-home-proof.py \
  docs/evidence/visual-rollout-2026-09-28-portfolio/recovery-2026-10-30/stability-results.json.gz
```

All runs used the existing pinned image digest, one test worker, and a private
container network/server capped at **2 CPUs / 2 GiB / 256 tasks / 256 MiB shm**.
No shared browser or port was taken over. An initial repeat-run collection used
an overly anchored grep and selected zero tests; its error receipt is retained,
and was not counted as a pass. The corrected pattern collected all twelve tests.
The mechanical UI detector returned no findings; executable a11y checks, not that
advisory alone, establish the scoped contrast/focus/reflow result.

Copy evidence: the public copy lane at `fb4a5570` identifies speech latency as M01,
not a measured guarantee; the current local source README explicitly says queued
acceptance is not audible onset. The new shelf summary states the single-user
Unix-socket/persistent-model/playback mechanism without speed numbers. It does
not silently rewrite the portfolio's locked positioning or unrelated pages.

### Remote delivery

PR #143 was OPEN/DRAFT and assigned to `phsb5321` at recovery. Its old head had
ten successful checks; that old result is **not acceptance of the rescued head**.
The five effective required checks were re-read from the live main ruleset.
No CODEOWNERS file is tracked. Fresh push/CI receipts are recorded in the delivery
checkpoint below; draft and production gates remain mandatory even when green.

GitButler inspection and commit commands refused this restored linked checkout
with `No GitButler project found`. No `but setup` was run in a linked worktree,
and the shared main checkout was not reconfigured. Delivery uses worktree-local
Git on the existing explicitly assigned branch only, without history rewriting.
The installed code-slop launcher rejects `--worktree`; its documented `--staged`
mode is used instead. The initial tooling error is preserved in the gate receipt.
`code-slop-gate --staged` and `alignment-gate --worktree` both PASS. The former
reports inherited dependency vulnerabilities (including critical Next/Sentry
advisories) as baseline warnings, not fixes supplied by this visual slice; no
manifest/lockfile change is concealed in the delivery.

### Delivery checkpoint — 30/10/2026 23:23 BRT

Recovery commit **`1f6ed9fcf0bda85281d76c92c27062cb4afaecd7`** was pushed as a
normal fast-forward to the existing branch, including rescue `10841d7`.
Exact-head remote result: **10/10 SUCCESS**, including all five required checks.
[Machine receipt](evidence/visual-rollout-2026-09-28-portfolio/recovery-2026-10-30/ci-code-head.json)
/ [live main rules](evidence/visual-rollout-2026-09-28-portfolio/recovery-2026-10-30/main-rules.json).

- [CI: lint/types + build](https://github.com/yolo-labz/portfolio/actions/runs/41159394298)
- [Pinned visual regression](https://github.com/yolo-labz/portfolio/actions/runs/41159394321)
- [Lighthouse + a11y budgets](https://github.com/yolo-labz/portfolio/actions/runs/41159394311)
- [SonarQube](https://github.com/yolo-labz/portfolio/actions/runs/41159394632)
- [Code quality/alignment](https://github.com/yolo-labz/portfolio/actions/runs/41159394293)
- [CodeQL](https://github.com/yolo-labz/portfolio/actions/runs/41159394305)
- [Stealth/framing](https://github.com/yolo-labz/portfolio/actions/runs/41159394294)

PR remains **OPEN / DRAFT**, assigned to **phsb5321**, with no auto-merge enabled.
Main still points to `bf3ca9b3f3fdc890387c5c84601a96f47bc14376`; the deploy workflow
is unchanged. The subsequent report/receipt-only commit does not alter the tested
UI, browser specs, verifier or golden pixels; its own fresh required checks still apply.
The stopping boundary is green draft delivery for review, **not merge/deploy**.
No automated model review or human approval is claimed.

## Authorization and remaining gates

- Verified GitHub identity `phsb5321`; it is the repository's available assignee.
  Every PR from this slice must be assigned to that account.
- Classic branch protection returned 404, but **the active `main-protection`
  ruleset does apply**: PR + resolved threads, zero required approvals, and five
  required checks (`SonarQube scan`, `build`, `code-slop + alignment`,
  `lint-and-typecheck`, `stealth + framing terms`). No CODEOWNERS file was present.
  The `.github` repository's policy is not evidence about this repository.
- Real remote CI is required at the pushed head; local green is not a remote verdict.
  [Live PR checks](https://github.com/yolo-labz/portfolio/pull/143/checks).
  Recovery receipts below distinguish code-head checks from later report-only commits.
- Optional GLM advisory was not dispatched under the no-new-workers boundary.
- **Production authorization remains pending**: changing `apps/web/**` on main
  triggers the unchanged Dokku deployment workflow. A code PR is not deploy consent;
  do not self-merge or enable auto-merge for this slice.
- No other seat, canonical vault note, shared cache/worktree, secret, policy,
  deployment, release, organization setting or external message was changed.
- Reversal after any later authorized landing: `git revert <squash-sha>` on a new
  feature branch and submit a revert PR. Nothing is deployed by this report.
