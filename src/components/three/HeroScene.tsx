"use client";

import { useRef, useState } from "react";
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

/** One model on the turntable, growing in from the ground when it becomes
 * active and shrinking away when it stops being active. Hidden models skip
 * their own motion and are culled once they are small enough. */
function Slot({ model, active, period, animate }: { model: ModelKey; active: boolean; period: number; animate: boolean }) {
  const group = useRef<THREE.Group>(null);
  const [t, setT] = useState(STILL_PHASE[model]);
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const s = THREE.MathUtils.damp(g.scale.x, active ? 1 : 0, 7, delta);
    g.scale.setScalar(s);
    g.visible = s > 0.005;
    if (!animate || !g.visible) return;
    const next = (state.clock.elapsedTime / period) % 1;
    if (Math.abs(next - t) > 1 / 120) setT(next);
  });
  return (
    <group ref={group} scale={0}>
      <Model model={model} t={t} />
    </group>
  );
}

function Turntable({ animate, children }: { animate: boolean; children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    const g = group.current;
    if (!g || !animate) return;
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

/** Orthographic camera that eases its zoom and aim between models. */
function Rig({ framing, fit }: { framing: Framing; fit: number }) {
  const cam = useRef<THREE.OrthographicCamera>(null);
  const size = useThree((s) => s.size);
  const aim = useRef(new THREE.Vector3(0, framing.targetY, 0));
  useFrame((_, delta) => {
    const c = cam.current;
    if (!c) return;
    const zoom = (Math.min(size.width, size.height * 0.85) * fit) / framing.height;
    c.zoom = THREE.MathUtils.damp(c.zoom, zoom, 5, delta);
    aim.current.y = THREE.MathUtils.damp(aim.current.y, framing.targetY, 5, delta);
    c.lookAt(aim.current);
    c.updateProjectionMatrix();
  });
  return <OrthographicCamera ref={cam} makeDefault position={[240, 150, 300]} zoom={2} near={1} far={2000} />;
}

const MODELS: readonly ModelKey[] = ["balance", "glasses", "arm", "board"];

export interface HeroSceneProps {
  active: ModelKey;
  periods: Record<ModelKey, number>;
  reduced: boolean;
  fit?: number;
  className?: string;
}

/** One canvas, one turntable, all four models mounted; only the active one is grown in. */
export function HeroScene({ active, periods, reduced, fit = 1, className }: HeroSceneProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapper, { margin: "80px" });
  const animate = inView && !reduced;
  return (
    <div ref={wrapper} className={className} aria-hidden="true">
      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true, toneMapping: NoToneMapping }} frameloop={inView ? "always" : "never"}>
        <Rig framing={FRAMING[active]} fit={fit} />
        <Lights />
        <Turntable animate={animate}>
          {MODELS.map((m) => (
            <Slot key={m} model={m} active={m === active} period={periods[m]} animate={animate} />
          ))}
        </Turntable>
      </Canvas>
    </div>
  );
}
