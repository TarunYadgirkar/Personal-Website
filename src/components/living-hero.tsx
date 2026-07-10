"use client";

import { motion, useReducedMotion } from "framer-motion";

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
