"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { ScrollTrigger, gsap } from "@/lib/gsap";

/**
 * Puts Lenis and GSAP on one clock.
 *
 * Lenis paints an *interpolated* scroll position while the browser keeps
 * reporting the raw one. Left alone, ScrollTrigger reads the raw value, so every
 * scrubbed animation sits a frame or two behind the content it is pinned to —
 * which reads as jitter, not as lag. Two halves fix it: drive `lenis.raf` from
 * `gsap.ticker` (with Lenis's own rAF switched off, see `autoRaf: false` below)
 * so there is a single loop, and call `ScrollTrigger.update` on Lenis's scroll
 * event so triggers measure against the position Lenis actually painted.
 *
 * This has to live *inside* <ReactLenis> because it reads the instance from
 * context — and that matters: ReactLenis destroys and rebuilds Lenis whenever
 * its options object changes, which happens once on every page load when
 * `useReducedMotion()` resolves from null to a boolean. Keying the effect on the
 * instance means the ticker follows the new one instead of driving a corpse.
 */
function GsapLenisBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const raf = (time: number) => lenis.raf(time * 1000);
    // Wrapped rather than passed by reference: Lenis hands its callback the
    // instance, and ScrollTrigger.update's first parameter is a truthy-checked
    // flag, so `lenis.on("scroll", ScrollTrigger.update)` would quietly opt into
    // a mode we never asked for.
    const onScroll = () => ScrollTrigger.update();

    lenis.on("scroll", onScroll);
    gsap.ticker.add(raf);
    // Default lag smoothing fast-forwards GSAP after a stall; that would shove
    // Lenis past its own easing curve instead of letting it catch up smoothly.
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
    };
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  // The rendered tree is identical in both branches — only the options differ —
  // so there is nothing for hydration to disagree about.
  return (
    <ReactLenis
      root
      options={
        reduced
          ? { lerp: 1, duration: 0, smoothWheel: false, anchors: true, autoRaf: false }
          : { lerp: 0.1, duration: 1.2, anchors: true, autoRaf: false }
      }
    >
      <GsapLenisBridge />
      {children}
    </ReactLenis>
  );
}
