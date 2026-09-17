import type { Metadata } from "next";
import { Page, Section } from "@/components/site/Page";
import { TextLink } from "@/components/ui/TextLink";
import { balance } from "@/content/balance";
import { ThreeView } from "@/components/home/ThreeView";
import { SignalPath } from "@/components/drawings/SignalPath";

export const metadata: Metadata = {
  title: "BALANCE",
  description: "A hybrid wheeled and legged mobility device, co-developed with a student team. Provisional patent 63/743,085 and a design article in the Youth Innovation Journal.",
};

export default function PatentPage() {
  return (
    <Page title="BALANCE" lead={balance.concept}>
      <p className="-mt-6 mb-10 text-base text-ink-mute">{balance.expansion}</p>

      <ThreeView />

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
        <ul className="mt-6 flex flex-col gap-2 text-base text-ink-soft">
          {balance.features.map((f) => (
            <li key={f} className="flex gap-3">
              <span className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-rust" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="signal-path" title="From sensors to a step">
        <SignalPath />
        <p className="mt-4 text-sm text-ink-mute">
          LiDAR, sonar and cameras feed the on-board computer, which maps the ground and picks a mode; the wheeled base
          handles flat ground and the powered legs take stairs and uneven terrain.
        </p>
      </Section>

      <Section id="status" title="Where it stands">
        <p className="text-base leading-relaxed text-ink-soft">{balance.statusDetail}</p>
        <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
          {balance.links.map((l) => (
            <TextLink key={l.href} href={l.href}>
              {l.label}
            </TextLink>
          ))}
        </p>
      </Section>
    </Page>
  );
}
