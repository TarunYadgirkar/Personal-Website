import { FpgaPipeline } from "@/components/drawings/FpgaPipeline";
import { TextLink } from "@/components/ui/TextLink";
import { researchTeaser } from "@/content/home";

export function ResearchTeaser() {
  return (
    <section id="research" className="border-y border-line bg-paper-deep/50">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
        <div className="max-w-2xl">
          <h2 className="text-4xl sm:text-5xl">{researchTeaser.title}</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{researchTeaser.body}</p>
        </div>
        <figure className="mt-10 rounded-2xl bg-paper-pale p-4 shadow-card sm:p-6">
          <div className="overflow-x-auto">
            <FpgaPipeline className="h-auto w-full min-w-[640px]" />
          </div>
          <figcaption className="mt-3 text-sm text-ink-mute">{researchTeaser.caption}</figcaption>
        </figure>
        <p className="mt-6">
          <TextLink href={researchTeaser.link.href}>{researchTeaser.link.label}</TextLink>
        </p>
      </div>
    </section>
  );
}
