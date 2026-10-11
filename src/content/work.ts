export type Link = { label: string; href: string };
export type EventLink = Link & { detail: string };

export type Hackathon = {
  slug: string;
  title: string;
  oneLiner: string;
  when: string;
  /** Set only when the build placed; drives the trophy on its pill. */
  placed?: string;
  event?: EventLink;
  problem: string;
  built: string;
  stack: readonly string[];
  outcome: string;
  links: readonly Link[];
};

/* Newest first. */
export const hackathons: readonly Hackathon[] = [
  {
    slug: "bonsai",
    title: "Bonsai",
    oneLiner: "Tree-structured AI chat",
    when: "Aug 2026",
    problem: "A long AI chat drags its whole history into every side question, so answers get slower, costlier and less focused.",
    built:
      "Bonsai turns the chat into a tree: branch a side question with a compiled brief instead of the whole history, route it to the right model, and merge one distilled sentence back. A dependency-free TypeScript engine (bonsai-engine on npm) runs behind three surfaces: a claude.ai MCP connector that renders the tree inline, a Claude Code plugin, and a web app.",
    stack: ["TypeScript", "MCP", "Claude Code plugin", "Vercel"],
    outcome: "Open source under the MIT license and published on npm. A referent-resolution benchmark runs in CI.",
    links: [
      { label: "GitHub", href: "https://github.com/TarunYadgirkar/Bonsai" },
      { label: "Live", href: "https://bonsai-connector.vercel.app" },
    ],
  },
  {
    slug: "popper",
    title: "Popper",
    oneLiner: "Adversarial pull-request gate",
    when: "Jul 2026",
    event: {
      label: "Daytona HackSprint",
      href: "https://daytona-hacksprint.vercel.app",
      detail: "July 2026",
    },
    problem: "Code review asks whether a diff looks right, which misses claims the code never actually meets.",
    built:
      "Popper extracts the claim a PR makes and writes tests designed to break it. Each test runs against the code before and after the change in an isolated Daytona sandbox, so a pass only counts when the same test failed before. The gate then compares that evidence with CodeRabbit's static review and surfaces where the two disagree.",
    stack: ["TypeScript", "Daytona", "CodeRabbit", "Vercel"],
    outcome: "The live demo runs the full six-stage gate in about thirteen seconds.",
    links: [
      { label: "Live", href: "https://daytona-hacksprint.vercel.app" },
      { label: "GitHub", href: "https://github.com/TarunYadgirkar/Daytona-Hacksprint" },
    ],
  },
  {
    slug: "carepath",
    title: "CarePath",
    oneLiner: "Voice-first patient navigation",
    when: "Jun 2026",
    placed: "5th place",
    event: {
      label: "Autonomous Healthcare Hackathon",
      href: "https://luma.com/zru7alb6",
      detail: "Legion Health and Atlas AI, June 2026",
    },
    problem: "Patients don't know where to go, what it may cost, or what to bring when symptoms are confusing.",
    built:
      "A browser-based voice app that turns symptom descriptions into a recommended care destination with visible reasoning and cost context, plus a shareable Care Card. It has five modes (Triage, Debrief, MedCard, Check-in and Timeline), with simulated records import and local-only data handling.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Grok Voice", "OpenAI gpt-4o-mini", "Vercel"],
    outcome: "Placed 5th at a one-day health AI hackathon.",
    links: [
      { label: "Live", href: "https://carepath-five.vercel.app" },
      { label: "GitHub", href: "https://github.com/TarunYadgirkar/carepath" },
    ],
  },
  {
    slug: "intent",
    title: "Intent",
    oneLiner: "App Intents code generator for Siri",
    when: "Jun 2026",
    event: {
      label: "Bitrig Hacks",
      href: "https://events.ycombinator.com/bitrighacks-june2026",
      detail: "Y Combinator in Mountain View, June 2026",
    },
    problem: "Making an iOS app visible to AI-powered Siri requires hand-writing App Intents.",
    built:
      "A native SwiftUI app that turns a plain-English app description into a complete, compilable App Intents Swift implementation through the Claude API.",
    stack: ["Swift", "Xcode 27 / iOS 27 (deploys iOS 16+)", "Anthropic API"],
    outcome: "Built a working native code-generation prototype.",
    links: [{ label: "GitHub", href: "https://github.com/TarunYadgirkar/bitrig-yc-hackathon" }],
  },
  {
    slug: "voicevision",
    title: "VoiceVision",
    oneLiner: "Voice-controlled screen accessibility",
    when: "Jun 2026",
    placed: "2nd place",
    event: {
      label: "AI Hackathon with The AI Collective Tri-Valley",
      href: "https://luma.com/aic-tr-june",
      detail: "Humans in AI Week, June 2026",
    },
    problem: "People with visual impairments can't easily reconfigure a screen for their needs in real time.",
    built:
      "A voice-driven layer where spoken needs adapt the display live: colorblindness filters, dark mode, high contrast, light sensitivity and center magnification. A Manifest V3 Chrome extension applies the same filters to any webpage.",
    stack: ["Next.js", "TypeScript", "Web Speech API", "Google Gemini", "SVG feColorMatrix", "Chrome Extension"],
    outcome: "Placed 2nd at the AI Collective Tri-Valley hackathon.",
    links: [
      { label: "Live", href: "https://voicevision-eight.vercel.app" },
      { label: "GitHub", href: "https://github.com/TarunYadgirkar/voicevision" },
    ],
  },
  {
    slug: "klarity-voicenote",
    title: "Klarity VoiceNote",
    oneLiner: "Voice intake for mental-health notes",
    when: "May 2026",
    placed: "1st, Klarity Health track",
    event: {
      label: "Build Smth AI-Native Hackathon, UC Berkeley",
      href: "https://luma.com/7i8crpqz",
      detail: "Klarity Health track at UC Berkeley, May 2026",
    },
    problem: "Clinicians spend time triaging and documenting intake before an appointment even starts.",
    built:
      "A voice-intake system that turns patient conversations into provider-ready documentation. Patients go from an intake link through a short form, consent and an AI voice agent to a confirmation. The provider dashboard shows an intake queue with AI-assigned risk levels, a summary, a SOAP note, symptoms, goals, suggested questions and follow-ups.",
    stack: ["Next.js 16", "TypeScript", "Retell AI", "Google Gemini", "Neon Postgres", "Vercel"],
    outcome: "Won the Klarity Health sponsor track.",
    links: [
      { label: "Live", href: "https://klarity-voicenote.vercel.app" },
      { label: "GitHub", href: "https://github.com/TarunYadgirkar/klarity-voicenote-Hackathon" },
    ],
  },
  {
    slug: "guestflow",
    title: "GuestFlow",
    oneLiner: "Agentic arrival orchestration for hotels",
    when: "May 2026",
    event: {
      label: "Hospitality 2030",
      href: "https://cerebralvalley.ai/events/~/e/rosewood-hospitality-2030",
      detail: "Rosewood Sand Hill and Cerebral Valley, May 2026",
    },
    problem: "Personalizing a returning hotel guest's arrival normally takes manual staff work per reservation.",
    built:
      "An agentic pipeline that assembles a bespoke arrival from guest history, live flight status, timezone and climate change, booking metadata and the guest's home-country tech profile. It produces a staff brief, a room and amenity spec, and a guest-facing itinerary, and asks for consent before acting on high-impact inferences.",
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
    when: "May 2026",
    event: {
      label: "AgeTech SF Hackathon",
      href: "https://luma.com/jfen5fhk",
      detail: "May 2026",
    },
    problem:
      "Detection alone doesn't make anyone safe, because there is a gap between a sensor firing and a human confirming what happens next.",
    built:
      "A system that takes a free-text event, classifies severity with visible AI reasoning, then runs a user-configured escalation procedure step by step with live timers until a human takes ownership. The escalation state machine is pure, unit-tested TypeScript.",
    stack: ["React 19", "TypeScript", "Vite", "Vercel Functions", "Google Gemini", "Retell SDK"],
    outcome: "Shipped at the AgeTech SF hackathon.",
    links: [
      { label: "Live", href: "https://age-tech-hackathon-1.vercel.app" },
      { label: "GitHub", href: "https://github.com/TarunYadgirkar/AgeTech-Hackathon-1" },
    ],
  },
];
