import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-[20rem] break-words font-mono text-[10px] uppercase leading-relaxed tracking-[0.16em] text-accent before:mr-2 before:inline-block before:size-1 before:bg-accent before:align-middle sm:max-w-full sm:text-[11px] sm:tracking-[0.22em]">
      {children}
    </p>
  );
}

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
    <div className="mb-10 flex flex-col gap-3">
      <Eyebrow>{eyebrow}</Eyebrow>
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
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}
