"use client";

import { useMemo, useRef, useState, type RefObject } from "react";
import { useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import { useNearViewport } from "@/lib/useNearViewport";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { BOARD_SIZE } from "./Board";
import { DOG_SIZE } from "./Dog";
import { GLASSES_SIZE } from "./Glasses";
import { DrawnModel, STILL_PHASE, type DrawnModelKey } from "./models";
import { DraftingCanvas, Turntable, fitZoom } from "./scene";

export type View = "turn" | "front" | "side" | "top";
export type ThumbModel = Exclude<DrawnModelKey, "arm">;

/* Framing height in centimetres and the point the camera aims at, per model. */
const FRAME: Record<ThumbModel, { height: number; targetY: number }> = {
  balance: { height: 125, targetY: 50 },
  glasses: { height: GLASSES_SIZE.height * 1.25, targetY: GLASSES_SIZE.targetY },
  board: { height: BOARD_SIZE.height * 1.05, targetY: BOARD_SIZE.targetY + 1 },
  dog: { height: DOG_SIZE.height * 1.5, targetY: DOG_SIZE.targetY },
};

const VIEWS: Record<Exclude<View, "turn">, { position: [number, number, number]; up: [number, number, number] }> = {
  front: { position: [0, 50, 400], up: [0, 1, 0] },
  side: { position: [400, 50, 0], up: [0, 1, 0] },
  top: { position: [0, 400, 0.01], up: [0, 0, -1] },
};

function Camera({ view, zoom: zoomProp, fit, model }: { view: View; zoom?: number; fit: number; model: ThumbModel }) {
  const frame = FRAME[model];
  const size = useThree((s) => s.size);
  const zoom = zoomProp || fitZoom(size, fit, frame.height);
  const target = useMemo(() => new THREE.Vector3(0, frame.targetY, 0), [frame.targetY]);
  const aim = (c: THREE.Camera) => c.lookAt(target);
  if (view === "turn") {
    return <OrthographicCamera makeDefault position={[240, 150, 300]} zoom={zoom} near={1} far={2000} onUpdate={aim} />;
  }
  const v = VIEWS[view];
  // Front and side views sit level with the aim point; the top view keeps its own height.
  const y = view === "top" ? v.position[1] : frame.targetY;
  return <OrthographicCamera makeDefault position={[v.position[0], y, v.position[2]]} up={v.up} zoom={zoom} near={1} far={2000} onUpdate={aim} />;
}

/** `seen` turns true the first time the wrapper comes near the viewport, so a
 * below-the-fold thumbnail costs nothing until it is about to be seen.
 * `animate` is whether a turning scene should move right now. */
function useVisibility(wrapper: RefObject<HTMLDivElement | null>, turns: boolean): { seen: boolean; animate: boolean } {
  const inView = useNearViewport(wrapper);
  const reduced = useReducedMotion();
  const [seen, setSeen] = useState(false);
  if (inView && !seen) setSeen(true);
  return { seen, animate: turns && inView && !reduced };
}

export interface ModelSceneProps {
  /** Which drawn model to show; BALANCE by default. */
  model?: ThumbModel;
  view?: View;
  /** 0 rolling, 1 stepping. */
  stride?: number;
  /** Pixels per centimeter. Omit to size from the canvas. */
  zoom?: number;
  /** When zoom is omitted: share of the shorter side the model fills. */
  fit?: number;
  className?: string;
}

/** One drawn model lit like a product shot, on a turntable or in a fixed orthographic view. */
export function ModelScene({ model = "balance", view = "turn", stride = 0.15, zoom, fit = 0.9, className }: ModelSceneProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  // The flat board is a line edge-on, so it holds the angle that shows its top.
  const { seen, animate } = useVisibility(wrapper, view === "turn" && model !== "board");
  return (
    <div ref={wrapper} className={className} aria-hidden="true">
      {seen && (
        <DraftingCanvas frameloop={animate ? "always" : "demand"}>
          <Camera view={view} zoom={zoom} fit={fit} model={model} />
          <Turntable animate={animate} spin={view === "turn" ? 0.6 : 0} castShadow={view === "turn"}>
            <DrawnModel model={model} t={STILL_PHASE[model]} stride={stride} />
          </Turntable>
        </DraftingCanvas>
      )}
    </div>
  );
}
