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
  const active = !reduced && fine;

  // The wrapper shape is deliberately identical whether or not the effect is
  // active, and `children` always sit in the same slot. `fine` is false during
  // hydration and flips straight after, so a structural difference between the
  // two branches would make React unmount and rebuild everything inside — which
  // silently invalidated scroll animations that had already captured those
  // elements (the featured-work row rules never drew).
  return (
    <div
      className={`relative ${className}`}
      onPointerMove={
        active
          ? (e) => {
              const r = e.currentTarget.getBoundingClientRect();
              x.set(e.clientX - r.left);
              y.set(e.clientY - r.top);
            }
          : undefined
      }
      onPointerEnter={active ? () => opacity.set(1) : undefined}
      onPointerLeave={active ? () => opacity.set(0) : undefined}
    >
      {active ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{ background, opacity }}
        />
      ) : null}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
