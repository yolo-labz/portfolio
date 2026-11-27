# Brand candidate validation

The required `lint-and-typecheck` CI job runs the dependency-free validator suite:

```sh
node --test qa/brand-candidate/tests/validator.test.mjs
```

The suite checks missing inputs, immutable file identities, source changes, path
containment, one-time run creation, and runtime report completeness. Synthetic
reports test the verifier. Three recovered obsolete assets test rejection against
the newer candidate hashes. Their provenance is in `fixtures/README.md`.

Automatic CI exercises the tooling. Actual candidate browser acceptance requires
the recovered source, standalone build, technical receipt and DOM mapping.
`candidate-manifest.required.json` keeps these fields empty until that recovery.
The manifest validator rejects incomplete input before starting a server.

## Run a recovered candidate

Copy the manifest template outside the repository and fill its fields from the
recovered candidate. Preserve its expected hashes. Set its state to
`ready_for_technical_validation` after reviewing that mapping. A null icon means
the corrected ICO is unmapped and untested.

Use a clean checkout of the recorded source commit and an immutable standalone
build directory. Obtain its tree digest without starting a server:

```sh
node qa/brand-candidate/scripts/preflight.mjs inventory /absolute/build/root
```

The digest identifies the observed build; its compilation relationship to the
source commit remains a reviewed input tied to the technical receipt.

From the portfolio root in the existing pinned Playwright environment, use a new
proof directory outside both the source checkout and build directory:

```sh
set -euo pipefail
export BRAND_MANIFEST=/absolute/recovered-candidate-manifest.json
export BRAND_PROOF_DIR=/absolute/existing/parent/new-proof-directory
node qa/brand-candidate/scripts/prepare-run.mjs
pnpm exec playwright test --config qa/brand-candidate/playwright.brand-candidate.config.mjs
node qa/brand-candidate/scripts/finalize-proof.mjs
```

Preparation creates the run identity once. Config, worker and server imports only
validate that record. The existing upstream Playwright configuration supplies the
desktop and mobile projects. The spec checks English, Portuguese and Spanish home
routes, actual served SVG bytes, image geometry, alt text, viewport containment
and page overflow. A mapped icon also needs the corrected response bytes.

Retain the complete proof directory on success and failure. The finalizer accepts
exactly six distinct cases with one clean pass each and matching run, source,
build, implementation and screenshot identities. It rechecks inputs after the
run. The existing browser owner reviews that evidence.

The expected container image is a declared workflow pin; actual execution image
provenance requires the CI job receipt. Technical success covers this bounded
matrix. Founder selection, final release approval, deployment and live-site
operation remain separate acceptance decisions. Screenshot baselines are never
updated by these commands.
