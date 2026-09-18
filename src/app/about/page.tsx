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
  "I work on the layer where software meets the physical world: models that have to run on a chip with a fixed budget, machines that have to hold a person up, and glasses that have to know where the walls are.",
  "At Santa Clara University's Wireless Intelligent Networks Lab I research FPGA acceleration for machine learning and wireless communication. The work takes models from PyTorch and TensorFlow, quantizes them to fixed point, and ports them to the fabric, then does the same for channel estimation and signal processing so both run on live samples at the rate the radio produces them.",
  "With Boris Nezlobin I co-founded Vantage, a pair of AR glasses and the spatial operating system inside them. The prototype already runs as a full Linux-based OS with optical gesture recognition and LiDAR-based room mapping; the hardware is in design. Before that I spent a summer at Rainier Labs, a robotics startup, integrating displays and audio into a robot head and redesigning its CAD to fit.",
  "Earlier, with a student team, I co-developed BALANCE, a hybrid wheeled and legged mobility device for people who need anything from a little support to a lot. We filed a provisional patent and published the design in the Youth Innovation Journal.",
  "I also build fast at hackathons, usually voice-first applied AI, and I keep the prototypes running afterward. I study applied mathematics at UC Berkeley, and I trained in machine learning for autonomous robotics at Berkeley's ROAR Academy on a full scholarship.",
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
