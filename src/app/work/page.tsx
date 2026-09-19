import type { Metadata } from "next";
import { Page, Section } from "@/components/site/Page";
import { TextLink } from "@/components/ui/TextLink";
import { additionalCaseStudies, caseStudies, rainier, type CaseStudy } from "@/content/work";
import { selected } from "@/content/selected";

export const metadata: Metadata = {
  title: "Work",
  description: "Every build with its case notes: what the problem was, what got built, what it runs on, and how it went.",
};

function Notes({ c }: { c: CaseStudy }) {
  return (
    <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-[max-content_1fr]">
      <dt className="text-base font-semibold text-ink-mute">Problem</dt>
      <dd className="text-base leading-relaxed">{c.problem}</dd>
      <dt className="text-base font-semibold text-ink-mute">Built</dt>
      <dd className="text-base leading-relaxed">{c.built}</dd>
      <dt className="text-base font-semibold text-ink-mute">Runs on</dt>
      <dd className="text-base leading-relaxed">{c.stack.join(", ")}</dd>
      <dt className="text-base font-semibold text-ink-mute">Outcome</dt>
      <dd className="text-base leading-relaxed">{c.outcome}</dd>
      <dt className="text-base font-semibold text-ink-mute">Where</dt>
      <dd className="text-base leading-relaxed">
        <TextLink href={c.event.href}>{c.event.label}</TextLink>
        <span className="text-ink-mute">, {c.event.detail}</span>
      </dd>
    </dl>
  );
}

function Study({ c }: { c: CaseStudy }) {
  return (
    <Section id={c.slug} title={c.title}>
      <p className="text-lg text-ink">{c.oneLiner}</p>
      <div className="mt-5">
        <Notes c={c} />
      </div>
      <p className="mt-5 flex flex-wrap gap-x-5 gap-y-1">
        {c.links.map((l) => (
          <TextLink key={l.href} href={l.href}>
            {l.label}
          </TextLink>
        ))}
      </p>
    </Section>
  );
}

const products = selected.filter((s) => s.slug !== "rainier");

export default function WorkPage() {
  return (
    <Page title="Work" lead="Everything I have shipped or am shipping, with the notes I would want if I were reading about it cold.">
      {products.map((p) => (
        <Section key={p.slug} id={p.slug} title={p.title}>
          <p className="text-lg text-ink">{p.what}</p>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">{p.detail}</p>
          <p className="mt-3 text-base text-ink-soft">{p.standing}</p>
          {p.links && (
            <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
              {p.links.map((l) => (
                <TextLink key={l.href} href={l.href}>
                  {l.label}
                </TextLink>
              ))}
            </p>
          )}
        </Section>
      ))}

      <Section id={rainier.id} title="Robots at Rainier Labs">
        <p className="text-lg text-ink">{rainier.status}</p>
        <p className="mt-1 text-base text-ink-mute">{rainier.context}</p>
        <p className="mt-4 text-base leading-relaxed text-ink-soft">{rainier.body}</p>
      </Section>

      {[...caseStudies, ...additionalCaseStudies].map((c) => (
        <Study key={c.slug} c={c} />
      ))}
    </Page>
  );
}
