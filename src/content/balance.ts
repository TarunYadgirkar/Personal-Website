export const balance = {
  expansion: "Biomechanical Assistive Legs with Advanced Navigation and Control Engineering",
  problem:
    "Mobility loss is not all or nothing, but most assistive devices are. A cane, a walker or a wheelchair each serves one narrow stage, none of them adapts across terrain, and some of them accelerate muscle atrophy by doing too much of the work.",
  concept:
    "BALANCE is a hybrid robotic mobility device positioned between simple aids and complex exoskeletons, supporting users across the full continuum of mobility with partial-to-full assistance.",
  systems: [
    {
      name: "Assistive leg framework",
      detail:
        "The frame carries both wheels and legs, provides structural support and isolates shocks. It rolls on flat ground and switches to robotic-leg assistance on stairs and on uneven or narrow terrain.",
    },
    {
      name: "Adaptive control and navigation suite",
      detail:
        "LiDAR, sonar, 360° cameras and an on-board computer map the surroundings and navigate in real time.",
    },
  ],
  features: [
    "Collapsible hip-centric modular frame",
    "Biometric monitoring",
    "Lithium battery management",
    "User interface for adjustable assistance levels",
  ],
  // Drives the <Schematic> on /patent.
  signalPath: [
    {
      kick: "Sensing",
      nodes: [
        { title: "LiDAR", sub: ["depth and ranging"] },
        { title: "Sonar", sub: ["near-field"] },
        { title: "360° cameras", sub: ["visual field"] },
      ],
    },
    {
      kick: "Compute",
      nodes: [
        {
          title: "On-board compute",
          sub: ["Real-time mapping", "Terrain classification", "Gait and path planning"],
          isAccent: true,
        },
      ],
    },
    {
      kick: "Control",
      nodes: [
        {
          title: "Mode arbitration",
          sub: ["Structural support", "Shock isolation"],
        },
      ],
    },
    {
      kick: "Locomotion",
      nodes: [
        { title: "Wheeled base", sub: ["flat ground"] },
        { title: "Robotic-leg assist", sub: ["stairs and uneven terrain"] },
      ],
    },
  ],
  statusDetail:
    "We co-developed BALANCE as a student team and filed it as provisional patent No. 63/743,085. A related article describing the design was published in the Youth Innovation Journal in fall 2025.",
  links: [
    {
      label: "Article in the Youth Innovation Journal",
      href: "https://www.youthinnovationjournal.org/researchlib/papers/balance",
    },
    {
      label: "Provisional patent document",
      href: "https://drive.google.com/file/d/1i_ofeLd-kAhmBPF8lrnoHFrk3FPM-U7r/view",
    },
  ],
} as const;
