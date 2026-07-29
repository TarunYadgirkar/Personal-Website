"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * A page section rendered as a sheet on an engineering drawing: a mono index,
 * a hairline lead-in, then the standard accent-square heading, with a rule down
 * the left gutter that fills as the section is read.
 *
 * The index sits *inline with* the heading rather than above it, because
 * .design-sync/conventions.md forbids eyebrow labels stacked over headings.
 */
export function SectionFrame({
  index,
  title,
  id,
  children,
  className = "",
}: {
  index: string;
  title: string;
  id: string;
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.4"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={ref}
      className={`relative pt-24 ${className}`}
      aria-labelledby={id}
    >
      {/* gutter rule — decorative, desktop only, sits in the page's px-6 gutter
          so it never shifts content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-6 bottom-0 top-24 hidden w-px bg-line lg:block"
      >
        <motion.div
          className="h-full w-full origin-top bg-accent"
          style={reduced ? { scaleY: 1, opacity: 0.4 } : { scaleY, opacity: 0.55 }}
        />
      </div>

      <div className="mb-10 flex items-center gap-3">
        <span className="font-mono text-[12px] tabular-nums text-fg-faint">{index}</span>
        <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
        <span aria-hidden="true" className="size-1.5 shrink-0 bg-accent" />
        <h2 id={id} className="text-2xl font-medium tracking-tight text-fg sm:text-3xl">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}
