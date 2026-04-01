# Feature Specification: Production-Ready Portfolio Site

**Feature Branch**: `001-production-ready-site`
**Created**: 2026-03-31
**Status**: Draft
**Input**: User description: "Implement Phase 0 of the roadmap — make the portfolio site production-ready with 404 pages, error handling, favicon, OG images, robots.txt, sitemap, mobile navigation, accessibility improvements, structured data, and Lighthouse optimization."

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Visitor lands on a broken URL (Priority: P1)

A potential Upwork client clicks a mistyped or outdated link and reaches a URL that doesn't exist on the portfolio. Instead of a browser default error or a blank page, they see a branded 404 page that guides them back to the homepage or project list.

**Why this priority**: A broken page makes the portfolio look unfinished. Clients evaluating a developer's attention to detail will notice. This is the single most damaging gap.

**Independent Test**: Navigate to `/this-page-does-not-exist` and `/projects/nonexistent-slug`. Both MUST render a styled 404 page inside the site layout with a working link to the homepage.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to a URL that matches no route, **When** the page loads, **Then** a custom 404 page is displayed within the site's Header/Footer layout, showing a message and a link to return home.
2. **Given** a visitor navigates to `/projects/invalid-slug`, **When** the `notFound()` function fires, **Then** the same custom 404 page is displayed with correct HTTP 404 status code.
3. **Given** a runtime error occurs in any page component, **When** the error boundary catches it, **Then** a styled error page is displayed with a "Try again" button that re-renders the route segment.

---

### User Story 2 — Visitor shares the portfolio on social media (Priority: P1)

A recruiter or client shares Pedro's portfolio URL on LinkedIn, Slack, or Twitter. The shared link MUST render a rich preview card with a branded image, title, and description — not a blank card or generic favicon.

**Why this priority**: Social sharing is the primary organic distribution channel for a freelancer portfolio. A blank preview card signals amateurism.

**Independent Test**: Paste `https://<domain>/` and `https://<domain>/projects/realestate-price-tracker` into the LinkedIn post composer (or use opengraph.xyz). Both MUST show a branded image, title, and description.

**Acceptance Scenarios**:

1. **Given** a visitor shares the homepage URL, **When** the social platform fetches the page metadata, **Then** it displays: a branded OG image (1200x630), the title "Pedro Balbino — Software Engineer", and a concise description.
2. **Given** a visitor shares a project page URL, **When** the platform fetches metadata, **Then** it displays: a project-specific OG image with the project title, and the tagline as description.
3. **Given** the site is loaded in a browser, **When** the browser renders the tab, **Then** a custom favicon is displayed (not the Next.js default or a blank icon).

---

### User Story 3 — Visitor browses on a mobile device (Priority: P1)

A client views the portfolio on their phone. The navigation MUST be usable on small screens — currently the header overflows and nav links are inaccessible on mobile.

**Why this priority**: Over 50% of web traffic is mobile. A broken mobile nav makes the portfolio unusable for half the audience.

**Independent Test**: Open the site on a 375px-wide viewport. All navigation items MUST be reachable via a mobile menu toggle, with touch targets of at least 44x44 pixels.

**Acceptance Scenarios**:

1. **Given** a visitor opens the site on a screen narrower than 768px, **When** the page loads, **Then** the inline nav links are hidden and a hamburger menu button is visible.
2. **Given** the hamburger button is tapped, **When** the mobile menu opens, **Then** a slide-in drawer displays all navigation links with a minimum touch target of 44x44px, and the page background scrolls are locked.
3. **Given** the mobile menu is open, **When** the visitor taps a nav link, **Then** the menu closes and the page scrolls to the target section.
4. **Given** the mobile menu is open, **When** the visitor presses Escape or taps the backdrop, **Then** the menu closes.

---

### User Story 4 — Visitor with a disability uses the portfolio (Priority: P2)

A visitor using a screen reader, keyboard-only navigation, or reduced-motion preferences can access all content and navigate the site without barriers.

**Why this priority**: Accessibility is both a legal requirement in many jurisdictions and a signal of engineering quality. Government and enterprise Upwork clients often require WCAG compliance.

**Independent Test**: Navigate the entire site using only a keyboard (Tab, Enter, Escape). All interactive elements MUST receive visible focus indicators. VoiceOver/NVDA MUST announce page sections and navigation correctly.

**Acceptance Scenarios**:

1. **Given** a keyboard user presses Tab on page load, **When** focus lands on the first interactive element, **Then** a "Skip to main content" link is visible and functional, bypassing the navigation.
2. **Given** a screen reader user navigates the page, **When** they encounter each major section, **Then** the section heading is announced via `aria-labelledby` attributes on landmark `<section>` elements.
3. **Given** a user has `prefers-reduced-motion: reduce` enabled, **When** they load any page, **Then** all Motion animations are suppressed — elements appear in their final state without transitions.
4. **Given** a keyboard user navigates the mobile menu, **When** the drawer is open, **Then** focus is trapped within the drawer until it is closed.

---

### User Story 5 — Search engine crawls the portfolio (Priority: P2)

Google, Bing, and other search engines can discover, crawl, and index all public pages. The site provides structured data to enhance search result appearance (rich snippets).

**Why this priority**: SEO drives organic discovery. Clients searching for "freelance data extraction engineer" or Pedro's name should find the portfolio.

