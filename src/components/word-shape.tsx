"use client";

import { useId } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { Variants } from "framer-motion";

export type WordShapeKind = "arm" | "chip" | "graph" | "wave" | "hand";

type Props = {
  word: string;
  shape: WordShapeKind;
  className?: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

const FONT_SIZE = 7.2;
const ROW_STEP = 7.4;
const ROW_COUNT = 14;
const TEXT_X = -6;
const LETTER_SPACING = -0.3;

const ROWS = Array.from({ length: ROW_COUNT }, (_, i) => 2 + i * ROW_STEP);

const CHIP_PIN_POS = [33, 44, 55, 66] as const;

const WAVE_BAR_HEIGHTS = [16, 30, 24, 46, 38, 60, 42, 52, 28, 38, 18] as const;

const GRAPH_NODES = [
  { cx: 28, cy: 32, r: 8 },
  { cx: 72, cy: 26, r: 7 },
  { cx: 34, cy: 74, r: 8 },
  { cx: 74, cy: 70, r: 7 },
] as const;

const GRAPH_EDGES = [
  "28.27,33.98 72.27,27.98 71.73,24.02 27.73,30.02",
  "29.98,31.72 35.98,73.72 32.02,74.28 26.02,32.28",
  "34.2,75.99 74.2,71.99 73.8,68.01 33.8,72.01",
  "73.998,25.91 75.998,69.91 72.002,70.09 70.002,26.09",
] as const;

const ARM_BARS = [
  "55.3,88.8 73.3,54.8 62.7,49.2 44.7,83.2",
  "72.2,48.45 50.2,22.45 41.8,29.55 63.8,55.55",
] as const;

const HEART_PATH =
  "M50 80 C 30 66 18 50 18 38 C 18 28 26 22 34 22 C 41 22 47 27 50 33 C 53 27 59 22 66 22 C 74 22 82 28 82 38 C 82 50 70 66 50 80 Z";

function renderShape(shape: WordShapeKind): ReactNode {
  switch (shape) {
    case "arm":
      return (
        <>
          <rect x={38} y={84} width={24} height={14} rx={2} />
          <circle cx={50} cy={86} r={7} />
          <circle cx={68} cy={52} r={6} />
          <circle cx={46} cy={26} r={5} />
          {ARM_BARS.map((pts) => (
            <polygon key={pts} points={pts} />
          ))}
          <rect x={38} y={14} width={16} height={12} rx={1} />
          <rect x={38} y={8} width={4} height={8} />
          <rect x={50} y={8} width={4} height={8} />
        </>
      );
    case "chip":
      return (
        <>
          <rect x={28} y={28} width={44} height={44} rx={3} />
          {CHIP_PIN_POS.map((p) => (
            <rect key={`l${p}`} x={20} y={p} width={8} height={5} />
          ))}
          {CHIP_PIN_POS.map((p) => (
            <rect key={`r${p}`} x={72} y={p} width={8} height={5} />
          ))}
          {CHIP_PIN_POS.map((p) => (
            <rect key={`t${p}`} x={p} y={20} width={5} height={8} />
          ))}
          {CHIP_PIN_POS.map((p) => (
            <rect key={`b${p}`} x={p} y={72} width={5} height={8} />
          ))}
        </>
      );
    case "graph":
      return (
        <>
          {GRAPH_EDGES.map((pts) => (
            <polygon key={pts} points={pts} />
          ))}
          {GRAPH_NODES.map((n) => (
            <circle key={`${n.cx}-${n.cy}`} cx={n.cx} cy={n.cy} r={n.r} />
          ))}
        </>
      );
    case "wave":
      return (
        <>
          {WAVE_BAR_HEIGHTS.map((h, i) => (
            <rect key={i} x={8 + i * 8} y={50 - h / 2} width={6} height={h} rx={1} />
          ))}
        </>
      );
    case "hand":
      return <path d={HEART_PATH} />;
  }
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.022 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 1.5 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

export function WordShape({ word, shape, className }: Props): ReactNode {
  const reduced = useReducedMotion();
  const rawId = useId();
  const clipId = `word-shape-${rawId.replace(/:/g, "")}`;

  const upper = word.toUpperCase();
  const repeatCount = Math.ceil(44 / (upper.length + 1)) + 1;
  const filler = `${upper} `.repeat(repeatCount);

  return (
    <svg
      viewBox="0 0 100 100"
      className={className ?? "size-12"}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>{renderShape(shape)}</clipPath>
      </defs>

      <motion.g
        clipPath={`url(#${clipId})`}
        initial={reduced ? undefined : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, margin: "-20px" }}
        variants={reduced ? undefined : container}
      >
        {ROWS.map((baseY, i) => (
          <motion.g key={i} variants={reduced ? undefined : rowVariants}>
            <text
              x={TEXT_X}
              y={baseY}
              fontFamily="var(--font-mono)"
              fontSize={FONT_SIZE}
              fontWeight={500}
              letterSpacing={LETTER_SPACING}
              fill="var(--color-accent)"
            >
              {filler}
            </text>
          </motion.g>
        ))}
      </motion.g>

      <g fill="none" stroke="var(--color-line-strong)" strokeWidth={1}>
        {renderShape(shape)}
      </g>
    </svg>
  );
}
