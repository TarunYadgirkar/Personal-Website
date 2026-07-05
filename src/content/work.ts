export type Link = { label: string; href: string };
export type EventLink = Link & { detail: string };

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
  event: EventLink;
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
    status: "Provisional patent filed",
    context: "Related article published · Youth Innovation Journal, Fall 2025",
    summary:
      "A hybrid robotic mobility device combining wheeled movement on flat ground with robotic-leg assistance on stairs and uneven terrain. Filed as provisional patent No. 63/743,085; a related article about the design was published in the Youth Innovation Journal.",
    tags: ["Assistive Robotics", "Mechatronics", "LiDAR", "Navigation", "CAD"],
    href: "/patent",
  },
  {
    slug: "applied-ai",
    title: "Applied AI Product Builds",
    status: "Selected prototypes",
    context: "Shipped prototypes · 2026",
    summary:
      "A focused set of shipped prototypes across voice-first care navigation, mental-health intake, native AI tooling, accessibility, hospitality, and elder-care escalation.",
    tags: ["Applied AI", "Voice Agents", "LLM Orchestration", "Full-Stack"],
    href: "/work",
  },
] as const;

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "carepath",
    title: "CarePath",
    oneLiner: "Voice-first patient navigation",
    status: "Shipped prototype",
    event: {
      label: "Autonomous Healthcare Hackathon",
      href: "https://luma.com/zru7alb6",
      detail: "Legion Health × Atlas AI · Jun 2026",
    },
    problem:
      "Patients don't know where to go, what it may cost, or what to bring when symptoms are confusing.",
    built:
      "A browser-based voice app that turns symptom descriptions into a recommended care destination with visible reasoning, cost context, and a shareable Care Card. The prototype includes five modes: Triage, Debrief, MedCard, Check-in, and Timeline, with simulated records import and privacy-by-design local data handling.",
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Grok Voice",
      "OpenAI gpt-4o-mini",
      "Vercel",
    ],
    outcome: "Shipped a working care-navigation prototype at a one-day health AI hackathon.",
    links: [
      { label: "Live", href: "https://carepath-five.vercel.app" },
      { label: "GitHub", href: "https://github.com/TarunYadgirkar/carepath" },
    ],
  },
  {
    slug: "klarity-voicenote",
    title: "Klarity VoiceNote",
    oneLiner: "AI voice intake for mental-health documentation",
    status: "Shipped prototype",
    event: {
      label: "Build Smth AI-Native Hackathon @Cal",
      href: "https://luma.com/7i8crpqz",
      detail: "Klarity Health track · UC Berkeley · May 2026",
    },
    problem:
      "Clinicians spend time triaging and documenting intake before an appointment even starts.",
    built:
      "A voice-intake system that turns patient conversations into provider-ready documentation. Patient flow: intake link, short form, consent, AI voice agent, confirmation. The provider dashboard shows an intake queue with AI-assigned risk levels, summary, SOAP note, symptoms, goals, suggested questions, and follow-ups.",
    stack: [
      "Next.js 16",
      "TypeScript",
      "Retell AI",
      "Google Gemini",
      "Neon Postgres",
      "Vercel",
    ],
    outcome: "Won the Klarity Health sponsor track.",
    links: [
      { label: "Live", href: "https://klarity-voicenote.vercel.app" },
      { label: "GitHub", href: "https://github.com/TarunYadgirkar/klarity-voicenote-Hackathon" },
    ],
  },
  {
    slug: "intent",
    title: "Intent",
    oneLiner: "Native App Intents code generator",
    status: "Shipped prototype",
    event: {
      label: "Bitrig Hacks",
      href: "https://www.linkedin.com/posts/julianschiavo_were-so-excited-to-host-the-first-ever-bitrig-activity-7468388738302369792-6vTM",
      detail: "Y Combinator Mountain View HQ · Jun 2026",
    },
    problem: "Making an iOS app visible to AI-powered Siri requires hand-writing App Intents.",
    built:
      "A native SwiftUI app that turns a plain-English app description into a complete, compilable App Intents Swift implementation via the Claude API.",
    stack: ["Swift", "Xcode 27 / iOS 27 (deploys iOS 16+)", "Anthropic API"],
    outcome: "Built a working native code-generation prototype.",
    links: [{ label: "GitHub", href: "https://github.com/TarunYadgirkar/bitrig-yc-hackathon" }],
  },
];

