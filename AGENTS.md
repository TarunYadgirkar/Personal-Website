# AGENTS.md — project context & handoff

Canonical living doc for any Claude Code or Codex session working in this repo. **Read this first. Update the "Current status" section at the end of any session that changes ongoing work.**

## Project

Tarun Yadgirkar's personal site. Live: https://tarunyadgirkar.com (repo `TarunYadgirkar/Personal-Website`, auto-deploys `main` via Vercel).

- Stack: Next.js 16 (App Router), React 19, TypeScript strict, Tailwind v4, framer-motion 12. Package manager: **npm** (no pnpm on this machine).
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
- **Positioning rules** (from info2.md): never say "granted patent"/"patented" for BALANCE (it's provisional, No. 63/743,085); no phone number in UI; not "high school student"; VEX/science-fair → Archive only.

## Animation system (built 2026-07-08)

Distinct, self-contained client components. **All must:** use palette CSS vars only (`--color-accent`, `--color-fg`, `--color-bg`, `--color-line`, etc. — never hardcoded hex); respect `prefers-reduced-motion` (render one static frame, no rAF/loops); pause canvas work when offscreen (IntersectionObserver + `visibilitychange`); be DPR-aware; `aria-hidden` on decorative visuals.

- `src/components/particle-field.tsx` — `ParticleField`: canvas dust that forms a single signal WAVEFORM, springs back, disperses from the cursor (repel physics), and auto-sweeps a "ghost" disturbance across every ~6–9s when idle. Used as the hero divider strip in `page.tsx`.
- `src/components/word-shape.tsx` — `WordShape`: an SVG silhouette filled with repeated tiled mono text of its own name (concrete-poetry). Kinds: `chip | rover | graph | mic | hand | wave | arm`. Used as the 5 "Technical focus areas" glyphs via `focusGlyphs` in `page.tsx`: embedded-ml=chip, robotics=rover, applied-ai=graph(neural net), voice-agents=mic, assistive-robotics=hand.
- `src/components/cursor-arms.tsx` — `CursorArms`: SVG robot arms anchored to the screen edges that track the cursor via **2-bone IK** (shoulder+elbow hinge), with a parallel-jaw gripper and cone-clamped rotation. `lg:` only, `-z-10`, reduced-motion → null.
- `src/components/living-hero.tsx` — `SequentialCaptions` (hero subline revealed line-by-line, subtitle cadence). Also still exports `WaveBackdrop` (a drifting sine-wave layer) which is **currently unused** — kept as an option; the user tried both blob and wave hero backdrops and chose a plain hero.
- Design spec: `docs/superpowers/specs/2026-07-08-cool-animations-design.md`.

Reference material (not in repo): parent dir `../cool images to copy theme:style:animations from/` — screenshots of Anthropic's "global workspace" video (particle dust, concrete-poetry typography, living-painting ships) that seeded these.

## Current status / ongoing

**2026-07-08 — animation pass.** Iterated live with the user across several rounds. State:

- DONE + on main: ParticleField (waveform-only + cursor-repel + timed auto-sweep); WordShape glyphs wired into the 5 focus cards, size-18/weight-700; CursorArms as 2-bone IK arms + parallel-jaw gripper + clamped cones; SequentialCaptions on the hero subline. Focus glyphs finalized: embedded-ml=chip, robotics=rover, applied-ai=neural network, voice-agents=mic, assistive-robotics=heart. Hero background is PLAIN (blobs then waves both tried and rejected by the user; `WaveBackdrop` kept as an unused export only).
- All verified green (build+lint) and screenshot-checked in both themes before push.
- Open follow-ups: none outstanding at last check.

_Update this block when you finish a chunk of work._
