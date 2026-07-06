"use client";

import { useEffect, useState } from "react";

export function useScrollPast(fraction: number): boolean {
  const [past, setPast] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setPast(window.scrollY > window.innerHeight * fraction);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [fraction]);

  return past;
}
