"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/research", label: "Research" },
  { href: "/patent", label: "Patent" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
] as const;

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-sm">
      <nav aria-label="Main" className="mx-auto max-w-5xl px-6">
        <div className="flex h-16 items-center justify-between">
        <Link
          href="/"
          className="inline-flex h-10 items-center font-mono text-sm tracking-tight text-fg transition-colors duration-150 hover:text-accent"
        >
          tarun yadgirkar
        </Link>

        <ul className="hidden items-center gap-5 md:flex">
          {LINKS.map(({ href, label }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex h-10 items-center text-[13px] tracking-wide transition-colors duration-150 ${
                    active ? "text-accent" : "text-fg-muted hover:text-fg"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="inline-flex h-10 min-w-10 items-center justify-center rounded-sm font-mono text-[13px] text-fg-muted transition-colors duration-150 hover:text-fg md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "close" : "menu"}
        </button>
        </div>

        <ul
          id="mobile-menu"
          hidden={!open}
          className="border-t border-line py-4 md:hidden"
        >
          {LINKS.map(({ href, label }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`block py-2.5 text-sm ${
                    active ? "text-accent" : "text-fg-muted"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
