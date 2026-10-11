import { site } from "./site";
import type { Link } from "./work";

/** The thumbnail: a drawn 3D model. */
export type DrawingKind = "board" | "balance" | "glasses" | "dog";

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

/* Vantage leads, then the research, BALANCE and Rainier. Hackathon builds live in work.ts. */
export const selected: readonly Selected[] = [
  {
    slug: "vantage",
    title: "Vantage",
    what: "Vantage is a pair of AR glasses and the spatial operating system inside them, which I co-founded with Boris Nezlobin at UC Berkeley. Windows dock to the walls around you and stay where you left them.",
    detail:
      "The prototype runs as a full Linux-based OS taking camera streams over the network, with optical hand-gesture recognition, LiDAR-based SLAM for the room model, and an on-glasses keyboard you can type on. Hardware is in design.",
    standing: "Vantage is pre-seed in Berkeley, with a working software prototype and the glasses and case in development.",
    period: "2026 to now",
    drawing: "glasses",
    href: site.links.vantage,
    links: [{ label: "vantage site", href: site.links.vantage }],
  },
  {
    slug: "fpga-ml",
    title: "Machine learning FPGA research",
    what: "At Santa Clara University's Wireless Intelligent Networks Lab I research how to run ML and wireless signal-processing algorithms on FPGAs, where throughput and latency are fixed by the hardware rather than by the framework.",
    detail:
      "The work runs from PyTorch and TensorFlow models through quantization to fixed-point implementations on the fabric, then the same treatment for channel estimation and signal processing so the two share a pipeline.",
    standing: "I have been a research assistant there since July 2025.",
    period: "2025 to now",
    drawing: "board",
    href: "/research",
    links: [{ label: "research notes", href: "/research" }],
  },
  {
    slug: "balance",
    title: "BALANCE",
    what: "BALANCE is a hybrid mobility device that rolls on wheels over flat ground and switches to robotic-leg assistance on stairs and rough terrain, so one device covers the whole range from a little support to full assistance.",
    detail:
      "We co-developed it as a student team. A hip-centric collapsible frame carries the leg and wheel units; LiDAR, sonar and cameras feed an on-board computer that maps the ground ahead and picks the mode.",
    standing: "We filed provisional patent 63/743,085 and published the design in the Youth Innovation Journal in fall 2025.",
    period: "2023 to 2025",
    drawing: "balance",
    href: "/patent",
    links: [{ label: "the BALANCE page", href: "/patent" }],
  },
  {
    slug: "rainier",
    title: "Robots at Rainier Labs",
    what: "I spent a summer at Rainier Labs, a robotics startup in Sunnyvale, helping build their robot dogs and an expressive robot head.",
    detail:
      "The work was hardware and embedded systems across both machines. On the head I selected and integrated the displays, redesigned the CAD so the electronics fit, and evaluated microphone and speaker components against both hardware and software constraints.",
    standing: "I interned there in summer 2025.",
    period: "Summer 2025",
    drawing: "dog",
    href: "/work#rainier",
  },
];
