"use client";

import { useEffect, useMemo } from "react";
import { Edges, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { INK, boneMaterial, glassMaterial, inkMaterial, rubberMaterial, rustMaterial, shadeMaterial } from "./drafting";

/* VANTAGE, in centimeters. y is up, the front of the glasses faces +z. They
 * are set down on a table at y = 0, resting on the bottom of the lens rims
 * and on the ear tips, with the temples running back toward -z.
 *
 * `t` is a looping phase in [0, 1). Three AR panels project out of the
 * lenses into the room in front, hold, and retract. */

export const GLASSES_SIZE = { height: 30, targetY: 11 } as const;

const lensMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#e8e2d4"),
  transmission: 0.6,
  roughness: 0.1,
  transparent: true,
  opacity: 0.55,
});

const panelMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#faf8f3"),
  transparent: true,
  opacity: 0.92,
  side: THREE.DoubleSide,
});

const LENS_HW = 2.8;
const LENS_HH = 2.2;
const LENS_X = 3.7;
/** Rim bottom plus the tube radius, so the rims sit on the table. */
const LENS_Y = 2.55;
const RIM_R = 0.35;
const BRIDGE_Y = LENS_Y + 1.2;
const TEMPLE_X = 6.4;
const TEMPLE_Y = LENS_Y + 1.2;
const TEMPLE_PITCH = -0.245;
const SIDES: Array<1 | -1> = [1, -1];
/** The wearer faces +z, so their right hand is toward -x. */
const RIGHT = -1;
const FORWARD = new THREE.Vector3(0, 0, 1);

/** The wraparound: the frame falls away in z the further out it runs. */
function wrapZ(x: number): number {
  return -0.035 * x * x;
}

/** A rounded rectangle drawn as a superellipse, bowed into the wrap. */
function rimPoints(cx: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const n = 48;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const x = cx + LENS_HW * Math.sign(c) * Math.sqrt(Math.abs(c));
    const y = LENS_Y + LENS_HH * Math.sign(s) * Math.sqrt(Math.abs(s));
    pts.push(new THREE.Vector3(x, y, wrapZ(x)));
  }
  return pts;
}

/** Ink outline. Flat parts show every crease; round parts only their rims. */
function Outline({ round = false }: { round?: boolean }) {
  return <Edges threshold={round ? 60 : 24} color={INK} lineWidth={1} />;
}

function Rims() {
  const geoms = useMemo(
    () =>
      SIDES.map((s) => {
        const curve = new THREE.CatmullRomCurve3(rimPoints(s * LENS_X), true, "catmullrom", 0.5);
        return new THREE.TubeGeometry(curve, 140, RIM_R, 10, true);
      }),
    [],
  );
  useEffect(() => () => geoms.forEach((g) => g.dispose()), [geoms]);
  return (
    <group>
      {SIDES.map((s, i) => (
        <mesh key={s} geometry={geoms[i]} material={boneMaterial} castShadow />
      ))}
    </group>
  );
}

