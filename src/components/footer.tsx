import { site } from "@/content/site";
import { SystemMark } from "@/components/ui";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-3">
          <SystemMark className="mt-0.5" />
          <div className="flex flex-col gap-2">
            <p className="text-sm text-fg">{site.name}</p>
            <p className="font-mono text-xs text-fg-faint">{site.location}</p>
            <div className="flex flex-col gap-1">
              {site.emails.map((email) => (
                <a
                  key={email.address}
                  href={`mailto:${email.address}`}
                  className="font-mono text-xs text-fg-muted transition-colors duration-150 hover:text-accent"
                >
                  {email.address}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:items-end">
          <ul className="flex gap-5">
            {(
              [
                ["GitHub", site.links.github],
                ["LinkedIn", site.links.linkedin],
                ["X", site.links.x],
              ] as const
            ).map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-fg-muted transition-colors duration-150 hover:text-accent"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <p className="font-mono text-[11px] text-fg-faint">
            Next.js · TypeScript · Tailwind · Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
