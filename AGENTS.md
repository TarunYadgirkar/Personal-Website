# AGENTS.md — project context & handoff

Canonical living doc for any Claude Code or Codex session working in this repo. **Read this first. Update the "Current status" section at the end of any session that changes ongoing work.**

## Project

Tarun Yadgirkar's personal site. Live: https://tarunyadgirkar.com (repo `TarunYadgirkar/Personal-Website`, auto-deploys `main` via Vercel).

- Stack: Next.js 16 (App Router), React 19, TypeScript strict, Tailwind v4, `motion` 12 (motion.dev — the renamed framer-motion; import from `motion/react`), Lenis. Package manager: **npm** (no pnpm on this machine).
- All copy lives in `src/content/*.ts`. Components in `src/components/`. Pages in `src/app/`.
- Theme: `next-themes` class strategy (`.dark` on `<html>`, persisted in localStorage `theme`). Light = warm parchment; dark = deep navy. Accent = rust (light) / amber (dark).

## Commands

- `npm run dev` — dev server on :3000
- `npm run build` — prod build (includes typecheck)
- `npm run lint` — eslint

## Working agreements (protocols)

- **Commit directly to `main`.** No feature branches for this repo. Push frequently for a consistent commit history; `main` auto-deploys to prod, and the user reviews on the live/preview site.
- **Verify before push:** `npm run build` + `npm run lint` green, and screenshot the affected UI in BOTH themes. Never claim done without evidence.
- **Conventional commits** (`feat:`/`fix:`/`chore:`/`docs:`), short imperative subject.
- **Division of labor:** Opus/Claude does the hard thinking, planning, and design-critical code (e.g. IK math, novel visuals). Sonnet subagents and Codex do mechanical execution (build-fix loops, screenshot capture, transcribing a specified change). Keep heavy/iterative work off the main context.
- **Positioning rules** (from info2.md): never say "granted patent"/"patented" for BALANCE (it's provisional, No. 63/743,085); the phone number is intentionally public in the résumé and source documents; not "high school student"; VEX/science-fair → Archive only.

## Visual system (rebuilt 2026-07-29)

The site's visual language is the **engineering schematic**: hairline `rgba` borders,
2px radii, mono metadata with `·` separators, drawn line-work at 1.5–1.75 stroke, and
accent rationed to a handful of places per page. It started on `/patent` and now runs
across every route.

**All visual components must:** use palette CSS vars only (`--color-accent`, `--color-fg`,
`--color-bg`, `--color-line`, etc. — never hardcoded hex); respect `prefers-reduced-motion`
by rendering one static *complete* frame (no rAF/loops); be `aria-hidden` if decorative;
and, if they use canvas, be DPR-aware and pause offscreen (IntersectionObserver +
`visibilitychange`). Nothing currently uses canvas — the whole set is SVG or CSS.

**Scroll motion runs on GSAP** (`src/lib/gsap.ts` — the single plugin registration point;
import `gsap`/`ScrollTrigger`/`SplitText`/`DrawSVGPlugin` from there, never from `gsap`
directly). `motion` is still the right tool for entrance reveals, `AnimatePresence`, and
layout; GSAP owns anything scrubbed, drawn, or sequenced. Every new scroll component
follows the same shape: `useGSAP` for scoping and cleanup, `gsap.matchMedia()` with **both**
a `FULL_MOTION` and a `REDUCED_MOTION` branch, and the reduced branch painting the
*finished* frame — the global reduced-motion clamp in `globals.css` only reaches CSS
transitions, so a GSAP tween parked at `drawSVG: "0%"` would render an invisible diagram.

- `src/components/schematic.tsx` — `Schematic`: the data-driven signal-path diagram
  (columns → nodes → arrows). Shared by `/patent` (`balance.signalPath`) and the homepage
  (`site.buildPipeline`). Two load-bearing details: `className="contents"` dissolves the
  per-column wrapper so arrows are flex siblings, and the frame is `bg-bg` while nodes are
  `bg-surface` so nodes read as raised *out of* the drawing. Exactly one `isAccent` node
  per diagram. An opt-in `animate` prop wraps it in `SchematicMotion` so it assembles
  stage by stage on scroll — **left off for `/patent`, deliberately**, which keeps that
  page's markup server-rendered and its pixels identical.
- `src/components/hero-plate.tsx` — `HeroPlate`: the homepage's drawing sheet. Owns the one
  scroll range (`[data-hero-frame]`, `top center` → `+=60%`) that `SystemRule` and
  `KinematicRig` both build against, which is what makes the arm move as the trace reaches
  `actuate`. Not pinned — see the 2026-08-07 note below.
- `src/components/kinematic-rig.tsx` — `KinematicRig`: a three-link planar arm as an
  orthographic plate, posed by forward kinematics from scroll progress, with live mono
  angle/TCP readouts. Poses in `KEYS` were solved so the tool lands on the pick table and
  the drop zone; the furniture is positioned *from* the solved poses, so moving one means
  re-deriving the other. No cursor tracking, no IK, no React state per frame.
- `src/components/schematic-motion.tsx`, `row-reveal.tsx`, `axis-reveal.tsx` — the reusable
  scroll behaviours. They find their targets by data attribute (`data-schematic-node` /
  `data-row` + `data-row-rule` + `data-row-part` / `data-axis` + `data-axis-dot`) so the
  markup stays in the page and these only supply motion.
- `src/components/system-rule.tsx` — `SystemRule`: the hero divider. An analog wave
  resolving to digital, drawn as a dimensioned rule with a scroll-linked read-head. Sine
  control points are `-16`/`104` **by derivation, not eyeball** — a quadratic's midpoint is
  `0.25·y₀ + 0.5·cy + 0.25·y₁`, which against the baseline of 44 lands peaks exactly on the
  square wave's 14/74 rails. Station labels anchor to real events in the trace. The trace is
  split at the `x=480` conversion point so the square wave snaps on as the read-head crosses
  `infer`, and the two animated paths deliberately **omit `vector-effect: non-scaling-stroke`**
  — it makes the browser interpret `stroke-dasharray` in screen units, which is exactly the
  mechanism DrawSVG uses to meter the reveal. They carry `strokeWidth={2}` to compensate.
- `src/components/schematic-glyph.tsx` — `SchematicGlyph`: the 5 focus-area glyphs
  (`chip | rover | graph | mic | hand`), self-drawing via `pathLength`. **Monochrome —
  the user explicitly rejected accent colour in these.** Circles must be written as two
  half-arcs (`a r,r 0 1,0 2r,0` twice); the single-arc shorthand degenerates at 360° and
  renders as a lump.
- `src/components/section-frame.tsx` — `SectionFrame`: numbered inline heading plus a
  scroll-filled left gutter rule. Used by every page. It is `position: relative`, which
  makes it the `offsetParent` for headings inside it — see the `section-nav.tsx` gotcha
  below.
- `src/components/spotlight.tsx` — `Spotlight`: cursor-follow tint adapted from KokonutUI
  onto our tokens. Returns children unwrapped under reduced motion **and** on coarse
  pointers, so touch gets nothing.
- `src/components/motion.tsx` — shared primitives. `Reveal` takes a `variant`
  (`up | mask | stagger`) so scroll entrances aren't one uniform fade; `WordReveal` does
  the hero headline word-by-word.
- `src/components/signal-trace.tsx` — **unused by the app**, but exported from
  `src/components/index.ts` and consumed by `.design-sync/`. Don't delete it.
- Design specs: `docs/superpowers/specs/2026-07-08-cool-animations-design.md` describes the
  *previous* (deleted) animation set — historical only. The 2026-07-29 status block below
  is the current record.

**Deleted 2026-07-29, do not resurrect without asking:** `particle-field.tsx` (canvas dust
waveform), `cursor-arms.tsx` (IK robot arms), `word-shape.tsx` (concrete-poetry glyphs),
`living-hero.tsx` (`SequentialCaptions`), `wave-backdrop.tsx`. The user rejected each of
these by name.

## Current status / ongoing

> This is an append-only log, newest at the bottom. **Entries are historical records, not
> current state** — the 2026-07-08 and 2026-07-09 entries describe components that were
> deleted on 2026-07-29. Read the "Visual system" section above for what actually exists,
> and the newest entry here for where things stand.

**2026-07-08 — animation pass.** Iterated live with the user across several rounds. State:

- DONE + on main: ParticleField (waveform-only + cursor-repel + timed auto-sweep); WordShape glyphs wired into the 5 focus cards, size-18/weight-700; CursorArms as 2-bone IK arms + parallel-jaw gripper + clamped cones; SequentialCaptions on the hero subline. Focus glyphs finalized: embedded-ml=chip, robotics=rover, applied-ai=neural network, voice-agents=mic, assistive-robotics=heart. Hero background is PLAIN (blobs then waves both tried and rejected by the user; `WaveBackdrop` kept as an unused export only).
- All verified green (build+lint) and screenshot-checked in both themes before push.

**2026-07-09 — motion/integration follow-up + seamless waveform fix (merged to main).** User feedback: icons needed more motion, particle trail needed to feel more integrated with the site, and the wave-to-box join in the particle waveform should be seamless.

- `WordShape` now loops a seamless marquee drift (`y: [0, -ROW_STEP]`, linear, infinite) of the tiled text plus a slow breathing pulse on the outline stroke opacity, both skipped under reduced-motion.
- `ParticleField`'s hero wrapper dropped its `border-b` box treatment; the canvas gained a `.fade-x` mask (new util in `globals.css`) so the dust fades at its left/right edges instead of ending in a hard rectangle.
- `drawWaveform`'s sine segment used to end at an arbitrary phase then jump straight to `mid - amp` to start the box wave (visible snap). Tuned the cycle count to 2.25 so the sine lands exactly on that peak — box wave now picks up with no jump.
- Verified green (build+lint) and screenshot-checked in both themes each round, plus a 2.5s-apart screenshot pair confirming the drift/pulse actually animate.
- DONE + on main as of this pass. No open follow-ups.

**2026-07-09 — Lenis smooth scroll (merged to main).** Added `lenis` (npm `lenis` package, `lenis/react` bindings) for inertial scrolling site-wide.

- `src/components/smooth-scroll.tsx` — `SmoothScroll`: wraps the app in `<ReactLenis root>` (no extra DOM wrapper). Falls back to `lerp: 1, duration: 0, smoothWheel: false` under `prefers-reduced-motion` (component tree stays identical either way — only the Lenis options differ — so there's no hydration mismatch).
- Wired into `layout.tsx` around `ThemeProvider`. `anchors: true` makes Lenis auto-intercept in-page `href="#..."` clicks (skip link, `SectionNav` dots), so no per-link code changes were needed.
- `back-to-top.tsx` and `scroll-for-more.tsx` now call `lenis.scrollTo(...)` (via `useLenis()`) instead of native `window.scrollTo`/`scrollBy`, with a native fallback if `lenis` isn't mounted yet.
- `globals.css` overrides `scroll-behavior: auto !important` while `.lenis-smooth` is on `<html>` — Lenis's own recommended setup, since native CSS smooth-scroll would otherwise double up with Lenis's easing on every programmatic scroll.
- Verified: `html.lenis` class present, wheel-scroll and anchor-click both produce a decelerating eased scrollY curve (checked via a Playwright script sampling `window.scrollY`), build+lint green, screenshot-checked in both themes for layout regressions.
- Note: rebased on top of a concurrent session's commits (CursorArms gating, security headers, `next.config.ts` redirect) — one trivial rename conflict in `back-to-top.tsx`, resolved.
- DONE + on main as of this pass. No open follow-ups.

**2026-07-09 — mobile audit (merged to main).** User asked to verify the whole site works on phone. Ran a Playwright audit (iPhone 13 viewport) across all 6 routes × both themes: no horizontal overflow anywhere, `CursorArms` correctly absent (its `lg:` matchMedia gate works), Lenis doesn't set any `touch-action`/`overflow` that would block native touch scroll, sticky nav genuinely stays pinned (the "double header" look on scroll is just the intended `bg-bg/90 backdrop-blur-sm` translucency, not a bug).

- Found a real bug: `SocialBubble` (fixed `bottom-5 right-5`) floats in the page's side gutter on desktop (safe because content is capped at `max-w-5xl` and centered), but on mobile content runs edge-to-edge, so the pill sat directly on top of body text — confirmed via bounding-box intersection checks, it overlapped real copy on **every single page** at first paint.
- Fix: `social-bubble.tsx` now hides the floating pill below `md:` (`hidden md:flex`, matching the same breakpoint `nav.tsx` already uses for its own desktop-links/hamburger split) and exports `SOCIAL_ICONS` + a shared `useMountedTheme()` hook. `nav.tsx`'s mobile menu now renders the GitHub/X/LinkedIn links and the theme toggle inline at the bottom of the slide-down menu, so mobile users still get both, just docked instead of floating over content.
- Re-verified after the fix: bubble has a zero-size rect (truly hidden, not just visually covered) on mobile, mobile-menu theme toggle actually flips `html.dark`, social links carry correct `href`s, no overflow/overlap regressions across all 6 pages × both themes.
- Build+lint green. Also hit and fixed an unrelated local-testing snag: a stale `next-server` process surviving a rebuild served mismatched chunk hashes (500 on the CSS chunk) — not a code bug, just a leftover process from an earlier `npm run start` in the same sandbox.
- DONE + on main as of this pass. No open follow-ups.

**2026-07-23 — résumé section.** Added Tarun's current résumé PDF as a local,
versioned site asset. The homepage now includes a dedicated résumé section with
open/download actions; the hero résumé button, section navigator, and command
palette all link to the current document. Verified with lint and a production
build on Node 20; screenshot-checked in light, dark, and mobile layouts; confirmed
the deployed asset route returns `application/pdf`.

**2026-07-27 — LinkedIn URL refresh.** Replaced the former numbered LinkedIn
slug with `linkedin.com/in/tarun-yadgirkar/` in the live site content and both
source documents. Verified with lint, a production build on Node 20.20.0, and
light/dark browser checks confirming the new URL renders and the old URL does not.

**2026-07-27 — codebase audit and hardening.** Upgraded Next.js and
`eslint-config-next` to 16.2.12; temporarily removed the phone number from tracked
source and the public résumé PDF while preserving its page and
external links; converted the command palette to a native modal dialog with
keyboard focus containment and restoration; raised light-theme faint-text
contrast; and limited development-only CSP allowances to Next.js and Vercel
observability requirements. Verified all routes, both themes, modal keyboard
behavior, privacy/PDF invariants, lint, and a production build on Node 20.20.0.
`npm audit --omit=dev` still reports unsupported transitive `postcss` and `sharp`
ranges; its forced fix downgrades Next.js to 9.3.3, so it was not applied.

**2026-07-27 — phone publication correction.** User confirmed the phone number
is intentionally public. Restored all prior source references and the exact
pre-audit résumé PDF; updated the positioning rule so future audits preserve it.

**2026-07-29 — "engineering document" redesign (MERGED TO `main`, live).**
User wanted the site to stop looking basic, kept the patent-page diagrams, and
rejected the hero particle banner and the side robot arms. Direction: keep the
visual identity (palette, type, radii, hairline-grid motif) and instead push the
patent page's *schematic* language across every page.

> Built on `claude/website-homepage-redesign-4khest` and reviewed across two
> rounds on a Vercel preview while the live site stayed on `339fc79`. The user
> approved it on 2026-07-29 and it was merged to `main`, so this is now what
> tarunyadgirkar.com serves. The normal commit-directly-to-`main` protocol is
> back in force.

- **Deleted:** `cursor-arms.tsx`, `particle-field.tsx`, `word-shape.tsx`,
  `living-hero.tsx` (`SequentialCaptions`), the already-dead `wave-backdrop.tsx`,
  and the orphaned `.fade-x` utility.
- **New shared components:** `system-rule.tsx` (scroll-linked drawn signal rule —
  replaces the particle strip), `schematic.tsx` (generalised from
  `BalanceDiagram`; `/patent` and the homepage now share it, data in
  `balance.signalPath` / `site.buildPipeline`), `schematic-glyph.tsx` (self-drawing
  line-art focus icons at the same 1.5 stroke as the diagram arrows),
  `spotlight.tsx` (cursor-follow tint, adapted from KokonutUI onto our tokens —
  inert under reduced motion *and* on coarse pointers), `section-frame.tsx`
  (numbered inline heading + scroll-filled gutter rule, used on every page).
- **Dependency:** `framer-motion` → `motion` (motion.dev). Same API, import path
  only. `Reveal` now takes a `variant` (`up | mask | stagger`) so scroll
  entrances stop being one uniform fade. Fixed pre-existing reduced-motion gaps
  in `scroll-progress.tsx` and `social-bubble.tsx`.
- **Deviation from plan:** the `<details>` disclosure on `/work` kept native
  semantics and got a CSS `::details-content` transition behind `@supports`
  instead of an `AnimatePresence` rewrite — a controlled React disclosure would
  have cost find-in-page and no-JS behaviour for a cosmetic gain.
- **Gotcha for future edits:** `SectionFrame` is `position: relative`, which makes
  it the `offsetParent` for the headings inside it. `section-nav.tsx` was switched
  from `offsetTop` to `getBoundingClientRect().top + scrollY` for this reason —
  don't switch it back.
- Verified: build + lint green; all 6 routes × both themes at 1440px and iPhone-13
  width with no horizontal overflow; reduced-motion pass (static complete frames,
  no spotlight overlays, read-head absent); coarse-pointer pass; anchor +
  section-nav + ⌘K palette contract incl. the new `#how-i-build`. `/patent`
  regression-checked by pixel-diffing the diagram against a `main` worktree —
  identical geometry, 0.17% of pixels differ and all of it is text antialiasing.

**2026-07-29 — redesign feedback round 2 (also merged to `main`).** User reviewed
the preview and asked for content fixes plus three visual corrections.

- **Content:** now based in **Berkeley** (`atAGlance` row *and* `site.location`,
  which feeds the footer — change both or they contradict). Eagle Scout carries
  the year earned (2025) in both `recognition` and `archive`, no span.
  `ArchiveItem.years` is now **optional** — two entries have unknown dates and
  render a blank cell rather than an `—` placeholder; get real years from the
  user before inventing any. "Prof. Allen Yang" removed from `about.ts` *and*
  `research.ts` (user only named the About one; removed both for consistency —
  revert the research one if they object).
- **`buildPipeline` is deliberately NOT about hardware.** The first version
  described sensor → model → control → actuator, and the user rejected it for
  generalising all their work to embedded robotics. It is now a mindset:
  Frame → Reduce → Contact → Iterate. Do not reintroduce hardware, motion
  assistance, or voice interfaces into this section.
- **`system-rule.tsx`:** sine control points are `-16`/`104` on purpose — a
  quadratic's midpoint is `0.25·y₀ + 0.5·cy + 0.25·y₁`, which against the
  baseline of 44 lands peaks exactly on the square wave's 14/74 rails. Eyeballed
  values make the two halves read as unrelated drawings. Station labels are
  anchored to real events (mid-analog, the conversion riser, settled output).
- **`schematic-glyph.tsx`:** **no accent colour in the glyphs** — user asked for
  them monochrome. Circles must be written as two half-arcs
  (`a r,r 0 1,0 2r,0` twice); the single-arc shorthand degenerates at 360° and
  renders as a lump, which is what made the old rover look wrong. `rover` and
  `hand` were redrawn (`hand` is now an assistive leg brace, pointing at
  BALANCE); `chip`/`graph`/`mic` were fine and untouched.
- Verified: build + lint green; all 6 routes × both themes, desktop + iPhone-13,
  no overflow; reduced-motion and coarse-pointer passes clean; archive year cells
  and Eagle Scout year asserted programmatically; `/patent` re-diffed against a
  `main` worktree — unchanged (0.17%, antialiasing only).
- Local-testing gotcha, again: `next start` survives a rebuild and serves stale
  chunks. `pkill -9 -f next-server` before restarting or Playwright times out.

**2026-08-07 — GSAP + Lenis scroll pass (branch
`claude/website-visual-upgrade-cxydu0`, NOT on `main`).** User asked to stop the site
being boring, naming Lenis and GSAP. The diagnosis was that the style was fine and the
*motion* was not: every section did one fade and froze, and Lenis was installed but
nothing responded to it. Scroll is now the instrument.

- **Plumbing.** Added `gsap` + `@gsap/react`. Lenis runs with `autoRaf: false` and is
  driven from `gsap.ticker`, with `ScrollTrigger.update` on Lenis's scroll event, so both
  libraries share one clock — otherwise ScrollTrigger reads the raw scroll position while
  Lenis paints an interpolated one and every scrubbed animation jitters. The bridge reads
  the instance from **context, not a ref**: `ReactLenis` assigns its imperative handle from
  a state value and rebuilds the instance whenever its options change, which happens once
  per load when `useReducedMotion()` resolves. `ScrollRefresh` re-measures cached trigger
  geometry after font swap, route change, and `<details>` toggle.
- **Hero.** `HeroPlate` composes a scrubbed `SystemRule` with the new `KinematicRig`, both
  on one shared range. This is the answer to the robot-arm follow-up below.
- **Sections.** `Schematic` assembles stage by stage (opt-in); featured work, `/work`
  case studies, recognition, and `/archive` all got per-row or per-tick scroll response.
- **Route changes** are a hairline sweeping down the viewport. This replaced
  `AnimatePresence mode="wait"`, whose held-open exit meant incoming ScrollTriggers
  measured against a document that still contained the outgoing page.

Three traps worth not re-discovering:

1. **`useGSAP`'s `scope` resolves selector strings inside the scoped element.** Passing a
   shared *ancestor* trigger as a selector silently misses, and ScrollTrigger falls back to
   the top of the document — the timeline reads as already finished. Resolve shared
   triggers off `document` (both hero children do).
2. **A component that renders two different DOM shapes across hydration destroys anything
   holding references to its children.** `Spotlight` did this (`useFinePointer()` is false
   during hydration, true right after), so React unmounted and rebuilt its subtree and the
   featured-work row rules never drew. Its wrapper shape is now identical either way. Same
   class of bug fixed in `WordReveal`, which branched its markup on `useReducedMotion()` and
   was failing hydration outright (React #418) for reduced-motion users — now gated through
   `useSyncExternalStore` so the first client render matches the server.
3. **Pinning was built, verified working, and then removed on purpose.** The plate is
   ~300px tall in a ~900px viewport, so holding it at centre left half a screen of empty
   page above it while the copy scrolled away — it read as a layout bug. Scrubbing over the
   plate's own travel plays the identical sequence, and skipping the `pin-spacer` avoids
   changing document height under `section-nav`, the anchors, and the ⌘K palette. Don't
   re-add a pin without checking the element is tall enough to earn it.

Verified: build + lint green; all 6 routes × both themes × desktop + iPhone-13 with no
overflow and no console errors; scrubbed sequences sampled across scroll to prove they
advance *and* that nothing is left partially revealed once scrolled past; reduced-motion
pass asserts finished frames; coarse pointer gets zero spotlight overlays; skip link,
all six in-page anchors (landing at the 80px `scroll-padding-top`), and ⌘K all intact;
**`/patent` pixel-diffed against a `main` worktree — 0 differing pixels of 3.39M in both
themes**, the opt-in `animate` prop having kept it byte-identical.

_Update this block when you finish a chunk of work._

**Follow-up now addressed (was open 2026-07-29):** *"we will add better robot arms and
maybe animations stuff later."* `KinematicRig` is the answer, and it is deliberately not
`cursor-arms.tsx`: one arm in a drafting frame rather than four pinned to the screen
edges, posed by scroll progress rather than by the cursor, forward kinematics rather than
an IK solver, and GSAP writing SVG attributes rather than a React `setState` per rAF frame.
Still do not restore the old component.
