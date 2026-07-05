import { SignalTrace } from "tarun-yadgirkar-site";

export const HeroWidth = () => (
  <div style={{ width: "100%", padding: "16px 0" }}>
    <SignalTrace className="h-20 w-full" />
  </div>
);

export const Compact = () => (
  <div style={{ width: "100%" }}>
    <SignalTrace className="h-10 w-full" />
  </div>
);
