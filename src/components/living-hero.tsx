"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

type BlobSpec = {
  id: string;
  size: number;
  top: string;
  left: string;
  color: string;
  opacity: number;
  drift: { x: number; y: number };
  duration: number;
};

const BACK_BLOBS: readonly BlobSpec[] = [
  {
    id: "b1",
    size: 620,
    top: "-14%",
    left: "-10%",
    color: "var(--color-accent)",
    opacity: 0.09,
    drift: { x: 24, y: 16 },
    duration: 34,
  },
  {
    id: "b2",
    size: 460,
    top: "6%",
    left: "36%",
    color: "var(--color-accent-dim)",
    opacity: 0.07,
    drift: { x: 18, y: -20 },
    duration: 38,
  },
];

const FRONT_BLOBS: readonly BlobSpec[] = [
  {
    id: "f1",
    size: 520,
    top: "38%",
    left: "56%",
    color: "var(--color-accent-bright)",
    opacity: 0.08,
    drift: { x: -22, y: 24 },
    duration: 26,
  },
];

const SPRING = { stiffness: 60, damping: 20, mass: 0.6 } as const;
const PARALLAX_FRONT = 8;
const PARALLAX_BACK = 3;

export function LivingBackdrop({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, SPRING);
  const sy = useSpring(my, SPRING);
  const frontX = useTransform(sx, (v) => v * PARALLAX_FRONT);
  const frontY = useTransform(sy, (v) => v * PARALLAX_FRONT);
  const backX = useTransform(sx, (v) => v * PARALLAX_BACK);
  const backY = useTransform(sy, (v) => v * PARALLAX_BACK);

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    let nx = 0;
    let ny = 0;
    const handleMove = (e: MouseEvent) => {
      nx = (e.clientX / window.innerWidth) * 2 - 1;
      ny = (e.clientY / window.innerHeight) * 2 - 1;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        mx.set(nx);
        my.set(ny);
      });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduced, mx, my]);

  const renderBlob = (b: BlobSpec) => (
    <motion.div
      key={b.id}
      style={{
        position: "absolute",
        top: b.top,
        left: b.left,
        width: b.size,
        height: b.size,
        borderRadius: "50%",
        background: `radial-gradient(circle at 50% 50%, ${b.color}, transparent 68%)`,
        opacity: b.opacity,
        filter: "blur(32px)",
        willChange: "transform",
      }}
      animate={reduced ? undefined : { x: [0, b.drift.x, 0], y: [0, b.drift.y, 0] }}
      transition={
        reduced
          ? undefined
          : { duration: b.duration, repeat: Infinity, ease: "easeInOut" }
      }
    />
  );

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <motion.div
        style={{ position: "absolute", inset: 0, x: backX, y: backY, willChange: "transform" }}
      >
        {BACK_BLOBS.map(renderBlob)}
      </motion.div>
      <motion.div
        style={{ position: "absolute", inset: 0, x: frontX, y: frontY, willChange: "transform" }}
      >
        {FRONT_BLOBS.map(renderBlob)}
      </motion.div>
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
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.7, delay: i * 0.55, ease: "easeOut" }
          }
        >
          {line}
        </motion.span>
      ))}
    </div>
  );
}
