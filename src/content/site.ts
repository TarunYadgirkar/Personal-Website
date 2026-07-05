export const site = {
  name: "Tarun Yadgirkar",
  positioning: "AI systems, robotics, and embedded intelligence",
  subline: "Embedded ML · robotics & autonomy · applied AI",
  credentialLine: "SCU WIN Lab · Rainier Labs · UC Berkeley Applied Mathematics",
  education: "Applied Mathematics @ UC Berkeley",
  location: "San Ramon, California",
  email: "tyadgirkar@gmail.com",
  url: "https://tarunyadgirkar.vercel.app",
  // Set to a PDF path/URL to enable the Resume button (kept null until the
  // updated resume is ready — the old PDF has outdated positioning).
  resumeUrl: null as string | null,
  // Paste a Spline scene export URL (https://prod.spline.design/<id>/scene.splinecode)
  // to swap the hero signal trace for the 3D scene. Null keeps the trace.
  splineSceneUrl: "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode" as string | null,
  bioShort:
    "I build AI systems, robotics platforms, and embedded intelligence — from FPGA-accelerated machine learning to assistive mobility robots and applied AI prototypes. Current work spans embedded ML research at Santa Clara University's WIN Lab, robotics and embedded-systems work at Rainier Labs, and BALANCE, an assistive mobility system filed as a provisional patent.",
  links: {
    github: "https://github.com/TarunYadgirkar",
    linkedin: "https://www.linkedin.com/in/tarun-yadgirkar-74a12531b/",
    devpost: "https://devpost.com/tyadgirkar",
  },
} as const;

export const proofPoints = [
  {
    label: "Research",
    value: "FPGA / embedded ML",
    detail: "SCU Wireless Intelligent Networks Lab",
  },
  {
    label: "Builds",
    value: "Applied AI prototypes",
    detail: "Agentic, voice-first, and product systems",
  },
  {
    label: "Robotics",
    value: "BALANCE",
    detail: "Filed provisional patent No. 63/743,085",
  },
] as const;

export const focusAreas = [
  {
    title: "Embedded ML",
    detail: "Machine learning on FPGAs and constrained hardware",
  },
  {
    title: "Robotics & autonomy",
    detail: "Robotics systems, autonomy, and sensor-driven builds",
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
    line: "Eagle Scout",
    context: "Boy Scouts of America",
  },
  {
    line: "AIME qualifier",
    context: "2026",
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
