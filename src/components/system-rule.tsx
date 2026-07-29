"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { EASE_OUT } from "@/components/motion";

const VB_W = 1200;
const VB_H = 120;
const MID = 44;
// Nothing in the trace goes below this, so the label band underneath stays clear.
const LABEL_Y = 104;

// An analog wave resolving into a clean digital signal.
//
// The sine's control points are -16 and 104 rather than something eyeballed:
// a quadratic's midpoint is 0.25·y₀ + 0.5·cy + 0.25·y₁, so against a baseline
// of 44 those solve to peaks of exactly 14 and 74 — the same rails the square
// wave rides. Without that the two halves read as unrelated drawings spliced
// together. The flat run at the end is kept short so it terminates the trace
// instead of being dead width.
const TRACE =
  "M0,44 Q40,-16 80,44 T160,44 T240,44 T320,44 T400,44 T480,44" +
  " L480,14 L560,14 L560,74 L640,74 L640,14 L720,14 L720,74 L800,74" +
  " L800,14 L880,14 L880,74 L960,74 L960,14 L1040,14 L1040,44 L1200,44";

// Tick marks along the baseline, as on a drawing's dimension line.
const TICKS = Array.from({ length: 25 }, (_, i) => i * (VB_W / 24));

// Anchored to actual events in the trace, not spaced for looks: mid-analog,
// the exact analog→digital conversion (the foot of the first riser), and the
// settled output.
const STATIONS = [
  { x: 240, label: "sense" },
  { x: 480, label: "infer" },
  { x: 1120, label: "actuate" },
] as const;

/**
 * The hero divider. Replaces the old canvas particle field: same "signal
 * processing" story, but drawn as line-work that belongs to the same family as
 * the Schematic diagrams instead of decorative dust.
 *
 * The accent node travels the rule as the hero scrolls away — scroll position
 * is the only input, so there is no rAF loop to pause when offscreen.
 */
export function SystemRule({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.9", "end 0.15"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const nodeX = useTransform(smooth, [0, 1], [0, VB_W]);

  return (
    <div ref={ref} className={className} aria-hidden="true">
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

        {/* the signal itself, drawn on once */}
        <motion.path
          d={TRACE}
          stroke="var(--color-accent)"
          strokeOpacity={0.6}
          strokeWidth={1.5}
          strokeLinecap="square"
          vectorEffect="non-scaling-stroke"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.25, ease: EASE_OUT }}
        />

        {STATIONS.map((s) => (
          <g key={s.label}>
            <circle cx={s.x} cy={MID} r="2.5" fill="var(--color-accent)" />
            <text
              x={s.x}
              y={LABEL_Y}
              textAnchor="middle"
              fill="var(--color-fg-faint)"
              fontSize="15"
              // set directly: Tailwind's font-mono class doesn't reliably reach
              // SVG <text> through the theme layer
              style={{ fontFamily: "var(--font-plex-mono), ui-monospace, monospace" }}
            >
              {s.label}
            </text>
          </g>
        ))}

        {/* the travelling read-head — scroll-linked, static under reduced motion */}
        {!reduced && (
          <motion.g style={{ x: nodeX }}>
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
          </motion.g>
        )}
      </svg>
    </div>
  );
}
