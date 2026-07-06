export const site = {
  name: "Tarun Yadgirkar",
  positioning: "AI systems, robotics, and embedded intelligence",
  subline: "Embedded ML · robotics & autonomy · applied AI",
  credentialLine: "SCU WIN Lab · Rainier Labs · UC Berkeley Applied Mathematics",
  education: "Applied Mathematics @ UC Berkeley",
  location: "San Ramon, California",
  email: "tarun_yadgirkar@berkeley.edu",
  emails: [{ label: "Berkeley", address: "tarun_yadgirkar@berkeley.edu" }],
  url: "https://tarunyadgirkar.vercel.app",
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

export const atAGlance = [
  { label: "Patent", value: "63/743,085", accent: "BALANCE · " },
  { label: "Paper", value: "Youth Innov. Journal '25" },
  { label: "Lab", value: "SCU WIN Lab" },
  { label: "Robotics", value: "VEX Worlds qualifier" },
  { label: "Based", value: "San Ramon, CA" },
] as const;

export const focusAreas = [
  {
    title: "Embedded ML",
    detail: "Machine learning on FPGAs and constrained hardware",
  },
  {
    title: "Robotics & autonomy",
    detail: "Embedded and hardware robotics, autonomous systems",
  },
  {
    title: "Applied AI systems",
    detail: "Agentic pipelines and LLM-backed products",
  },
  {
    title: "Voice agents",
    detail: "Voice-first interfaces and real-time voice AI",
  },
  {
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
      "Computer vision",
      "CNNs / LSTMs",
      "Reinforcement learning",
      "LLM orchestration",
      "Voice agents",
      "Model optimization",
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
