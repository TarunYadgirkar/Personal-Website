"use client";

import { motion, useReducedMotion } from "framer-motion";

type Wave = {
  d: string;
  drift: number;
  dur: number;
  opacity: number;
  width: number;
  bright: boolean;
};

function buildWave(span: number, y: number, amp: number, wavelength: number): string {
  const pts: string[] = [];
  for (let x = 0; x <= span; x += 18) {
    const yy = y + amp * Math.sin((x / wavelength) * Math.PI * 2);
    pts.push(`${x},${yy.toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}

const SPAN = 1600;

const WAVES: readonly Wave[] = [
  { d: buildWave(SPAN, 70, 14, 300), drift: 300, dur: 27, opacity: 0.16, width: 1.5, bright: false },
  { d: buildWave(SPAN, 130, 22, 380), drift: 380, dur: 34, opacity: 0.13, width: 1.5, bright: false },
  { d: buildWave(SPAN, 190, 18, 260), drift: 260, dur: 21, opacity: 0.2, width: 1.25, bright: true },
  { d: buildWave(SPAN, 238, 12, 220), drift: 220, dur: 16, opacity: 0.1, width: 1, bright: false },
];

export function WaveBackdrop({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}
    >
      <svg
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
        fill="none"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        {WAVES.map((w, i) => (
          <motion.path
            key={i}
            d={w.d}
            stroke={w.bright ? "var(--color-accent-bright)" : "var(--color-accent)"}
            strokeOpacity={w.opacity}
            strokeWidth={w.width}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            animate={reduced ? undefined : { x: [0, -w.drift] }}
            transition={reduced ? undefined : { duration: w.dur, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </svg>
    </div>
  );
}

type CaptionsProps = {
  lines: readonly string[] | string[];
  className?: string;
};

export function SequentialCaptions({ lines, className }: CaptionsProps) {
  const reduced = useReducedMotion();

  return (
    <div className={className}>
      {lines.map((line, i) => (
        <motion.span
          key={`${i}-${line}`}
          style={{ display: "block" }}
          initial={reduced ? false : { opacity: 0, y: 8, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={reduced ? { duration: 0 } : { duration: 0.7, delay: i * 0.55, ease: "easeOut" }}
        >
          {line}
        </motion.span>
      ))}
    </div>
  );
}
