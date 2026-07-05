import { ExternalLink } from "tarun-yadgirkar-site";

export const Default = () => (
  <ExternalLink href="https://github.com/TarunYadgirkar">GitHub</ExternalLink>
);

export const LiveDemo = () => (
  <ExternalLink href="https://carepath-five.vercel.app" ariaLabel="CarePath live demo">
    Live
  </ExternalLink>
);

export const Row = () => (
  <div style={{ display: "flex", gap: "20px" }}>
    <ExternalLink href="https://github.com/TarunYadgirkar/klarity-voicenote-Hackathon">
      GitHub
    </ExternalLink>
    <ExternalLink href="https://klarity-voicenote.vercel.app">Live</ExternalLink>
  </div>
);
