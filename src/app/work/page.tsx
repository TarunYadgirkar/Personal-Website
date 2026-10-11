import type { Metadata } from "next";
import { Page, Section } from "@/components/site/Page";
import { HackathonPills } from "@/components/site/HackathonPills";
import { TextLink } from "@/components/ui/TextLink";
import { selected } from "@/content/selected";

export const metadata: Metadata = {
  title: "Work",
  description: "Vantage, machine learning FPGA research, BALANCE, Rainier Labs, and hackathon builds.",
};

export default function WorkPage() {
  return (
    <Page title="Work">
      {selected.map((p) => (
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

      <Section id="hackathons" title="Hackathon builds">
        <HackathonPills />
      </Section>
    </Page>
  );
}
