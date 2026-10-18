"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { palette } from "@/lib/palette";
import { Print, type Look } from "./effects";

/* Everything the hero and the thumbnail scenes share: the canvas set-up,
 * the studio light, the floor shadows, the turntable and the zoom arithmetic. */

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

/* Neutral tone mapping keeps the base colours true, the way a product shot is graded. */
const GL = { antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping, toneMappingExposure: 1 } as const;

/* The paper colour, dimmed, so shaded sides pick up a warm bounce instead of going grey. */
const STUDIO_WALLS = new THREE.Color(palette.paper).multiplyScalar(0.32);

/* A studio built from light cards, so nothing is fetched: a broad softbox
 * overhead, a tall key card left of the camera, a rim card behind and a low
 * fill in front, inside walls the colour of the page for the bounce. */
function Studio() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={[STUDIO_WALLS]} />
      <Lightformer form="rect" intensity={2.4} position={[0, 8, 0]} rotation-x={Math.PI / 2} scale={[14, 14, 1]} />
      <Lightformer form="rect" intensity={3.2} position={[-6, 3, 5]} scale={[3, 9, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={1.8} position={[7, 4, -6]} scale={[4, 8, 1]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={0.9} position={[5, 0.5, 7]} scale={[8, 2, 1]} target={[0, 0, 0]} />
    </Environment>
  );
}

/** The key light, high and to the left, the only light that casts a shadow. */
function KeyLight() {
  return (
    <directionalLight
      position={[-35, 300, 50]}
      intensity={1.5}
      castShadow
      shadow-mapSize={[1024, 1024]}
      shadow-radius={5}
      shadow-bias={-0.0004}
      shadow-normalBias={0.1}
    >
      <orthographicCamera attach="shadow-camera" args={[-90, 90, 90, -90, 10, 700]} />
    </directionalLight>
  );
}

/** The floor shows only shadows: a tight contact shadow where things touch
 * and, unless `cast` is off, the key light's shadow, faint. */
function Floor({ cast }: { cast: boolean }) {
  return (
    <group>
      {cast && (
        <mesh rotation-x={-Math.PI / 2} position-y={-0.05} receiveShadow>
          <planeGeometry args={[400, 400]} />
          <shadowMaterial opacity={0.13} color={palette.ink} transparent depthWrite={false} />
        </mesh>
      )}
      <ContactShadows position={[0, 0.05, 0]} opacity={0.55} scale={160} resolution={1024} blur={1.6} far={6} color={palette.ink} />
    </group>
  );
}

/** Every mesh casts and takes shadows, except see-through ones like lenses and projected windows. */
export function useShadowFlags(root: RefObject<THREE.Object3D | null>): void {
  useLayoutEffect(() => {
    root.current?.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      const clear = (o.material as THREE.Material).transparent;
      o.castShadow = !clear;
      o.receiveShadow = !clear;
    });
  });
}

interface DraftingCanvasProps {
  frameloop: "always" | "demand";
  /** How the render is printed onto the page. */
  look: Look;
  children: ReactNode;
}

/** A transparent canvas with the shared light; the caller supplies the camera and the models. */
export function DraftingCanvas({ frameloop, look, children }: DraftingCanvasProps) {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 2]}
      gl={GL}
      frameloop={frameloop}
      fallback={null}
      onCreated={keepContextRestorable}
    >
      <RedrawOnResize />
      <Print look={look} />
      <Studio />
      <KeyLight />
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
  /** Show the key light's shadow on the floor; orthographic drawings leave it off. */
  castShadow?: boolean;
  children: ReactNode;
}

/** Slow turn with a pointer lean, over a floor that shows the shadows. */
export function Turntable({ animate, spin = 0.6, kickOn, castShadow = true, children }: TurntableProps) {
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
      <Floor cast={castShadow} />
    </group>
  );
}
