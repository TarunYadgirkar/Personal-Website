"use client";

import { ArrowUpIcon } from "@phosphor-icons/react";
import { useLenis } from "lenis/react";
import { useScrollPast } from "@/components/use-scroll-past";

export function BackToTop() {
  const isVisible = useScrollPast(0.6);
  const lenis = useLenis();

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={() =>
        lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" })
      }
      aria-label="Back to top"
      className="fixed bottom-5 left-1/2 z-40 flex size-11 -translate-x-1/2 items-center justify-center rounded-sm border border-line-strong bg-surface text-fg-muted transition-colors duration-150 hover:text-accent"
    >
      <ArrowUpIcon aria-hidden="true" weight="regular" className="size-[18px]" />
    </button>
  );
}
