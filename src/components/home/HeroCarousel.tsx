"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useInView } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";
import { HERO_ADVANCE_MS, heroModels, heroPeriods } from "@/content/models";

const HeroScene = dynamic(() => import("@/components/three/HeroScene").then((m) => m.HeroScene), { ssr: false });

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

function subscribeVisibility(cb: () => void) {
  document.addEventListener("visibilitychange", cb);
  return () => document.removeEventListener("visibilitychange", cb);
}

function useDocumentVisible(): boolean {
  return useSyncExternalStore(
    subscribeVisibility,
    () => document.visibilityState === "visible",
    () => true,
  );
}

export function HeroCarousel() {
  const reduced = useReducedMotion();
  const visible = useDocumentVisible();
  const figure = useRef<HTMLElement>(null);
  const inView = useInView(figure, { margin: "80px" });
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
        <HeroScene className="absolute inset-0" active={current.key} periods={heroPeriods} reduced={reduced} />
      </div>
      {/* Announced only after a deliberate choice, never on the timer. */}
      <span role="status" className="sr-only">
        {pinned ? current.name : ""}
      </span>
      <div className="mt-3 flex justify-center sm:justify-end">
        <div className="inline-flex flex-wrap rounded-full bg-ink/8 p-1" role="group" aria-label="Model on the turntable">
          {heroModels.map((m, i) => (
            <button
              key={m.key}
              type="button"
              aria-pressed={i === index}
              onClick={() => jump(i)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-semibold text-ink transition-[background-color,box-shadow] duration-150",
                i === index && "bg-paper-pale shadow-card",
              )}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>
    </figure>
  );
}