**Independent Test**: Run Google's Rich Results Test on the homepage URL. The tool MUST detect valid Person and WebSite schemas. Verify `robots.txt` allows all crawlers and `sitemap.xml` lists all public pages.

**Acceptance Scenarios**:

1. **Given** a search engine requests `/robots.txt`, **When** the file is served, **Then** it allows all user agents to crawl all paths and references the sitemap URL.
2. **Given** a search engine requests `/sitemap.xml`, **When** the file is served, **Then** it lists the homepage and all project detail pages with last-modified dates and priority values.
3. **Given** a search engine parses the homepage, **When** it reads the JSON-LD block, **Then** it finds valid `Person` schema (name, jobTitle, knowsAbout, sameAs) and `WebSite` schema (name, url).
4. **Given** a search engine parses a project page, **When** it reads the JSON-LD block, **Then** it finds a valid `CreativeWork` schema linking to the Person.

---

### User Story 6 — Portfolio scores 95+ on Lighthouse (Priority: P2)

Running a Lighthouse audit on the deployed portfolio returns scores of 95 or higher across Performance, Accessibility, Best Practices, and SEO categories.

**Why this priority**: Lighthouse scores are an objective quality bar. Anything below 90 signals rough edges; 95+ demonstrates production polish.

**Independent Test**: Run `npx lighthouse https://<domain>/ --output json` and verify all four scores are >= 95.

**Acceptance Scenarios**:

1. **Given** the homepage is audited with Lighthouse, **When** the audit completes, **Then** all four scores (Performance, Accessibility, Best Practices, SEO) are 95 or higher.
2. **Given** a project detail page is audited, **When** the audit completes, **Then** all four scores are 95 or higher.

---

### Edge Cases

- What happens when JavaScript is disabled? Pages MUST still render (SSG/static HTML).
- What happens when the site is loaded over slow 3G? Hero section MUST paint within 3 seconds (LCP target).
- What happens when a user has a very narrow viewport (320px)? Layout MUST not overflow horizontally.
- What happens when a project is added to `projects.ts` but no OG image route exists? A fallback global OG image MUST be served.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Site MUST render a custom 404 page for unmatched routes, inside the root layout, with a link back to the homepage.
- **FR-002**: Site MUST render an error boundary page for runtime errors, with a retry mechanism.
- **FR-003**: Site MUST serve a custom favicon (`.ico` for legacy, `.svg` for modern browsers, `apple-touch-icon` for iOS).
- **FR-004**: Site MUST serve a `manifest.webmanifest` file with name, icons, and theme color.
- **FR-005**: Site MUST serve a `robots.txt` that allows all crawlers and links to the sitemap.
- **FR-006**: Site MUST serve a `sitemap.xml` listing all public pages (homepage + all project detail pages) with lastModified dates and priority values.
- **FR-007**: Site MUST generate OG images (1200x630 PNG) — a global default for the homepage and per-project images for each `/projects/[slug]` page.
- **FR-008**: Site MUST include JSON-LD structured data: `Person` + `WebSite` schemas on the homepage, `CreativeWork` schema on project pages.
- **FR-009**: Header MUST display a hamburger menu on viewports below 768px, opening a slide-in drawer with all navigation links.
- **FR-010**: Mobile drawer MUST lock background scrolling, support Escape key to close, and trap focus within the drawer while open.
- **FR-011**: Site MUST include a "Skip to main content" link as the first focusable element.
- **FR-012**: All section elements MUST have `aria-labelledby` attributes pointing to their heading elements.
- **FR-013**: All interactive elements MUST have visible `:focus-visible` outlines.
- **FR-014**: Site MUST include a `<meta name="theme-color">` tag matching the background color.
- **FR-015**: Site MUST include a `resume.pdf` file in `public/` that is served when the "Download Resume" link is clicked.

### Key Entities

- **OG Image**: A 1200x630 PNG generated at build time via `next/og` `ImageResponse`. One global, one per project slug.
- **Structured Data**: JSON-LD blocks embedded as `<script type="application/ld+json">` in the page HTML.
- **Mobile Drawer**: A client-side component using Motion's `AnimatePresence` for enter/exit transitions.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All four Lighthouse scores (Performance, Accessibility, Best Practices, SEO) are 95 or higher on both homepage and a project page.
- **SC-002**: OG images render correctly when the homepage and a project page URL are tested on opengraph.xyz or LinkedIn post composer.
- **SC-003**: Site is fully navigable using only a keyboard, with all interactive elements receiving visible focus.
- **SC-004**: Mobile navigation is fully functional on a 375px viewport — all links are reachable via the hamburger menu.
- **SC-005**: `robots.txt` and `sitemap.xml` are valid and accessible at their respective URLs.
- **SC-006**: Google's Rich Results Test detects valid `Person` and `WebSite` schemas on the homepage.
- **SC-007**: Custom 404 page renders for both unmatched routes and invalid project slugs, returning HTTP 404 status.

## Assumptions

- The site will be deployed to Vercel (or a similar static hosting platform) before Lighthouse audits are run on production.
- The `resume.pdf` file will be provided by the user (Pedro) — a placeholder will be used during development.
- The site domain is not yet finalized; structured data and sitemap URLs will use a placeholder domain that can be swapped via environment variable (`NEXT_PUBLIC_SITE_URL`).
- The `next/og` `ImageResponse` API is used for OG image generation (not external services).
- The experimental `globalNotFound` feature is NOT used — the standard `not-found.tsx` inside the root layout is sufficient for this site structure.
