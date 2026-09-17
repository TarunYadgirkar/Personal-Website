# tarunyadgirkar.com

Personal site. Next.js 16, TypeScript, Tailwind v4, three.js through React Three Fiber for the BALANCE drawing, Phosphor icons.

```sh
pnpm install
pnpm dev
pnpm lint    # eslint with complexity capped at 10 per function
pnpm build
```

Content lives in `src/content/` as typed data: `site.ts` (name, links, the "now" block), `selected.ts` (the selected work list and the hackathon table), `work.ts` (case notes), `research.ts`, `balance.ts`, `archive.ts`. Pages in `src/app/` read from there. Drawings are in `src/components/drawings/` (SVG) and `src/components/three/` (the BALANCE model, drawn procedurally in centimeters).

Design tokens are defined once in `src/app/globals.css` under `@theme`. Fonts are self-hosted in `src/fonts/`: Schibsted Grotesk for headings, Hanken Grotesk for text, Geist Mono for figures that need to line up.
