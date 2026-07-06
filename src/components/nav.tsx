"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SystemMark } from "@/components/ui";
import { navLinks } from "@/content/site";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const navItems = navLinks.map((link) => ({
    ...link,
    active: link.href === "/" ? pathname === "/" : pathname.startsWith(link.href),
  }));

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/90 backdrop-blur-sm">
      <nav aria-label="Main" className="mx-auto max-w-5xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="inline-flex h-10 items-center gap-2 font-mono text-sm tracking-tight text-fg transition-colors duration-150 hover:text-accent"
          >
            <SystemMark />
            <span>tarun yadgirkar</span>
          </Link>

          <ul className="hidden items-center gap-5 md:flex">
            {navItems.map(({ href, label, active }) => {
              return (
                <li key={href} className="relative">
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex h-10 items-center text-[13px] tracking-wide transition-colors duration-150 ${
                      active ? "text-accent" : "text-fg-muted hover:text-fg"
                    }`}
                  >
                    {label}
                  </Link>
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-px h-px bg-accent"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
              aria-label="Open command palette"
              className="hidden h-9 items-center gap-2 rounded-sm border border-line-strong px-3 font-mono text-xs text-fg-muted transition-colors duration-150 hover:border-accent hover:text-accent md:inline-flex"
            >
              Search
              <kbd className="rounded-sm border border-line-strong px-1 py-0.5 text-[11px]">
                ⌘K
              </kbd>
            </button>

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
        </div>

        <ul
          id="mobile-menu"
          hidden={!open}
          className="border-t border-line py-4 md:hidden"
        >
          {navItems.map(({ href, label, active }) => {
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
