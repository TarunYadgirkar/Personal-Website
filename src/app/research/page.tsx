import type { Metadata } from "next";
import { Page, Section } from "@/components/site/Page";
import { TextLink } from "@/components/ui/TextLink";
import { publication, roar, winLab } from "@/content/research";

export const metadata: Metadata = {
  title: "Research",
  description: "FPGA acceleration for machine learning and wireless signal processing at Santa Clara University's Wireless Intelligent Networks Lab, the ROAR Academy, and the BALANCE article.",
};

export default function ResearchPage() {
  return (
    <Page
      title="Research"
      lead="Most of my research is about what an algorithm can do once the hardware sets the budget: how much of a model survives quantization, and how fast a channel estimate can come out of an FPGA."
    >
      <Section id="win-lab" title={winLab.org}>
        <p className="text-lg text-ink">{winLab.role}</p>
        <p className="mt-1 text-base text-ink-mute">
          {winLab.period}, {winLab.location}
        </p>
        <ul className="mt-5 flex flex-col gap-3 text-base leading-relaxed text-ink-soft">
          {winLab.bullets.map((b) => (
            <li key={b} className="flex gap-3">
              <span className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-rust" aria-hidden="true" />
              {b}
            </li>
          ))}
        </ul>
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
          <TextLink href={roar.links[0].href}>{roar.links[0].label}</TextLink>
        </p>
      </Section>
    </Page>
  );
}
