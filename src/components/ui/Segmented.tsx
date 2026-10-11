import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** The tinted pill that holds a row of segment buttons. */
export function SegmentGroup({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div role="group" className={cn("inline-flex rounded-full bg-ink/8 p-1", className)} {...rest} />;
}

interface SegmentButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Raise this segment as the current choice. */
  selected?: boolean;
}

/** One choice in a segment group; the selected one sits raised on paper. */
export function SegmentButton({ selected = false, className, type = "button", ...rest }: SegmentButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "rounded-full px-3 py-1.5 text-sm font-semibold text-ink transition-colors duration-150",
        selected && "bg-paper-pale shadow-card",
        className,
      )}
      {...rest}
    />
  );
}
