"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_OUT } from "@/components/motion";

export type GlyphKind = "chip" | "rover" | "graph" | "mic" | "hand";

/**
 * Each glyph is two layers:
 * - `chassis` — the neutral structure, drawn in fg-faint.
 * - `signal`  — the one path that carries the idea, drawn in accent.
 * Both are stroked at 1.5, matching the arrow weight in <Schematic>, so the
 * focus cards and the pipeline diagrams read as the same drawing set.
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
  rover: {
    chassis: [
      "M16 44h48v10H16z",
      "M28 44V32h24v12",
      "M34 32V22h12v10",
      "M40 22v-8",
    ],
    signal: "M40 14 22 34M40 14l18 20M24 62a6 6 0 1 0 0-.1M56 62a6 6 0 1 0 0-.1",
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
  hand: {
    chassis: [
      "M26 44V26a4 4 0 0 1 8 0v14",
      "M34 40V22a4 4 0 0 1 8 0v18",
      "M42 40V26a4 4 0 0 1 8 0v16",
      "M50 42v-8a4 4 0 0 1 8 0v18a16 16 0 0 1-16 16h-6a12 12 0 0 1-12-12V44",
    ],
    signal: "M40 66a10 10 0 0 0 0-20 10 10 0 0 0 0 20z",
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
      <g stroke="var(--color-fg-faint)" strokeOpacity={0.75} {...stroke}>
        {glyph.chassis.map((d, i) => (
          <motion.path
            key={d}
            d={d}
            {...draw}
            transition={{ duration: 0.6, delay: delay + i * 0.08, ease: EASE_OUT }}
          />
        ))}
      </g>
      <motion.path
        d={glyph.signal}
        stroke="var(--color-accent)"
        {...stroke}
        {...draw}
        transition={{ duration: 0.7, delay: delay + 0.24, ease: EASE_OUT }}
      />
    </svg>
  );
}
