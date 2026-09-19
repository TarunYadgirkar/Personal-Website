export type Link = { label: string; href: string };
export type EventLink = Link & { detail: string };

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

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "carepath",
    title: "CarePath",
    oneLiner: "Voice-first patient navigation",
    status: "Shipped prototype",
    event: {
      label: "Autonomous Healthcare Hackathon",
      href: "https://luma.com/zru7alb6",
      detail: "Legion Health and Atlas AI, June 2026",
    },
    problem:
      "Patients don't know where to go, what it may cost, or what to bring when symptoms are confusing.",
    built:
      "A browser-based voice app that turns symptom descriptions into a recommended care destination with visible reasoning and cost context, plus a shareable Care Card. The prototype includes five modes: Triage, Debrief, MedCard, Check-in, and Timeline, with simulated records import and privacy-by-design local data handling.",
    stack: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Grok Voice",
      "OpenAI gpt-4o-mini",
      "Vercel",
    ],
    outcome: "Placed 5th at a one-day health AI hackathon with a working care-navigation prototype.",
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
      label: "Build Smth AI-Native Hackathon, UC Berkeley",
      href: "https://luma.com/7i8crpqz",
      detail: "Klarity Health track at UC Berkeley, May 2026",
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
    oneLiner: "App Intents code generator for Siri",
    status: "Shipped prototype",
    event: {
      label: "Bitrig Hacks",
      href: "https://events.ycombinator.com/bitrighacks-june2026",
      detail: "Y Combinator in Mountain View, June 2026",
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
      detail: "Humans in AI Week, June 2026",
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
    oneLiner: "Agentic arrival orchestration for hotels",
    status: "Shipped prototype",
    event: {
      label: "Hospitality 2030",
      href: "https://cerebralvalley.ai/events/~/e/rosewood-hospitality-2030",
      detail: "Rosewood Sand Hill and Cerebral Valley, May 2026",
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
    oneLiner: "Escalation state machine for elder care",
    status: "Shipped prototype",
    event: {
      label: "AgeTech SF Hackathon",
      href: "https://luma.com/jfen5fhk",
      detail: "May 2026",
    },
    problem:
      "Detection alone doesn't make anyone safe, because there is a gap between a sensor firing and a human confirming what happens next.",
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
    outcome: "Shipped at the AgeTech SF hackathon; the escalation engine is pure TypeScript with unit tests.",
    links: [
      { label: "Live", href: "https://age-tech-hackathon-1.vercel.app" },
      { label: "GitHub", href: "https://github.com/TarunYadgirkar/AgeTech-Hackathon-1" },
    ],
  },
] as const;

export const rainier = {
  id: "rainier",
  title: "Robotics hardware and embedded systems at Rainier Labs",
  status: "Robotics hardware and embedded systems intern",
  context: "Sunnyvale, California, June to August 2025",
  body: "I worked on hardware and embedded systems across two robots: the robot dogs and an expressive head. On the head I selected and integrated the display screens for its facial-expression system, redesigned the CAD so the electronics fit, helped shape the head so it looked right while still housing the hardware, and evaluated microphone and speaker components against both hardware and software constraints.",
  tags: ["Embedded Systems", "Robotics", "CAD", "Human-Robot Interaction"],
} as const;
