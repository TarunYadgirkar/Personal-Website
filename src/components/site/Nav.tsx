"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { navLinks, site } from "@/content/site";

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 bg-paper/85 backdrop-blur-md">
      <nav aria-label="Main" className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-3 sm:px-8 sm:py-4">
        <Link href="/" className="rounded font-heading text-lg font-semibold">
          {site.name}
        </Link>
        <ul className="-mx-2 flex items-center gap-0.5 overflow-x-auto px-2 sm:mx-0 sm:gap-1 sm:px-0">
          {navLinks.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-2.5 py-1.5 text-sm font-semibold transition-colors duration-150 hover:bg-ink/8 sm:px-3 sm:text-base",
                    active && "bg-ink/8",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
