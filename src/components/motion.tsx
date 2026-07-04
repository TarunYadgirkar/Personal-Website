"use client";

import { MotionConfig, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.28, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

export function HeroReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

export function Pressable({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.span
      className={className}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15, ease: EASE_OUT }}
      style={{ display: "inline-block" }}
    >
      {children}
    </motion.span>
  );
}
