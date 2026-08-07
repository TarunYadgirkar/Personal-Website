"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ScrollTrigger } from "@/lib/gsap";

// PageTransition's exit is 0.22s; wait past it so the outgoing page is gone
// before anything is measured.
const ROUTE_SETTLE_MS = 280;
// ::details-content animates block-size over 0.32s (globals.css).
const DETAILS_SETTLE_MS = 360;

/**
 * Keeps ScrollTrigger's cached geometry honest.
 *
 * Every trigger resolves its start/end to pixel offsets once and reuses them.
 * Anything that changes document height afterwards leaves those offsets stale,
 * and the symptom is not a crash — it is animations quietly firing at the wrong
 * scroll position. Three things do it here, none covered by ScrollTrigger's
 * built-in resize handling:
 *
 *  - `next/font` swapping the fallback face for the real one, which changes the
 *    height of every block of text on the page
 *  - route changes, because PageTransition is `<AnimatePresence mode="wait">` —
 *    the outgoing page is still in the DOM while the incoming one mounts
 *  - the `<details>` disclosure on /work
 *
 * Theme changes deliberately do *not* refresh: next-themes only swaps CSS custom
 * properties on <html>, which moves no geometry at all.
 */
export function ScrollRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    const id = window.setTimeout(() => ScrollTrigger.refresh(), ROUTE_SETTLE_MS);
    return () => window.clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    const timers = new Set<number>();

    const refreshAfter = (ms: number) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        if (!cancelled) ScrollTrigger.refresh();
      }, ms);
      timers.add(id);
    };

    void document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    // `toggle` does not bubble, so listen in the capture phase.
    const onToggle = (event: Event) => {
      if ((event.target as HTMLElement | null)?.tagName === "DETAILS") {
        refreshAfter(DETAILS_SETTLE_MS);
      }
    };
    document.addEventListener("toggle", onToggle, true);

    return () => {
      cancelled = true;
      for (const id of timers) window.clearTimeout(id);
      document.removeEventListener("toggle", onToggle, true);
    };
  }, []);

  return null;
}
