"use client";

import { CheckIcon, CopyIcon } from "@phosphor-icons/react";
import { useState } from "react";

export function CopyEmailButton({ email }: { email: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch {
      // Clipboard permission denied or unavailable — mailto link above still works.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={isCopied ? "Email copied" : "Copy email address"}
      className="inline-flex size-8 items-center justify-center rounded-sm text-fg-faint transition-colors duration-150 hover:text-accent"
    >
      {isCopied ? (
        <CheckIcon aria-hidden="true" weight="regular" className="size-4" />
      ) : (
        <CopyIcon aria-hidden="true" weight="regular" className="size-4" />
      )}
    </button>
  );
}
