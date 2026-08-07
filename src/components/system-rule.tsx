"use client";

import { useRef } from "react";
import { FULL_MOTION, REDUCED_MOTION, gsap, useGSAP } from "@/lib/gsap";

const VB_W = 1200;
const VB_H = 120;
const MID = 44;
// Nothing in the trace goes below this, so the label band underneath stays clear.
const LABEL_Y = 104;
// Where the analog half hands over to the digital half.
const CONVERT_X = 480;

// An analog wave resolving into a clean digital signal, split into its two
// halves at the conversion point so each can be drawn on its own schedule —
// the sine sweeps in continuously, the square wave arrives in one snap.
//
// The sine's control points are -16 and 104 rather than something eyeballed:
// a quadratic's midpoint is 0.25·y₀ + 0.5·cy + 0.25·y₁, so against a baseline
// of 44 those solve to peaks of exactly 14 and 74 — the same rails the square
// wave rides. Without that the two halves read as unrelated drawings spliced
// together. The flat run at the end is kept short so it terminates the trace
// instead of being dead width.
const TRACE_ANALOG = "M0,44 Q40,-16 80,44 T160,44 T240,44 T320,44 T400,44 T480,44";
const TRACE_DIGITAL =
  "M480,44 L480,14 L560,14 L560,74 L640,74 L640,14 L720,14 L720,74 L800,74" +
  " L800,14 L880,14 L880,74 L960,74 L960,14 L1040,14 L1040,44 L1200,44";

// Tick marks along the baseline, as on a drawing's dimension line.
const TICKS = Array.from({ length: 25 }, (_, i) => i * (VB_W / 24));

// Anchored to actual events in the trace, not spaced for looks: mid-analog,
// the exact analog→digital conversion (the foot of the first riser), and the
// settled output.
const STATIONS = [
  { x: 240, label: "sense" },
  { x: CONVERT_X, label: "infer" },
  { x: 1120, label: "actuate" },
] as const;

// The analog half owns its share of the timeline in proportion to its width, so
// the read-head travels at a constant rate across the whole rule.
const ANALOG_SHARE = CONVERT_X / VB_W;

const MONO = { fontFamily: "var(--font-plex-mono), ui-monospace, monospace" };

/**
 * The hero divider: a signal being acquired, converted, and handed downstream.
 *
 * Scroll is the only clock. A scrubbed timeline draws the trace ahead of a
 * travelling read-head and lights each station as the head reaches it, so the
 * rule reads as an instrument running rather than a picture that faded in. The
 * companion `KinematicRig` shares this trigger, which is what makes the arm move
 * exactly when the trace reaches `actuate`.
 */
export function SystemRule({
  className,
  trigger,
  start = "center center",
  end = "+=70%",
}: {
  className?: string;
  /** CSS selector for a shared scroll trigger. Defaults to this element. */
  trigger?: string;
  start?: string;
  end?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const analog = root.current?.querySelector("[data-trace-analog]");
      const digital = root.current?.querySelector("[data-trace-digital]");
      const head = root.current?.querySelector("[data-read-head]");
      if (!analog || !digital || !head) return;

      const lit = STATIONS.map((s) =>
        root.current?.querySelector(`[data-station="${s.label}"]`),
      );

      // Resolved off `document`, not left as a selector string: useGSAP's scope
      // makes GSAP look selectors up *inside* this component's root, and the
      // shared trigger is an ancestor. A miss there fails silently — the trigger
      // just resolves to the top of the document and the timeline reads as
      // already finished.
      const triggerEl = (trigger ? document.querySelector(trigger) : null) ?? root.current;

      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: triggerEl, start, end, scrub: 0.6 },
        });

        tl.fromTo(
          analog,
          { drawSVG: "0% 0%" },
          { drawSVG: "0% 100%", ease: "none", duration: ANALOG_SHARE },
          0,
        )
          .fromTo(
            digital,
            { drawSVG: "0% 0%" },
            { drawSVG: "0% 100%", ease: "none", duration: 1 - ANALOG_SHARE },
            ANALOG_SHARE,
          )
          .fromTo(head, { x: 0, opacity: 0 }, { opacity: 1, duration: 0.02 }, 0)
          .to(head, { x: VB_W, ease: "none", duration: 1 }, 0)
          .to(head, { opacity: 0, duration: 0.02 }, 0.98);

        // set() records the pre-tween value, so scrubbing back up puts each
        // station out again instead of leaving a trail of lit ones behind.
        STATIONS.forEach((s, i) => {
          if (lit[i]) tl.set(lit[i]!, { opacity: 1 }, s.x / VB_W);
        });
      });

      mm.add(REDUCED_MOTION, () => {
        // The finished frame: whole trace drawn, every station lit, no head.
        gsap.set([analog, digital], { drawSVG: "0% 100%" });
        gsap.set(lit.filter(Boolean), { opacity: 1 });
        gsap.set(head, { opacity: 0 });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [trigger, start, end] },
  );

  return (
    <div ref={root} className={className} aria-hidden="true">
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} fill="none" className="h-full w-full">
        {/* baseline + ticks: the static drawing furniture */}
        <line
          x1="0"
          y1={MID}
          x2={VB_W}
          y2={MID}
          stroke="var(--color-line-strong)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        {TICKS.map((x, i) => (
          <line
            key={x}
            x1={x}
            y1={MID}
            x2={x}
            y2={MID + (i % 4 === 0 ? 8 : 4)}
            stroke="var(--color-line-strong)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* The trace. No non-scaling-stroke here: that makes the browser read
            stroke-dasharray in screen units, which is exactly what DrawSVG uses
            to meter the reveal. Width is raised to 2 so it still lands near a
            hairline once the viewBox is scaled down. */}
        <path
          data-trace-analog
          d={TRACE_ANALOG}
          stroke="var(--color-accent)"
          strokeOpacity={0.6}
          strokeWidth={2}
          strokeLinecap="butt"
        />
        <path
          data-trace-digital
          d={TRACE_DIGITAL}
          stroke="var(--color-accent)"
          strokeOpacity={0.6}
          strokeWidth={2}
          strokeLinecap="square"
        />

        {STATIONS.map((s) => (
          <g key={s.label}>
            <circle cx={s.x} cy={MID} r="2.5" fill="var(--color-line-strong)" />
            <text
              x={s.x}
              y={LABEL_Y}
              textAnchor="middle"
              fill="var(--color-fg-faint)"
              fontSize="15"
              // set directly: Tailwind's font-mono class doesn't reliably reach
              // SVG <text> through the theme layer
              style={MONO}
            >
              {s.label}
            </text>
            {/* the lit copy, faded in as the read-head arrives */}
            <g data-station={s.label} opacity={0}>
              <circle cx={s.x} cy={MID} r="3.5" fill="var(--color-accent)" />
              <text
                x={s.x}
                y={LABEL_Y}
                textAnchor="middle"
                fill="var(--color-accent)"
                fontSize="15"
                style={MONO}
              >
                {s.label}
              </text>
            </g>
          </g>
        ))}

        {/* the travelling read-head */}
        <g data-read-head opacity={0}>
          <line
            x1="0"
            y1={MID - 16}
            x2="0"
            y2={MID + 16}
            stroke="var(--color-accent)"
            strokeWidth="1"
            strokeOpacity={0.5}
            vectorEffect="non-scaling-stroke"
          />
          <circle cx="0" cy={MID} r="3.5" fill="var(--color-accent-bright)" />
        </g>
      </svg>
    </div>
  );
}
