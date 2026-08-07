"use client";

import { MotionConfig, motion, useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";
import { useSyncExternalStore, type ReactNode } from "react";

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/**
 * Hydration-safe reduced-motion.
 *
 * Use this — not `useReducedMotion()` — whenever the answer decides *which
 * elements get rendered* rather than merely how they move. React renders the
 * server snapshot during hydration and only then reconciles against the client
 * one, so the first client render is guaranteed to match the markup that came
 * off the server. Branching directly on `useReducedMotion()` is what made the
 * homepage headline fail hydration (React #418) for reduced-motion users.
 */
function useReducedMotionAfterMount() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/**
 * Scroll entrance variants. Deliberately more than one: a site where every
 * section fades up by the same 12px reads as generated, which is the tell
 * called out in docs/superpowers/specs/2026-07-07-non-vibecoded-redesign-design.md.
 *
 * - `up`      — the original lift. Still the default for prose blocks.
 * - `mask`    — a clip-path wipe, as if a plotter drew the block in. Used on
 *               schematic figures so they arrive the way a drawing would.
 * - `stagger` — parent only; children animate via `revealChild` below.
 */
export type RevealVariant = "up" | "mask" | "stagger";

const VARIANTS: Record<RevealVariant, Variants> = {
  up: {
    hidden: { opacity: 0, y: 12 },
    shown: { opacity: 1, y: 0, transition: { duration: 0.28, ease: EASE_OUT } },
  },
  mask: {
    hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
    shown: {
      opacity: 1,
      clipPath: "inset(0 0% 0 0)",
      transition: { duration: 0.5, ease: EASE_OUT },
    },
  },
  stagger: {
    hidden: {},
    shown: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
  },
};

export const revealChild: Variants = {
  hidden: { opacity: 0, y: 10 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE_OUT } },
};

export function Reveal({
  children,
  delay = 0,
  className,
  variant = "up",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  variant?: RevealVariant;
}) {
  return (
    <motion.div
      className={className}
      variants={VARIANTS[variant]}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay }}
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

/**
 * The hero headline, revealed a word at a time behind a rising mask. Reads as
 * type being set rather than a block fading in — and unlike the old
 * SequentialCaptions it is fully legible in ~450ms, not ~1.7s.
 */
export function WordReveal({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  // Mount-gated: this branch swaps one DOM shape for another, and doing that on
  // the first client render made the homepage's headline fail hydration
  // (React #418) for anyone with reduced motion on.
  const reduced = useReducedMotionAfterMount();
  const words = text.split(" ");

  if (reduced) return <span className={className}>{text}</span>;

  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="shown"
      variants={{ shown: { transition: { staggerChildren: 0.04, delayChildren: delay } } }}
      aria-label={text}
    >
      {words.map((word, i) => (
        // overflow-hidden gives each word its own mask; the trailing space sits
        // inside the inner span so wrapping still breaks between words.
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="inline-block overflow-hidden align-bottom"
        >
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "100%", opacity: 0 },
              shown: { y: "0%", opacity: 1, transition: { duration: 0.45, ease: EASE_OUT } },
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
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
      tabIndex={-1}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15, ease: EASE_OUT }}
      style={{ display: "inline-block" }}
    >
      {children}
    </motion.span>
  );
}
