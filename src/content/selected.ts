import type { Link } from "./work";

export type DrawingKind = "balance" | "fpga" | "glasses" | "head" | "gate" | "tree";

export interface Selected {
  slug: string;
  title: string;
  /** What it is, in one plain sentence. */
  what: string;
  /** The part that took real work, and what came of it. */
  detail: string;
  /** Where it stands: a fact, not a status chip. */
  standing: string;
  period: string;
  drawing: DrawingKind;
  href: string;
  links?: readonly Link[];
}

/* Ordered by how much of the identity each one carries. */
export const selected: readonly Selected[] = [
  {
    slug: "fpga-ml",
    title: "Machine learning on FPGAs",
    what: "Research at Santa Clara University's Wireless Intelligent Networks Lab on running ML and wireless signal-processing algorithms on FPGAs, where throughput and latency are fixed by the hardware rather than by the framework.",
    detail:
      "The work runs from PyTorch and TensorFlow models through quantization to fixed-point implementations on the fabric, then the same treatment for channel estimation and signal processing so the two share a pipeline.",
    standing: "Research assistant since July 2025, ongoing.",
    period: "2025 to now",
    drawing: "fpga",
    href: "/research",
  },
  {
    slug: "balance",
    title: "BALANCE",
    what: "A hybrid mobility device that rolls on wheels over flat ground and switches to robotic-leg assistance on stairs and rough terrain, so one device covers the whole range from a little support to full assistance.",
    detail:
      "Co-developed with a student team. A hip-centric collapsible frame carries the leg and wheel units; LiDAR, sonar and cameras feed an on-board computer that maps the ground ahead and picks the mode.",
    standing: "Provisional patent 63/743,085. Design article in the Youth Innovation Journal, fall 2025.",
    period: "2023 to 2025",
    drawing: "balance",
    href: "/patent",
  },
  {
    slug: "vantage",
    title: "Vantage",
    what: "AR glasses and the spatial operating system inside them, co-founded at UC Berkeley. Windows dock to the walls around you and stay where you left them.",
    detail:
      "The prototype runs as a full Linux-based OS taking camera streams over the network, with optical hand-gesture recognition, LiDAR-based SLAM for the room model, and an on-glasses keyboard you can type on. Hardware is in design.",
    standing: "Pre-seed, Berkeley. Working software prototype; glasses and case in development.",
    period: "2026 to now",
    drawing: "glasses",
    href: "https://vantage-site-bice.vercel.app",
    links: [{ label: "vantage site", href: "https://vantage-site-bice.vercel.app" }],
  },
  {
    slug: "rainier",
    title: "Robotic head at Rainier Labs",
    what: "Hardware and embedded-systems internship at a robotics startup in Sunnyvale, on a robot head that shows facial expressions on screens.",
    detail:
      "Selected and integrated the displays, redesigned the CAD so the electronics fit the head, and sourced the microphone and speaker path against both hardware and software constraints.",
    standing: "Summer 2025 internship.",
    period: "Summer 2025",
    drawing: "head",
    href: "/work#rainier",
  },
  {
    slug: "popper",
    title: "Popper",
    what: "An adversarial pull-request gate. Instead of asking whether a diff looks right, it extracts the claim the PR makes and writes tests designed to break it.",
    detail:
      "Each test runs against the code before and after the change in an isolated Daytona sandbox, so a pass only counts when the same test failed before. The gate then compares that evidence with CodeRabbit's static review and surfaces where the two disagree.",
    standing: "Built at Daytona HackSprint, July 2026. Live demo runs the full six-stage gate in about thirteen seconds.",
    period: "July 2026",
    drawing: "gate",
    href: "https://daytona-hacksprint.vercel.app",
    links: [
      { label: "live demo", href: "https://daytona-hacksprint.vercel.app" },
      { label: "github", href: "https://github.com/TarunYadgirkar/Daytona-Hacksprint" },
    ],
  },
  {
    slug: "bonsai",
    title: "Bonsai",
    what: "Turns an AI chat from a growing scroll into a tree: branch a side question with a compiled brief instead of the whole history, route it to the right model, and merge one distilled sentence back.",
    detail:
      "A dependency-free TypeScript engine (bonsai-engine on npm) behind three surfaces: a claude.ai MCP connector that renders the tree inline, a Claude Code plugin, and a web app. A referent-resolution benchmark runs in CI so the compiled-brief claim is tested, not asserted.",
    standing: "Open source, MIT. Published on npm.",
    period: "August 2026",
    drawing: "tree",
    href: "https://github.com/TarunYadgirkar/Bonsai",
    links: [
      { label: "github", href: "https://github.com/TarunYadgirkar/Bonsai" },
      { label: "live demo", href: "https://bonsai-connector.vercel.app" },
    ],
  },
];

export interface Build {
  title: string;
  what: string;
  event: string;
  when: string;
  result: string;
  live?: string;
  repo?: string;
}

/* Hackathon builds, newest first. Result column states only what is known. */
export const builds: readonly Build[] = [
  {
    title: "Popper",
    what: "Adversarial PR verification gate",
    event: "Daytona HackSprint",
    when: "Jul 2026",
    result: "Sponsor-track build",
    live: "https://daytona-hacksprint.vercel.app",
    repo: "https://github.com/TarunYadgirkar/Daytona-Hacksprint",
  },
  {
    title: "CarePath",
    what: "Voice-first patient navigation",
    event: "Autonomous Healthcare Hackathon",
    when: "Jun 2026",
    result: "5th place",
    live: "https://carepath-five.vercel.app",
    repo: "https://github.com/TarunYadgirkar/carepath",
  },
  {
    title: "Intent",
    what: "App Intents code generator for Siri",
    event: "Bitrig Hacks, Y Combinator",
    when: "Jun 2026",
    result: "Shipped",
    repo: "https://github.com/TarunYadgirkar/bitrig-yc-hackathon",
  },
  {
    title: "VoiceVision",
    what: "Voice-controlled screen accessibility",
    event: "AI Collective Tri-Valley",
    when: "Jun 2026",
    result: "2nd place",
    live: "https://voicevision-eight.vercel.app",
    repo: "https://github.com/TarunYadgirkar/voicevision",
  },
  {
    title: "Klarity VoiceNote",
    what: "Voice intake for mental-health notes",
    event: "Build Smth AI-Native, UC Berkeley",
    when: "May 2026",
    result: "1st, Klarity Health track",
    live: "https://klarity-voicenote.vercel.app",
    repo: "https://github.com/TarunYadgirkar/klarity-voicenote-Hackathon",
  },
  {
    title: "GuestFlow",
    what: "Agentic arrival orchestration for hotels",
    event: "Hospitality 2030, Rosewood Sand Hill",
    when: "May 2026",
    result: "Shipped",
    live: "https://guestflow-henna.vercel.app",
    repo: "https://github.com/TarunYadgirkar/guestflow",
  },
  {
    title: "GuardianAlert",
    what: "Escalation state machine for elder care",
    event: "AgeTech SF",
    when: "May 2026",
    result: "Shipped",
    live: "https://age-tech-hackathon-1.vercel.app",
    repo: "https://github.com/TarunYadgirkar/AgeTech-Hackathon-1",
  },
];
