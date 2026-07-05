import { Eyebrow, HeroReveal } from "tarun-yadgirkar-site";

export const HeroHeadline = () => (
  <HeroReveal>
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Eyebrow>Embedded ML · robotics &amp; autonomy · applied AI</Eyebrow>
      <h1 style={{ fontSize: "34px", fontWeight: 500, letterSpacing: "-0.025em", margin: 0 }}>
        Tarun Yadgirkar
      </h1>
    </div>
  </HeroReveal>
);

export const Staggered = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
    <HeroReveal>
      <p style={{ margin: 0 }}>First line — mounts immediately.</p>
    </HeroReveal>
    <HeroReveal delay={0.12}>
      <p style={{ margin: 0, color: "var(--color-fg-muted, #98a1b3)" }}>
        Second line — staggered 120ms behind.
      </p>
    </HeroReveal>
  </div>
);
