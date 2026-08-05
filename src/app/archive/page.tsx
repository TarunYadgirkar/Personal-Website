import type { Metadata } from "next";
import { ExternalLink } from "@/components/ui";
import { archive } from "@/content/archive";

export const metadata: Metadata = {
  title: "Archive",
  description: "Earlier and secondary work — trajectory, not trophies.",
  alternates: {
    canonical: "/archive",
  },
};

export default function ArchivePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-28 pt-20">
      <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-5xl">
        Earlier work
      </h1>
      <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-fg-muted">
        Secondary and earlier projects, kept for the record. The current work
        lives on the homepage.
      </p>

      {/* A time axis rather than a table: the years are the through-line here,
          so they sit on a rule with a tick per entry. */}
      <div className="relative mt-14">
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-[64px] top-6 hidden w-px bg-line sm:block"
        />
        {archive.map((item) => (
          <article
            key={item.title}
            id={item.id}
            className="relative grid gap-2 border-b border-line py-6 sm:grid-cols-[64px_120px_1fr] sm:gap-8"
          >
            <p className="font-mono text-[12px] tabular-nums text-fg-faint">
              {item.years ?? ""}
            </p>
            <span
              aria-hidden="true"
              className="absolute left-[61px] top-[30px] hidden size-1.5 rounded-full bg-accent sm:block"
            />
            <p className="font-mono text-[12px] text-fg-faint sm:pl-4">{item.type}</p>
            <div>
              <h2 className="text-[15px] font-medium text-fg-muted">{item.title}</h2>
              <p className="mt-1.5 text-[14px] leading-relaxed text-fg-faint">
                {item.detail}
              </p>
              {item.href && (
                <div className="mt-2">
                  <ExternalLink
                    href={item.href}
                    ariaLabel={`${item.title} — external link`}
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
