"use client";

import { usePathname } from "next/navigation";
import { useRef, type ReactNode } from "react";
import { FULL_MOTION, REDUCED_MOTION, gsap, useGSAP } from "@/lib/gsap";

/**
 * Route changes as a plotter pass: a hairline sweeps down the viewport while the
 * incoming page rises in behind it.
 *
 * Replaces an `<AnimatePresence mode="wait">` cross-fade. That kept the outgoing
 * page mounted for the length of its exit, which meant every ScrollTrigger on
 * the incoming page measured its start and end against a document that still
 * contained the previous one. Letting the router swap immediately removes the
 * overlap entirely — `ScrollRefresh` then only has to re-measure once, after
 * this animation settles.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const content = useRef<HTMLDivElement>(null);
  const sweep = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION, () => {
        const tl = gsap.timeline();
        tl.set(sweep.current, { y: 0, opacity: 1 })
          // Resolved as a function so the distance is right at play time rather
          // than whenever this timeline happened to be built.
          .to(sweep.current, {
            y: () => window.innerHeight,
            duration: 0.5,
            ease: "power2.inOut",
          })
          .set(sweep.current, { opacity: 0 })
          .from(content.current, { opacity: 0, y: 10, duration: 0.4, ease: "power2.out" }, 0.1);
        return () => tl.kill();
      });

      mm.add(REDUCED_MOTION, () => {
        gsap.set(sweep.current, { opacity: 0 });
        gsap.set(content.current, { opacity: 1, y: 0 });
      });

      return () => mm.revert();
    },
    { dependencies: [pathname] },
  );

  return (
    <>
      <div
        ref={sweep}
        data-page-sweep
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-px bg-accent opacity-0"
      />
      {/* keyed so children remount per route and their scroll effects re-run */}
      <div ref={content} data-page-content key={pathname}>
        {children}
      </div>
    </>
  );
}
