# Non-vibecoded polish pass — design

## Problem

Site reads "a little vibecoded" across three axes (visual, copy, code structure) — not any one glaring tell, per user. Researched actual signs of AI-generated sites (purple gradients, Inter/shadcn defaults, uniform fade-in-only motion, identical decorative cards, buzzwordy copy) and checked each against this codebase.

**Ruled out as non-issues** after checking:
- Palette, typography (Schibsted Grotesk + IBM Plex Mono), layout structure — already distinctive, no generic defaults.
- The hairline-grid pattern (`grid gap-px ... bg-line`) used by focus-areas, skills, and patent pages — this is a deliberate, consistent motif repeated across three pages. Repetition of an intentional custom system is good design discipline, not the "everything's an identical card" AI-slop tell. No change needed here.

**Confirmed as real, scoped to fix:**

1. **Motion uniformity** — every scroll-triggered section uses the identical fade+translate-up (`Reveal`/`HeroReveal` in `src/components/motion.tsx`), applied per-item with no variation. This matches the "generic animations, fade-ins only" tell from research.
2. **Decorative accent bar** — `src/app/page.tsx` (~line 165), the hover-triggered top accent-bar on focus-area tiles carries no information: tiles are `<li>`, not links, nothing happens on click. Matches the "colored bar with no discernible logic" tell.
3. **Copy density** — `src/content/site.ts` `focusAreas`, two `detail` lines are generic-AI-buzzword phrasing instead of specific facts already available elsewhere in the codebase (`src/content/work.ts`).

## Changes

### 1. Motion uniformity

- `src/app/page.tsx`: "Featured work" list — remove per-row `<Reveal delay={...}>` wrapping each item; wrap the whole list container in a single `Reveal` instead. Same for the "Technical focus areas" grid — one `Reveal` on the `<ul>`, not per-tile.
- `src/app/work/page.tsx`: leave `Reveal` per case-study article as-is — these are substantive, self-contained content blocks where a per-item reveal is earned, not decorative.
- No changes to `HeroReveal` usage in the hero section (first-paint sequencing is a different, legitimate use, not a scroll-triggered tell).

### 2. Decorative accent bar

- `src/app/page.tsx`: delete the `<span aria-hidden ... group-hover:scale-x-100 ...>` accent-bar element from the focus-area `<li>`. No replacement — tiles are static info, they don't need hover feedback.

### 3. Copy density

- `src/content/site.ts`, `focusAreas`:
  - `id: "applied-ai"` detail: replace `"Agentic pipelines and LLM-backed products"` with a line naming actual shipped work (CarePath, Klarity VoiceNote, GuestFlow — sourced from `src/content/work.ts`).
  - `id: "voice-agents"` detail: replace `"Voice-first interfaces and real-time voice AI"` (restates the title) with the actual stack used (Grok Voice, Retell AI, ElevenLabs — sourced from `src/content/work.ts`).

## Out of scope

- Visual system rebuild (palette/typography/layout) — already distinctive, confirmed via research comparison.
- Hairline-grid pattern — confirmed as intentional, not a tell.
- Anything beyond the 3 items above (this spec is deliberately narrow; a separate "make it more unique" round is a distinct follow-on ask, not folded in here).

## Testing

- `tsc --noEmit`, `eslint src`, `next build` after changes (same bar as the prior simplify pass).
- Visual check in browser: focus-area tiles no longer show hover bar; featured-work list and focus-area grid still animate in on scroll (once, at the list/section level) without each row/tile animating independently.
