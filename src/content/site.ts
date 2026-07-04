export const site = {
  name: "Tarun Yadgirkar",
  positioning: "AI systems, robotics, and embedded intelligence",
  subline: "Embedded ML · robotics & autonomy · applied AI",
  education: "Applied Mathematics @ UC Berkeley",
  location: "San Ramon, California",
  email: "tyadgirkar@gmail.com",
  url: "https://tarunyadgirkar.vercel.app",
  // Set to a PDF path/URL to enable the Resume button (kept null until the
  // updated resume is ready — the old PDF has outdated positioning).
  resumeUrl: null as string | null,
  bioShort:
    "I build AI systems, robotics platforms, and embedded intelligence — from FPGA-accelerated machine learning to assistive mobility robots. I'm studying Applied Mathematics at UC Berkeley, research embedded ML at Santa Clara University's WIN Lab, and hold a provisional patent for BALANCE, a hybrid legged-and-wheeled mobility device.",
  links: {
    github: "https://github.com/TarunYadgirkar",
    linkedin: "https://www.linkedin.com/in/tarun-yadgirkar-74a12531b/",
    devpost: "https://devpost.com/tyadgirkar",
  },
} as const;

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
    line: "Provisional patent + published paper (BALANCE)",
    context: "Youth Innovation Journal, 2025",
  },
  {
    line: "Research assistant",
    context: "SCU Wireless Intelligent Networks (WIN) Lab",
  },
  {
    line: "Robotics hardware & embedded-systems internship",
    context: "Rainier Labs",
  },
  {
    line: "VEX Robotics World Championship qualifier",
    context: "2024",
  },
  {
    line: "Eagle Scout",
    context: "Boy Scouts of America",
  },
] as const;

export const skills = [
  {
    group: "Robotics & Controls",
    items: ["Robotics", "Autonomous systems", "ROS", "CAD/CAM", "Mechanism design"],
  },
  {
    group: "Embedded & Hardware",
    items: ["FPGA", "Embedded systems", "Raspberry Pi", "Sensors (LiDAR / sonar / NIR)", "3D printing"],
  },
  {
    group: "AI / ML",
    items: ["Embedded ML", "Computer vision", "CNNs / LSTMs", "Reinforcement learning", "Applied LLMs", "Voice agents"],
  },
  {
    group: "Software & Tools",
    items: ["Python", "C/C++", "Java", "TypeScript / JavaScript", "Swift", "Git", "Next.js", "React"],
  },
] as const;
