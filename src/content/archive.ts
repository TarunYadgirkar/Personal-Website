export type ArchiveItem = {
  id?: string;
  years: string;
  title: string;
  type: string;
  detail: string;
  href?: string;
};

export const archive: readonly ArchiveItem[] = [
  {
    years: "2022–2026",
    title: "VEX Robotics — Dublin Robotics",
    type: "Robotics",
    detail:
      "Co-captain / captain. Led a multidisciplinary team across CAD, build, and programming; developed autonomous and driver code. Results: VEX Worlds 2024 qualifier (top-10 Robot Skills worldwide), US Open top-5 qualification rankings (2×), division finalist (2×).",
  },
  {
    id: "waste-sorting",
    years: "2025",
    title: "AI Waste-Sorting Robot",
    type: "CV + Robotics",
    detail:
      "Computer-vision and robotics build — Raspberry Pi, camera + near-infrared sensor, 3D-printed parts, servo actuation; 94.7% sorting accuracy across compost, recycling, and trash. Recognized at the Contra Costa County Science & Engineering Fair (3rd of 67; Martinez Refinery sustainability certificate; $500 development grant).",
  },
  {
    years: "2024–2025",
    title: "NASA TechRise Challenge",
    type: "Experiment design",
    detail:
      "Co-designed an experiment proposal to measure solar spectra and study space-weather effects.",
    href: "https://drive.google.com/file/d/1hhEVC_67gEud2GW1LAja0Mh0uRe96zfv/view",
  },
  {
    years: "2023",
    title: "Inspirit AI Scholars — Distracted Drivers",
    type: "Applied AI",
    detail:
      "Built a real-time driver-inattentiveness alert system using CNNs and LSTMs on visual input.",
  },
  {
    years: "—",
    title: "AI & Robotics teaching — Vidyananda Gurukula Education Trust, Karnataka",
    type: "Teaching",
    detail:
      "Designed and delivered an AI & robotics program — kits plus virtual and in-person classes.",
    href: "https://www.facebook.com/vidyanandagurukula/",
  },
  {
    years: "—",
    title: "Troop 60 website",
    type: "Web",
    detail: "Responsive HTML/CSS/JS site for a Boy Scout troop.",
    href: "https://danvilletroop60.wordpress.com/author/troop60admin/",
  },
  {
    years: "2023–2026",
    title: "Speech & Debate",
    type: "Speaking",
    detail:
      "Varsity Impromptu captain; GGSA IE3 Novice Impromptu champion (2024).",
  },
  {
    years: "2019–present",
    title: "Eagle Scout / Assistant Senior Patrol Leader",
    type: "Scouting",
    detail: "Boy Scouts of America.",
  },
] as const;
