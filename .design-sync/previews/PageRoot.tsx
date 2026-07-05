import { Eyebrow, PageRoot, StatusTag } from "tarun-yadgirkar-site";

export const BaseStyles = () => (
  <PageRoot>
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Eyebrow>Root wrapper</Eyebrow>
      <p style={{ margin: 0, maxWidth: "52ch", lineHeight: 1.6 }}>
        PageRoot supplies the site&apos;s dark background, foreground color, and
        both font families — wrap every design in it, exactly like the
        app&apos;s body element.
      </p>
      <div>
        <StatusTag>bg #0b0e15 · fg #e7eaf2 · Schibsted Grotesk</StatusTag>
      </div>
    </div>
  </PageRoot>
);
