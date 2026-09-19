export type ArchiveItem = {
  /** Omitted when the dates aren't known; the row renders without a year cell. */
  years?: string;
  title: string;
  type: string;
  detail: string;
  href?: string;
};

export const archive: readonly ArchiveItem[] = [
  {
    years: "2022–2026",
    title: "VEX Robotics, Dublin Robotics",
    type: "Robotics",
    detail:
      "I was co-captain and then captain, led the team across CAD, build and programming, and wrote the autonomous and driver code. We qualified for VEX Worlds 2024 with a top-ten Robot Skills score worldwide, ranked top five in US Open qualification twice, and reached the division finals twice.",
  },
  {
    years: "2025",
    title: "AI waste-sorting robot",
    type: "Vision and robotics",
    detail:
      "I built a sorting robot on a Raspberry Pi with a camera, a near-infrared sensor, 3D-printed parts and servo actuation. It sorted compost, recycling and trash at 94.7% accuracy and placed 3rd of 67 at the Contra Costa County Science and Engineering Fair, which also brought a Martinez Refinery sustainability certificate and a $500 development grant.",
  },
  {
    years: "2024–2025",
    title: "NASA TechRise Challenge",
    type: "Experiment design",
    detail:
      "I co-designed an experiment proposal to measure solar spectra and study space-weather effects.",
    href: "https://drive.google.com/file/d/1hhEVC_67gEud2GW1LAja0Mh0uRe96zfv/view",
  },
  {
    years: "2023",
    title: "Inspirit AI Scholars, distracted drivers",
    type: "Applied AI",
    detail:
      "I built a real-time driver-inattentiveness alert system using CNNs and LSTMs on visual input.",
  },
  {
    title: "AI and robotics teaching at Vidyananda Gurukula Education Trust, Karnataka",
    type: "Teaching",
    detail:
      "I designed and delivered an AI and robotics program with kits, taught both online and in person.",
    href: "https://www.facebook.com/vidyanandagurukula/",
  },
  {
    title: "Troop 60 website",
    type: "Web",
    detail: "I built a responsive site for a Boy Scout troop in HTML, CSS and JavaScript.",
    href: "https://danvilletroop60.wordpress.com/author/troop60admin/",
  },
  {
    years: "2023–2026",
    title: "Speech and debate",
    type: "Speaking",
    detail:
      "I captained varsity impromptu and won the GGSA IE3 novice impromptu title in 2024.",
  },
  {
    years: "2025",
    title: "Eagle Scout",
    type: "Scouting",
    detail: "I earned Eagle Scout in 2025 and served as assistant senior patrol leader.",
  },
] as const;
