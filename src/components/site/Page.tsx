import type { ReactNode } from "react";

/** The shared frame for an inner page: a title, a lead paragraph, then the body. */
export function Page({ title, lead, children }: { title: string; lead?: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-8 pt-12 sm:px-8 md:pt-16">
      <h1 className="text-5xl sm:text-6xl md:text-7xl">{title}</h1>
      {lead && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">{lead}</p>}
      <div className="mt-12 md:mt-16">{children}</div>
    </div>
  );
}

/** A section inside a page: heading names the one thing the section is about. */
export function Section({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-line py-10 md:grid md:grid-cols-[260px_1fr] md:gap-10 md:py-14">
      <h2 className="text-2xl sm:text-3xl">{title}</h2>
      <div className="mt-5 max-w-2xl md:mt-0">{children}</div>
    </section>
  );
}
