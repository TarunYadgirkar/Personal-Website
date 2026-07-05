import { StatusTag } from "tarun-yadgirkar-site";

export const ProvisionalPatent = () => <StatusTag>Provisional patent filed</StatusTag>;

export const Research = () => <StatusTag>Research · ongoing</StatusTag>;

export const Shipped = () => <StatusTag>Shipped prototype</StatusTag>;

export const Row = () => (
  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
    <StatusTag>Industry internship</StatusTag>
    <StatusTag>Selected prototypes</StatusTag>
    <StatusTag>Archive</StatusTag>
  </div>
);
