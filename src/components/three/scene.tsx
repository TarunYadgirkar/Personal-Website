"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { NoToneMapping } from "three";
import { palette } from "@/lib/palette";

/* Everything the hero and the thumbnail scenes share: the canvas set-up,
 * the light, the floor shadow, the turntable and the zoom arithmetic. */

/** Zoom in pixels per centimetre so a framing `height` fills `fit` of the canvas's shorter side. */
export function fitZoom(size: { width: number; height: number }, fit: number, height: number): number {
  // A 0x0 first measurement would make the projection degenerate; hold a sane floor.
  return Math.max((Math.min(size.width, size.height * 0.85) * fit) / height, 0.01);
}

/** Lets the browser restore a lost WebGL context, then asks for a frame so the canvas is not left blank. */
function keepContextRestorable({ gl, invalidate }: RootState): void {
  gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault(), false);
  gl.domElement.addEventListener("webglcontextrestored", () => invalidate(), false);
}

/** In demand mode nothing redraws on its own, so a resize asks for one frame. */
function RedrawOnResize() {
  const size = useThree((s) => s.size);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => invalidate(), [size.width, size.height, invalidate]);
  return null;
}

function Lights() {
  return (
    <>
      <hemisphereLight args={["#ffffff", palette.line, 1.4]} />
      <directionalLight position={[120, 220, 160]} intensity={1.3} color="#fff8ec" castShadow shadow-mapSize={[1024, 1024]} />
    </>
  );
}

/** A transparent canvas with the shared light; the caller supplies the camera and the models. */
export function DraftingCanvas({ frameloop, children }: { frameloop: "always" | "demand"; children: ReactNode }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, toneMapping: NoToneMapping }}
      frameloop={frameloop}
      fallback={null}
      onCreated={keepContextRestorable}
    >
      <RedrawOnResize />
      <Lights />
      {children}
    </Canvas>
  );
}

/* Extra turn, in radians per second, added at the moment `kickOn` changes; it decays over about a second. */
const KICK = 2.4;

interface TurntableProps {
  /** Turn slowly and lean toward the pointer. */
  animate: boolean;
  /** Starting angle about y. */
  spin?: number;
  /** A change in this value gives the turntable a kick of extra spin. */
  kickOn?: string;
  children: ReactNode;
}

/** Slow turn with a pointer lean and a soft floor shadow. */
export function Turntable({ animate, spin = 0.6, kickOn, children }: TurntableProps) {
  const group = useRef<THREE.Group>(null);
  const kick = useRef(0);
  const lastKickOn = useRef(kickOn);
  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    if (lastKickOn.current !== kickOn) {
      lastKickOn.current = kickOn;
      kick.current = KICK;
    }
    kick.current = THREE.MathUtils.damp(kick.current, 0, 3, delta);
    g.rotation.y += delta * kick.current;
    if (!animate) return;
    g.rotation.y += delta * 0.18;
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, state.pointer.x * 0.08, 4, delta);
  });
  return (
    <group ref={group} rotation={[0, spin, 0]}>
      {children}
      <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={140} blur={2.4} far={40} color={palette.ink} />
    </group>
  );
}
