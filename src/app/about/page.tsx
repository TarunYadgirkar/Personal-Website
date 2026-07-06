import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui";
import { aboutParagraphs } from "@/content/about";
import { site, skills } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: site.bioShort,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-28 pt-20">
      <h1 className="mt-4 max-w-3xl text-3xl font-medium tracking-tight sm:text-5xl">
        Where software meets the physical world
      </h1>

      <div className="mt-10 flex max-w-2xl flex-col gap-5">
        {aboutParagraphs.map((p) => (
          <p key={p.slice(0, 40)} className="text-[16px] leading-relaxed text-fg-muted">
            {p}
          </p>
        ))}
      </div>

      <section className="mt-20" aria-labelledby="skills">
        <SectionHeading id="skills"  title="Skills" />
        <div className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
          {skills.map((group) => (
            <div key={group.group} className="bg-surface p-6 sm:p-7">
              <h3 className="font-mono text-[12px] text-accent">{group.group}</h3>
              <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5">
                {group.items.map((item) => (
                  <li key={item} className="font-mono text-[12px] text-fg-muted">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20" aria-labelledby="connect">
        <SectionHeading id="connect"  title="Get in touch" />
        <div className="flex flex-col items-start gap-2">
          {site.emails.map((email) => (
            <a
              key={email.address}
              href={`mailto:${email.address}`}
              className="text-xl font-medium tracking-tight text-fg underline-offset-8 transition-colors duration-150 hover:text-accent hover:underline sm:text-2xl"
            >
              {email.address}
            </a>
          ))}
        </div>
        <ul className="mt-6 flex gap-6">
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
                className="font-mono text-[13px] text-fg-muted transition-colors duration-150 hover:text-accent"
              >
                {label}{" "}
                <ArrowUpRight aria-hidden="true" className="inline size-3 align-[-1px]" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
