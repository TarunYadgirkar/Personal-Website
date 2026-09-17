"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";

/** The address as a link, with a copy control beside it. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a href={`mailto:${email}`} className="figures rounded text-lg font-medium underline-offset-4 hover:underline sm:text-xl">
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink/8 px-3 text-sm font-semibold transition-[scale,background-color] duration-150 hover:bg-ink/14 active:scale-[0.96]"
      >
        {copied ? <Check size={16} weight="bold" aria-hidden="true" /> : <Copy size={16} weight="bold" aria-hidden="true" />}
        {copied ? "Copied" : "Copy address"}
      </button>
    </div>
  );
}
