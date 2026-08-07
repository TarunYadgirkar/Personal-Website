"use client";

import { useRef } from "react";
import { KinematicRig } from "@/components/kinematic-rig";
import { SystemRule } from "@/components/system-rule";
import { FULL_MOTION, gsap, useGSAP } from "@/lib/gsap";

/**
 * One scroll range, shared by everything on the plate.
 *
 * Deliberately not pinned. Pinning did work, but the plate is only ~300px tall
 * in a ~900px viewport, so holding it at centre left roughly half a screen of
 * empty page above it while the hero copy scrolled away — it read as a layout
 * bug, not as a set piece. Scrubbing over the plate's own travel through the
 * viewport plays the same sequence, keeps the page moving, and avoids a
 * `pin-spacer` changing document height under `section-nav`, the in-page
 * anchors, and the ⌘K palette.
 */
const TRIGGER = "[data-hero-frame]";
const START = "top center";
const END = "+=60%";

/**
 * The hero's drawing sheet: a signal on the left, the machine it drives on the
 * right, both scrubbed by the same stretch of scroll. `SystemRule` names its
 * stations sense → infer → actuate and, until now, nothing actuated. This is the
 * part that does.
 */
export function HeroPlate({ className = "" }: { className?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION, () => {
        const entrance = gsap.from(body.current, {
          opacity: 0,
          y: 14,
          duration: 0.4,
          ease: "power2.out",
          delay: 0.3,
        });
        return () => entrance.kill();
      });

      return () => mm.revert();
    },
    { scope: frame },
  );

  return (
    <div data-hero-frame ref={frame} className={className}>
      <div
        data-hero-plate
        ref={plate}
        className="overflow-hidden rounded-sm border border-line-strong bg-bg"
      >
        <div ref={body}>
          <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2">
            <p className="flex items-center gap-2 font-mono text-[11px] text-fg-faint">
              <span aria-hidden="true" className="size-1.5 shrink-0 bg-accent" />
              FIG. 01
              <span aria-hidden="true" className="h-px w-4 bg-line-strong" />
              <span className="text-fg-muted">sense · infer · actuate</span>
            </p>
            <p className="hidden shrink-0 font-mono text-[11px] text-fg-faint motion-reduce:hidden sm:block">
              scroll to run
            </p>
          </div>

          <div className="grid items-center lg:grid-cols-[1fr_360px]">
            <div className="px-4 py-6">
              <SystemRule
                trigger={TRIGGER}
                start={START}
                end={END}
                className="h-24 w-full sm:h-28"
              />
              {/* A drawing legend, and the reason the left cell isn't mostly
                  empty: the rule's viewBox is 10:1, so extra container height
                  only letterboxes it. */}
              <div className="mt-5 flex items-center justify-between border-t border-line pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-fg-faint">
                <span>analog in</span>
                <span className="hidden sm:inline">quantise</span>
                <span>digital out</span>
              </div>
            </div>
            <div className="border-t border-line px-4 py-3 lg:border-l lg:border-t-0">
              <KinematicRig
                trigger={TRIGGER}
                start={START}
                end={END}
                className="h-44 w-full lg:h-52"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
