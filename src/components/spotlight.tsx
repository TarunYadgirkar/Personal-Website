"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "motion/react";
import { useSyncExternalStore, type ReactNode } from "react";

const subscribeNoop = () => () => {};

// Coarse pointers have no hover state to track, so the effect is skipped
// entirely on touch rather than rendered and left inert.
function useFinePointer() {
  return useSyncExternalStore(
    subscribeNoop,
    () => window.matchMedia("(pointer: fine)").matches,
    () => false,
  );
}

/**
 * A cursor-following highlight, adapted from KokonutUI's mouse-effect card
 * (kokonutui.com) onto this site's tokens — accent-dim instead of the original's
 * gradient-on-zinc, so it tints rather than glows.
 *
 * Renders children untouched under reduced motion or on a coarse pointer.
 */
export function Spotlight({
  children,
  className = "",
  radius = 340,
}: {
  children: ReactNode;
  className?: string;
  radius?: number;
}) {
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const opacity = useMotionValue(0);

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${x}px ${y}px, var(--color-accent-dim), transparent 70%)`;

  if (reduced || !fine) return <div className={className}>{children}</div>;

  return (
    <div
      className={`relative ${className}`}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerEnter={() => opacity.set(1)}
      onPointerLeave={() => opacity.set(0)}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{ background, opacity }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
