import { cn } from "@/lib/cn";
import { TextLink } from "./TextLink";

/** A wrapping row of inline links, such as a project's live demo and repository. */
export function LinkRow({ links, className }: { links: readonly { label: string; href: string }[]; className?: string }) {
  return (
    <p className={cn("flex flex-wrap gap-x-5 gap-y-1", className)}>
      {links.map((l) => (
        <TextLink key={l.href} href={l.href}>
          {l.label}
        </TextLink>
      ))}
    </p>
  );
}
