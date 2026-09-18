"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";
import { HERO_ADVANCE_MS, heroModels, type ModelKey } from "@/content/models";

const HeroScene = dynamic(() => import("@/components/three/HeroScene").then((m) => m.HeroScene), { ssr: false });

/** Advances `index` on a timer unless something holds it. */
function useAutoAdvance(count: number, held: boolean): [number, (i: number) => void] {
  const [index, setIndex] = useState(0);
  const [epoch, setEpoch] = useState(0);
  useEffect(() => {
    if (held) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), HERO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [count, held, epoch]);
  const jump = (i: number) => {
    setIndex(i);
    setEpoch((e) => e + 1);
  };
  return [index, jump];
}

function useDocumentVisible(): boolean {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return visible;
}

export function HeroCarousel() {
  const reduced = useReducedMotion() ?? false;
  const visible = useDocumentVisible();
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const held = reduced || !visible || hovering || focused;
  const [index, jump] = useAutoAdvance(heroModels.length, held);
  const current = heroModels[index];
  const periods = useMemo(
    () => Object.fromEntries(heroModels.map((m) => [m.key, m.period])) as Record<ModelKey, number>,
    [],
  );

  return (
    <figure
      className="relative"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => setFocused(e.currentTarget.contains(e.relatedTarget as Node | null))}
    >
      <div className="relative aspect-[4/5] sm:aspect-square md:aspect-[4/5]">
        <HeroScene className="absolute inset-0" active={current.key} periods={periods} reduced={reduced} />
      </div>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <figcaption className="min-h-16 max-w-sm text-sm text-ink-mute" aria-live="polite">
          {current.caption}
        </figcaption>
        <div className="inline-flex flex-wrap rounded-full bg-ink/8 p-1" role="group" aria-label="Model on the turntable">
          {heroModels.map((m, i) => (
            <button
              key={m.key}
              type="button"
              aria-pressed={i === index}
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
