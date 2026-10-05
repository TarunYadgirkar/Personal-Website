import type { Metadata } from "next";
import { SignalPath } from "@/components/drawings/SignalPath";
import { ThreeView } from "@/components/patent/ThreeView";
import { Page, Section } from "@/components/site/Page";
import { BulletList } from "@/components/ui/BulletList";
import { LinkRow } from "@/components/ui/LinkRow";
import { balance } from "@/content/balance";
import { patentPage } from "@/content/pages";

export const metadata: Metadata = { title: patentPage.title, description: patentPage.description };

export default function PatentPage() {
  return (
    <Page title={patentPage.title} lead={balance.concept}>
      <p className="-mt-6 mb-10 text-base text-ink-mute">The name stands for {balance.expansion}.</p>

      <ThreeView captions={patentPage.poseCaptions} />

      <Section id="problem" title="The gap it fills">
        <p className="text-base leading-relaxed text-ink-soft">{balance.problem}</p>
      </Section>

      <Section id="systems" title="Two subsystems">
        <dl className="grid gap-x-8 gap-y-5">
          {balance.systems.map((s) => (
            <div key={s.name}>
              <dt className="text-lg font-semibold">{s.name}</dt>
              <dd className="mt-1 text-base leading-relaxed text-ink-soft">{s.detail}</dd>
            </div>
          ))}
        </dl>
        <BulletList items={balance.features} className="mt-6 gap-2" />
      </Section>

      <Section id="signal-path" title="From sensors to a step">
        <div className="overflow-x-auto">
          <SignalPath />
        </div>
        <p className="mt-4 text-sm text-ink-mute">{patentPage.signalPathCaption}</p>
      </Section>

      <Section id="status" title="Where it stands">
        <p className="text-base leading-relaxed text-ink-soft">{balance.statusDetail}</p>
        <LinkRow links={balance.links} className="mt-4" />
      </Section>
    </Page>
  );
}
