import type { Metadata } from "next";
import { Page, Section } from "@/components/site/Page";
import { LinkRow } from "@/components/ui/LinkRow";
import { TextLink } from "@/components/ui/TextLink";
import { workPage } from "@/content/pages";
import { selected, type Selected } from "@/content/selected";
import { caseStudies, rainier, type CaseStudy } from "@/content/work";

export const metadata: Metadata = { title: workPage.title, description: workPage.description };

/** The selected projects other than Rainier, which has its own entry below. */
const products = selected.filter((s) => s.slug !== rainier.id);

function Product({ p }: { p: Selected }) {
  return (
    <Section id={p.slug} title={p.title}>
      <p className="text-lg text-ink">{p.what}</p>
      <p className="mt-4 text-base leading-relaxed text-ink-soft">{p.detail}</p>
      <p className="mt-3 text-base text-ink-soft">{p.standing}</p>
      {p.links && <LinkRow links={p.links} className="mt-4" />}
    </Section>
  );
}

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
      <LinkRow links={c.links} className="mt-5" />
    </Section>
  );
}

export default function WorkPage() {
  return (
    <Page title={workPage.title} lead={workPage.lead}>
      {products.map((p) => (
        <Product key={p.slug} p={p} />
      ))}

      <Section id={rainier.id} title={rainier.title}>
        <p className="text-lg text-ink">{rainier.status}</p>
        <p className="mt-1 text-base text-ink-mute">{rainier.context}</p>
        <p className="mt-4 text-base leading-relaxed text-ink-soft">{rainier.body}</p>
      </Section>

      {caseStudies.map((c) => (
        <Study key={c.slug} c={c} />
      ))}
    </Page>
  );
}
