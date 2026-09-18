/** Single source of truth for names, one-liners and links. */
export const site = {
  name: "Tarun Yadgirkar",
  headline: "Tarun Yadgirkar builds intelligent systems where hardware meets AI.",
  description:
    "Tarun Yadgirkar builds machine learning on FPGAs, assistive robotics, and AR glasses with their own operating system, and studies applied mathematics at UC Berkeley.",
  location: "Berkeley, California",
  email: "tarun_yadgirkar@berkeley.edu",
  url: "https://tarunyadgirkar.com",
  resumeUrl: "/resume/tarun-yadgirkar-resume.pdf",
  links: {
    github: "https://github.com/TarunYadgirkar",
    linkedin: "https://www.linkedin.com/in/tarun-yadgirkar/",
    x: "https://x.com/tarun__y",
    vantage: "https://vantage-site-bice.vercel.app",
  },
} as const;

export const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/research", label: "Research" },
  { href: "/patent", label: "BALANCE" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
] as const;

/** What is true right now. Shown as a key/value block, never as stat tiles. */
interface NowRow {
  key: string;
  value: string;
  href?: string;
}

export const now: readonly NowRow[] = [
  {
    key: "Building",
    value: "Vantage, AR glasses and the spatial operating system inside them, as co-founder",
    href: "https://vantage-site-bice.vercel.app",
  },
  {
    key: "Researching",
    value: "FPGA acceleration for machine learning and wireless signal processing at Santa Clara University's WIN Lab",
    href: "/research",
  },
  { key: "Studying", value: "Applied Mathematics at UC Berkeley" },
  { key: "Based in", value: "Berkeley, California" },
];
