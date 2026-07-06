"use client";

import { ArrowUp } from "lucide-react";
import { useScrollPast } from "@/components/use-scroll-past";

export function BackToTop() {
  const visible = useScrollPast(0.6);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="fixed bottom-5 left-1/2 z-40 flex size-11 -translate-x-1/2 items-center justify-center rounded-full border border-line-strong bg-surface/90 text-fg-muted shadow-lg backdrop-blur-sm transition-colors duration-150 hover:text-accent"
    >
      <ArrowUp aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
    </button>
  );
}
