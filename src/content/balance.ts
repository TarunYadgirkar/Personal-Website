export const balance = {
  name: "BALANCE",
  expansion: "Biomechanical Assistive Legs with Advanced Navigation and Control Engineering",
  status: "Provisional patent filed (No. 63/743,085) · Related article, Youth Innovation Journal",
  problem:
    "Mobility isn't binary, but most assistive devices such as wheelchairs, walkers, and canes solve one narrow stage of mobility loss and don't adapt across terrain, and some accelerate muscle atrophy. Meanwhile the aging population and the gap between lifespan and health-span are both growing.",
  concept:
    "BALANCE is a hybrid robotic mobility device positioned between simple aids and complex exoskeletons, supporting users across the full continuum of mobility with partial-to-full assistance.",
  systems: [
    {
      name: "Assistive Leg Framework",
      detail:
        "A dual wheeled-and-leg mobility frame that provides structural support and isolates shocks, using wheeled movement on flat ground and robotic-leg assistance on stairs and uneven or narrow terrain.",
    },
    {
      name: "Adaptive Control & Navigation Suite",
      detail:
        "LiDAR, sonar, 360° cameras, and on-board computing for real-time mapping and navigation.",
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
      kick: "Input · sensing",
      nodes: [
        { title: "LiDAR", sub: ["depth · ranging"] },
        { title: "Sonar", sub: ["near-field"] },
        { title: "360° cameras", sub: ["visual field"] },
      ],
    },
    {
      kick: "Perception · compute",
      nodes: [
        {
          title: "On-board compute",
          sub: ["Real-time mapping", "Terrain classification", "Gait & path planning"],
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
      kick: "Output · locomotion",
      nodes: [
        { title: "Wheeled base", sub: ["flat ground"] },
        { title: "Robotic-leg assist", sub: ["stairs · uneven terrain"] },
      ],
    },
  ],
  statusDetail:
    "The system was filed as provisional patent No. 63/743,085. A related article describing the BALANCE design was published in the Youth Innovation Journal (Fall 2025). Co-developed with a student team.",
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
