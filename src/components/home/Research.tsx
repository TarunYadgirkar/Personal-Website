import { FpgaPipeline } from "@/components/drawings/FpgaPipeline";
import { TextLink } from "@/components/ui/TextLink";

export function ResearchTeaser() {
  return (
    <section id="research" className="border-y border-line bg-paper-deep/50">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
        <div className="max-w-2xl">
          <h2 className="text-4xl sm:text-5xl">Machine learning at line rate</h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            At Santa Clara University&rsquo;s Wireless Intelligent Networks Lab I take models trained in PyTorch and TensorFlow, quantize them to
            fixed point, and port them to FPGAs, where the clock and the number of DSP slices set the throughput and the
            latency. The same fabric runs the wireless side: channel estimation and signal processing on samples as they
            arrive from the radio.
          </p>
        </div>
        <figure className="mt-10 rounded-2xl bg-paper-pale p-4 shadow-card sm:p-6">
          <div className="overflow-x-auto">
            <FpgaPipeline className="h-auto w-full min-w-[640px]" />
          </div>
          <figcaption className="mt-3 text-sm text-ink-mute">
            The sample leaves the model as a 32-bit float and enters the fabric as a fixed-point word; the wave across the
            tiles is the pipeline advancing one stage per clock.
          </figcaption>
        </figure>
        <p className="mt-6">
          <TextLink href="/research">Research notes, the ROAR Academy, and the BALANCE article</TextLink>
        </p>
      </div>
    </section>
  );
}
