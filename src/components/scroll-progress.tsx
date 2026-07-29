"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 300,
    damping: 40,
    mass: 0.2,
  });

  // The bar still tracks scroll under reduced motion — that's position, not
  // decoration — but it snaps instead of springing.
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: reduced ? scrollYProgress : scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-accent"
    />
  );
}
