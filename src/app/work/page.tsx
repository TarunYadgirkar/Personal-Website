import type { Metadata } from "next";
import { Reveal } from "@/components/motion";
import { Eyebrow, ExternalLink, SectionHeading, StatusTag, Tags } from "@/components/ui";
import { caseStudies, rainier } from "@/content/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies — applied AI, voice agents, and robotics product builds.",
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

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-28 pt-20">
      <Eyebrow>Work</Eyebrow>
      <h1 className="mt-4 max-w-2xl text-3xl font-medium tracking-tight sm:text-5xl">
        Case studies
      </h1>
      <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-fg-muted">
        Applied-AI and voice-agent products, most built and shipped in 24–48
        hours at hackathons. Research and robotics work lives on the{" "}
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
            <article
              id={cs.slug}
              className="rounded-sm border border-line bg-surface p-7 sm:p-10"
            >
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-medium tracking-tight text-fg">
                  {cs.title}
                </h2>
                <StatusTag>{cs.status}</StatusTag>
              </div>
              <p className="mt-2 text-[15px] text-fg-muted">{cs.oneLiner}</p>
              <p className="mt-1 font-mono text-[11px] text-fg-faint">{cs.context}</p>

              <div className="mt-8 flex flex-col gap-6 border-t border-line pt-8">
                <Field label="Problem">{cs.problem}</Field>
                <Field label="What I built">{cs.built}</Field>
                <Field label="Stack">
                  <Tags items={cs.stack} />
                </Field>
                <Field label="Outcome">{cs.outcome}</Field>
                {cs.links.length > 0 && (
                  <Field label="Links">
                    <div className="flex flex-wrap gap-5">
                      {cs.links.map((link) => (
                        <ExternalLink key={link.href} href={link.href}>
                          {link.label}
                        </ExternalLink>
                      ))}
                    </div>
                  </Field>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>

      <section className="mt-24" aria-labelledby="rainier">
        <SectionHeading
          id="rainier"
          eyebrow="Industry"
          title="Robotics hardware & embedded systems"
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
