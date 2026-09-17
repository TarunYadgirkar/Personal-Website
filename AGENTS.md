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

## Lanes
- `src/content/*` is the only place copy and facts live.
- `src/components/three/Balance.tsx` is the device in centimeters; `BalanceScene` frames it (turntable or front/side/top) and sizes it to the canvas.
- `src/components/drawings/*` are the SVG diagrams; each shows a mechanism, not an icon.

## Next.js notes
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
