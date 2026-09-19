# tarunyadgirkar.com

## Stack
Next.js 16 app router, React 19, TypeScript strict, Tailwind v4, three.js + @react-three/fiber + drei, motion, Phosphor icons, Vercel Analytics. pnpm.

## Rules
- The design and writing rules in `~/.claude/CLAUDE.md` apply to every UI change and every line of copy: sentence case, no eyebrows or micro-labels, no letter-spacing, no all-caps, no decorative numbers or rules, no three-card rows, no gradient text, no rounded element with a visible border (inputs excepted), prose without em dashes, verbless fragments or evaluative tags.
- Voice: builder, not student. Concrete nouns and specifics. High-school-era work stays in `/archive`.
- Vantage is always the glasses and the OS together. Rainier Labs is written "Rainier Labs, a robotics startup". BALANCE is a provisional patent, co-developed with a student team.
- Do not add SLICE Lab yet.
- Tokens live once in `src/app/globals.css`; components reference tokens, never hex.
- `pnpm lint` enforces `complexity: 10` and `max-depth: 3`; a failure is a bug.
- The R3F canvases size themselves through ResizeObserver, which never fires in a hidden browser tab or a hidden desktop-app browser pane. A 300x150 canvas in that state is the tab, not the site; verify in Playwright or a visible window.
- `src/app/opengraph-image.tsx` needs a TrueType face (Satori cannot read woff2), so `src/fonts/schibsted-600.ttf` is a static 600 instance of the heading font kept only for that image.

## Lanes
- `src/content/*` is the only place copy and facts live.
- `src/components/three/Balance.tsx` is the device in centimeters; `BalanceScene` frames any thumbnail model (`model` prop: balance, glasses, board, dog) as a turntable or front/side/top view and sizes it to the canvas. The Selected work thumbnails use it; only Bonsai and Popper are SVG (`drawings/Icons.tsx`).
- `src/components/drawings/*` are the SVG diagrams; each shows a mechanism, not an icon.
- `src/components/three/{Glasses,Arm,Board,Dog}.tsx` are the other drawn models (Dog is the Rainier thumbnail only), each in centimetres on the ground plane with a looping phase prop `t` in [0,1) and a `*_SIZE` export for framing. `HeroScene.tsx` mounts all four in one canvas and grows only the active one; per-model framing overrides live in its `FRAMING` table. `HeroCarousel.tsx` owns the timer (7 s; held on keyboard focus, hidden tab and reduced motion; a manual pick pauses it for two cycles). Copy for the switcher and captions is in `src/content/models.ts`.

## Next.js notes
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
