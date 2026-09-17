import { TextLink } from "@/components/ui/TextLink";
import { now } from "@/content/site";

export function Now() {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-14 sm:px-8 md:pt-20">
      <dl className="grid gap-x-10 gap-y-4 md:grid-cols-[max-content_1fr]">
        {now.map((row) => (
          <div key={row.key} className="contents">
            <dt className="text-base font-semibold text-ink-mute md:pt-0.5">{row.key}</dt>
            <dd className="max-w-2xl text-lg text-ink">
              {row.href ? <TextLink href={row.href} className="font-normal decoration-line">{row.value}</TextLink> : row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
