import { Reveal, SectionHeading, Tags } from "tarun-yadgirkar-site";

export const RevealedCard = () => (
  <Reveal>
    <div
      style={{
        border: "1px solid rgba(231,234,242,0.12)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <SectionHeading eyebrow="Featured" title="BALANCE — assistive mobility robotics" />
      <Tags items={["Assistive Robotics", "Mechatronics", "LiDAR"]} />
    </div>
  </Reveal>
);

export const RevealedText = () => (
  <Reveal delay={0.1}>
    <p style={{ maxWidth: "48ch", lineHeight: 1.6 }}>
      Scroll-triggered entrance: fades up 12px over 280ms once the block enters
      the viewport, honoring reduced-motion preferences.
    </p>
  </Reveal>
);
