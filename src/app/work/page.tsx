import type { Metadata } from "next";
import { Reveal } from "@/components/motion";
import { SectionFrame } from "@/components/section-frame";
import { Spotlight } from "@/components/spotlight";
import { ExternalLink, StatusTag, Tags } from "@/components/ui";
import { additionalCaseStudies, caseStudies, rainier, type CaseStudy } from "@/content/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Industry experience and selected builds across AI systems, voice agents, and robotics.",
};

// A spec-sheet row: mono label in a fixed column, hairline rule between rows.
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 border-b border-line py-4 last:border-b-0 sm:grid-cols-[140px_1fr] sm:gap-8">
      <p className="font-mono text-[12px] text-fg-faint">{label}</p>
      <div className="text-[15px] leading-relaxed text-fg-muted">{children}</div>
    </div>
  );
}

function EventLine({ study }: { study: CaseStudy }) {
  return (
    <p className="mt-1 font-mono text-[12px] text-fg-faint">
      <ExternalLink
        href={study.event.href}
        className="text-fg-muted underline-offset-4 transition-colors duration-150 hover:text-accent hover:underline"
      >
        {study.event.label}
      </ExternalLink>{" "}
      · {study.event.detail}
    </p>
  );
}

function CaseStudyArticle({ study, isCompact = false }: { study: CaseStudy; isCompact?: boolean }) {
  return (
    <Spotlight className="rounded-sm border border-line bg-surface">
      <article id={study.slug} className={isCompact ? "p-6 sm:p-7" : "p-7 sm:p-10"}>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className={`${isCompact ? "text-xl" : "text-2xl"} font-medium tracking-tight text-fg`}>
            {study.title}
          </h2>
          <StatusTag>{study.status}</StatusTag>
        </div>
        <p className="mt-2 text-[15px] text-fg-muted">{study.oneLiner}</p>
        <EventLine study={study} />

        <div className="mt-8 flex flex-col border-t border-line pt-2">
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
    </Spotlight>
  );
}

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-28 pt-20">
      <h1 className="mt-4 max-w-2xl text-3xl font-medium tracking-tight sm:text-5xl">
        Industry work and selected builds
      </h1>
      <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-fg-muted">
        A concise view of the systems I have built in industry settings and
        fast prototype environments: robotics integration, voice agents,
        applied AI workflows, and native AI tooling.
      </p>

      <SectionFrame index="01" title="Industry experience" id="rainier">
        <Spotlight className="rounded-sm border border-line bg-surface">
          <article className="p-7 sm:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-medium tracking-tight text-fg">Rainier Labs</h2>
              <StatusTag>{rainier.status}</StatusTag>
            </div>
            <p className="mt-1 font-mono text-[12px] text-fg-faint">{rainier.context}</p>
            <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-fg-muted">
              {rainier.body}
            </p>
            <div className="mt-5">
              <Tags items={rainier.tags} />
            </div>
          </article>
        </Spotlight>
      </SectionFrame>

      <SectionFrame index="02" title="Selected prototypes" id="selected-builds">
        <div className="flex flex-col gap-16">
          {caseStudies.map((cs, i) => (
            <Reveal key={cs.slug} variant={i % 2 === 0 ? "up" : "mask"}>
              <CaseStudyArticle study={cs} />
            </Reveal>
          ))}
        </div>
      </SectionFrame>

      <SectionFrame index="03" title="Additional builds" id="additional-builds">
        <details className="group border-t border-line">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 border-b border-line py-5 text-left marker:hidden">
            <span>
              <span className="block text-[15px] font-medium text-fg">
                Show VoiceVision, GuestFlow, and GuardianAlert
              </span>
              <span className="mt-1 block text-[13px] leading-relaxed text-fg-muted">
                Voice-first accessibility, hospitality automation, and elder-care escalation tooling.
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
                <CaseStudyArticle study={cs} isCompact />
              </Reveal>
            ))}
          </div>
        </details>
      </SectionFrame>
    </div>
  );
}
