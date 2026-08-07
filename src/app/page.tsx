import Link from "next/link";
import { ArrowRight, Download, FileText } from "lucide-react";
import { AxisReveal } from "@/components/axis-reveal";
import { CopyEmailButton } from "@/components/copy-email-button";
import { HeroPlate } from "@/components/hero-plate";
import { HeroReveal, Pressable, Reveal, WordReveal } from "@/components/motion";
import { RowReveal } from "@/components/row-reveal";
import { Schematic } from "@/components/schematic";
import { SectionFrame } from "@/components/section-frame";
import { Spotlight } from "@/components/spotlight";
import { StatusTag, Tags, isSafeHref } from "@/components/ui";
import { ScrollForMore } from "@/components/scroll-for-more";
import { SectionNav } from "@/components/section-nav";
import { atAGlance, buildPipeline, focusAreas, recognition, site } from "@/content/site";
import { featured } from "@/content/work";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6">
      <ScrollForMore />
      <SectionNav />

      <section className="pt-24 sm:pt-32">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_320px] lg:gap-14">
          <div>
            <HeroReveal>
              <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-accent">
                {site.education}
              </p>
            </HeroReveal>
            <h1 className="mt-3 max-w-[20rem] break-words text-[1.9rem] font-medium leading-[1.08] tracking-tight sm:max-w-3xl sm:text-5xl sm:leading-[1.06]">
              <WordReveal text={`${site.name} builds ${site.positioning}.`} delay={0.06} />
            </h1>
            <HeroReveal delay={0.12}>
              <p className="mt-5 max-w-[20rem] break-words font-mono text-sm leading-relaxed text-fg-muted sm:max-w-full">
                {site.subline}
              </p>
            </HeroReveal>
            <HeroReveal delay={0.18}>
              <p className="mt-6 max-w-[20rem] text-base leading-relaxed text-fg-muted sm:max-w-xl">
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
                {isSafeHref(site.resumeUrl) && (
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
                    href="#contact"
                    className="inline-flex h-10 items-center rounded-sm border border-line-strong px-5 text-sm text-fg transition-colors duration-150 hover:border-accent hover:text-accent"
                  >
                    Contact
                  </a>
                </Pressable>
              </div>
            </HeroReveal>
          </div>

          <HeroReveal delay={0.2}>
            <div className="rounded-sm border border-line-strong bg-surface px-5 pb-5 pt-5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[12px] text-fg-faint">At a glance</p>
                <span aria-hidden="true" className="font-mono text-[11px] text-fg-faint">
                  {String(atAGlance.length).padStart(2, "0")}
                </span>
              </div>
              <dl className="mt-4 space-y-3">
                {atAGlance.map((row) => (
                  <div key={row.label} className="flex items-baseline gap-3">
                    <dt className="whitespace-nowrap font-mono text-[12px] text-fg-faint">
                      {row.label}
                    </dt>
                    {/* leader rule, as on a spec sheet — carries the eye across */}
                    <span
                      aria-hidden="true"
                      className="h-px min-w-4 flex-1 translate-y-[-2px] bg-line"
                    />
                    <dd className="text-right font-mono text-[12.5px] leading-snug text-fg">
                      {row.accent && <span className="text-accent">{row.accent}</span>}
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </HeroReveal>
        </div>

        {/* Not wrapped in HeroReveal: this element gets pinned, and a motion
            wrapper's lingering transform would fight the pin. It runs its own
            entrance internally instead. */}
        <HeroPlate className="mt-12" />
      </section>

      <SectionFrame index="01" title="Featured work" id="featured-work">
        <RowReveal>
          <div className="border-t border-line">
            {featured.map((item, i) => (
              <Spotlight key={item.slug}>
                <Link
                  data-row
                  href={item.href}
                  className="group relative grid gap-4 py-8 sm:grid-cols-[200px_1fr] sm:gap-10"
                >
                  {/* the row's closing rule, drawn as the row is reached —
                      an element rather than a border-b so it can animate */}
                  <span
                    data-row-rule
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-px w-full bg-line"
                  />
                  <div data-row-part className="flex flex-col items-start gap-2">
                    <span className="font-mono text-[12px] tabular-nums text-fg-faint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <StatusTag>{item.status}</StatusTag>
                    <p className="font-mono text-[12px] leading-relaxed text-fg-faint">
                      {item.context}
                    </p>
                  </div>
                  <div data-row-part>
                    <h3 className="text-xl font-medium tracking-tight text-fg transition-colors duration-150 group-hover:text-accent">
                      {item.title}
                      <ArrowRight
                        aria-hidden="true"
                        className="ml-2 inline size-[18px] align-[-3px] text-fg-faint transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-accent"
                      />
                    </h3>
                    <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg-muted">
                      {item.summary}
                    </p>
                    <div className="mt-4">
                      <Tags items={item.tags} />
                    </div>
                  </div>
                </Link>
              </Spotlight>
            ))}
          </div>
        </RowReveal>
      </SectionFrame>

      <SectionFrame index="02" title="Technical focus areas" id="focus-areas">
        <Reveal>
          <ul className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {focusAreas.map((area, i) => (
              <li key={area.title} className="bg-surface">
                <Spotlight className="h-full">
                  {/* Indexed and ruled rather than pictogrammed — the glyphs
                      that used to sit here were rejected as not making sense. */}
                  <div className="flex h-full flex-col p-5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] tabular-nums text-fg-faint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
                      <span aria-hidden="true" className="size-1 shrink-0 bg-accent" />
                    </div>
                    <p className="mt-5 font-mono text-[12px] text-accent">{area.title}</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-fg-muted">
                      {area.detail}
                    </p>
                  </div>
                </Spotlight>
              </li>
            ))}
          </ul>
        </Reveal>
      </SectionFrame>

      <SectionFrame index="03" title="How I build" id="how-i-build">
        <p className="mb-8 max-w-2xl text-[15px] leading-relaxed text-fg-muted">
          Less a process than a bias. The domain changes; how I approach a
          problem doesn&apos;t.
        </p>
        {/* No Reveal wrapper: the diagram now assembles itself stage by stage
            on scroll, which replaces the single clip-path wipe. */}
        <Schematic columns={buildPipeline} animate />
      </SectionFrame>

      <SectionFrame index="04" title="Recognition" id="recognition">
        <AxisReveal>
          <ul className="relative">
            {/* the axis these entries hang off — drawn downward as it's read */}
            <span
              data-axis
              aria-hidden="true"
              className="absolute bottom-3 left-[3px] top-3 w-px bg-line"
            />
            {recognition.map((item) => (
              <li key={item.line} className="relative flex gap-5 py-4 pl-6">
                <span
                  data-axis-dot
                  aria-hidden="true"
                  className="absolute left-0 top-[22px] size-1.5 rounded-full bg-accent"
                />
                <p className="flex-1 text-[15px] text-fg">{item.line}</p>
                <p className="whitespace-nowrap font-mono text-xs text-fg-faint">
                  {item.context}
                </p>
              </li>
            ))}
          </ul>
        </AxisReveal>
      </SectionFrame>

      <SectionFrame index="05" title="Résumé" id="resume">
        {/* One compact row. The previous version was a full-height card with a
            mock document drawn out of bars and rules beside it, which read as
            stray marks rather than as a résumé. */}
        <Reveal>
          <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5 rounded-sm border border-line-strong bg-surface px-5 py-4 sm:px-6">
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-fg-faint">
                <span aria-hidden="true" className="size-1.5 shrink-0 bg-accent" />
                Current · PDF
              </p>
              <p className="mt-2 text-[15px] font-medium tracking-tight text-fg">
                Experience, research, and selected technical work.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Pressable>
                <a
                  href={site.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-2 rounded-sm bg-accent px-4 text-[13px] font-medium text-bg transition-colors duration-150 hover:bg-accent-bright"
                >
                  <FileText aria-hidden="true" className="size-4" strokeWidth={1.7} />
                  Open
                </a>
              </Pressable>
              <Pressable>
                <a
                  href={site.resumeUrl}
                  download="Tarun-Yadgirkar-Resume.pdf"
                  className="inline-flex h-9 items-center gap-2 rounded-sm border border-line-strong px-4 text-[13px] text-fg transition-colors duration-150 hover:border-accent hover:text-accent"
                >
                  <Download aria-hidden="true" className="size-4" strokeWidth={1.7} />
                  Download
                </a>
              </Pressable>
            </div>
          </div>
        </Reveal>
      </SectionFrame>

      <SectionFrame index="06" title="Collaborate" id="contact" className="pb-28">
        <p className="max-w-xl text-[15px] leading-relaxed text-fg-muted">
          Open to research collaborations, internships, and technical projects.
        </p>
        <div className="mt-6 flex flex-col items-start gap-2">
          {site.emails.map((email) => (
            <div key={email.address} className="flex items-center gap-1">
              <a
                href={`mailto:${email.address}`}
                className="text-xl font-medium tracking-tight text-fg underline-offset-8 transition-colors duration-150 hover:text-accent hover:underline sm:text-3xl"
              >
                {email.address}
              </a>
              <CopyEmailButton email={email.address} />
            </div>
          ))}
        </div>
      </SectionFrame>
    </div>
  );
}
