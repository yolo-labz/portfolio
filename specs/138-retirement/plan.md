# Plan

Hypothesis: an obsolete project catalogue entry, locale claims and independent workspace keep publishing/building a retired demonstration.

Evidence: prior R2 HTTP result was nginx welcome HTML and API 404. `projects.ts` feeds home cards, static route generation and sitemap; no remaining workspace imports the real-estate source. Its only external build reference is the root Dockerfile COPY plus pnpm workspace discovery/lockfile. History traces it to the independent Spec 004 implementation; preserve that historical spec. PR #135 additionally removes AI-document processing and is not the implementation source.

1. Remove only real-estate source and catalogue/locales/build references; retain AI-document and exec-job source/tests byte-for-byte.
2. Correct project counts and remove unsupported live-demo counts in all locales; preserve unrelated positioning text.
3. Add a small Node regression check to lint and browser assertions for retired 404 plus retained 200 routes.
4. Regenerate the existing screenshot grid from a local production build with the existing Playwright dependency. Refresh only affected baseline pages in the pinned Noble image if available; otherwise report renderer gate honestly.
5. Run commands, keep evidence in docs/evidence/swarm-2026-09-21, commit report and prepare replacement PR without closing #135.

Generator: OpenAI GPT-6 Astra. Spec/plan/tasks process only; no legacy workflow or reviewer spawn.
