---
name: site-content
description: >-
  Use when editing site copy, text, bio, links, work/research/archive entries, or any
  user-facing wording. All copy is typed data in src/content/*.ts — never hardcode text
  into page/component JSX. Also enforces the non-negotiable positioning rules (patent
  wording, framing, and what must not be "fixed") that must never be violated in any surface.
---

# Editing site content

**All copy lives in `src/content/*.ts` as typed data.** Pages in `src/app/` and
components in `src/components/` render it — do not hardcode user-facing text into JSX.
Change content by editing the data file; no page code should need touching for a copy
change.

| File | Controls |
|---|---|
| `site.ts` | Name, positioning line, bio, email, links, focus areas, recognition list, skills, `resumeUrl`, `site.url` |
| `work.ts` | Featured-work rows (homepage) + full case studies (Work page) |
| `research.ts` | WIN Lab entry, publication, ROAR Academy |
| `balance.ts` | Patent page (BALANCE) |
| `archive.ts` | Archive table |
| `about.ts` | About-page paragraphs |

Notes:
- Hero **Resume** button is driven by `resumeUrl` in `site.ts` (PDF dropped in
  `public/`, e.g. `/tarun-yadgirkar-resume.pdf`).
- `site.url` drives sitemap, robots, and OG metadata — update it if the domain changes.

## Positioning rules — NON-NEGOTIABLE (apply to every surface: UI, PDF, metadata)

- **BALANCE patent** is **provisional** (No. 63/743,085). Never write "granted patent",
  "patented", or imply issuance. Say "provisional patent" / "patent pending".
- **The phone number is intentionally public** in the résumé and source documents.
  Leave it alone. (A 2026-07-27 audit stripped it as a privacy issue; the user
  reverted that the same day and confirmed it is deliberate. Do not "fix" it again.)
- **Not "high school student."** Don't use that framing.
- **VEX / science-fair** material belongs in the **Archive** only — not featured work.

These are hard constraints from the project brief, not style preferences. A change that
violates one is wrong regardless of how it reads.

## After editing

Content changes still go through the full ship gate — see the `ship-checklist` skill
(build + lint + both-theme screenshots before commit to `main`).
