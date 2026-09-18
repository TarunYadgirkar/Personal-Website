import type { Metadata } from "next";
import Image from "next/image";
import { Page } from "@/components/site/Page";
import { TextLink } from "@/components/ui/TextLink";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description: "Who Tarun Yadgirkar is and what he works on.",
};

const paragraphs = [
  "I want to change the world by a measurable amount, and I have found that the way to do that is to keep trying things I don't know how to do yet. Most of what I make sits where software meets the physical world: models that have to run on a chip with a fixed budget, machines that have to hold a person up, and glasses that have to know where the walls are.",
  "Right now that means two things. At Santa Clara University's Wireless Intelligent Networks Lab I research how far a machine-learning model can be pushed onto an FPGA before quantization and the clock budget break it, and I do the same for channel estimation on live radio samples. With Boris Nezlobin I co-founded Vantage, a pair of AR glasses and the spatial operating system inside them, where the prototype already runs as a Linux-based OS with optical gesture recognition and LiDAR room mapping while the hardware is in design.",
  "Before that I spent a summer at Rainier Labs, a robotics startup, helping build robot dogs and an expressive robot head, and with a student team I co-developed BALANCE, a hybrid wheeled and legged mobility device that we filed as a provisional patent and published in the Youth Innovation Journal.",
  "I explore widely on purpose. I build at hackathons most months, usually voice-first applied AI, and I keep the prototypes running afterward because a thing that works for strangers teaches me more than a demo. I read outside my field, I pick up tools I have no immediate use for, and I say yes to problems that scare me a little. I study applied mathematics at UC Berkeley because it is the one discipline that shows up in all of the above.",
  "If you are working on something that changes how people live with machines, I would like to hear about it.",
];

export default function AboutPage() {
  return (
    <Page title="About">
      <div className="grid gap-10 md:grid-cols-[1fr_320px] md:gap-16">
        <div className="flex max-w-2xl flex-col gap-5 text-lg leading-relaxed text-ink-soft">
          {paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <p className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-base">
            <TextLink href={site.links.github}>GitHub</TextLink>
            <TextLink href={site.links.linkedin}>LinkedIn</TextLink>
            <TextLink href={site.links.x}>X</TextLink>
            <TextLink href={site.resumeUrl}>Resume (PDF)</TextLink>
          </p>
        </div>
        <figure className="md:-mt-24">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lift">
            <Image src="/tarun.jpg" alt="Tarun Yadgirkar" fill sizes="(min-width: 768px) 320px, 100vw" className="object-cover" priority />
          </div>
        </figure>
      </div>
    </Page>
  );
}
