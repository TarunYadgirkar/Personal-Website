# design-sync notes

- Repo is a Next.js 16 app, not a component library — no dist/, converter runs in synth-entry mode from `src/`.
- Compiled Tailwind v4 CSS comes from `next build` output (`.next/static/css/*.css`, hashed name). `buildCmd` copies it to the stable path `.design-sync/.cache/tailwind.css` which `cssEntry` points at — run `buildCmd` before the converter or the CSS is stale/missing.
- `Nav` (next/link + usePathname) and `HeroVisual` (next/image) are excluded via `componentSrcMap: null` — they need the Next runtime and would throw in previews.
- Fonts: Schibsted Grotesk + IBM Plex Mono load via next/font/google; the built CSS carries `@font-face` with `/_next/static/media/*.woff2` URLs. Expect `[FONT_MISSING]`/`[FONT_DANGLING]` — resolve by wiring the built woff2 files via `extraFonts`.
- User's own dev server often runs on port 3007 from this dir; `next build` shares `.next/` with it — harmless but dev may recompile after a build.
- Converter needs `--entry ./src/components/index.ts` (barrel written for the sync — the app itself never imports it). Without `--entry` the converter looks for `node_modules/<pkg>` and crashes.
- Framer-motion entrance animations (Reveal/HeroReveal/SignalTrace) raced the capture screenshot (second navigation is fully cached, networkidle fires before the ~300ms animation) — solved via `cfg.provider = PageRoot` with `props.staticMotion: true`, which sets framer-motion's `MotionGlobalConfig.skipAnimations` from inside the bundle so every animation renders at its final state. Do NOT drop this prop or animated cards go blank again.
- `PageRoot` (src/components/page-root.tsx) exists primarily for the DS export: standalone equivalent of the app's body styling + the staticMotion switch. The Next app doesn't use it.
- Playwright: cached chromium build 1223 in ~/Library/Caches/ms-playwright pins playwright@1.60.0 (installed in .ds-sync).

## Re-sync risks

- `cssEntry` / fonts come from `next build` output copied by `buildCmd` — Turbopack writes CSS to `.next/static/chunks/*.css` (NOT `static/css/`); if Next changes this layout the copy step in `buildCmd` silently grabs nothing.
- Compiled Tailwind CSS only contains classes the site's sources use; conventions.md enumerates them. Adding/removing site classes changes that vocabulary — re-validate conventions.md's class table on re-sync.
- site content (`src/content/*.ts`) is inlined into the bundle (Footer shows real emails); content edits change render hashes for Footer.
- Barrel `src/components/index.ts` must list any new component; also add it to `componentSrcMap`.
