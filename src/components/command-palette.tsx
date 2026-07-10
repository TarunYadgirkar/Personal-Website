"use client";

import { CornerDownLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { navLinks } from "@/content/site";

const ITEMS = [...navLinks, { href: "/#contact", label: "Contact" }] as const;

export function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(
    () => ITEMS.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  useEffect(() => {
    const openPalette = () => {
      setQuery("");
      setActiveIndex(0);
      setIsOpen(true);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (isOpen) {
          setIsOpen(false);
        } else {
          openPalette();
        }
      }
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("open-command-palette", openPalette);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("open-command-palette", openPalette);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const navigate = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-bg/70 pt-[15vh] backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-full max-w-md rounded-sm border border-line-strong bg-surface shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <Search aria-hidden="true" className="size-4 text-fg-faint" strokeWidth={1.5} />
          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, results.length - 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
              } else if (event.key === "Enter" && results[activeIndex]) {
                navigate(results[activeIndex].href);
              }
            }}
            placeholder="Jump to a page..."
            className="w-full bg-transparent font-mono text-sm text-fg outline-none placeholder:text-fg-faint"
          />
        </div>
        <ul className="max-h-72 overflow-y-auto py-2">
          {results.length === 0 && (
            <li className="px-4 py-3 text-sm text-fg-faint">No matches</li>
          )}
          {results.map((item, i) => (
            <li key={item.href}>
              <button
                type="button"
                onClick={() => navigate(item.href)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors duration-100 ${
                  i === activeIndex ? "bg-line/60 text-accent" : "text-fg"
                }`}
              >
                {item.label}
                {i === activeIndex && (
                  <CornerDownLeft aria-hidden="true" className="size-3.5 text-fg-faint" strokeWidth={1.5} />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
