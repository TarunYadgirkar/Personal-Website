import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  id,
}: {
  eyebrow: string;
  title: string;
  id?: string;
}) {
  return (
    <div id={id} className="mb-10 flex flex-col gap-3">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-2xl font-medium tracking-tight text-fg sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

export function StatusTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-line-strong bg-accent-dim px-2 py-0.5 font-mono text-[11px] tracking-wide text-accent-bright">
      {children}
    </span>
  );
}

export function Tags({ items }: { items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1.5">
      {items.map((tag) => (
        <li
          key={tag}
          className="font-mono text-[11px] tracking-wide text-fg-faint"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

export function ExternalLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        className ??
        "font-mono text-[13px] text-accent underline-offset-4 transition-colors duration-150 hover:text-accent-bright hover:underline"
      }
    >
      {children} ↗
    </a>
  );
}
