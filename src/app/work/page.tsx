import type { Metadata } from "next";
import { Reveal } from "@/components/motion";
import { Eyebrow, ExternalLink, SectionHeading, StatusTag, Tags } from "@/components/ui";
import { additionalCaseStudies, caseStudies, rainier, type CaseStudy } from "@/content/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies — AI systems, voice agents, product prototypes, and robotics systems.",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[140px_1fr] sm:gap-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-faint">
        {label}
      </p>
      <div className="text-[15px] leading-relaxed text-fg-muted">{children}</div>
    </div>
  );
}

function EventLine({ study }: { study: CaseStudy }) {
  return (
    <p className="mt-1 font-mono text-[11px] text-fg-faint">
      <a
        href={study.event.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-fg-muted underline-offset-4 transition-colors duration-150 hover:text-accent hover:underline"
      >
        {study.event.label}
        <span aria-hidden="true"> ↗</span>
      </a>{" "}
      · {study.event.detail}
    </p>
  );
}

function CaseStudyArticle({ study, compact = false }: { study: CaseStudy; compact?: boolean }) {
  return (
    <article
      id={study.slug}
      className={`rounded-sm border border-line bg-surface ${
        compact ? "p-6 sm:p-7" : "p-7 sm:p-10"
      }`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <h2 className={`${compact ? "text-xl" : "text-2xl"} font-medium tracking-tight text-fg`}>
          {study.title}
        </h2>
        <StatusTag>{study.status}</StatusTag>
      </div>
      <p className="mt-2 text-[15px] text-fg-muted">{study.oneLiner}</p>
      <EventLine study={study} />

      <div className="mt-8 flex flex-col gap-6 border-t border-line pt-8">
        <Field label="Problem">{study.problem}</Field>
        <Field label="What I built">{study.built}</Field>
        <Field label="Stack">
          <Tags items={study.stack} />
        </Field>
        <Field label="Outcome">{study.outcome}</Field>
        {study.links.length > 0 && (
          <Field label="Links">
            <div className="flex flex-wrap gap-5">
              {study.links.map((link) => (
                <ExternalLink key={link.href} href={link.href}>
                  {link.label}
                </ExternalLink>
              ))}
            </div>
          </Field>
        )}
      </div>
    </article>
  );
}

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-28 pt-20">
      <Eyebrow>Work</Eyebrow>
      <h1 className="mt-4 max-w-2xl text-3xl font-medium tracking-tight sm:text-5xl">
        Selected product prototypes
      </h1>
      <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-fg-muted">
        A focused set of shipped AI prototypes. The first three are expanded as
        case studies; additional builds are available below without letting the
        page turn into a full activity list. Research and BALANCE live on the{" "}
        <a
          href="/research"
          className="text-accent underline underline-offset-4 hover:text-accent-bright"
        >
          Research
        </a>{" "}
        and{" "}
        <a
          href="/patent"
          className="text-accent underline underline-offset-4 hover:text-accent-bright"
        >
          Patent
        </a>{" "}
        pages.
      </p>

      <div className="mt-16 flex flex-col gap-16">
        {caseStudies.map((cs) => (
          <Reveal key={cs.slug}>
            <CaseStudyArticle study={cs} />
          </Reveal>
        ))}
      </div>

      <section className="mt-24" aria-labelledby="additional-builds">
        <SectionHeading
          id="additional-builds"
          eyebrow="More"
          title="Additional builds"
        />
        <details className="group border-t border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 border-b border-line py-5 text-left marker:hidden">
            <span>
              <span className="block text-[15px] font-medium text-fg">
                Show VoiceVision, GuestFlow, and GuardianAlert
              </span>
              <span className="mt-1 block text-[13px] leading-relaxed text-fg-muted">
                Smaller project records kept here so the main page stays focused.
              </span>
            </span>
            <span
              aria-hidden="true"
              className="font-mono text-sm text-accent transition-transform duration-150 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <div className="mt-8 flex flex-col gap-8">
            {additionalCaseStudies.map((cs) => (
              <Reveal key={cs.slug}>
                <CaseStudyArticle study={cs} compact />
              </Reveal>
            ))}
          </div>
        </details>
      </section>

      <section className="mt-24" aria-labelledby="rainier">
        <SectionHeading
          id="rainier"
          eyebrow="Industry"
          title="Industry experience"
        />
        <article className="rounded-sm border border-line bg-surface p-7 sm:p-10">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-medium tracking-tight text-fg">
              Rainier Labs
            </h3>
            <StatusTag>{rainier.status}</StatusTag>
          </div>
          <p className="mt-1 font-mono text-[11px] text-fg-faint">{rainier.context}</p>
          <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-fg-muted">
            {rainier.body}
          </p>
          <div className="mt-5">
            <Tags items={rainier.tags} />
          </div>
        </article>
      </section>
    </div>
  );
}
