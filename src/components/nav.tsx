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
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6"
      >
        <Link
          href="/"
          className="font-mono text-sm tracking-tight text-fg transition-colors duration-150 hover:text-accent"
        >
          tarun yadgirkar
        </Link>

        <ul className="hidden items-center gap-7 sm:flex">
          {LINKS.map(({ href, label }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`text-[13px] tracking-wide transition-colors duration-150 ${
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
          className="font-mono text-[13px] text-fg-muted sm:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "close" : "menu"}
        </button>
      </nav>

      {open && (
        <ul
          id="mobile-menu"
          className="border-t border-line px-6 py-4 sm:hidden"
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
      )}
    </header>
  );
}
