export const winLab = {
  role: "Research assistant",
  org: "Santa Clara University, Wireless Intelligent Networks (WIN) Lab",
  period: "July 2025 to present",
  location: "Santa Clara, California",
  bullets: [
    "I investigate FPGA-based acceleration for machine-learning algorithms in high-throughput, low-latency workloads.",
    "I train and quantize models in PyTorch and TensorFlow, then port them to fixed-point FPGA implementations.",
    "I prototype and optimize FPGA implementations of wireless-communication algorithms, including signal processing and channel estimation.",
  ],
  tags: ["FPGA", "Embedded ML", "PyTorch", "TensorFlow", "Signal Processing", "Channel Estimation"],
} as const;

export const publication = {
  title:
    "BALANCE: A Nonbinary Approach to Biomechanical Assistive Legs for Diverse Mobility Needs",
  authorsNote: "I co-authored it with a student team as one of ten authors",
  venue: "Youth Innovation Journal",
  year: "fall 2025, published 29 October 2025",
  note: "The article describes the BALANCE design and is separate from the provisional patent filing, No. 63/743,085.",
  href: "https://www.youthinnovationjournal.org/researchlib/papers/balance",
} as const;

export const roar = {
  title: "UC Berkeley College of Engineering, ROAR Academy",
  period: "Summer 2025",
  detail:
    "I trained in machine-learning systems, programmed them, and applied them to autonomous robotics, on a full scholarship.",
  related:
    "A related ROAR SimRace submission provides a working solution for the Robot Open Autonomous Racing simulation series (Python).",
  links: [
    {
      label: "ROAR SimRace on GitHub",
      href: "https://github.com/TarunYadgirkar/ROAR_SimRace_Submission",
    },
  ],
} as const;
