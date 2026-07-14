"use client";

import { ArrowDown } from "lucide-react";
import { useLenis } from "lenis/react";
import { useScrollPast } from "@/components/use-scroll-past";

export function ScrollForMore() {
  const scrolled = useScrollPast(0.05);
  const lenis = useLenis();

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-5 z-30 transition-opacity duration-300 ${
        scrolled ? "opacity-0" : "opacity-100"
      }`}
    >
      <button
        type="button"
        onClick={() =>
          lenis
            ? lenis.scrollTo(window.scrollY + window.innerHeight)
            : window.scrollBy({ top: window.innerHeight, behavior: "smooth" })
        }
        className="pointer-events-auto mx-auto flex items-center gap-3 px-6"
      >
        <p className="font-mono text-[13px] text-fg-muted">Scroll for more</p>
        <ArrowDown aria-hidden="true" className="size-4 animate-bounce text-fg-muted" strokeWidth={1.5} />
      </button>
    </div>
  );
}
