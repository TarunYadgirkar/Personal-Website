export type ModelKey = "balance" | "glasses" | "arm" | "board";

export interface HeroModel {
  key: ModelKey;
  name: string;
  /** A fact the drawing cannot show on its own. */
  caption: string;
}

/* Carousel order: Vantage, the FPGA board, BALANCE, then the robot arm. */
export const heroModels: readonly HeroModel[] = [
  {
    key: "glasses",
    name: "Vantage",
    caption: "Vantage pins windows to the walls of a room and keeps them there. Two cameras beside the nose watch your hands, so there is no controller.",
  },
  {
    key: "board",
    name: "FPGA board",
    caption: "A sample enters from the radio at the SMA connector, crosses the DSP tiles one column per clock, and leaves for memory as a fixed-point word.",
  },
  {
    key: "balance",
    name: "BALANCE",
    caption: "The drawing follows provisional patent 63/743,085. The wheels carry flat ground, and the powered feet swing down for stairs.",
  },
  {
    key: "arm",
    name: "Robot arm",
    caption: "Six joint angles ease between three poses to move the part. The gripper closes only after the wrist has arrived.",
  },
];

export const heroPeriods: Record<ModelKey, number> = { balance: 0, glasses: 9, arm: 9, board: 7 };

export const HERO_ADVANCE_MS = 10000;
