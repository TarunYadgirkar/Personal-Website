import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/cn";

/** An inline link. External ones get the arrow so the reader knows they leave the site. */
export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const external = /^(https?:|mailto:)/.test(href);
  const classes = cn("inline-flex items-center gap-1 font-semibold underline underline-offset-4 decoration-line-strong hover:decoration-accent", className);
  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noreferrer">
        {children}
        <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
