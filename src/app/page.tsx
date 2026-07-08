import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyEmailButton } from "@/components/copy-email-button";
import { SequentialCaptions } from "@/components/living-hero";
import { HeroReveal, Pressable, Reveal } from "@/components/motion";
import { ParticleField } from "@/components/particle-field";
import { WordShape } from "@/components/word-shape";
import type { WordShapeKind } from "@/components/word-shape";
import { SectionHeading, StatusTag, Tags } from "@/components/ui";
import { ScrollForMore } from "@/components/scroll-for-more";
import { SectionNav } from "@/components/section-nav";
import { atAGlance, focusAreas, recognition, site } from "@/content/site";
import { featured } from "@/content/work";

const focusGlyphs: Record<string, { shape: WordShapeKind; word: string }> = {
  "embedded-ml": { shape: "chip", word: "EMBEDDED ML" },
  robotics: { shape: "rover", word: "ROBOTICS" },
  "applied-ai": { shape: "graph", word: "APPLIED AI" },
  "voice-agents": { shape: "mic", word: "VOICE" },
  "assistive-robotics": { shape: "hand", word: "ASSIST" },
};

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
            <HeroReveal delay={0.06}>
              <h1 className="mt-3 max-w-[20rem] break-words text-[1.9rem] font-medium leading-[1.08] tracking-tight sm:max-w-3xl sm:text-5xl sm:leading-[1.06]">
                {site.name} builds {site.positioning}.
              </h1>
            </HeroReveal>
            <SequentialCaptions
              lines={site.subline.split(" · ")}
              className="mt-5 max-w-[20rem] space-y-0.5 break-words font-mono text-sm leading-relaxed text-fg-muted sm:max-w-full"
            />
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
            <div className="rounded-sm border border-line-strong bg-surface px-5 pb-2 pt-5">
              <p className="font-mono text-[12px] text-fg-faint">
                At a glance
              </p>
              <dl className="mt-3">
                {atAGlance.map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex items-baseline justify-between gap-4 py-3 ${
                      i < atAGlance.length - 1 ? "border-b border-line" : ""
                    }`}
                  >
                    <dt className="whitespace-nowrap font-mono text-[12px] text-fg-faint">
                      {row.label}
                    </dt>
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
        <HeroReveal delay={0.3}>
          <div className="relative mt-12 border-b border-line pb-6">
            <ParticleField className="h-16 w-full sm:h-20" />
          </div>
        </HeroReveal>
      </section>

      <section className="pt-24" aria-labelledby="featured-work">
        <SectionHeading id="featured-work" title="Featured work" />
        <Reveal>
          <div className="border-t border-line">
            {featured.map((item) => (
              <Link
                key={item.slug}
                href={item.href}
                className="group grid gap-4 border-b border-line py-8 transition-colors duration-150 sm:grid-cols-[200px_1fr] sm:gap-10"
              >
                <div className="flex flex-col items-start gap-2">
                  <StatusTag>{item.status}</StatusTag>
                  <p className="font-mono text-[12px] leading-relaxed text-fg-faint">
                    {item.context}
                  </p>
                </div>
                <div>
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
            ))}
          </div>
        </Reveal>
      </section>

      <section className="pt-24" aria-labelledby="focus-areas">
        <SectionHeading id="focus-areas" title="Technical focus areas" />
        <Reveal>
          <ul className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {focusAreas.map((area) => {
              const glyph = focusGlyphs[area.id];
              return (
                <li key={area.title} className="relative overflow-hidden bg-surface p-5">
                  <WordShape shape={glyph.shape} word={glyph.word} className="size-18" />
                  <p className="mt-3 font-mono text-[12px] text-accent">{area.title}</p>
                  <p className="mt-2 text-[13px] leading-relaxed text-fg-muted">
                    {area.detail}
                  </p>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </section>

      <section className="pt-24" aria-labelledby="recognition">
        <SectionHeading id="recognition" title="Recognition" />
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
        <SectionHeading id="contact" title="Collaborate" />
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
      </section>
    </div>
  );
}
