"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "featured-work", label: "Work" },
  { id: "focus-areas", label: "Focus" },
  { id: "recognition", label: "Recognition" },
  { id: "contact", label: "Contact" },
] as const;

export function SectionNav() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);

  useEffect(() => {
    const onScroll = () => {
      const reference = window.scrollY + window.innerHeight * 0.4;
      let current: string = SECTIONS[0].id;
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= reference) current = id;
      }
      setActiveId(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      aria-label="Section"
      className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-4 lg:flex"
    >
      {SECTIONS.map(({ id, label }) => (
        <a key={id} href={`#${id}`} aria-label={label} className="group flex items-center justify-end gap-2">
          <span className="pointer-events-none whitespace-nowrap rounded-sm bg-surface px-2 py-1 font-mono text-[12px] text-fg-muted opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100">
            {label}
          </span>
          <span
            aria-hidden="true"
            className={`size-2 rounded-full border transition-colors duration-150 ${
              activeId === id
                ? "border-accent bg-accent"
                : "border-line-strong bg-transparent group-hover:border-accent"
            }`}
          />
        </a>
      ))}
    </nav>
  );
}
