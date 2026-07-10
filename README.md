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
- `src/components/` — nav, footer, motion primitives, small UI pieces, and the hero animation set:
  - `particle-field.tsx` — canvas dust waveform (cursor-repel, idle auto-sweep)
  - `word-shape.tsx` — concrete-poetry SVG glyphs for the focus-area cards
  - `cursor-arms.tsx` — IK-driven robot arms tracking the cursor (`lg:`+ only)
  - `living-hero.tsx` — sequential hero subline captions
  - `signal-trace.tsx` — signal-trace hero visual
  - `wave-backdrop.tsx` — unused, kept as an alternate hero backdrop option
- `src/content/` — all site copy (typed)

All animated components read palette CSS vars only, respect `prefers-reduced-motion`, and pause offscreen (see `AGENTS.md` for details).
