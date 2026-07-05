export const balance = {
  name: "BALANCE",
  expansion: "Biomechanical Assistive Legs with Advanced Navigation and Control Engineering",
  status: "Provisional patent filed (No. 63/743,085) · Related article, Youth Innovation Journal",
  problem:
    "Mobility isn't binary. Most assistive devices — wheelchairs, walkers, canes — solve one narrow stage of mobility loss, can accelerate muscle atrophy, and don't adapt across terrain. Meanwhile the aging population and the gap between lifespan and health-span are both growing.",
  concept:
    "BALANCE is a hybrid robotic mobility device positioned between simple aids and complex exoskeletons, supporting users across the full continuum of mobility with partial-to-full assistance.",
  systems: [
    {
      name: "Assistive Leg Framework",
      detail:
        "A dual wheeled-and-leg mobility frame that provides structural support and isolates shocks — wheeled movement on flat ground, robotic-leg assistance on stairs and uneven or narrow terrain.",
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
  statusDetail:
    "The system was filed as provisional patent No. 63/743,085. A related article describing the BALANCE design was published in the Youth Innovation Journal (Fall 2025). Co-developed with a student team.",
  links: [
    {
      label: "Article — Youth Innovation Journal",
      href: "https://www.youthinnovationjournal.org/researchlib/papers/balance",
    },
    {
      label: "Provisional patent document",
      href: "https://drive.google.com/file/d/1i_ofeLd-kAhmBPF8lrnoHFrk3FPM-U7r/view",
    },
  ],
} as const;
