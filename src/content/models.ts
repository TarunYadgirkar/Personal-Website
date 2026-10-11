export type ModelKey = "balance" | "glasses" | "arm" | "board";

export interface HeroModel {
  key: ModelKey;
  name: string;
  /** Seconds per animation loop; 0 holds the model still. */
  period: number;
}

/* The carousel shows these in this order: Vantage, the FPGA board, BALANCE, then the robot arm. */
export const heroModels: readonly HeroModel[] = [
  {
    key: "glasses",
    name: "Vantage",
    period: 9,
  },
  {
    key: "board",
    name: "FPGA board",
    period: 7,
  },
  {
    key: "balance",
    name: "BALANCE",
    period: 0,
  },
  {
    key: "arm",
    name: "Robot arm",
    period: 9,
  },
];

/** How long each model holds the turntable before the next one comes up. */
export const HERO_ADVANCE_MS = 10000;
