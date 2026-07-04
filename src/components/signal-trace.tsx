"use client";

import { motion, useReducedMotion } from "framer-motion";

// An analog wave resolving into a clean digital signal — the site's one
// signature visual, echoing the FPGA / signal-processing research.
const TRACE =
  "M0,60 Q30,12 60,60 T120,60 T180,60 T240,60 T300,60 T360,60" +
  " Q390,28 420,60 T480,60 Q510,40 540,60 T600,60" +
  " L640,60 L640,24 L720,24 L720,96 L800,96 L800,24 L880,24 L880,96 L960,96 L960,24 L1040,24 L1040,96 L1120,96 L1120,24 L1200,24";

export function SignalTrace({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  return (
    <svg
      viewBox="0 0 1200 120"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={className}
    >
      <motion.path
        d={TRACE}
        stroke="var(--color-accent)"
        strokeOpacity={0.55}
        strokeWidth={1.5}
        vectorEffect="non-scaling-stroke"
        initial={reduced ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, delay: 0.2, ease: "easeOut" }}
      />
    </svg>
  );
}
