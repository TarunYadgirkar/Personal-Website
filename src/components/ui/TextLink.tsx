import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/cn";

/** An inline link. External ones get the arrow so the reader knows they leave the site. */
export function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  // Files under /public are not routes; a Next Link would prefetch them and 404.
  const external = /^(https?:|mailto:)|\.[a-z0-9]{2,4}$/i.test(href);
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
