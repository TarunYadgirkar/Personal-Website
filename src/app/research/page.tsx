import type { Metadata } from "next";
import { Reveal } from "@/components/motion";
import { ExternalLink, SectionHeading, Tags } from "@/components/ui";
import { publication, roar, winLab } from "@/content/research";

export const metadata: Metadata = {
  title: "Research",
  description:
    "FPGA-based acceleration for machine learning and wireless-communication algorithms at SCU's WIN Lab; BALANCE article; ROAR Academy.",
};

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-28 pt-20">
      <h1 className="mt-4 max-w-3xl text-3xl font-medium tracking-tight sm:text-5xl">
        Embedded ML, close to the metal
      </h1>
      <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-fg-muted">
        Current research focuses on running machine learning under real
        hardware constraints — FPGA acceleration for high-throughput,
        low-latency workloads.
      </p>

      <section className="mt-16" aria-labelledby="win-lab">
        <SectionHeading id="win-lab"  title="SCU WIN Lab" />
        <Reveal>
          <article className="rounded-sm border border-line bg-surface p-7 sm:p-10">
            <h3 className="text-xl font-medium tracking-tight text-fg">
              {winLab.role} — {winLab.org}
            </h3>
            <p className="mt-1 font-mono text-[11px] text-fg-faint">
              {winLab.period} · {winLab.location}
            </p>
            <ul className="mt-6 flex max-w-3xl list-disc flex-col gap-3 pl-5 text-[15px] leading-relaxed text-fg-muted marker:text-accent">
              {winLab.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <div className="mt-6">
              <Tags items={winLab.tags} />
            </div>
          </article>
        </Reveal>
      </section>

      <section className="mt-20" aria-labelledby="publications">
        <SectionHeading id="publications"  title="Article" />
        <Reveal>
          <article className="border-l-2 border-accent pl-6">
            <h3 className="max-w-3xl text-lg font-medium leading-snug tracking-tight text-fg">
              {publication.title}
            </h3>
            <p className="mt-2 text-[14px] text-fg-muted">{publication.authorsNote}</p>
            <p className="mt-1 font-mono text-[12px] text-fg-faint">
              {publication.venue} · {publication.year}
            </p>
            <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-fg-muted">
              {publication.note}
            </p>
            <div className="mt-4">
              <ExternalLink href={publication.href}>Read the article</ExternalLink>
            </div>
          </article>
        </Reveal>
      </section>

      <section className="mt-20" aria-labelledby="training">
        <SectionHeading
          id="training"
                    title="Autonomy & machine learning"
        />
        <Reveal>
          <article className="rounded-sm border border-line bg-surface p-7 sm:p-10">
            <h3 className="text-lg font-medium tracking-tight text-fg">
              {roar.title}
            </h3>
            <p className="mt-1 font-mono text-[11px] text-fg-faint">{roar.period}</p>
            <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-fg-muted">
              {roar.detail}
            </p>
            <p className="mt-3 max-w-3xl text-[14px] leading-relaxed text-fg-muted">
              {roar.related}
            </p>
            <div className="mt-4 flex gap-5">
              {roar.links.map((link) => (
                <ExternalLink key={link.href} href={link.href}>
                  {link.label}
                </ExternalLink>
              ))}
            </div>
          </article>
        </Reveal>
      </section>
    </div>
  );
}
