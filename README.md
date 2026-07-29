# tarunyadgirkar.com

Personal website for Tarun Yadgirkar — AI systems, robotics, and embedded intelligence.

Built with Next.js 16 (App Router), TypeScript (strict), Tailwind CSS v4, and Framer Motion. Fully static output; deployed on Vercel.

## Editing content

All copy lives in `src/content/` — no page code needs touching for content changes:

| File | Controls |
|------|----------|
| `src/content/site.ts` | Name, positioning line, bio, email, links, focus areas, recognition list, skills, `resumeUrl` |
| `src/content/work.ts` | Featured-work rows (homepage) + full case studies (Work page) |
| `src/content/research.ts` | WIN Lab entry, publication, ROAR Academy |
| `src/content/balance.ts` | Patent page (BALANCE) |
| `src/content/archive.ts` | Archive table |
| `src/content/about.ts` | About-page paragraphs |

To enable the hero **Resume** button, set `resumeUrl` in `src/content/site.ts` to a PDF path (drop the file in `public/`, e.g. `"/tarun-yadgirkar-resume.pdf"`).

## Development

```bash
npm install
npm run dev    # http://localhost:3000
npm run lint
npm run build
```

## Deploying

Pushes to `main` auto-deploy if the repo is connected to a Vercel project. Manual deploy:

```bash
npx vercel --prod
```

After changing the production domain, update `site.url` in `src/content/site.ts` (drives sitemap, robots, and OG metadata).

## Structure

- `src/app/` — routes: `/` `/work` `/research` `/patent` `/archive` `/about`, plus `opengraph-image.tsx`, `sitemap.ts`, `robots.ts`
- `src/components/` — nav, footer, motion primitives, small UI pieces, and the schematic visual set:
  - `schematic.tsx` — the data-driven signal-path diagram, shared by `/patent` and the homepage
  - `system-rule.tsx` — the drawn hero rule (analog→digital trace, scroll-linked read-head)
  - `schematic-glyph.tsx` — self-drawing line-art glyphs for the focus-area cards
  - `section-frame.tsx` — numbered section heading + scroll-filled gutter rule
  - `spotlight.tsx` — cursor-follow tint (inert on touch and under reduced motion)
  - `signal-trace.tsx` — earlier signal-trace visual, kept for the `.design-sync` export
- `src/content/` — all site copy (typed)

All animated components read palette CSS vars only, respect `prefers-reduced-motion`, and pause offscreen (see `AGENTS.md` for details).

## Claude Code setup (`.claude/`)

This repo ships committed Claude Code config in `.claude/`, so any clone gets the same
setup automatically — Claude Code discovers `.claude/` when launched from the repo root,
and the skills below fire on their own when the matching work comes up:

- **`ship-checklist`** — the verify-before-push gate (build + lint green, screenshots in
  both themes, conventional commit to `main`).
- **`site-content`** — editing copy in `src/content/*.ts` and the non-negotiable
  positioning rules (patent wording, framing, what not to "fix").
- **`animation-components`** — the mandatory rules for visual components (palette vars
  only, reduced-motion, offscreen pause, DPR, `aria-hidden`) plus the component inventory.

`.claude/settings.json` is shared (a permissions allowlist for the routine
build/lint/dev commands). `.claude/settings.local.json` is per-developer and gitignored.
`AGENTS.md` remains the canonical living project doc these skills point back to.
