import { SystemMark } from "tarun-yadgirkar-site";

export const Default = () => <SystemMark />;

export const WithWordmark = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
    <SystemMark />
    <span style={{ fontSize: "14px" }}>Tarun Yadgirkar</span>
  </div>
);
