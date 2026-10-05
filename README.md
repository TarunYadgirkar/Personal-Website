# tarunyadgirkar.com

Personal site. Next.js 16, TypeScript, Tailwind v4, three.js through React Three Fiber for the drawn models, Phosphor icons.

```sh
pnpm install
pnpm dev
pnpm lint        # eslint with complexity capped at 10 per function
pnpm typecheck
pnpm build
```

Content lives in `src/content/` as typed data: `site.ts` (name, links, nav, the "now" block, footer copy), `home.ts` (front-page prose), `pages.ts` (each inner page's metadata, title and lead), `errors.ts`, `models.ts` (the hero carousel), `selected.ts` (the selected work list and the hackathon table), `work.ts` (case notes), `research.ts`, `balance.ts`, `archive.ts`. Pages in `src/app/` read from there.

Shared UI pieces are in `src/components/ui/`. Drawings are in `src/components/drawings/` (SVG) and `src/components/three/` (the models, drawn procedurally in centimetres, plus the shared scene set-up). `AGENTS.md` maps each file in detail.

Design tokens are defined once in `src/app/globals.css` under `@theme`; `src/lib/palette.ts` mirrors the colours for code that cannot read CSS variables. Fonts are self-hosted in `src/fonts/`: Schibsted Grotesk for headings, Hanken Grotesk for text, Geist Mono for figures that need to line up.
