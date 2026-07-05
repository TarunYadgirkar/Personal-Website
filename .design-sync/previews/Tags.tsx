import { Tags } from "tarun-yadgirkar-site";

export const ProjectStack = () => (
  <Tags items={["FPGA", "Embedded ML", "Signal Processing", "Channel Estimation"]} />
);

export const CaseStudy = () => (
  <Tags
    items={[
      "Next.js 16",
      "TypeScript",
      "Retell AI",
      "Google Gemini",
      "Neon Postgres",
      "Vercel",
    ]}
  />
);

export const Short = () => <Tags items={["Robotics", "CAD"]} />;