export const additionalCaseStudies: readonly CaseStudy[] = [
  {
    slug: "voicevision",
    title: "VoiceVision",
    oneLiner: "Voice-controlled screen accessibility",
    status: "Shipped prototype",
    event: {
      label: "AI Hackathon with The AI Collective Tri-Valley",
      href: "https://luma.com/aic-tr-june",
      detail: "Humans in AI Week · Jun 2026",
    },
    problem:
      "People with visual impairments can't easily reconfigure a screen for their needs in real time.",
    built:
      "A voice-driven layer where spoken needs adapt the display live: colorblindness filters, dark mode, high contrast, light sensitivity, and center magnification. The project also includes a Manifest V3 Chrome extension that applies the same filters to any webpage.",
    stack: [
      "Next.js",
      "TypeScript",
      "Web Speech API",
      "Google Gemini",
      "SVG feColorMatrix",
      "Chrome Extension",
    ],
    outcome: "Placed 2nd at the AI Collective Tri-Valley hackathon.",
    links: [
      { label: "Live", href: "https://voicevision-eight.vercel.app" },
      { label: "GitHub", href: "https://github.com/TarunYadgirkar/voicevision" },
    ],
  },
  {
    slug: "guestflow",
    title: "GuestFlow",
    oneLiner: "Agentic arrival orchestration for luxury hotels",
    status: "Shipped prototype",
    event: {
      label: "Hospitality 2030",
      href: "https://cerebralvalley.ai/events/~/e/rosewood-hospitality-2030",
      detail: "Rosewood Sand Hill × Cerebral Valley · May 2026",
    },
    problem:
      "Personalizing a returning hotel guest's arrival normally requires manual staff work per reservation.",
    built:
      "An agentic pipeline that assembles a bespoke arrival from guest history, live flight status, timezone and climate delta, booking metadata, and origin-country tech profile. It produces a staff brief, room and amenity spec, and guest-facing itinerary, with a confidence and consent layer for high-impact inferences.",
    stack: ["TypeScript", "Anthropic API", "ElevenLabs"],
    outcome: "Shipped a working hospitality workflow prototype.",
    links: [
      { label: "Live", href: "https://guestflow-henna.vercel.app" },
      { label: "GitHub", href: "https://github.com/TarunYadgirkar/guestflow" },
    ],
  },
  {
    slug: "guardianalert",
    title: "GuardianAlert",
    oneLiner: "Escalation state machine for elder-care detection",
    status: "Shipped prototype",
    event: {
      label: "AgeTech SF Hackathon",
      href: "https://luma.com/jfen5fhk",
      detail: "Closing the Emergency Detection Gap · May 2026",
    },
    problem:
      "Detection alone doesn't make anyone safe; there is a gap between a sensor firing and a human confirming what happens next.",
    built:
      "A system that takes a free-text event, classifies severity with visible AI reasoning, then runs a user-configured escalation procedure step by step with live timers until a human takes ownership. The core escalation state machine is pure, unit-testable TypeScript.",
    stack: [
      "React 19",
      "TypeScript",
      "Vite",
      "Vercel Functions",
      "Google Gemini",
      "Retell SDK",
    ],
    outcome: "Shipped with a pure, unit-testable escalation state machine.",
    links: [
      { label: "Live", href: "https://age-tech-hackathon-1.vercel.app" },
      { label: "GitHub", href: "https://github.com/TarunYadgirkar/AgeTech-Hackathon-1" },
    ],
  },
] as const;

export const rainier = {
  id: "rainier",
  title: "Robotics & Embedded Systems — Rainier Labs",
  status: "Industry internship",
  context: "Sunnyvale, CA · Jun – Aug 2025",
  body: "Worked on an expressive robotic head system: researched, selected, and integrated display screens for a robotic facial-expression system and redesigned CAD models to ensure proper hardware fit; collaborated on the robotic head design, balancing aesthetics with hardware function; evaluated and sourced microphone and speaker components across hardware/software trade-offs.",
  tags: ["Embedded Systems", "Robotics", "CAD", "Human-Robot Interaction"],
} as const;
