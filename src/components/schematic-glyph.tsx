"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/components/motion";

export type GlyphKind = "chip" | "rover" | "graph" | "mic" | "hand";

/**
 * Each glyph is two layers, `chassis` (the structure) then `signal` (the detail
 * that carries the idea). They render in the same neutral tone — the split
 * exists only so the draw-on staggers structure-first — and everything is
 * stroked at 1.5, matching the arrow weight in <Schematic>, so the focus cards
 * and the pipeline diagrams read as one drawing set.
 *
 * Circles are written as two half-arcs (`a r,r 0 1,0 2r,0` twice). Single-arc
 * shorthand degenerates at 360° and renders as a lump.
 */
const GLYPHS: Record<GlyphKind, { chassis: string[]; signal: string }> = {
  chip: {
    chassis: [
      "M22 22h36v36H22z",
      "M32 32h16v16H32z",
      "M30 22V10M50 22V10M30 58v12M50 58v12",
      "M22 30H10M22 50H10M58 30h12M58 50h12",
    ],
    signal: "M10 40h12v-8h16v16h16v-8h12",
  },
  // A rover in plan-elevation: chassis bar, two wheels, mast, sensor head.
  rover: {
    chassis: [
      "M18 40h44v12H18z",
      "M40 40V30",
      "M30 22h20v8H30z",
      "M28 52v4M52 52v4",
    ],
    signal:
      "M21,60 a7,7 0 1,0 14,0 a7,7 0 1,0 -14,0" +
      "M45,60 a7,7 0 1,0 14,0 a7,7 0 1,0 -14,0" +
      "M36 26h8",
  },
  graph: {
    chassis: [
      "M16 20a4 4 0 1 0 0-.1M16 40a4 4 0 1 0 0-.1M16 60a4 4 0 1 0 0-.1",
      "M40 28a4 4 0 1 0 0-.1M40 52a4 4 0 1 0 0-.1",
      "M64 40a4 4 0 1 0 0-.1",
      "M20 20l16 8M20 40l16-12M20 40l16 12M20 60l16-8",
    ],
    signal: "M44 28l16 12M44 52l16-12",
  },
  mic: {
    chassis: [
      "M34 16h12v26a6 6 0 0 1-12 0z",
      "M40 60v10M30 70h20",
      "M24 38v6a16 16 0 0 0 32 0v-6",
    ],
    signal: "M14 40c0 8 4 14 4 14M66 40c0 8-4 14-4 14",
  },
  // An assistive leg brace seen head-on: cuff, twin rails, knee joint, foot
  // plate. Points at BALANCE rather than at a generic hand, and holds together
  // at 1.5 stroke inside 80×80 — a four-finger outline did not, and a single
  // centre line read as a stick rather than a limb.
  hand: {
    chassis: [
      "M26 14h28",
      "M30 14v16M50 14v16",
      "M30 42v16M50 42v16",
      "M26 58h28",
    ],
    // The knee joint plus a foot that extends forward — without the foot the
    // twin rails just read as a ladder.
    signal: "M34,36 a6,6 0 1,0 12,0 a6,6 0 1,0 -12,0" + "M40 58v8M40 66h16",
  },
};

export function SchematicGlyph({
  kind,
  className,
  delay = 0,
}: {
  kind: GlyphKind;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const glyph = GLYPHS[kind];

  const stroke = {
    fill: "none" as const,
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const draw = reduced
    ? {}
    : {
        initial: { pathLength: 0, opacity: 0 },
        whileInView: { pathLength: 1, opacity: 1 },
        viewport: { once: true, margin: "-40px" },
      };

  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" className={className}>
      <g stroke="var(--color-fg-muted)" {...stroke}>
        {glyph.chassis.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            {...draw}
            transition={{ duration: 0.6, delay: delay + i * 0.08, ease: EASE_OUT }}
          />
        ))}
        <motion.path
          d={glyph.signal}
          {...draw}
          transition={{ duration: 0.7, delay: delay + 0.24, ease: EASE_OUT }}
        />
      </g>
    </svg>
  );
}
