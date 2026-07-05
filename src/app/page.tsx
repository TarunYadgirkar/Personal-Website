import Link from "next/link";
import { HeroReveal, Pressable, Reveal } from "@/components/motion";
import { HeroVisual } from "@/components/hero-visual";
import { Eyebrow, SectionHeading, StatusTag, Tags } from "@/components/ui";
import { focusAreas, proofPoints, recognition, site } from "@/content/site";
import { featured } from "@/content/work";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <section className="pt-24 sm:pt-32">
        <HeroReveal>
          <Eyebrow>{site.subline}</Eyebrow>
        </HeroReveal>
        <HeroReveal delay={0.06}>
          <h1 className="mt-5 max-w-[20rem] break-words text-[1.9rem] font-medium leading-[1.08] tracking-tight sm:max-w-3xl sm:text-6xl sm:leading-[1.05]">
            {site.name} builds {site.positioning}.
          </h1>
        </HeroReveal>
        <HeroReveal delay={0.12}>
          <p className="mt-5 max-w-[20rem] break-words font-mono text-sm leading-relaxed text-fg-muted sm:max-w-full">
            {site.credentialLine}
          </p>
        </HeroReveal>
        <HeroReveal delay={0.18}>
          <p className="mt-6 max-w-[20rem] text-base leading-relaxed text-fg-muted sm:max-w-2xl">
            {site.bioShort}
          </p>
        </HeroReveal>
        <HeroReveal delay={0.24}>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Pressable>
              <Link
                href="/work"
                className="inline-flex h-10 items-center rounded-sm bg-accent px-5 text-sm font-medium text-bg transition-colors duration-150 hover:bg-accent-bright"
              >
                View work
              </Link>
            </Pressable>
            <Pressable>
              <Link
                href="/research"
                className="inline-flex h-10 items-center rounded-sm border border-line-strong px-5 text-sm text-fg transition-colors duration-150 hover:border-accent hover:text-accent"
              >
                Research
              </Link>
            </Pressable>
            {site.resumeUrl && (
              <Pressable>
                <a
                  href={site.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center rounded-sm border border-line-strong px-5 text-sm text-fg transition-colors duration-150 hover:border-accent hover:text-accent"
                >
                  Resume
                </a>
              </Pressable>
            )}
            <Pressable>
              <a
                href={`mailto:${site.email}`}
                className="inline-flex h-10 items-center rounded-sm border border-line-strong px-5 text-sm text-fg transition-colors duration-150 hover:border-accent hover:text-accent"
              >
                Contact
              </a>
            </Pressable>
          </div>
        </HeroReveal>
        <HeroReveal delay={0.3}>
          <ul className="mt-12 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-3">
            {proofPoints.map((point) => (
              <li key={point.label} className="bg-surface p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-faint">
                  {point.label}
                </p>
                <p className="mt-3 text-[15px] font-medium text-fg">{point.value}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-fg-muted">
                  {point.detail}
                </p>
              </li>
            ))}
          </ul>
        </HeroReveal>
        <div className="mt-16 border-b border-line pb-px">
          <HeroVisual />
        </div>
      </section>

      <section className="pt-24" aria-labelledby="featured-work">
        <SectionHeading id="featured-work" eyebrow="Selected" title="Featured work" />
        <div className="border-t border-line">
          {featured.map((item, i) => (
            <Reveal key={item.slug} delay={Math.min(i * 0.04, 0.16)}>
              <Link
                href={item.href}
                className="group grid gap-4 border-b border-line py-8 transition-colors duration-150 sm:grid-cols-[200px_1fr] sm:gap-10"
              >
                <div className="flex flex-col items-start gap-2">
                  <StatusTag>{item.status}</StatusTag>
                  <p className="font-mono text-[11px] leading-relaxed text-fg-faint">
                    {item.context}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-medium tracking-tight text-fg transition-colors duration-150 group-hover:text-accent">
                    {item.title}
                    <span
                      aria-hidden="true"
                      className="ml-2 inline-block text-fg-faint transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-accent"
                    >
                      →
                    </span>
                  </h3>
                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg-muted">
                    {item.summary}
                  </p>
                  <div className="mt-4">
                    <Tags items={item.tags} />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pt-24" aria-labelledby="focus-areas">
        <SectionHeading id="focus-areas" eyebrow="Focus" title="Technical focus areas" />
        <ul className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
          {focusAreas.map((area) => (
            <li key={area.title} className="group relative overflow-hidden bg-surface p-5">
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
              />
              <p className="font-mono text-[12px] text-accent">{area.title}</p>
              <p className="mt-2 text-[13px] leading-relaxed text-fg-muted">
                {area.detail}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="pt-24" aria-labelledby="recognition">
        <SectionHeading id="recognition" eyebrow="Selected" title="Recognition" />
        <ul className="border-t border-line">
          {recognition.map((item) => (
            <li
              key={item.line}
              className="flex flex-col gap-1 border-b border-line py-4 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <p className="text-[15px] text-fg">{item.line}</p>
              <p className="font-mono text-xs text-fg-faint">{item.context}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="py-28" aria-labelledby="contact">
        <SectionHeading id="contact" eyebrow="Contact" title="Collaborate" />
        <p className="max-w-xl text-[15px] leading-relaxed text-fg-muted">
          Open to research collaborations, internships, and technical projects.
        </p>
        <div className="mt-6 flex flex-col items-start gap-2">
          {site.emails.map((email) => (
            <a
              key={email.address}
              href={`mailto:${email.address}`}
              className="text-xl font-medium tracking-tight text-fg underline-offset-8 transition-colors duration-150 hover:text-accent hover:underline sm:text-3xl"
            >
              {email.address}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
