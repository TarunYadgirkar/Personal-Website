"use client";

import { useReducedMotion } from "framer-motion";
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
