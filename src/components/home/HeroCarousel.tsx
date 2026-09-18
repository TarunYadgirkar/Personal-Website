"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { HERO_ADVANCE_MS, heroModels, heroPeriods } from "@/content/models";

const HeroScene = dynamic(() => import("@/components/three/HeroScene").then((m) => m.HeroScene), { ssr: false });

/** Advances `index` on a timer until something holds it. A manual choice
 * pins the carousel for good, which is also the pause control. */
function useAutoAdvance(count: number, held: boolean): [number, boolean, (i: number) => void] {
  const [index, setIndex] = useState(0);
  const [pinned, setPinned] = useState(false);
  useEffect(() => {
    if (held || pinned) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), HERO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [count, held, pinned]);
  const jump = (i: number) => {
    setIndex(i);
    setPinned(true);
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
  const reduced = useReducedMotion() ?? false;
  const visible = useDocumentVisible();
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const held = reduced || !visible || hovering || focused;
  const [index, pinned, jump] = useAutoAdvance(heroModels.length, held);
  const current = heroModels[index];

  return (
    <figure
      className="relative"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => setFocused(e.currentTarget.contains(e.relatedTarget as Node | null))}
    >
      <div className="relative aspect-[4/5] sm:aspect-square md:aspect-[4/5]">
        <HeroScene className="absolute inset-0" active={current.key} periods={heroPeriods} reduced={reduced} />
      </div>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <figcaption id="hero-model-caption" className="min-h-20 max-w-sm text-sm text-ink-mute" aria-live={held || pinned ? "polite" : "off"}>
          {current.caption}
        </figcaption>
        <div className="inline-flex flex-wrap rounded-full bg-ink/8 p-1" role="group" aria-label="Model on the turntable">
          {heroModels.map((m, i) => (
            <button
              key={m.key}
              type="button"
              aria-pressed={i === index}
              aria-controls="hero-model-caption"
              onClick={() => jump(i)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-semibold text-ink transition-colors duration-150",
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
