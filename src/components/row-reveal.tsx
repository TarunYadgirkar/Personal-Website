"use client";

import { useRef, type ReactNode } from "react";
import { FULL_MOTION, REDUCED_MOTION, gsap, useGSAP } from "@/lib/gsap";

/**
 * Gives a list of rows its own scroll response instead of one wipe over the
 * whole block: each row's hairline rule draws left to right as that row is
 * reached, and its parts arrive behind it.
 *
 * Per row, not per list — so the list answers the scroll continuously rather
 * than once. Looks for `[data-row]`, and inside each: `[data-row-rule]` (the
 * hairline) and `[data-row-part]` (the columns).
 */
export function RowReveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const host = root.current;
      if (!host) return;

      const rows = gsap.utils.toArray<HTMLElement>(host.querySelectorAll("[data-row]"));
      if (!rows.length) return;

      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION, () => {
        rows.forEach((row) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: row, start: "top 90%", end: "top 55%", scrub: 0.4 },
          });

          const rule = row.querySelector("[data-row-rule]");
          if (rule) {
            tl.from(
              rule,
              { scaleX: 0, transformOrigin: "left center", ease: "none", duration: 1 },
              0,
            );
          }
          tl.from(
            row.querySelectorAll("[data-row-part]"),
            { opacity: 0, y: 10, stagger: 0.2, duration: 0.6, ease: "none" },
            0.1,
          );
        });
        // No manual teardown: matchMedia.revert() below removes the tweens and
        // their ScrollTriggers together.
      });

      mm.add(REDUCED_MOTION, () => {
        gsap.set(host.querySelectorAll("[data-row-rule]"), { scaleX: 1 });
        gsap.set(host.querySelectorAll("[data-row-part]"), { opacity: 1, y: 0 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
