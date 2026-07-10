"use client";

import { useEffect, useState } from "react";

export function useScrollPast(fraction: number): boolean {
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    let isTicking = false;
    const onScroll = () => {
      if (isTicking) return;
      isTicking = true;
      requestAnimationFrame(() => {
        setIsPast(window.scrollY > window.innerHeight * fraction);
        isTicking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [fraction]);

  return isPast;
}
