# Plan

Base: `bf3ca9b3f3fdc890387c5c84601a96f47bc14376` (`origin/main`).
Worktree: `portfolio-20260928-org-showcase`; generator: OpenAI GPT-6 Astra.

1. Replace only the non-featured shelf in `project-showcase.tsx` with a scoped
   `OrganizationShowcase`. Reuse `Card`, `Badge`, `FigStamp` and localized `Link`.
   The existing `projects` array stays the sole source for titles, stack and URLs.
2. Select `wa`, `serverless-data-api`, `kokoro-speakd`, `fand` as four capability
   entry points, not a ranking of activity/popularity. Use their existing locale
   taglines. Keep all remaining non-featured projects in native `details/summary`;
   no filter state, new routes or catalogue changes.
3. Add only shelf UI labels to EN/PT/ES. Keep the emerald/Mocha theme, mono labels,
   and restrained border treatment. No image slot or synthetic artwork without p9.
4. Add Playwright contracts for selection, all remaining links, source destinations,
   keyboard focus/disclosure, widths and measured text contrast. Run in the pinned
   `v1.62.1-noble` image. Refresh only the six affected homepage snapshots; inspect
   scoped desktop/mobile captures and leave the other sixteen baselines untouched.
5. Run frozen install, lint, typecheck, build, full browser suite; open a PR assigned
   to verified identity `phsb5321`. Inspect CI and policy, never infer deploy consent.
6. Write `docs/visual-rollout-2026-09-28-portfolio.md` with exact evidence and gates.

Art dependency: p9's supplied `github-profile-010-gpt-gremlin-art/profile/assets/brand/
exploration/2026-09-28/` directory was absent at pickup, 28/09/2026 19:44 BRT.
No image generation, shared browser mutation or external publication is part of this slice.
