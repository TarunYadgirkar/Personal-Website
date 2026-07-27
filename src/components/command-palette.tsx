"use client";

import { CornerDownLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { navLinks } from "@/content/site";

const ITEMS = [
  ...navLinks,
  { href: "/#resume", label: "Résumé" },
  { href: "/#contact", label: "Contact" },
] as const;

export function CommandPalette() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(
    () => ITEMS.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  useEffect(() => {
    const openPalette = () => {
      returnFocusRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
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

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLInputElement>("input")?.focus();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  const navigate = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-label="Command palette"
      onCancel={(event) => {
        event.preventDefault();
        setIsOpen(false);
      }}
      onClose={() => {
        setIsOpen(false);
        returnFocusRef.current?.focus();
      }}
      className="fixed inset-0 z-[70] m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 text-fg backdrop:bg-bg/70 backdrop:backdrop-blur-sm"
    >
      <div
        className="flex h-full items-start justify-center pt-[15vh]"
        onClick={(event) => {
          if (event.target === event.currentTarget) setIsOpen(false);
        }}
      >
        <div className="w-full max-w-md rounded-sm border border-line-strong bg-surface shadow-xl">
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <Search aria-hidden="true" className="size-4 text-fg-faint" strokeWidth={1.5} />
            <input
              aria-label="Search pages"
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
    </dialog>
  );
}
