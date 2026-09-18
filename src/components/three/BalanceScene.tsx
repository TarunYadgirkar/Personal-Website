"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, OrthographicCamera } from "@react-three/drei";
import { NoToneMapping } from "three";
import * as THREE from "three";
import { useInView, useReducedMotion } from "motion/react";
import { Balance, HIP_Y } from "./Balance";

export type View = "turn" | "front" | "side" | "top";

const VIEWS: Record<Exclude<View, "turn">, { position: [number, number, number]; up: [number, number, number] }> = {
  front: { position: [0, 50, 400], up: [0, 1, 0] },
  side: { position: [400, 50, 0], up: [0, 1, 0] },
  top: { position: [0, 400, 0.01], up: [0, 0, -1] },
};

const TARGET = new THREE.Vector3(0, 50, 0);

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

/** Zoom in pixels per centimeter, from the prop or from the canvas size. The
 * device is about 125 cm tall on the turntable, so `fit` is the share of the
 * shorter canvas side it should fill. */
function useZoom(zoom: number | undefined, fit: number): number {
  const size = useThree((s) => s.size);
  if (zoom) return zoom;
  return (Math.min(size.width, size.height * 0.85) * fit) / 125;
}

function Camera({ view, zoom: zoomProp, fit }: { view: View; zoom?: number; fit: number }) {
  const zoom = useZoom(zoomProp, fit);
  if (view === "turn") {
    return <OrthographicCamera makeDefault position={[240, 150, 300]} zoom={zoom} near={1} far={2000} onUpdate={(c) => c.lookAt(TARGET)} />;
  }
  const v = VIEWS[view];
  return <OrthographicCamera makeDefault position={v.position} up={v.up} zoom={zoom} near={1} far={2000} onUpdate={(c) => c.lookAt(TARGET)} />;
}

export interface BalanceSceneProps {
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
export function BalanceScene({ view = "turn", stride = 0.15, zoom, fit = 0.9, className }: BalanceSceneProps) {
  const wrapper = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapper, { margin: "80px" });
  const reduced = useReducedMotion() ?? false;
  const animate = view === "turn" && inView && !reduced;
  return (
    <div ref={wrapper} className={className} aria-hidden="true">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, toneMapping: NoToneMapping }}
        frameloop={inView ? "always" : "never"}
      >
        <Camera view={view} zoom={zoom} fit={fit} />
        <Lights />
        <Turntable animate={animate} spin={view === "turn" ? 0.6 : 0}>
          <Balance stride={stride} />
        </Turntable>
      </Canvas>
    </div>
  );
}

export { HIP_Y };
