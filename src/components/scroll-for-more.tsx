"use client";

import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollForMore() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.05);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 border-t border-line pb-4 pt-3 transition-opacity duration-300 ${
        scrolled ? "opacity-0" : "opacity-100"
      }`}
    >
      <button
        type="button"
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
        className="pointer-events-auto mx-auto flex items-center gap-3 px-6"
      >
        <p className="font-mono text-[13px] text-fg-muted">Scroll for more</p>
        <ArrowDown aria-hidden="true" className="size-4 animate-bounce text-fg-muted" strokeWidth={1.5} />
      </button>
    </div>
  );
}
