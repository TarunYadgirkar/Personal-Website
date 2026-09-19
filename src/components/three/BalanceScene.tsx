"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrthographicCamera } from "@react-three/drei";
import { NoToneMapping } from "three";
import * as THREE from "three";
import { useInView } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Balance } from "./Balance";
import { NO_OBSERVER, keepContextRestorable } from "./drafting";
import { Glasses, GLASSES_SIZE } from "./Glasses";
import { Board, BOARD_SIZE } from "./Board";
import { Dog, DOG_SIZE } from "./Dog";

export type View = "turn" | "front" | "side" | "top";
export type ThumbModel = "balance" | "glasses" | "board" | "dog";

/* Framing height in centimetres and the point the camera aims at, per model. */
const FRAME: Record<ThumbModel, { height: number; targetY: number }> = {
  balance: { height: 125, targetY: 50 },
  glasses: { height: GLASSES_SIZE.height * 1.25, targetY: GLASSES_SIZE.targetY },
  board: { height: BOARD_SIZE.height * 1.05, targetY: BOARD_SIZE.targetY + 1 },
  dog: { height: DOG_SIZE.height * 1.5, targetY: DOG_SIZE.targetY },
};

/* The phase each model is drawn at when it is not animating. */
const STILL: Record<ThumbModel, number> = { balance: 0.15, glasses: 0.6, board: 0.5, dog: 0.5 };

const VIEWS: Record<Exclude<View, "turn">, { position: [number, number, number]; up: [number, number, number] }> = {
  front: { position: [0, 50, 400], up: [0, 1, 0] },
  side: { position: [400, 50, 0], up: [0, 1, 0] },
  top: { position: [0, 400, 0.01], up: [0, 0, -1] },
};



/** Slow turntable with a small pointer lean; frozen when motion is reduced. */
function Turntable({ animate, spin, children }: { animate: boolean; spin: number; children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    const g = group.current;
    if (!g || !animate) return;
    g.rotation.y += delta * 0.18;
    const lean = state.pointer.x * 0.08;
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, lean, 4, delta);
  });
  return (
    <group ref={group} rotation={[0, spin, 0]}>
      {children}
      <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={140} blur={2.4} far={40} color="#1d1a16" />
    </group>
  );
}

export function Lights() {
  return (
    <>
      <hemisphereLight args={["#ffffff", "#d9d2c3", 1.4]} />
      <directionalLight position={[120, 220, 160]} intensity={1.3} color="#fff8ec" castShadow shadow-mapSize={[1024, 1024]} />
    </>
  );
}

/** Zoom in pixels per centimeter, from the prop or from the canvas size.
 * `fit` is the share of the shorter canvas side the model's framing height fills. */
function useZoom(zoom: number | undefined, fit: number, height: number): number {
  const size = useThree((s) => s.size);
  if (zoom) return zoom;
  // A 0x0 first measurement would make the projection degenerate; hold a sane floor.
  return Math.max((Math.min(size.width, size.height * 0.85) * fit) / height, 0.01);
}

function Camera({ view, zoom: zoomProp, fit, model }: { view: View; zoom?: number; fit: number; model: ThumbModel }) {
  const frame = FRAME[model];
  const zoom = useZoom(zoomProp, fit, frame.height);
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

/** True from the first time the wrapper comes near the viewport, so a
 * below-the-fold thumbnail costs nothing until it is about to be seen. */
function useSeen(inView: boolean): boolean {
  const [seen, setSeen] = useState(false);
  if (inView && !seen) setSeen(true);
  return seen;
}

/** The flat board is a line edge-on, so it holds the angle that shows its top. */
function turns(model: ThumbModel, view: View): boolean {
  return view === "turn" && model !== "board";
}

/** In demand mode nothing redraws on its own, so a resize asks for one frame. */
function RedrawOnResize() {
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => invalidate(), [size.width, size.height, invalidate]);
  return null;
}

function ThumbModelView({ model, stride, phase }: { model: ThumbModel; stride: number; phase: number }) {
  switch (model) {
    case "balance":
      return <Balance stride={stride} />;
    case "glasses":
      return <Glasses t={phase} />;
    case "board":
      return <Board t={phase} />;
    case "dog":
      return <Dog t={phase} />;
  }
}

export interface BalanceSceneProps {
  /** Which drawn model to show; BALANCE by default. */
  model?: ThumbModel;
  view?: View;
  /** 0 rolling, 1 stepping. */
  stride?: number;
  /** Pixels per centimeter. Omit to size from the canvas. */
  zoom?: number;
  /** When zoom is omitted: share of the shorter side the device fills. */
  fit?: number;
  className?: string;
}

/** The BALANCE device drawn as an inked technical illustration. */
/** Whether the scene should draw and whether the turntable should move. */
function useSceneState(wrapper: React.RefObject<HTMLDivElement | null>, model: ThumbModel, view: View) {
  const inView = useInView(wrapper, { margin: "80px" }) || NO_OBSERVER;
  const reduced = useReducedMotion();
  const seen = useSeen(inView);
  const animate = turns(model, view) && inView && !reduced;
  return { seen, animate };
}

export function BalanceScene({ model = "balance", view = "turn", stride = 0.15, zoom, fit = 0.9, className }: BalanceSceneProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const { seen, animate } = useSceneState(wrapper, model, view);
  return (
    <div ref={wrapper} className={className} aria-hidden="true">
      {seen && (
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, toneMapping: NoToneMapping }}
          frameloop={animate ? "always" : "demand"}
          fallback={null}
          onCreated={({ gl, invalidate }) => keepContextRestorable(gl, invalidate)}
        >
          <RedrawOnResize />
          <Camera view={view} zoom={zoom} fit={fit} model={model} />
          <Lights />
          <Turntable animate={animate} spin={view === "turn" ? 0.6 : 0}>
            <ThumbModelView model={model} stride={stride} phase={STILL[model]} />
          </Turntable>
        </Canvas>
      )}
    </div>
  );
}

