import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "solid" | "quiet";

const base =
  "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-base font-semibold whitespace-nowrap transition-[scale,background-color,color] duration-150 ease-[var(--ease-out-soft)] active:scale-[0.96]";

const variants: Record<Variant, string> = {
  solid: "bg-ink text-paper-pale hover:bg-ink-soft",
  quiet: "bg-ink/8 text-ink hover:bg-ink/14",
};

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  variant?: Variant;
  children: ReactNode;
}

/** A pill-shaped link. Off-site and mailto links render a plain anchor; the rest a Next link. */
export function ButtonLink({ href, variant = "solid", className, children, ...rest }: LinkProps) {
  const classes = cn(base, variants[variant], className);
  const external = /^(https?:|mailto:)/.test(href);
  if (external) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
    </Link>
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

/** The same pill for an action that stays on the page. */
export function Button({ variant = "solid", className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={cn(base, variants[variant], className)} {...rest} />;
}
