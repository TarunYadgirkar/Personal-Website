export type ModelKey = "balance" | "glasses" | "arm" | "board";

export interface HeroModel {
  key: ModelKey;
  name: string;
  /** A fact the drawing cannot show on its own. */
  caption: string;
  /** Seconds per animation loop; 0 holds the model still. */
  period: number;
}

/* The carousel shows these in this order: Vantage, the FPGA board, BALANCE, then the robot arm. */
export const heroModels: readonly HeroModel[] = [
  {
    key: "glasses",
    name: "Vantage",
    caption: "Vantage pins windows to the walls of a room and keeps them there. Two cameras beside the nose watch your hands, so there is no controller.",
    period: 9,
  },
  {
    key: "board",
    name: "FPGA board",
    caption: "A sample enters from the radio at the SMA connector, crosses the DSP tiles one column per clock, and leaves for memory as a fixed-point word.",
    period: 7,
  },
  {
    key: "balance",
    name: "BALANCE",
    caption: "The drawing follows provisional patent 63/743,085. The wheels carry flat ground, and the powered feet swing down for stairs.",
    period: 0,
  },
  {
    key: "arm",
    name: "Robot arm",
    caption: "Six joint angles ease between three poses to move the part. The gripper closes only after the wrist has arrived.",
    period: 9,
  },
];

/** How long each model holds the turntable before the next one comes up. */
export const HERO_ADVANCE_MS = 10000;
