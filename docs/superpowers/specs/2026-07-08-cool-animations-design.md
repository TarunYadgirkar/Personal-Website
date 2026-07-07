# Cool Animations — Design Spec

**Date:** 2026-07-08
**Branch:** `feat/cool-animations`
**Source:** Three animation themes lifted from the Anthropic "A global workspace in language models" research video (reference screenshots in `../cool images to copy theme:style:animations from/`). User approved building all three, distributed across the homepage. User will review results after implementation.

## Themes → site mapping

| Ref theme | What it is | Where it lands |
|---|---|---|
| Particle dust field | White points on black morph into shapes (brain, blobs), dissolve + reform | Signature strip on homepage (replaces `SignalTrace` usage in the hero divider) |
| Words-as-objects ("J-space") | An object drawn from the repeated word that names it — boat from "BOAT", clouds from "CLOUDS" | The 5 focus-area icons (each concept spelled out of its own name) |
| Living painting + sequential captions (the "ship motion") | A still image quietly alive (drift/parallax) with poetic subtitles fading in on a cadence | Hero: subtle living backdrop + a short poetic line revealed caption-by-caption |

## Design constraints (all components)

- **Palette:** use CSS vars only — `--color-accent`, `--color-accent-bright`, `--color-fg`, `--color-fg-muted`, `--color-fg-faint`, `--color-line`, `--color-bg`, `--color-surface`. Never hardcode hex. Works in both light (warm parchment) and dark (deep navy) themes.
- **Font:** mono motifs use `var(--font-mono)` (IBM Plex Mono).
- **Motion:** all `"use client"`. Respect `prefers-reduced-motion` via framer-motion `useReducedMotion()` or a CSS/JS guard — reduced motion renders a single static frame (no loops, no drift, no rAF churn).
- **Perf (per web perf rules):** compositor-friendly only; canvas work capped and `requestAnimationFrame`-driven; pause when offscreen (IntersectionObserver) and on `visibilitychange`; DPR-aware canvas; no layout thrash. Homepage JS budget stays lean — no new heavy deps, framer-motion + canvas 2D only.
- **SSR safety:** guard `window`/`document`/canvas access to effects; no hydration mismatch.
- **A11y:** decorative visuals `aria-hidden`; text content (captions) remains real, readable text.

## Component A — `ParticleField` (`src/components/particle-field.tsx`)

Canvas-2D point cloud. ~900–1200 particles (scaled down on small screens) that ease toward sampled target positions, hold, then dissolve and reform into the next shape. Cycle through on-brand shapes: **signal waveform → node/neuron graph → robot-arm silhouette → back**. Points lerp toward targets with light idle jitter (the "dust" quality). Accent-tinted particles at low-to-mid opacity over transparent background so it reads on either theme.

- Props: `className?`, optional `shapes?` override, `height` via className.
- Targets sampled by rendering each shape (text/path) to an offscreen canvas and reading opaque pixels, then sampling N points.
- Reduced motion: render the first shape statically, no rAF.
- Pause via IntersectionObserver + `document.hidden`.
- Replaces `<SignalTrace />` at `page.tsx` hero divider (line ~117). `SignalTrace` component stays in the repo, just unused there. One shape is a waveform as homage.

## Component B — `WordShape` (`src/components/word-shape.tsx`)

SVG. A shape silhouette filled with its own name tiled as mono text, clipped to the silhouette (concrete-poetry look). On mount, the words settle in (stagger fade + tiny y). Used for the focus-area icons.

- Props: `word: string`, `shape: "arm" | "chip" | "graph" | "wave" | "hand"`, `className?`, `aria-hidden`.
- Implementation: `<clipPath>` from the shape path; inside, repeated `<text>` rows of the word in `var(--font-mono)`, `fill: var(--color-accent)`; a faint outline stroke of the shape for legibility. framer-motion staggers the rows in.
- Focus-area mapping (from `content/site.ts`):
  - `robotics` → shape `arm`, word `"ROBOTICS"` (the user's "robot arm" example)
  - `embedded-ml` → shape `chip`, word `"EMBEDDED ML"`
  - `applied-ai` → shape `graph`, word `"APPLIED AI"`
  - `voice-agents` → shape `wave`, word `"VOICE"`
  - `assistive-robotics` → shape `hand`, word `"ASSIST"`
- Reduced motion: rows render fully visible, no stagger.
- Replaces the lucide `Icon` in the focus grid (`page.tsx` ~166-167). Sized ~44–56px box so it sits where the icon did without reflow.

## Component C — `LivingHero` pieces (`src/components/living-hero.tsx`)

Two exports:

1. `LivingBackdrop` — an absolutely-positioned, very-low-opacity ambient layer behind the hero. Slow-drifting soft accent-tinted blobs + fine grain evoking the "living painting" calm, with gentle pointer parallax (translate a few px). `pointer-events-none`, `aria-hidden`. Reduced motion → static, no drift, no parallax.
2. `SequentialCaptions` — reveals an array of short lines one at a time (fade + slight blur-in + small y), subtitle cadence (~500–700ms apart), then rests. Real text, not decorative. Reduced motion → all lines visible immediately. Applied to a short 2–3 line poetic framing of `site.subline` / positioning at the top of the hero.

- Keep it tasteful and subtle; backdrop opacity low so hero text stays crisp (contrast preserved). If it reads as too much, it's trivially removable (single wrapper).

## Integration points (`src/app/page.tsx`)

1. Hero top: wrap in `LivingBackdrop`; add `SequentialCaptions` for the poetic intro lines above/around the h1 (or replace the mono subline reveal with the caption cadence).
2. Hero divider: swap `<SignalTrace .../>` → `<ParticleField .../>`.
3. Focus grid: swap lucide `<Icon/>` → `<WordShape word=... shape=.../>` per `area.id`.

Integration is done in a single serial pass by the main thread (page.tsx is a shared file — not parallelized) after the three components are built and reviewed.

## Build approach

`ultracode` workflow: build the three components in parallel (distinct new files, no shared-file conflict), then an adversarial React/perf review pass per component. Main thread then integrates into `page.tsx`, runs `next build`, and screenshots both themes to verify. Work committed to `feat/cool-animations`; `main` untouched for user review.

## Out of scope (YAGNI)

- No dedicated `/lab` page, no new nav item.
- No new dependencies.
- No changes to other pages (work/research/about/etc.).
