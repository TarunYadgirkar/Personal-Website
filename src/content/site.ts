export const site = {
  name: "Tarun Yadgirkar",
  positioning: "AI systems, robotics, and embedded intelligence",
  subline: "Embedded ML · robotics & autonomy · applied AI",
  education: "Applied Mathematics @ UC Berkeley",
  location: "San Ramon, California",
  emails: [{ label: "Berkeley", address: "tarun_yadgirkar@berkeley.edu" }],
  url: "https://tarunyadgirkar.com",
  // Set to a PDF path/URL to enable the Resume button (kept null until the
  // updated resume is ready — the old PDF has outdated positioning).
  resumeUrl: null as string | null,
  bioShort:
    "I build AI systems, robotics platforms, and embedded intelligence — from FPGA-accelerated machine learning to assistive mobility robots. I'm studying Applied Mathematics at UC Berkeley, research embedded ML at Santa Clara University's WIN Lab, and filed a provisional patent for BALANCE, a hybrid legged-and-wheeled mobility device.",
  links: {
    github: "https://github.com/TarunYadgirkar",
    linkedin: "https://www.linkedin.com/in/tarun-yadgirkar-74a12531b/",
    x: "https://x.com/tarun__y?s=11",
  },
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/research", label: "Research" },
  { href: "/patent", label: "Patent" },
  { href: "/archive", label: "Archive" },
  { href: "/about", label: "About" },
] as const;

export const socialLinks = [
  { label: "GitHub", href: site.links.github },
  { label: "X", href: site.links.x },
  { label: "LinkedIn", href: site.links.linkedin },
] as const;

type AtAGlanceRow = { label: string; value: string; accent?: string };

export const atAGlance: readonly AtAGlanceRow[] = [
  { label: "Patent", value: "63/743,085", accent: "BALANCE · " },
  { label: "Paper", value: "Youth Innov. Journal '25" },
  { label: "Lab", value: "SCU WIN Lab" },
  { label: "Robotics", value: "VEX Worlds qualifier" },
  { label: "Based", value: "San Ramon, CA" },
];

export const focusAreas = [
  {
    id: "embedded-ml",
    title: "Embedded ML",
    detail: "PyTorch/TensorFlow models, quantized and ported to FPGAs and constrained hardware",
  },
  {
    id: "robotics",
    title: "Robotics & autonomy",
    detail: "Embedded and hardware robotics, autonomous systems",
  },
  {
    id: "applied-ai",
    title: "Applied AI systems",
    detail: "CarePath, Klarity VoiceNote, GuestFlow — shipped AI product prototypes",
  },
  {
    id: "voice-agents",
    title: "Voice agents",
    detail: "Grok Voice, Retell AI, ElevenLabs across four shipped prototypes",
  },
  {
    id: "assistive-robotics",
    title: "Human-assistive robotics",
    detail: "Mobility and accessibility systems",
  },
] as const;

export const recognition = [
  {
    line: "AIME qualifier (American Invitational Mathematics Examination)",
    context: "2026",
  },
  {
    line: "Eagle Scout",
    context: "Boy Scouts of America",
  },
] as const;

export const skills = [
  {
    group: "Robotics & Controls",
    items: [
      "Robotics",
      "Autonomous systems",
      "Human-robot interaction",
      "Sensor integration",
      "CAD/CAM",
      "Mechanism design",
    ],
  },
  {
    group: "Embedded & Hardware",
    items: [
      "FPGA",
      "Embedded systems",
      "Raspberry Pi",
      "Sensors (LiDAR / sonar / NIR)",
      "Edge deployment",
      "3D printing",
    ],
  },
  {
    group: "AI / ML",
    items: [
      "Embedded ML",
      "PyTorch",
      "TensorFlow",
      "Computer vision",
      "CNNs / LSTMs",
      "Reinforcement learning",
      "LLM orchestration",
      "Voice agents",
      "Model optimization",
      "Quantization",
    ],
  },
  {
    group: "Software & Tools",
    items: [
      "Python",
      "C/C++",
      "Java",
      "TypeScript / JavaScript",
      "Swift / SwiftUI",
      "React / Next.js",
      "Tailwind CSS",
      "Vite",
      "Vercel",
      "Postgres / Neon",
      "Serverless functions",
      "Git",
    ],
  },
] as const;
