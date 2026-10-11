import { cn } from "@/lib/cn";

/** A list with a small rust dot for each item. */
export function BulletList({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn("flex flex-col text-base text-ink-soft", className)}>
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-rust" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}
