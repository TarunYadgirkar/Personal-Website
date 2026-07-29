"use client";

import { useReducedMotion } from "motion/react";
import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <ReactLenis
      root
      options={
        reduced
          ? { lerp: 1, duration: 0, smoothWheel: false, anchors: true }
          : { lerp: 0.1, duration: 1.2, anchors: true }
      }
    >
      {children}
    </ReactLenis>
  );
}
