---
name: animation-components
description: >-
  Use when creating or editing any animated or canvas/SVG visual component — hero
  visuals, SVG/canvas effects, motion.dev pieces, scroll-driven motion, drawn diagrams
  or glyphs. Encodes the mandatory rules every visual here follows (palette vars only,
  reduced-motion, offscreen pause, DPR-awareness, aria-hidden) plus the existing component
  inventory so new work matches the schematic language instead of reinventing it.
---

# Animation & visual components

Distinct, self-contained **client** components. The site's visual language is the
**engineering schematic** — drawn line-work at 1.5-1.75 stroke, hairline borders, mono
labels, accent rationed. Rebuilt 2026-07-29, iterated live with the user across two
review rounds. Match it; don't reinvent.

Animation here is *restrained and informational*. The user has rejected decorative
motion twice by name: a canvas particle field and cursor-tracking IK robot arms. Prefer
scroll-linked and draw-on effects over ambient loops.

## The rules — ALL visual components MUST follow

- **Palette CSS vars only, never hardcoded hex.** Use `var(--color-accent)`,
  `--color-fg`, `--color-bg`, `--color-line`, `--color-accent-bright`, etc. Hardcoding a
  color breaks theming (light parchment/rust ↔ dark navy/amber) instantly.
- **Respect `prefers-reduced-motion`.** Render exactly one static, *complete* frame — no
  rAF loop, no motion animation running, and nothing left half-drawn. (For a Lenis-style
  wrapper, keep the component tree identical and only change options, to avoid hydration
  mismatch.)
- **Gate cursor effects on coarse pointers too.** `matchMedia("(pointer: fine)")` — a
  hover effect on touch is dead weight in the bundle and the DOM.
- **Pause work when offscreen.** Use `IntersectionObserver` to stop canvas/rAF work when
  scrolled out of view, and `visibilitychange` to pause on tab hide.
- **DPR-aware.** Scale canvas backing store by `devicePixelRatio` so it's crisp on
  retina.
- **`aria-hidden` on decorative visuals.** They're not content.
- **Gate expensive components by real viewport, not just CSS** — `matchMedia`, not merely
  `hidden lg:block`, so the work never runs on mobile at all. (`SocialBubble` is the live
  example of the CSS-only trap: it was visually hidden but still overlapping body copy.)

## Existing components (extend these patterns)

- `schematic.tsx` — `Schematic`: the data-driven signal-path diagram (columns → nodes →
  arrows), shared by `/patent` and the homepage. `className="contents"` keeps arrows as
  flex siblings; frame is `bg-bg` while nodes are `bg-surface` so nodes read as raised.
  Exactly one `isAccent` node per diagram.
- `system-rule.tsx` — `SystemRule`: hero divider, analog wave resolving to digital with a
  scroll-linked read-head. Sine control points `-16`/`104` are derived so its peaks land on
  the square wave's rails — don't eyeball them (see AGENTS.md for the arithmetic).
- `schematic-glyph.tsx` — `SchematicGlyph`: line-art glyphs, self-drawing via `pathLength`.
  **Currently unused — the user rejected them on the focus cards (2026-08-07) and those now
  use a mono index instead. Don't reinstate without asking.** If they return: monochrome
  only (accent here was rejected separately), and write circles as two half-arcs since the
  single-arc shorthand degenerates at 360°.
- `hero-plate.tsx` / `kinematic-rig.tsx` / `system-rule.tsx` — the hero's scrubbed
  commissioning plate. All three share one range via `[data-hero-frame]`. The arm raises
  its part onto a ledge; furniture is derived from the solved poses.
- `schematic-motion.tsx` / `row-reveal.tsx` / `axis-reveal.tsx` — reusable scroll
  behaviours, targeted by data attribute so markup stays in the page.
- `section-frame.tsx` — `SectionFrame`: numbered heading + scroll-filled gutter rule.
  It is `position: relative`, so it becomes the `offsetParent` of headings inside it —
  measure scroll positions with `getBoundingClientRect().top + scrollY`, never `offsetTop`.
- `spotlight.tsx` — `Spotlight`: cursor-follow tint on our tokens. Bails to unwrapped
  children under reduced motion and on coarse pointers.
- `motion.tsx` — shared primitives. `Reveal` takes `variant` (`up|mask|stagger`) — use a
  variety, not one uniform fade. `WordReveal` for headlines. Import from `motion/react`.
- `signal-trace.tsx` — **unused by the app**, but exported via `index.ts` for
  `.design-sync/`. Don't delete it.
- `smooth-scroll.tsx` — Lenis inertial scroll wrapper; programmatic scrolls go through
  `lenis.scrollTo()` (via `useLenis()`) with a native fallback.

**Deleted 2026-07-29, each rejected by the user by name — do not resurrect without
asking:** `particle-field.tsx`, `cursor-arms.tsx`, `word-shape.tsx`, `living-hero.tsx`,
`wave-backdrop.tsx`. `docs/superpowers/specs/2026-07-08-cool-animations-design.md`
describes that old set and is historical only.

## Verify

Motion changes need a time-separated screenshot pair (prove it animates) in BOTH themes,
plus build + lint green — see `ship-checklist`.
