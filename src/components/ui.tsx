import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function SystemMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex size-7 shrink-0 items-center justify-center border border-line-strong bg-surface text-accent ${className}`}
    >
      <svg viewBox="0 0 28 28" className="size-7" role="img">
        <path
          d="M6 18.5 12 12l4 3.5L22 8"
          fill="none"
          stroke="currentColor"
          strokeLinecap="square"
          strokeWidth="1.4"
        />
        <circle cx="6" cy="18.5" r="1.9" fill="currentColor" />
        <circle cx="12" cy="12" r="1.9" fill="currentColor" />
        <circle cx="22" cy="8" r="1.9" fill="currentColor" />
        <path d="M8 22h12" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    </span>
  );
}

export function SectionHeading({ title, id }: { title: string; id?: string }) {
  return (
    <div className="mb-10 flex items-center gap-3">
      <span aria-hidden="true" className="size-1.5 shrink-0 bg-accent" />
      <h2 id={id} className="text-2xl font-medium tracking-tight text-fg sm:text-3xl">
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
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={
        className ??
        "font-mono text-[13px] text-accent underline-offset-4 transition-colors duration-150 hover:text-accent-bright hover:underline"
      }
    >
      {children}{" "}
      <ArrowUpRight aria-hidden="true" className="inline size-3.5 align-[-2px]" />
    </a>
  );
}
