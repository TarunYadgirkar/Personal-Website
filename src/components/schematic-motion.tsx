"use client";

import { useRef, type ReactNode } from "react";
import { FULL_MOTION, REDUCED_MOTION, gsap, useGSAP } from "@/lib/gsap";

// Spacing between consecutive stages on the timeline. Scrub normalises the
// total against the scroll range, so this only sets the overlap between one
// stage and the next.
const STEP = 0.55;

/**
 * Assembles a `<Schematic>` stage by stage as it is scrolled into view: each
 * node arrives, then the arrow to the next column draws, then the next node.
 * Replaces a single clip-path wipe over the whole figure — the diagram now
 * builds the way it would be drawn, left to right.
 *
 * Opt-in, and applied by wrapping rather than by making `Schematic` itself a
 * client component, so /patent keeps its exact server-rendered markup.
 */
export function SchematicMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const host = root.current;
      if (!host) return;

      // One query so the result is in document order. `Schematic` emits the
      // arrow before the column it points into, which makes that order exactly
      // the left-to-right reading order of the diagram.
      const items = gsap.utils.toArray<HTMLElement>(
        host.querySelectorAll("[data-schematic-node],[data-schematic-arrow]"),
      );
      if (!items.length) return;

      const arrowPaths = host.querySelectorAll("[data-schematic-arrow] path");
      const nodes = host.querySelectorAll("[data-schematic-node]");

      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: host, start: "top 85%", end: "top 40%", scrub: 0.5 },
        });

        items.forEach((el, i) => {
          const at = i * STEP;
          if (el.hasAttribute("data-schematic-arrow")) {
            tl.from(
              el.querySelectorAll("path"),
              { drawSVG: "0%", opacity: 0, duration: 0.5, ease: "none" },
              at,
            );
          } else {
            tl.from(el, { opacity: 0, y: 12, duration: 0.6, ease: "none" }, at);
          }
        });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      mm.add(REDUCED_MOTION, () => {
        // The finished drawing — every node placed, every arrow whole.
        gsap.set(nodes, { opacity: 1, y: 0 });
        gsap.set(arrowPaths, { opacity: 1, drawSVG: "100%" });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return <div ref={root}>{children}</div>;
}
