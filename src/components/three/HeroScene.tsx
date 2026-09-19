"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrthographicCamera } from "@react-three/drei";
import * as THREE from "three";
import { NoToneMapping } from "three";
import { useInView } from "motion/react";
import type { ModelKey } from "@/content/models";
import { Balance } from "./Balance";
import { Glasses, GLASSES_SIZE } from "./Glasses";
import { Arm, ARM_SIZE } from "./Arm";
import { Board, BOARD_SIZE } from "./Board";
import { Lights } from "./BalanceScene";
import { NO_OBSERVER, keepContextRestorable } from "./drafting";

interface Framing {
  height: number;
  targetY: number;
}

const FRAMING: Record<ModelKey, Framing> = {
  balance: { height: 125, targetY: 50 },
  // Temples run 14 cm back and the panels 12 cm forward, so the turn needs slack on both sides.
  glasses: { height: GLASSES_SIZE.height * 1.35, targetY: GLASSES_SIZE.targetY + 1 },
  // The arm reaches 38 cm off its base, so it needs more room than its standing height.
  arm: { height: ARM_SIZE.height * 1.3, targetY: ARM_SIZE.targetY - 4 },
  // The board is 24 cm on its long side, wider than it is tall once tilted.
  board: { height: BOARD_SIZE.height * 1.6, targetY: BOARD_SIZE.targetY },
};

/* Where each model rests when motion is reduced: arm mid-carry, board with
 * the wave on the chip, glasses fully revealed. */
const STILL_PHASE: Record<ModelKey, number> = { balance: 0.15, glasses: 0.6, arm: 0.5, board: 0.5 };

/* A flat board seen edge-on is a line, so it faces the camera and sways
 * instead of taking the full turn. */
const FACES_CAMERA: Record<ModelKey, boolean> = { balance: false, glasses: false, arm: false, board: true };
const SWAY = 0.35;
const SETTLE_MS = 2200;
/* Extra turn, in radians per second, added at the moment of a switch; it decays over about a second. */
const KICK = 2.4;

function Model({ model, t }: { model: ModelKey; t: number }) {
  switch (model) {
    case "balance":
      return <Balance stride={0.15} />;
    case "glasses":
      return <Glasses t={t} />;
    case "arm":
      return <Arm t={t} />;
    case "board":
      return <Board t={t} />;
  }
}

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
    g.visible = p > 0.004;
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
      <Model model={model} t={t} />
    </group>
  );
}

/** Slow turn with a pointer lean, plus a kick of extra spin whenever the model changes. */
function Turntable({ animate, active, children }: { animate: boolean; active: ModelKey; children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const kick = useRef(0);
  const lastActive = useRef(active);
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (lastActive.current !== active) {
      lastActive.current = active;
      kick.current = KICK;
    }
    kick.current = THREE.MathUtils.damp(kick.current, 0, 3, delta);
    g.rotation.y += delta * kick.current;
    if (!animate) return;
    g.rotation.y += delta * 0.18;
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, state.pointer.x * 0.08, 4, delta);
  });
  return (
    <group ref={group} rotation={[0, 0.6, 0]}>
      {children}
      <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={140} blur={2.4} far={40} color="#1d1a16" />
    </group>
  );
}

/** In demand mode nothing redraws on its own, so a resize asks for one frame. */
function RedrawOnResize() {
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => invalidate(), [size.width, size.height, invalidate]);
  return null;
}

/** Orthographic camera that eases its zoom and aim between models. */
function Rig({ framing, fit }: { framing: Framing; fit: number }) {
  const cam = useRef<THREE.OrthographicCamera>(null);
  const size = useThree((s) => s.size);
  const aim = useRef(new THREE.Vector3(0, framing.targetY, 0));
  useFrame((_, delta) => {
    const c = cam.current;
    if (!c) return;
    const zoom = Math.max((Math.min(size.width, size.height * 0.85) * fit) / framing.height, 0.01);
    c.zoom = THREE.MathUtils.damp(c.zoom, zoom, 5, delta);
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

export interface HeroSceneProps {
  active: ModelKey;
  periods: Record<ModelKey, number>;
  reduced: boolean;
  fit?: number;
  className?: string;
}

/** One canvas, one turntable, all four models mounted; only the active one is grown in. */
/** True for a while after each model change, long enough for zoom and scale to settle. */
function useSettling(active: ModelKey): boolean {
  const [settledFor, setSettledFor] = useState<ModelKey | null>(null);
  useEffect(() => {
    const id = window.setTimeout(() => setSettledFor(active), SETTLE_MS);
    return () => window.clearTimeout(id);
  }, [active]);
  return settledFor !== active;
}

export function HeroScene({ active, periods, reduced, fit = 1, className }: HeroSceneProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapper, { margin: "80px" }) || NO_OBSERVER;
  const animate = inView && !reduced;
  const shown = useShown(active);
  const settling = useSettling(active);
  // With reduced motion nothing moves once a switch has settled, so the loop stops too.
  const frameloop = inView && (!reduced || settling) ? "always" : "demand";
  return (
    <div ref={wrapper} className={className} aria-hidden="true">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, toneMapping: NoToneMapping }}
        frameloop={frameloop}
        fallback={null}
        onCreated={({ gl, invalidate }) => keepContextRestorable(gl, invalidate)}
      >
        <RedrawOnResize />
        <Rig framing={FRAMING[active]} fit={fit} />
        <Lights />
        <Turntable animate={animate} active={active}>
          {shown.map((m) => (
            <Slot key={m} model={m} active={m === active} period={periods[m]} animate={animate} framing={FRAMING[m]} />
          ))}
        </Turntable>
      </Canvas>
    </div>
  );
}