function Lenses() {
  const geometry = useMemo(() => {
    const flat = rimPoints(0).map((p) => new THREE.Vector2(p.x, p.y - LENS_Y));
    return new THREE.ExtrudeGeometry(new THREE.Shape(flat), { depth: 0.12, bevelEnabled: false });
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <group>
      {SIDES.map((s) => (
        <mesh
          key={s}
          geometry={geometry}
          material={lensMaterial}
          position={[s * LENS_X, LENS_Y, wrapZ(LENS_X) - 0.06]}
          rotation={[0, s * 0.25, 0]}
        >
          <Outline round />
        </mesh>
      ))}
    </group>
  );
}

/** Bridge, the LiDAR puck centred on it, and the two hand-watching cameras. */
function Bridge() {
  return (
    <group>
      <RoundedBox args={[1.8, 0.8, 0.7]} radius={0.3} position={[0, BRIDGE_Y, wrapZ(0.9)]} material={boneMaterial}>
        <Outline />
      </RoundedBox>
      <mesh position={[0, BRIDGE_Y, 0.4]} rotation={[Math.PI / 2, 0, 0]} material={inkMaterial}>
        <cylinderGeometry args={[0.34, 0.34, 0.6, 24]} />
        <Outline round />
      </mesh>
      <mesh position={[0, BRIDGE_Y, 0.72]} rotation={[Math.PI / 2, 0, 0]} material={rustMaterial}>
        <cylinderGeometry args={[0.36, 0.36, 0.12, 24]} />
      </mesh>
      {SIDES.map((s) => (
        <group key={s} position={[s * 1.6, LENS_Y - 1.55, wrapZ(1.6) + 0.26]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={inkMaterial}>
            <cylinderGeometry args={[0.38, 0.38, 0.34, 18]} />
            <Outline round />
          </mesh>
          <mesh position={[0, 0, 0.12]} rotation={[Math.PI / 2, 0, 0]} material={glassMaterial}>
            <cylinderGeometry args={[0.26, 0.26, 0.3, 18]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/** Slider strip, fingerprint pad, and the status LED on the inner face. */
function TempleControls({ side }: { side: 1 | -1 }) {
  const outer = side * 0.5;
  return (
    <group>
      <RoundedBox args={[0.14, 0.42, 2.6]} radius={0.06} position={[outer, 0.3, -3.4]} material={shadeMaterial}>
        <Outline />
      </RoundedBox>
      <mesh position={[outer + side * 0.04, 0.3, -2.7]} material={rustMaterial}>
        <boxGeometry args={[0.16, 0.34, 0.5]} />
      </mesh>
      <RoundedBox args={[0.14, 0.9, 0.9]} radius={0.2} position={[outer, -0.15, -6.4]} material={inkMaterial}>
        <Outline />
      </RoundedBox>
      <mesh position={[-outer, 0.45, -1.5]} material={rustMaterial}>
        <boxGeometry args={[0.1, 0.22, 0.22]} />
      </mesh>
    </group>
  );
}

/** One temple: hinge, the electronics housing, a taper, and a rubber ear tip. */
function Temple({ side }: { side: 1 | -1 }) {
  return (
    <group position={[side * TEMPLE_X, TEMPLE_Y, wrapZ(TEMPLE_X)]} rotation={[TEMPLE_PITCH, -side * 0.04, 0]}>
      <mesh material={inkMaterial}>
        <cylinderGeometry args={[0.36, 0.36, 1.9, 18]} />
        <Outline round />
      </mesh>
      <RoundedBox args={[0.95, 1.9, 5.4]} radius={0.4} position={[0, 0, -3]} material={boneMaterial} castShadow>
        <Outline />
      </RoundedBox>
      <RoundedBox args={[0.75, 1.45, 5]} radius={0.32} position={[0, -0.12, -8.2]} material={boneMaterial} castShadow>
        <Outline />
      </RoundedBox>
      <RoundedBox args={[0.6, 1.02, 3.2]} radius={0.24} position={[0, -0.24, -12.1]} material={shadeMaterial}>
        <Outline />
      </RoundedBox>
      <RoundedBox args={[0.66, 1.06, 2.6]} radius={0.3} position={[0, -0.26, -13.2]} material={rubberMaterial}>
        <Outline />
      </RoundedBox>
      {side === RIGHT && <TempleControls side={side} />}
    </group>
  );
}

interface PanelSpec {
  id: string;
  w: number;
  h: number;
  lines: number;
  rest: readonly [number, number, number];
  from: readonly [number, number, number];
  appear: readonly [number, number];
}

const PANELS: readonly PanelSpec[] = [
  { id: "wide", w: 11, h: 6, lines: 3, rest: [0, 9.5, 12], from: [0, LENS_Y, 0.4], appear: [0.05, 0.3] },
  { id: "tall", w: 5, h: 7, lines: 3, rest: [-8.6, 13.5, 9], from: [-LENS_X, LENS_Y, 0.4], appear: [0.15, 0.4] },
  { id: "card", w: 4, h: 3, lines: 2, rest: [8, 14.5, 7], from: [LENS_X, LENS_Y, 0.4], appear: [0.25, 0.45] },
];

const LINE_SHARE = [0.9, 0.62, 0.74];

/** Out over the panel's own window, held, then retracted with the others. */
function reveal(t: number, appear: readonly [number, number]): number {
  const out = THREE.MathUtils.smoothstep(t, appear[0], appear[1]);
  return out * (1 - THREE.MathUtils.smoothstep(t, 0.8, 0.95));
}

function PanelFace({ w, h, lines }: { w: number; h: number; lines: number }) {
  const barY = h / 2 - 0.35;
  return (
    <group>
      <mesh material={panelMaterial}>
        <boxGeometry args={[w, h, 0.06]} />
        <Outline />
      </mesh>
      <mesh position={[0, barY, 0.05]} material={rustMaterial}>
        <boxGeometry args={[w - 0.6, 0.5, 0.04]} />
      </mesh>
      {Array.from({ length: lines }, (_, i) => {
        const width = (w - 0.8) * LINE_SHARE[i % LINE_SHARE.length];
        return (
          <mesh key={i} position={[-w / 2 + 0.4 + width / 2, barY - 1.15 - i * 0.8, 0.05]} material={shadeMaterial}>
            <boxGeometry args={[width, 0.26, 0.04]} />
          </mesh>
        );
      })}
    </group>
  );
}

function ArPanel({ spec, t }: { spec: PanelSpec; t: number }) {
  const eased = reveal(t, spec.appear);
  if (eased <= 0.002) return null;
  const pos = new THREE.Vector3(...spec.from).lerp(new THREE.Vector3(...spec.rest), eased);
  // Panels face the wearer's eyeline, toed in slightly toward the centre.
  const toe = -0.18 * Math.sign(spec.rest[0]);
  return (
    <group position={pos} rotation={[0, toe, 0]} scale={eased}>
      <PanelFace w={spec.w} h={spec.h} lines={spec.lines} />
    </group>
  );
}

function Guide({ from, to }: { from: THREE.Vector3; to: THREE.Vector3 }) {
  const dir = to.clone().sub(from);
  const len = dir.length();
  const quat = new THREE.Quaternion().setFromUnitVectors(FORWARD, dir.normalize());
  return (
    <mesh position={from.clone().lerp(to, 0.5)} quaternion={quat} scale={[1, 1, len]} material={shadeMaterial}>
      <boxGeometry args={[0.08, 0.08, 1]} />
    </mesh>
  );
}

const CORNERS: ReadonlyArray<readonly [number, number]> = [
  [-1, 1],
  [-1, -1],
  [1, 1],
  [1, -1],
];

/** Faint beams from each lens to the corners of the wide panel. */
function ProjectionGuides({ t }: { t: number }) {
  const spec = PANELS[0];
  const eased = reveal(t, spec.appear);
  if (eased <= 0.02) return null;
  const centre = new THREE.Vector3(...spec.from).lerp(new THREE.Vector3(...spec.rest), eased);
  return (
    <group>
      {CORNERS.map(([sx, sy]) => {
        const lens = new THREE.Vector3(sx * LENS_X, LENS_Y, 0.2);
        const corner = centre.clone().add(new THREE.Vector3((sx * spec.w) / 2, (sy * spec.h) / 2, 0).multiplyScalar(eased));
        return <Guide key={`${sx}${sy}`} from={lens} to={corner} />;
      })}
    </group>
  );
}

export function Glasses({ t }: { t: number }) {
  return (
    <group>
      <Rims />
      <Lenses />
      <Bridge />
      {SIDES.map((s) => (
        <Temple key={s} side={s} />
      ))}
      {PANELS.map((spec) => (
        <ArPanel key={spec.id} spec={spec} t={t} />
      ))}
      <ProjectionGuides t={t} />
    </group>
  );
}
