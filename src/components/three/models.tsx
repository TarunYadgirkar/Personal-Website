"use client";

import { Arm } from "./Arm";
import { Balance } from "./Balance";
import { Board } from "./Board";
import { Dog } from "./Dog";
import { Glasses } from "./Glasses";

/** Every drawn model. Each is in centimetres, standing on the ground plane. */
export type DrawnModelKey = "balance" | "glasses" | "arm" | "board" | "dog";

/* Where each model rests when it is not animating: BALANCE mostly rolling,
 * the glasses fully revealed, the arm mid-carry, the board with the wave on
 * the chip, the dog between steps. */
export const STILL_PHASE: Record<DrawnModelKey, number> = { balance: 0.15, glasses: 0.6, arm: 0.5, board: 0.5, dog: 0.5 };

/** One model at phase `t`. BALANCE has no loop; it takes `stride` (0 rolling, 1 stepping) instead. */
export function DrawnModel({ model, t, stride = 0.15 }: { model: DrawnModelKey; t: number; stride?: number }) {
  switch (model) {
    case "balance":
      return <Balance stride={stride} />;
    case "glasses":
      return <Glasses t={t} />;
    case "arm":
      return <Arm t={t} />;
    case "board":
      return <Board t={t} />;
    case "dog":
      return <Dog t={t} />;
  }
}
