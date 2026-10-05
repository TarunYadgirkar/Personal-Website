# tarunyadgirkar.com

## Stack
Next.js 16 app router, React 19, TypeScript strict, Tailwind v4, three.js + @react-three/fiber + drei, motion, Phosphor icons, Vercel Analytics. pnpm.

## Rules
- The design and writing rules in `~/.claude/CLAUDE.md` apply to every UI change and every line of copy: sentence case, no eyebrows or micro-labels, no letter-spacing, no all-caps, no decorative numbers or rules, no three-card rows, no gradient text, no rounded element with a visible border (inputs excepted), prose without em dashes, verbless fragments or evaluative tags.
- Voice: builder, not student. Concrete nouns and specifics. High-school-era work stays in `/archive`.
- Vantage is always the glasses and the OS together. Rainier Labs is written "Rainier Labs, a robotics startup". BALANCE is a provisional patent, co-developed with a student team.
- Do not add SLICE Lab yet.
- Tokens live once in `src/app/globals.css`; components reference tokens, never hex. Code that cannot read a CSS variable (three.js materials, SMIL keyframes, the OG image, `global-error.tsx`, the viewport theme colour) imports `src/lib/palette.ts`, the one mirror of those values.
- `pnpm lint` enforces `complexity: 10` and `max-depth: 3`; a failure is a bug. Run `pnpm lint && pnpm typecheck` before every commit.
- The R3F canvases size themselves through ResizeObserver, which never fires in a hidden browser tab or a hidden desktop-app browser pane. A 300x150 canvas in that state is the tab, not the site; verify in Playwright or a visible window.
- `src/app/opengraph-image.tsx` needs a TrueType face (Satori cannot read woff2), so `src/fonts/schibsted-600.ttf` is a static 600 instance of the heading font kept only for that image.

## Lanes
- `src/content/*` is the only place copy and facts live. `site.ts` holds names, links, nav, profile links and the footer copy; `home.ts` the front-page prose; `pages.ts` each inner page's metadata, title and lead; `errors.ts` the not-found and error copy (kept apart because the error pages ship with every page); `models.ts` the hero carousel (order, names, captions, loop periods); `selected.ts`, `work.ts`, `research.ts`, `balance.ts`, `archive.ts` the lists. Client components never import `pages.ts`; a server page passes them the strings they need.
- `src/components/ui/*` are the shared pieces: `ButtonLink` and `Button`, `TextLink`, `LinkRow` (a row of links), `BulletList`, `SegmentGroup` and `SegmentButton` (the pill toggles). Reuse them before writing new markup.
- `src/components/drawings/*` are the SVG diagrams; each shows a mechanism, not an icon.
- `src/components/three/` holds the drawn models, each in centimetres on the ground plane with a looping phase prop `t` in [0,1) and a `*_SIZE` export for framing: `Balance.tsx` (the device; takes `stride` instead of `t`), `Glasses.tsx`, `Arm.tsx`, `Board.tsx`, `Dog.tsx` (the Rainier thumbnail only). `drafting.tsx` has the shared materials, `Outline` and `SIDES`; `models.tsx` maps a model key to its component and still phase; `scene.tsx` has the shared canvas, light, floor shadow, turntable and `fitZoom`.
- `ModelScene.tsx` frames one thumbnail model (`model` prop: balance, glasses, board, dog) as a turntable or front/side/top view and sizes it to the canvas; the Selected work thumbnails and the /patent views use it. Only Bonsai and Popper are SVG (`drawings/Icons.tsx`).
- `HeroScene.tsx` mounts the hero models in one canvas and grows only the active one; per-model framing overrides live in its `FRAMING` table. `HeroCarousel.tsx` owns the timer (`HERO_ADVANCE_MS`, 10 s; held on keyboard focus, hidden tab and reduced motion; a manual pick pauses it for two cycles).
- Code outside `src/components/three/` imports only `three/lazy.tsx` from it, which loads the scenes in the browser after the page, so three.js stays out of the first page load.
- To check a refactor changed nothing visible: `pnpm build && pnpm start`, then take full-page Playwright screenshots of every route with `reducedMotion: "reduce"` before and after and diff the pixels. With reduced motion the canvases are deterministic.

## Next.js notes
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
