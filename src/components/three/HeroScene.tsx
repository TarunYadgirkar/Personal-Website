"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import { useNearViewport } from "@/lib/useNearViewport";
import type { ModelKey } from "@/content/models";
import { ARM_SIZE } from "./Arm";
import { BOARD_SIZE } from "./Board";
import { GLASSES_SIZE } from "./Glasses";
import { DrawnModel, STILL_PHASE } from "./models";
import { DraftingCanvas, Turntable, fitZoom } from "./scene";

interface Framing {
  height: number;
  targetY: number;
}

const FRAMING: Record<ModelKey, Framing> = {
  balance: { height: 125, targetY: 50 },
  // Temples run 14 cm back and the panels 12 cm forward, so the turn needs slack on both sides.
  glasses: { height: GLASSES_SIZE.height * 1.45, targetY: GLASSES_SIZE.targetY - 1 },
  // The arm reaches 38 cm off its base, so it needs more room than its standing height.
  arm: { height: ARM_SIZE.height * 1.3, targetY: ARM_SIZE.targetY - 8 },
  // The board is 24 cm on its long side, wider than it is tall once tilted.
  board: { height: BOARD_SIZE.height * 1.6, targetY: BOARD_SIZE.targetY },
};

/* A flat board seen edge-on is a line, so it faces the camera and sways
 * instead of taking the full turn. */
const FACES_CAMERA: Record<ModelKey, boolean> = { balance: false, glasses: false, arm: false, board: true };
const SWAY = 0.35;
const SETTLE_MS = 2200;
const HIDE_BELOW = 0.03;

/** Ease with a small overshoot, so the incoming model settles like something set down. */
function easeOutBack(x: number): number {
  const c = 1.4;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
}

/** One model on the turntable. The active one rises out of the floor with a
 * spin and settles; a model that stops being active spins back down into it. */
function Slot({ model, active, period, animate, framing }: { model: ModelKey; active: boolean; period: number; animate: boolean; framing: Framing }) {
  const group = useRef<THREE.Group>(null);
  const [t, setT] = useState(STILL_PHASE[model]);
  const progress = useRef(0);
  const lastUpdate = useRef(0);
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    progress.current = THREE.MathUtils.damp(progress.current, active ? 1 : 0, 4.5, delta);
    const p = progress.current;
    const eased = active ? easeOutBack(p) : p;
    g.scale.setScalar(Math.max(eased, 0.0001));
    g.position.y = -framing.height * 0.35 * (1 - p);
    g.rotation.y = (1 - p) * 1.6;
    // Hidden while still a few percent of full size, so an outgoing model never lingers as a speck.
    g.visible = p > HIDE_BELOW;
    if (FACES_CAMERA[model] && g.parent) {
      g.rotation.y += -g.parent.rotation.y + 0.6 + Math.sin(state.clock.elapsedTime * 0.5) * SWAY;
    }
    if (!animate || !g.visible || period === 0) return;
    // 30 updates a second is enough for these motions and halves the React work per frame.
    if (state.clock.elapsedTime - lastUpdate.current < 1 / 30) return;
    lastUpdate.current = state.clock.elapsedTime;
    setT((state.clock.elapsedTime / period) % 1);
  });
  return (
    <group ref={group} scale={0.0001}>
      <DrawnModel model={model} t={t} />
    </group>
  );
}

/** Orthographic camera that eases its zoom and aim between models. */
function Rig({ framing, fit }: { framing: Framing; fit: number }) {
  const cam = useRef<THREE.OrthographicCamera>(null);
  const size = useThree((s) => s.size);
  const aim = useRef(new THREE.Vector3(0, framing.targetY, 0));
  useFrame((_, delta) => {
    const c = cam.current;
    if (!c) return;
    c.zoom = THREE.MathUtils.damp(c.zoom, fitZoom(size, fit, framing.height), 5, delta);
    aim.current.y = THREE.MathUtils.damp(aim.current.y, framing.targetY, 5, delta);
    c.lookAt(aim.current);
    c.updateProjectionMatrix();
  });
  return <OrthographicCamera ref={cam} makeDefault position={[240, 150, 300]} zoom={2} near={1} far={2000} />;
}

/** Models mount the first time they are shown and stay mounted after, so
 * the first paint builds one model, not four. */
function useShown(active: ModelKey): readonly ModelKey[] {
  const [shown, setShown] = useState<readonly ModelKey[]>([active]);
  if (!shown.includes(active)) setShown([...shown, active]);
  return shown;
}

/** True for a while after each model change, long enough for zoom and scale to settle. */
function useSettling(active: ModelKey): boolean {
  const [settledFor, setSettledFor] = useState<ModelKey | null>(null);
  useEffect(() => {
    const id = window.setTimeout(() => setSettledFor(active), SETTLE_MS);
    return () => window.clearTimeout(id);
  }, [active]);
  return settledFor !== active;
}

export interface HeroSceneProps {
  active: ModelKey;
  /** Seconds per loop for each model; 0 holds it still. */
  periods: Record<ModelKey, number>;
  reduced: boolean;
  fit?: number;
  className?: string;
}

/** One canvas, one turntable, every model shown so far mounted; only the active one is grown in. */
export function HeroScene({ active, periods, reduced, fit = 1, className }: HeroSceneProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const inView = useNearViewport(wrapper);
  const animate = inView && !reduced;
  const shown = useShown(active);
  const settling = useSettling(active);
  // With reduced motion nothing moves once a switch has settled, so the loop stops too.
  const frameloop = inView && (!reduced || settling) ? "always" : "demand";
  return (
    <div ref={wrapper} className={className} aria-hidden="true">
      <DraftingCanvas frameloop={frameloop} look="dither">
        <Rig framing={FRAMING[active]} fit={fit} />
        <Turntable animate={animate} kickOn={active}>
          {shown.map((m) => (
            <Slot key={m} model={m} active={m === active} period={periods[m]} animate={animate} framing={FRAMING[m]} />
          ))}
        </Turntable>
      </DraftingCanvas>
    </div>
  );
}
