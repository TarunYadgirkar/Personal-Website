import type { Metadata } from "next";
import { Page, Section } from "@/components/site/Page";
import { HackathonPills } from "@/components/site/HackathonPills";
import { LinkRow } from "@/components/ui/LinkRow";
import { workPage } from "@/content/pages";
import { selected } from "@/content/selected";

export const metadata: Metadata = { title: workPage.title, description: workPage.description };

export default function WorkPage() {
  return (
    <Page title={workPage.title}>
      {selected.map((p) => (
        <Section key={p.slug} id={p.slug} title={p.title}>
          <p className="text-lg text-ink">{p.what}</p>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">{p.detail}</p>
          <p className="mt-3 text-base text-ink-soft">{p.standing}</p>
          {p.links && <LinkRow links={p.links} className="mt-4" />}
        </Section>
      ))}

      <Section id="hackathons" title="Hackathon builds">
        <HackathonPills />
      </Section>
    </Page>
  );
}
