"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard permission denied or unavailable — mailto link above still works.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Email copied" : "Copy email address"}
      className="inline-flex size-8 items-center justify-center rounded-sm text-fg-faint transition-colors duration-150 hover:text-accent"
    >
      {copied ? (
        <Check aria-hidden="true" className="size-4" strokeWidth={1.75} />
      ) : (
        <Copy aria-hidden="true" className="size-4" strokeWidth={1.75} />
      )}
    </button>
  );
}
