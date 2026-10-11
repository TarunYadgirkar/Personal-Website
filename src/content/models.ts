export type ModelKey = "balance" | "glasses" | "arm" | "board";

export interface HeroModel {
  key: ModelKey;
  name: string;
}

/* Order matches the identity order on the page: Vantage, the FPGA research, BALANCE, then robotics. */
export const heroModels: readonly HeroModel[] = [
  { key: "glasses", name: "Vantage" },
  { key: "board", name: "FPGA board" },
  { key: "balance", name: "BALANCE" },
  { key: "arm", name: "Robot arm" },
];

export const heroPeriods: Record<ModelKey, number> = { balance: 0, glasses: 9, arm: 9, board: 7 };

export const HERO_ADVANCE_MS = 10000;
