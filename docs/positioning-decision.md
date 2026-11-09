# Decision: the site keeps its category (option C holds, B is not taken)

**Status:** decided 08/11/2026 by the portfolio lane (`wT:p9`), on Pedro's delegation of the same
day. **Supersedes:** the open "B or C" fork recorded on 02/11 (the COPY-SPLIT-C evidence row).
**Companion:** [`share-card-decision.md`](./share-card-decision.md). Option A shipped in #193, and
it closed the one visible leak C had left.

## The two options

- **B: full re-position.** Move the site off *Compliance-Grade AI Architect* onto the org
  one-liner. This touches the `<title>`, JSON-LD `name`/`jobTitle`, three locale catalogues (71/75/74
  matches of `complian|conformidad|cumplimiento|audit|regulated|regulad` in en/pt/es), the five featured case studies, a
  constitution v1.1.0 amendment (Principle I audience, Content & Copy), new locked copy in the
  vault corpus first (CLAUDE.md: copy is never regenerated), and Playwright/Lighthouse baseline
  churn.
- **C: the current split.** The site keeps its locked category. The org profile keeps the
  tool-maker sentence, and the repo docs stay aligned to `yolo-labz/.github`
  `docs/brand-positioning.md` (done in #181).

## Rationale

C holds because nothing a visitor can see on 08/11/2026 contradicts it once #193 is live. The org
profile and the site describe two different subjects. One is an org of six open-source tools ("Small
tools. Deliberate automation."). The other is a person whose case studies are regulated-work decision
records. The org profile never links to the site, and the site describes the org in the org's own
words: "Open-source tools, by yolo-labz" and "Repositories are public under github.com/yolo-labz". So
neither surface has a sentence that the other one denies. The one place the two met was the share
card. A share of the site used to render the org sentence, a sentence the site never makes. Option A
removed that. B would not remove any inconsistency. It would create one with the blog, whose lead post
is "Compliance-grade RAG for tier-1 LATAM banking". It would also drop the claim that the five case
studies and the thesis page support, and it would need new locked copy and a constitution amendment
before a single line could change. That is a large re-position with no visible defect to fix, so it
stays untaken. If the intent ever becomes "the site is the org's shop window", then B is the honest
way to say it, and this record is the place to reverse.

## Evidence (measured 08/11/2026: live pages through the server browser, anonymous identity; source on main `05ee68e`)

| Surface | What it claims | Mentions the other's sentence? |
| --- | --- | --- |
| Org profile `github.com/yolo-labz` (`profile/README.md`) | "Small tools. Deliberate automation." + six tool bullets | 0× "Compliance-Grade"/"AI Architect"; no link to the site or the blog |
| Site `/en` `<title>`, `og:title` | "Pedro Balbino — Compliance-Grade AI Architect" | org named only as the home of the public repos |
| Site `/en` `<h1>` | "AI stacks fail their first audit at three seams: prompt provenance, retrieval lineage, output attestation." | — |
| Site share card (before #193) | org card: "yolo-labz · Small tools. Deliberate automation." | **yes, the visible leak, now closed by #193** |
| Site share card (after #193) | the site's name, role and `<h1>` on the brand frame | no |
| Blog home `blog.home301server.com.br` | "Engineering writeups"; lead post "Compliance-grade RAG for tier-1 LATAM banking" | consistent with the site |
| Blog `/about` (+ `pt`, `es`, JSON-LD `description`) | "Senior SWE — AI-native automation. Ships Claude Code plugins…" | **a third headline; see below** |

Source counts on site main (`apps/web/src`, `apps/web/messages`): "Compliance-Grade" 8, "AI Architect" 9,
"Small tools"/"Deliberate automation" 0, "yolo-labz" 38 (repo links and the org attribution).

## What C leaves, and where it belongs

The blog's About page opens with **"Senior SWE — AI-native automation"** in all three locales and in
its JSON-LD `description`. The site is one click away (the blog nav links to "Portfolio"). That is the
remaining headline a visitor can see differ. B does not fix it, because the org one-liner is a fourth
wording, not that one. It is a blog-copy alignment in `phsb5321/blog` (`content/about{,.pt,.es}.md`,
`layouts/partials/structured-data.html`), and the blog's own publish gate applies. The same page also
asserts "SLSA L2" hardening, which needs the claim check `brand-positioning.md` applies to the org copy
before it is kept.
