import type { Metadata } from "next";
import { Page, Section } from "@/components/site/Page";
import { BulletList } from "@/components/ui/BulletList";
import { TextLink } from "@/components/ui/TextLink";
import { researchPage } from "@/content/pages";
import { publication, roar, winLab } from "@/content/research";

export const metadata: Metadata = { title: researchPage.title, description: researchPage.description };

export default function ResearchPage() {
  return (
    <Page title={researchPage.title} lead={researchPage.lead}>
      <Section id="win-lab" title={winLab.org}>
        <p className="text-lg text-ink">{winLab.role}</p>
        <p className="mt-1 text-base text-ink-mute">
          {winLab.period}, {winLab.location}
        </p>
        <BulletList items={winLab.bullets} className="mt-5 gap-3 leading-relaxed" />
      </Section>

      <Section id="balance-article" title="BALANCE article">
        <p className="text-lg text-ink">{publication.title}</p>
        <p className="mt-2 text-base text-ink-soft">
          {publication.venue}, {publication.year}. {publication.authorsNote}.
        </p>
        <p className="mt-2 text-base text-ink-soft">{publication.note}</p>
        <p className="mt-4">
          <TextLink href={publication.href}>Read the article</TextLink>
        </p>
      </Section>

      <Section id="roar" title={roar.title}>
        <p className="text-base text-ink-mute">{roar.period}</p>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">{roar.detail}</p>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">{roar.related}</p>
        <p className="mt-4">
          <TextLink href={roar.link.href}>{roar.link.label}</TextLink>
        </p>
      </Section>
    </Page>
  );
}
