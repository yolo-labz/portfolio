# Visual rollout — portfolio presentation consumer

**28/09/2026 · OpenAI GPT-6 Astra · local acceptance complete; not merged or deployed.**

## Custody and scope

- Repo: `yolo-labz/portfolio`.
- Worktree: `/home/notroot/Documents/Code/yolo-labz/portfolio-20260928-org-showcase`.
- Branch: `20260928-org-showcase`; base: `bf3ca9b3f3fdc890387c5c84601a96f47bc14376`.
- Coordinator: `home-projects` / `w8:p6`; slice: portfolio presentation consumer.
- Commit/PR: awaiting the initial commit and assigned PR; landing receipt is recorded below.
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
- Two-column desktop / single-column mobile cards, existing localized taglines,
  stack labels, separately named project/source links and 44px link targets.
- Native keyboard-operable disclosure for the remaining six catalogue entries;
  the count is data-derived and remains compatible with a future retirement landing.
- Compact EN/PT/ES organization labels; no added metrics, uptime claims or ranking.
- Existing emerald/Mocha typography and colors; no substitute image, logo or full rebrand.

Key paths:

- `apps/web/src/components/sections/organization-showcase.tsx`
- `apps/web/src/components/sections/project-showcase.tsx` (only the shelf replaced)
- `apps/web/messages/{en,pt,es}.json` (`ProjectShowcase` UI labels only)
- `tests/visual/organization-showcase.spec.ts`

## Actual renders and provenance

All PNGs below are **actual local production-site screenshots**, not GPT-generated
art or approved brand masters. Chromium **151.0.7922.34**, Playwright **1.62.1**,
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
The public receipt reports **blocked before upload/send**, **0 sends / 0 generated
images**, `BrowserType.connect_over_cdp` connection closed. Sanitized receipt retained
as [`p9-generation-status.json`](evidence/visual-rollout-2026-09-28-portfolio/p9-generation-status.json).
The reference board is input, not a new GPT result; it was not imported. Exploration
is not a canonical brand master. Art consumption remains pending successful output,
provenance and permitted use. The text-first layout is independently testable.

## Executable acceptance

| Check | Result |
| --- | --- |
| `corepack pnpm install --frozen-lockfile` | PASS; no manifest/lockfile changes |
| `corepack pnpm lint` | PASS; zero hard voice failures, 39 pre-existing advisories |
| `corepack pnpm typecheck --concurrency=$(nproc)` | PASS, 7/7 Turbo tasks |
| `corepack pnpm build --concurrency=$(nproc)` | PASS, 8/8 Turbo tasks |
| Explicit TypeScript check of both browser specs | PASS |
| Pinned browser full suite, `playwright test --workers=1` | **30/30 PASS**, no retries |
| Scoped checks | Four selected projects, every remaining link, exact localized destinations, keyboard Enter/Space/Tab, visible 2px focus, ≥44px link height, all sampled text contrast ≥4.5:1, no 320px clipping |
| Snapshot boundary | Six homepage baselines refreshed; sixteen unrelated baselines unchanged; original 2% tolerance unchanged |
| `git diff --check` | PASS |
| Scope oracle | No diff in `.github`, `package.json`, `pnpm-lock.yaml`, `projects.ts`, `globals.css` |

Commands:

```bash
corepack pnpm lint
corepack pnpm typecheck --concurrency="$(nproc)"
corepack pnpm build --concurrency="$(nproc)"
corepack pnpm exec tsc --noEmit --skipLibCheck --target ES2022 \
  --module ESNext --moduleResolution bundler tests/visual/*.ts
# Existing production-server harness builds/serves the site automatically:
corepack pnpm exec playwright test organization-showcase.spec.ts
```

For byte-stable browser verification, after the build and copying `public`/`.next/static`
into the standalone bundle, run in the pinned image with only this worktree mounted:

```bash
docker run --rm --ipc=host --user "$(id -u):$(id -g)" -e HOME=/tmp \
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

## Authorization and remaining gates

- Verified GitHub identity `phsb5321`; it is the repository's available assignee.
  Every PR from this slice must be assigned to that account.
- Classic branch protection returned 404, but **the active `main-protection`
  ruleset does apply**: PR + resolved threads, zero required approvals, and five
  required checks (`SonarQube scan`, `build`, `code-slop + alignment`,
  `lint-and-typecheck`, `stealth + framing terms`). No CODEOWNERS file was present.
  The `.github` repository's policy is not evidence about this repository.
- Real remote CI is still required; local green is not a remote verdict.
- Optional GLM advisory was not dispatched under the no-new-workers boundary.
- **Production authorization remains pending**: changing `apps/web/**` on main
  triggers the unchanged Dokku deployment workflow. A code PR is not deploy consent;
  do not self-merge or enable auto-merge for this slice.
- No other seat, canonical vault note, shared cache/worktree, secret, policy,
  deployment, release, organization setting or external message was changed.
- Reversal after any later authorized landing: `git revert <squash-sha>` on a new
  feature branch and submit a revert PR. Nothing is deployed by this report.
