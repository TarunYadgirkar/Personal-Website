import type { Metadata } from "next";
import Image from "next/image";
import { Page } from "@/components/site/Page";
import { LinkRow } from "@/components/ui/LinkRow";
import { aboutPage } from "@/content/pages";
import { profileLinks } from "@/content/site";

export const metadata: Metadata = { title: aboutPage.title, description: aboutPage.description };

export default function AboutPage() {
  return (
    <Page title={aboutPage.title}>
      <div className="grid gap-10 md:grid-cols-[1fr_320px] md:gap-16">
        <div className="flex max-w-2xl flex-col gap-5 text-lg leading-relaxed text-ink-soft">
          {aboutPage.paragraphs.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
          <LinkRow links={profileLinks} className="mt-2 text-base" />
        </div>
        <figure className="order-first md:order-none md:-mt-24">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-lift">
            <Image src="/tarun.jpg" alt="Tarun Yadgirkar" fill sizes="(min-width: 768px) 320px, 100vw" className="object-cover" priority />
          </div>
        </figure>
      </div>
    </Page>
  );
}
