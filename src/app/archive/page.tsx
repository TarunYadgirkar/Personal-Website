import type { Metadata } from "next";
import { Eyebrow, ExternalLink } from "@/components/ui";
import { archive } from "@/content/archive";

export const metadata: Metadata = {
  title: "Archive",
  description: "Earlier and secondary work — trajectory, not trophies.",
};

export default function ArchivePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-28 pt-20">
      <Eyebrow>Archive</Eyebrow>
      <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-5xl">
        Earlier work
      </h1>
      <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-fg-muted">
        Secondary and earlier projects, kept for the record. The current work
        lives on the homepage.
      </p>

      <div className="mt-14 border-t border-line">
        {archive.map((item) => (
          <article
            key={item.title}
            id={item.id}
            className="grid gap-2 border-b border-line py-6 sm:grid-cols-[110px_120px_1fr] sm:gap-8"
          >
            <p className="font-mono text-[12px] text-fg-faint">{item.years}</p>
            <p className="font-mono text-[12px] text-fg-faint">{item.type}</p>
            <div>
              <h2 className="text-[15px] font-medium text-fg-muted">{item.title}</h2>
              <p className="mt-1.5 text-[14px] leading-relaxed text-fg-faint">
                {item.detail}
              </p>
              {item.href && (
                <div className="mt-2">
                  <ExternalLink
                    href={item.href}
                    className="font-mono text-[12px] text-fg-muted transition-colors duration-150 hover:text-accent"
                  >
                    Link
                  </ExternalLink>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
