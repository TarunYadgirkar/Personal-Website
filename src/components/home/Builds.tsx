import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { builds } from "@/content/selected";

function Cell({ href, label }: { href?: string; label: string }) {
  if (!href) return null;
  return (
    <a href={href} className="inline-flex items-center gap-0.5 rounded font-semibold underline-offset-4 hover:underline" target="_blank" rel="noreferrer">
      {label}
      <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
    </a>
  );
}

export function Builds() {
  return (
    <section id="builds" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
      <h2 className="text-4xl sm:text-5xl">Weekend builds</h2>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
        Hackathon prototypes, each shipped in a day or two and left running. Most are voice-first applied AI, because a
        weekend is long enough to find out whether people will talk to a thing.
      </p>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-base">
          <thead>
            <tr className="border-b border-line-strong text-sm text-ink-mute">
              <th scope="col" className="py-2 pr-4 font-semibold">Build</th>
              <th scope="col" className="py-2 pr-4 font-semibold">What it does</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Event</th>
              <th scope="col" className="py-2 pr-4 font-semibold">When</th>
              <th scope="col" className="py-2 pr-4 font-semibold">Result</th>
              <th scope="col" className="py-2 font-semibold">Links</th>
            </tr>
          </thead>
          <tbody>
            {builds.map((b) => (
              <tr key={b.title} className="border-b border-line align-top">
                <th scope="row" className="py-3 pr-4 font-semibold">{b.title}</th>
                <td className="py-3 pr-4 text-ink-soft">{b.what}</td>
                <td className="py-3 pr-4 text-ink-soft">{b.event}</td>
                <td className="figures py-3 pr-4 text-sm text-ink-mute">{b.when}</td>
                <td className="py-3 pr-4">{b.result}</td>
                <td className="py-3">
                  <span className="flex gap-3">
                    <Cell href={b.live} label="live" />
                    <Cell href={b.repo} label="github" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
