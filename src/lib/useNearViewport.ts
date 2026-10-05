import type { RefObject } from "react";
import { useInView } from "motion/react";

/** True when the page cannot tell what is on screen, so callers should assume it is. */
const NO_OBSERVER = typeof window !== "undefined" && typeof IntersectionObserver === "undefined";

/** True while the element is on screen or within 80px of it. */
export function useNearViewport(ref: RefObject<Element | null>): boolean {
  return useInView(ref, { margin: "80px" }) || NO_OBSERVER;
}
