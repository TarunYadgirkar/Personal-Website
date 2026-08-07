"use client";

import { useRef, type ReactNode } from "react";
import { FULL_MOTION, REDUCED_MOTION, gsap, useGSAP } from "@/lib/gsap";

/**
 * Draws a vertical timeline axis downward as its list is read, popping each
 * marker as the line reaches it.
 *
 * Looks for `[data-axis]` (the rule, scaled from its top edge) and
 * `[data-axis-dot]` (the markers) anywhere inside, so the markup stays in the
 * page and this only supplies the motion.
 */
export function AxisReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const host = root.current;
      if (!host) return;

      const axis = host.querySelector("[data-axis]");
      const dots = gsap.utils.toArray<HTMLElement>(host.querySelectorAll("[data-axis-dot]"));
      if (!axis || !dots.length) return;

      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: host, start: "top 80%", end: "bottom 65%", scrub: 0.5 },
        });

        tl.from(axis, { scaleY: 0, transformOrigin: "top center", ease: "none", duration: 1 }, 0);
        // Each marker lands as the line passes its own position in the list.
        dots.forEach((dot, i) => {
          tl.from(dot, { scale: 0, opacity: 0, duration: 0.1, ease: "none" }, (i + 0.5) / dots.length);
        });

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      mm.add(REDUCED_MOTION, () => {
        // The finished axis: full-length rule, every marker present.
        gsap.set(axis, { scaleY: 1 });
        gsap.set(dots, { scale: 1, opacity: 1 });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
