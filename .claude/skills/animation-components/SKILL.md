---
name: animation-components
description: >-
  Use when creating or editing any animated or canvas/SVG visual component — hero
  visuals, particle/canvas effects, framer-motion pieces, scroll-driven motion, IK/
  cursor-tracking. Encodes the mandatory rules every visual here follows (palette vars
  only, reduced-motion, offscreen pause, DPR-awareness, aria-hidden) plus the existing
  component inventory so new work matches the system instead of reinventing it.
---

# Animation & visual components

Distinct, self-contained **client** components. The site has a deliberate animation
system (built 2026-07-08, iterated live with the user). Match it; don't reinvent.

## The rules — ALL visual components MUST follow

- **Palette CSS vars only, never hardcoded hex.** Use `var(--color-accent)`,
  `--color-fg`, `--color-bg`, `--color-line`, `--color-accent-bright`, etc. Hardcoding a
  color breaks theming (light parchment/rust ↔ dark navy/amber) instantly.
- **Respect `prefers-reduced-motion`.** Render exactly one static frame — no rAF loop,
  no framer-motion animation running. (For a Lenis-style wrapper, keep the component
  tree identical and only change options, to avoid hydration mismatch.)
- **Pause work when offscreen.** Use `IntersectionObserver` to stop canvas/rAF work when
  scrolled out of view, and `visibilitychange` to pause on tab hide.
- **DPR-aware.** Scale canvas backing store by `devicePixelRatio` so it's crisp on
  retina.
- **`aria-hidden` on decorative visuals.** They're not content.
- **Gate expensive components by real viewport, not just CSS.** `CursorArms` mounts only
  at `lg:` via `matchMedia` (not merely `hidden lg:block`), so the rAF loop never runs on
  mobile at all.

## Existing components (extend these patterns)

- `particle-field.tsx` — `ParticleField`: canvas dust forming a signal WAVEFORM,
  cursor-repel physics, idle auto-sweep every ~6–9s, `.fade-x` edge mask. Hero divider.
- `word-shape.tsx` — `WordShape`: SVG silhouette tiled with its own name (concrete
  poetry); seamless marquee drift + breathing stroke pulse. Kinds:
  `chip|rover|graph|mic|hand|wave|arm`. Powers the 5 focus-area glyphs.
- `cursor-arms.tsx` — `CursorArms`: 2-bone IK robot arms (shoulder+elbow), parallel-jaw
  gripper, cone-clamped rotation, `lg:`-gated.
- `living-hero.tsx` — `SequentialCaptions`: line-by-line hero subline reveal.
- `signal-trace.tsx` — signal-trace hero visual.
- `wave-backdrop.tsx` — `WaveBackdrop`: **unused**, kept as an alternate hero backdrop
  export only (the user chose a plain hero; blob and wave were both rejected). Don't wire
  it in without being asked.
- `motion.tsx` — shared motion primitives (`Reveal`, entrance wrappers) — reuse these.
- `smooth-scroll.tsx` — Lenis inertial scroll wrapper; programmatic scrolls go through
  `lenis.scrollTo()` (via `useLenis()`) with a native fallback.

Design spec for the animation set:
`docs/superpowers/specs/2026-07-08-cool-animations-design.md`.

## Verify

Motion changes need a time-separated screenshot pair (prove it animates) in BOTH themes,
plus build + lint green — see `ship-checklist`.
