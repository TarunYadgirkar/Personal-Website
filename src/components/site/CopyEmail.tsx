"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, TextAa } from "@phosphor-icons/react/dist/ssr";

type State = "idle" | "copied" | "selected";

const LABEL: Record<State, string> = { idle: "Copy address", copied: "Copied", selected: "Selected, now press copy" };
const RESET_MS = 2200;

/** Falls back to selecting the address so the visitor can copy it by hand. */
function selectText(el: HTMLElement | null): void {
  const selection = window.getSelection();
  if (!el || !selection) return;
  const range = document.createRange();
  range.selectNodeContents(el);
  selection.removeAllRanges();
  selection.addRange(range);
}

/** The address as a link, with a copy control beside it. */
export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<State>("idle");
  const [tick, setTick] = useState(0);
  const address = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (state === "idle") return;
    const t = setTimeout(() => setState("idle"), RESET_MS);
    return () => clearTimeout(t);
  }, [state, tick]);

  async function copy() {
    setTick((n) => n + 1);
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      selectText(address.current);
      setState("selected");
    }
  }

  const Icon = state === "copied" ? Check : state === "selected" ? TextAa : Copy;
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a ref={address} href={`mailto:${email}`} className="figures rounded text-lg font-medium underline-offset-4 hover:underline sm:text-xl">
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink/8 px-3 text-sm font-semibold transition-[scale,background-color] duration-150 hover:bg-ink/14 active:scale-[0.96]"
      >
        <Icon size={16} weight="bold" aria-hidden="true" />
        {LABEL[state]}
      </button>
      <span role="status" className="sr-only">
        {state === "idle" ? "" : LABEL[state]}
      </span>
    </div>
  );
}
