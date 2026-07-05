export type Link = { label: string; href: string };

export type Featured = {
  slug: string;
  title: string;
  status: string;
  context: string;
  summary: string;
  tags: readonly string[];
  href: string;
  external?: boolean;
};

export type CaseStudy = {
  slug: string;
  title: string;
  oneLiner: string;
  status: string;
  context: string;
  problem: string;
  built: string;
  stack: readonly string[];
  outcome: string;
  links: readonly Link[];
};

export const featured: readonly Featured[] = [
  {
    slug: "fpga-ml",
    title: "FPGA-Accelerated Machine Learning",
    status: "Research · ongoing",
    context: "SCU Wireless Intelligent Networks (WIN) Lab · Jul 2025 – present",
    summary:
      "Investigating FPGA-based acceleration to run machine-learning algorithms for high-throughput, low-latency workloads. Prototyping and optimizing FPGA implementations of wireless-communication algorithms, including signal processing and channel estimation.",
    tags: ["FPGA", "Embedded ML", "Signal Processing", "Channel Estimation", "Low-Latency Systems"],
    href: "/research",
  },
  {
    slug: "balance",
    title: "BALANCE — Assistive Mobility Robotics",
    status: "Provisional patent · Published",
    context: "Co-developed with a student team · Youth Innovation Journal, Fall 2025",
    summary:
      "A hybrid robotic mobility device combining wheeled movement on flat ground with robotic-leg assistance on stairs and uneven terrain — structural support and shock isolation paired with LiDAR, sonar, 360° cameras, and on-board computing for real-time mapping. Filed as a provisional patent (No. 63/743,085).",
    tags: ["Assistive Robotics", "Mechatronics", "LiDAR", "Navigation", "CAD"],
    href: "/patent",
  },
  {
    slug: "rainier",
    title: "Robotics Hardware & Embedded Systems",
    status: "Internship",
    context: "Rainier Labs · Sunnyvale, CA · Jun – Aug 2025",
    summary:
      "Worked on an expressive robotic head system: researched, selected, and integrated display screens for a robotic facial-expression system, redesigned CAD models to ensure proper hardware fit, and evaluated microphone and speaker components across hardware/software trade-offs.",
    tags: ["Embedded Systems", "Robotics Hardware", "CAD", "Human-Robot Interaction"],
    href: "/work#rainier",
  },
  {
    slug: "applied-ai",
    title: "Applied AI & Voice-Agent Product Builds",
    status: "Shipped",
    context: "Hackathons · 2026",
    summary:
      "Rapid applied-AI prototypes — agentic orchestration, voice-first accessibility, and healthcare-navigation tools — usually built and shipped in 24–48 hours. Selected: GuestFlow, VoiceVision (2nd place), CarePath, Klarity VoiceNote (won its track).",
    tags: ["Applied AI", "Voice Agents", "LLM Orchestration", "Full-Stack"],
    href: "/work",
  },
  {
    slug: "waste-sorting",
    title: "AI Waste-Sorting Robot",
    status: "Prototype",
    context: "Computer vision + robotics · 2025",
    summary:
      "A robot that sorts waste into compost, recycling, and trash using a Raspberry Pi, a camera and near-infrared sensor, 3D-printed mechanical parts, and servo actuation — 94.7% sorting accuracy on a school-collected dataset.",
    tags: ["Computer Vision", "Robotics", "Raspberry Pi", "Sensors", "3D Printing"],
    href: "/archive#waste-sorting",
  },
] as const;

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "guestflow",
    title: "GuestFlow",
    oneLiner: "Agentic arrival orchestration for luxury hotels",
    status: "Prototype",
    context: "Hospitality 2030 — a Rosewood Sand Hill hackathon · May 2026",
    problem:
      "Personalizing a returning hotel guest's arrival normally requires manual staff work per reservation.",
    built:
      "An agentic pipeline that, the moment a reservation lands, autonomously assembles a bespoke arrival — pulling guest history, live flight status, timezone/climate delta, booking metadata, and origin-country tech profile, then applying four lenses (Guest Purpose, Party Composition, Cultural Nuance, Tech Continuity) to produce three artifacts: a Staff Pre-Arrival Brief, a Room & Amenity Spec, and a guest-facing pre-loaded itinerary. A Confidence + Consent layer only auto-acts on high-confidence, non-invasive inferences and routes borderline calls to staff.",
    stack: ["TypeScript", "Anthropic API (Claude)", "ElevenLabs"],
    outcome: "Built at Hospitality 2030 — a Rosewood Sand Hill hackathon (May 2026).",
    links: [
      { label: "Live", href: "https://guestflow-henna.vercel.app" },
      { label: "GitHub", href: "https://github.com/TarunYadgirkar/guestflow" },
    ],
  },
  {
    slug: "voicevision",
    title: "VoiceVision",
    oneLiner: "Voice-controlled screen accessibility",
    status: "2nd place",
    context: "AI Collective Tri-Valley hackathon · Humans in AI Week · Jun 2026",
    problem:
      "People with visual impairments can't easily reconfigure a screen for their needs in real time.",
    built:
      "A voice-driven layer where spoken needs adapt the display live — \"I have red-green colorblindness\" applies a deuteranopia filter; \"make it dark,\" \"high contrast,\" \"I'm light sensitive,\" and \"macular degeneration\" (center magnification) each map to filters that stack. Ships with a Manifest V3 Chrome extension that applies the same voice-controlled filters to any webpage.",
    stack: [
      "Next.js (App Router)",
      "TypeScript",
      "Web Speech API",
      "Google Gemini 2.5 Flash",
      "SVG feColorMatrix",
      "Tailwind CSS",
      "Vercel",
    ],
    outcome: "2nd place at the AI Collective Tri-Valley hackathon (Humans in AI Week, Jun 2026).",
    links: [
      { label: "Live", href: "https://voicevision-eight.vercel.app" },
      { label: "GitHub", href: "https://github.com/TarunYadgirkar/voicevision" },
    ],
  },
  {
    slug: "carepath",
    title: "CarePath",
    oneLiner: "Voice-first patient navigation",
    status: "Shipped",
    context: "Autonomous Healthcare Hackathon — Legion Health × Atlas AI · Jun 2026",
    problem:
      "Patients don't know where to go (ER vs. urgent care vs. doctor vs. home), what it costs, or what to bring.",
    built:
      "A voice-first app: speak your symptoms and it recommends a destination with visible reasoning and a cost estimate, ending in a shareable Care Card — what to say at check-in, questions to ask, and red flags. Five connected modes (Triage, Debrief, MedCard, Check-in, Timeline), simulated records import (SMART on FHIR / Epic MyChart), and privacy-by-design: data stays in the browser.",
    stack: [
      "Next.js 16 (App Router)",
      "React 19",
      "TypeScript (strict)",
      "Tailwind CSS v4",
      "Grok Voice (xAI Realtime API)",
      "OpenAI gpt-4o-mini",
      "Vercel",
    ],
    outcome: "Built at the Autonomous Healthcare Hackathon (Legion Health × Atlas AI, Jun 2026).",
    links: [
      { label: "Live", href: "https://carepath-five.vercel.app" },
      { label: "GitHub", href: "https://github.com/TarunYadgirkar/carepath" },
    ],
  },
  {
    slug: "klarity-voicenote",
    title: "Klarity VoiceNote",
    oneLiner: "AI voice intake for mental-health documentation",
    status: "Won its track",
    context: "\"Build Smth AI\" hackathon at UC Berkeley",
    problem:
      "Clinicians spend time triaging and documenting intake before an appointment even starts.",
    built:
      "A voice-intake system that turns patient conversations into provider-ready documentation. Patient flow: intake link → short form → consent → AI voice agent → confirmation. The provider dashboard shows an intake queue with AI-assigned risk levels; the AI drafts a patient summary, chief concern, SOAP note, risk level and flags, symptoms, goals, suggested questions, and follow-ups — all provider-editable.",
    stack: [
      "Next.js 16 (Turbopack)",
      "TypeScript (strict)",
      "Tailwind CSS v4",
      "Retell AI",
      "Google Gemini 2.5 Flash Lite",
      "Neon serverless Postgres",
      "Vercel",
    ],
    outcome: "Won the Klarity Health track at the \"Build Smth AI\" hackathon at UC Berkeley.",
    links: [
      { label: "Live", href: "https://klarity-voicenote.vercel.app" },
      { label: "GitHub", href: "https://github.com/TarunYadgirkar/klarity-voicenote-Hackathon" },
    ],
  },
  {
    slug: "guardianalert",
    title: "GuardianAlert",
    oneLiner: "Escalation layer for elder-care detection",
    status: "Prototype",
    context: "AgeTech SF Hackathon · 2026",
    problem:
      "Detection alone (falls, inactivity) doesn't make anyone safe; there's a gap between a sensor firing and a human confirming.",
    built:
      "A system that takes a free-text \"something's off\" event, classifies severity (minor/medium/major) with visible AI reasoning, then runs a user-configured escalation procedure step by step with live timers until a human takes ownership. 911 is shown as intent only, never dialed. The core escalation state machine is pure, unit-testable TypeScript.",
    stack: [
      "React 19",
      "TypeScript (strict)",
      "Tailwind CSS v4",
      "Vite",
      "Vercel Functions",
      "Google Gemini",
      "Retell SDK",
    ],
    outcome: "Built at the AgeTech SF Hackathon 2026.",
    links: [
      { label: "Live", href: "https://age-tech-hackathon-1.vercel.app" },
      { label: "GitHub", href: "https://github.com/TarunYadgirkar/AgeTech-Hackathon-1" },
    ],
  },
  {
    slug: "intent",
    title: "Intent",
    oneLiner: "App Intents code generator",
    status: "Prototype",
    context: "YC hackathon",
    problem: "Making an iOS app visible to AI-powered Siri requires hand-writing App Intents.",
    built:
      "A native SwiftUI app that turns a plain-English app description into a complete, compilable App Intents Swift implementation via the Claude API.",
    stack: ["Swift", "Xcode 27 / iOS 27 (deploys iOS 16+)", "Anthropic API"],
    outcome: "Built at a YC hackathon.",
    links: [{ label: "GitHub", href: "https://github.com/TarunYadgirkar/bitrig-yc-hackathon" }],
  },
] as const;

export const rainier = {
  id: "rainier",
  title: "Robotics Hardware & Embedded Systems — Rainier Labs",
  status: "Internship",
  context: "Sunnyvale, CA · Jun – Aug 2025",
  body: "Worked on an expressive robotic head system: researched, selected, and integrated display screens for a robotic facial-expression system and redesigned CAD models to ensure proper hardware fit; collaborated on the robotic head design, balancing aesthetics with hardware function; evaluated and sourced microphone and speaker components across hardware/software trade-offs.",
  tags: ["Embedded Systems", "Robotics Hardware", "CAD", "Human-Robot Interaction"],
} as const;
