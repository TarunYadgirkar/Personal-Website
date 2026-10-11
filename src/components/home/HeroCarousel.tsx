"use client";

import { useEffect, useRef, useState } from "react";
import { HeroScene } from "@/components/three/lazy";
import { SegmentButton, SegmentGroup } from "@/components/ui/Segmented";
import { HERO_ADVANCE_MS, heroModels, type ModelKey } from "@/content/models";
import { useDocumentVisible } from "@/lib/useDocumentVisible";
import { useNearViewport } from "@/lib/useNearViewport";
import { useReducedMotion } from "@/lib/useReducedMotion";

const PERIODS = Object.fromEntries(heroModels.map((m) => [m.key, m.period])) as Record<ModelKey, number>;

/** Advances `index` on a timer until something holds it. A manual choice
 * pauses the rotation for two cycles, then it picks up again. */
function useAutoAdvance(count: number, held: boolean): [number, boolean, (i: number) => void] {
  const [index, setIndex] = useState(0);
  const [pinnedAt, setPinnedAt] = useState<number | null>(null);
  const pinned = pinnedAt !== null;
  useEffect(() => {
    if (!pinned) return;
    const id = window.setTimeout(() => setPinnedAt(null), HERO_ADVANCE_MS * 2);
    return () => window.clearTimeout(id);
  }, [pinnedAt, pinned]);
  useEffect(() => {
    if (held || pinned) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), HERO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [count, held, pinned]);
  const jump = (i: number) => {
    setIndex(i);
    setPinnedAt(Date.now());
  };
  return [index, pinned, jump];
}

/** The hero turntable and its switcher. The timer holds on hover,
 * keyboard focus, a hidden tab, or reduced motion. */
export function HeroCarousel() {
  const reduced = useReducedMotion();
  const visible = useDocumentVisible();
  const figure = useRef<HTMLElement>(null);
  const inView = useNearViewport(figure);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const held = reduced || !visible || !inView || focused || hovered;
  const [index, pinned, jump] = useAutoAdvance(heroModels.length, held);
  const current = heroModels[index];

  return (
    <figure
      ref={figure}
      className="relative"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => setFocused(e.currentTarget.contains(e.relatedTarget as Node | null))}
    >
      <div className="relative aspect-[4/5] sm:aspect-square md:aspect-[5/6]">
        <HeroScene className="absolute inset-0" active={current.key} periods={PERIODS} reduced={reduced} />
      </div>
      {/* Announced only after a deliberate choice, never on the timer. */}
      <span role="status" className="sr-only">
        {pinned ? current.name : ""}
      </span>
      <div className="mt-3 flex justify-center sm:justify-end">
        <SegmentGroup className="flex-wrap" aria-label="Model on the turntable">
          {heroModels.map((m, i) => (
            <SegmentButton key={m.key} selected={i === index} aria-pressed={i === index} onClick={() => jump(i)}>
              {m.name}
            </SegmentButton>
          ))}
        </SegmentGroup>
      </div>
    </figure>
  );
}
