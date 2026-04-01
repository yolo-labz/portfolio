# Production Readiness Checklist: Production-Ready Portfolio Site

**Purpose**: Validate that all requirements for Phase 0 are complete, clear, consistent, and measurable before implementation
**Created**: 2026-03-31
**Feature**: [spec.md](../spec.md)
**Plan**: [plan.md](../plan.md)

## Requirement Completeness

- [ ] CHK001 Are error recovery requirements defined beyond the retry button — e.g., what happens if retry also fails? [Gap, Spec §US1]
- [ ] CHK002 Are 404 page content requirements specified — what text, links, or suggestions should appear? [Completeness, Spec §FR-001]
- [ ] CHK003 Are error boundary content requirements specified — what message, styling, and actions beyond "Try again"? [Completeness, Spec §FR-002]
- [ ] CHK004 Are favicon color values and branding elements explicitly defined (e.g., "P" letter, accent color, background)? [Completeness, Spec §FR-003]
- [ ] CHK005 Are web manifest icon size requirements specified (192x192, 512x512, or other)? [Completeness, Spec §FR-004]
- [ ] CHK006 Are sitemap priority values defined for each page type (homepage vs project pages)? [Completeness, Spec §FR-006]
- [ ] CHK007 Are all JSON-LD `Person` fields enumerated — which `knowsAbout` terms, which `sameAs` URLs? [Completeness, Spec §FR-008]
- [ ] CHK008 Are hamburger icon visual specifications defined (three lines, X transition, size)? [Gap, Spec §FR-009]
- [ ] CHK009 Are mobile drawer width, background, and animation direction requirements specified? [Gap, Spec §FR-009]
- [ ] CHK010 Is the `resume.pdf` content scope defined — is a blank placeholder acceptable for launch? [Completeness, Spec §FR-015]

## Requirement Clarity

- [ ] CHK011 Is "inside the root layout" quantified — does it mean Header + Footer visible, or just the same CSS? [Clarity, Spec §FR-001]
- [ ] CHK012 Is "retry mechanism" defined — does `unstable_retry` re-render the segment or the full page? [Clarity, Spec §FR-002]
- [ ] CHK013 Is "allows all crawlers" specific — should `Disallow` lines exist for `/api/` or other non-content routes? [Clarity, Spec §FR-005]
- [ ] CHK014 Is "branded OG image" defined with specific visual elements (name, title, colors, layout)? [Clarity, Spec §FR-007]
- [ ] CHK015 Is "slide-in drawer" direction specified (left-to-right, right-to-left)? [Clarity, Spec §FR-009]
- [ ] CHK016 Is "lock background scrolling" defined — is `overflow: hidden` on body the required approach, or are alternatives acceptable? [Clarity, Spec §FR-010]
- [ ] CHK017 Is the skip-to-content link's visibility behavior specified — always visible, or only on focus? [Clarity, Spec §FR-011]
- [ ] CHK018 Is "visible `:focus-visible` outlines" quantified with outline width, color, and offset? [Clarity, Spec §FR-013]

## Requirement Consistency

- [ ] CHK019 Are mobile breakpoint thresholds consistent — FR-009 says "below 768px" while research says `md:` breakpoint — are these the same? [Consistency, Spec §FR-009 vs Plan §R7]
- [ ] CHK020 Do OG image requirements align between spec (FR-007: "global default + per-project") and plan (Step 4: specific file paths)? [Consistency]
- [ ] CHK021 Are all nav items listed in the header also required in the mobile drawer? [Consistency, Spec §FR-009 vs US3]
- [ ] CHK022 Is the theme-color value consistent with the `--color-bg` CSS variable defined in globals.css? [Consistency, Spec §FR-014]

## Acceptance Criteria Quality

- [ ] CHK023 Can "custom favicon is displayed (not the Next.js default)" be objectively verified across browsers? [Measurability, Spec §US2.3]
- [ ] CHK024 Can "minimum touch target of 44x44px" be measured — is padding included in the measurement? [Measurability, Spec §US3.2]
- [ ] CHK025 Can "all Motion animations are suppressed" be verified exhaustively — is there a list of animated components? [Measurability, Spec §US4.3]
- [ ] CHK026 Is the Lighthouse 95+ target qualified with specific conditions — device type, network throttling, number of runs? [Measurability, Spec §SC-001]

## Scenario Coverage

- [ ] CHK027 Are requirements defined for what happens when the mobile drawer is open and the viewport is resized above 768px? [Coverage, Edge Case]
- [ ] CHK028 Are requirements defined for OG image rendering when the site has no custom domain yet (Vercel preview URL)? [Coverage, Edge Case]
- [ ] CHK029 Are requirements defined for JSON-LD behavior when `NEXT_PUBLIC_SITE_URL` env var is not set? [Coverage, Edge Case]
- [ ] CHK030 Are requirements defined for sitemap behavior when a new project is added to `projects.ts`? [Coverage, Spec §FR-006]
- [ ] CHK031 Are requirements defined for the error boundary when the error occurs during static generation (build time)? [Coverage, Gap]
- [ ] CHK032 Are keyboard navigation requirements specified for the hamburger button itself (Enter + Space activation)? [Coverage, Spec §FR-010]
- [ ] CHK033 Are requirements defined for screen readers announcing the mobile drawer open/close state? [Coverage, Spec §US4]

## Non-Functional Requirements

- [ ] CHK034 Are LCP and CLS targets explicitly stated as requirements or only implied by Lighthouse score? [Gap, Spec §SC-001]
- [ ] CHK035 Are bundle size requirements defined — is there a max first-load JS target? [Gap]
- [ ] CHK036 Are contrast ratio requirements specified for the dark theme beyond "oklch values should pass"? [Gap, Spec §US4]
- [ ] CHK037 Are requirements defined for site behavior with JavaScript disabled (SSG graceful degradation)? [Gap, Spec §Edge Cases]

## Dependencies & Assumptions

- [ ] CHK038 Is the assumption that "resume.pdf will be provided by the user" validated — is there a timeline? [Assumption, Spec §Assumptions]
- [ ] CHK039 Is the assumption that "experimental globalNotFound is not needed" validated against current routing? [Assumption, Spec §Assumptions]
- [ ] CHK040 Is the dependency on `NEXT_PUBLIC_SITE_URL` documented in the deployment guide or `.env.example`? [Dependency, Plan §Step 1]

## Notes

- Focus areas: UX/Accessibility, SEO/Discoverability, Error Handling, Performance
- Depth: Standard (pre-implementation gate)
- Audience: Author + implementing agent
- This checklist validates the REQUIREMENTS quality, not the implementation
- Items reference spec sections (§FR-xxx, §US-x, §SC-xxx) and plan sections (§Step x, §Rx) for traceability
- 40 items across 7 categories, covering completeness, clarity, consistency, measurability, scenario coverage, non-functional requirements, and dependencies
