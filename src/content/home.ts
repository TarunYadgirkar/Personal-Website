/** Copy for the front page sections that are not lists. */

export const hero = {
  headline: "I build intelligent systems where hardware meets AI.",
  lead: "I work on machine learning that runs on FPGAs, a hybrid mobility device with a provisional patent, and AR glasses with their own operating system. I study applied mathematics at UC Berkeley and spend the rest of the week building.",
} as const;

export const researchTeaser = {
  title: "Machine learning at line rate",
  body: "At Santa Clara University’s Wireless Intelligent Networks Lab I take models trained in PyTorch and TensorFlow, quantize them to fixed point, and port them to FPGAs, where the clock and the number of DSP slices set the throughput and the latency. The same fabric runs the wireless side: channel estimation and signal processing on samples as they arrive from the radio.",
  caption: "The sample leaves the model as a 32-bit float and enters the fabric as a fixed-point word; the wave across the tiles is the pipeline advancing one stage per clock.",
  link: { label: "Research notes, the ROAR Academy, and the BALANCE article", href: "/research" },
} as const;

export const buildsIntro = {
  title: "Weekend builds",
  lead: "Hackathon prototypes, each shipped in a day or two and left running. Most are voice-first applied AI, because a weekend is long enough to find out whether people will talk to a thing.",
} as const;
