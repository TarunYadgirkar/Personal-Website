"use client";

import { useLayoutEffect, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { palette } from "@/lib/palette";
import { FINISH, goldMaterial, metalMaterial, rubberMaterial } from "./drafting";

/* The parts of the FPGA board that do not move: soldermask, silkscreen,
 * copper, connectors and the scatter of passives. Centimetres, on the board's
 * own frame with the top copper at y = TOP. */

export const TOP = 0.08;
export const BOARD_W = 24;
export const BOARD_D = 16;

const soldermask = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(FINISH.soldermask),
  roughness: 0.6,
  clearcoat: 0.5,
  clearcoatRoughness: 0.32,
});

/** Copper under the mask reads as a slightly lighter green. */
const copperUnderMask = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(FINISH.trace),
  roughness: 0.5,
  clearcoat: 0.5,
  clearcoatRoughness: 0.32,
});

const silkscreen = new THREE.MeshStandardMaterial({ color: new THREE.Color(FINISH.silkscreen), roughness: 0.8 });

/** Black epoxy chip packages and plastic housings. */
export const epoxyMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(FINISH.epoxy),
  roughness: 0.55,
  clearcoat: 0.3,
  clearcoatRoughness: 0.5,
});

const ceramic = new THREE.MeshStandardMaterial({ color: new THREE.Color(FINISH.ceramic), roughness: 0.6 });

export const HOLES: ReadonlyArray<readonly [number, number]> = [
  [-10.8, -6.8],
  [10.8, -6.8],
  [-10.8, 6.8],
  [10.8, 6.8],
];

export function Pcb() {
  return (
    <group>
      <RoundedBox args={[BOARD_W, 0.16, BOARD_D]} radius={0.07} smoothness={2} material={soldermask} />
      {HOLES.map(([x, z]) => (
        <group key={`${x}:${z}`} position={[x, 0, z]}>
          <mesh material={goldMaterial}>
            <cylinderGeometry args={[0.5, 0.5, 0.18, 32]} />
          </mesh>
          <mesh material={epoxyMaterial}>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 24]} />
          </mesh>
          <mesh position={[0, -0.5, 0]} material={rubberMaterial}>
            <cylinderGeometry args={[0.55, 0.55, 0.9, 20]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

type Rect = readonly [x: number, z: number, w: number, d: number];

/** Thin silkscreen outlines: the board edge and a box around each major part. */
const OUTLINES: readonly Rect[] = [
  [0, 0, BOARD_W - 1, BOARD_D - 1],
  [-3.5, 0, 6.8, 6.8],
  [4.3, 0, 3.6, 3.8],
  [0, -6.75, 10.8, 1.5],
];
const SILK_W = 0.06;

function Outline({ rect }: { rect: Rect }) {
  const [x, z, w, d] = rect;
  const bars: ReadonlyArray<readonly [number, number, number, number]> = [
    [x, z - d / 2, w, SILK_W],
    [x, z + d / 2, w, SILK_W],
    [x - w / 2, z, SILK_W, d],
    [x + w / 2, z, SILK_W, d],
  ];
  return (
    <group>
      {bars.map(([bx, bz, bw, bd]) => (
        <mesh key={`${bx}:${bz}`} position={[bx, TOP + 0.005, bz]} material={silkscreen}>
          <boxGeometry args={[bw, 0.01, bd]} />
        </mesh>
      ))}
    </group>
  );
}

/** Rows of short silkscreen marks standing in for reference designators. */
const LABELS: ReadonlyArray<readonly [number, number, number]> = [
  [-7.6, 1.7, 0.9],
  [-3.1, 1.7, 0.9],
  [-3.5, -3.9, 1.6],
  [4.3, -2.3, 1.2],
  [8.5, -5.4, 2.2],
  [-10.6, 1.9, 0.8],
];

export function Silkscreen() {
  return (
    <group>
      {OUTLINES.map((r) => (
        <Outline key={`${r[0]}:${r[1]}`} rect={r} />
      ))}
      {LABELS.map(([x, z, w]) => (
        <mesh key={`${x}:${z}`} position={[x, TOP + 0.005, z]} material={silkscreen}>
          <boxGeometry args={[w, 0.01, 0.14]} />
        </mesh>
      ))}
    </group>
  );
}

const TRACE_Y = TOP + 0.004;
/** Copper runs as [x, z, w, d]: the two radio paths and the memory bus. */
const TRACES: readonly Rect[] = [
  [-7.5, 5, 0.12, 4],
  [-6.25, 3, 2.5, 0.12],
  [-2.5, 6, 1, 0.12],
  [-2, 4.5, 0.12, 3],
  ...Array.from({ length: 8 }, (_, i): Rect => [1.1, -1.05 + i * 0.3, 2.2, 0.08]),
];

export function Traces() {
  return (
    <group>
      {TRACES.map(([x, z, w, d]) => (
        <mesh key={`${x}:${z}:${w}`} position={[x, TRACE_Y, z]} material={copperUnderMask}>
          <boxGeometry args={[w, 0.01, d]} />
        </mesh>
      ))}
    </group>
  );
}

/** One instanced mesh for many identical small parts at the given positions. */
function Scatter({ positions, material, size }: { positions: ReadonlyArray<readonly [number, number, number]>; material: THREE.Material; size: [number, number, number] }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    positions.forEach(([x, y, z], i) => mesh.setMatrixAt(i, m.makeTranslation(x, y, z)));
    mesh.instanceMatrix.needsUpdate = true;
  }, [positions]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, positions.length]} material={material}>
      <boxGeometry args={size} />
    </instancedMesh>
  );
}

const HEADER_COLS = 20;
const HEADER_PINS = Array.from({ length: HEADER_COLS * 2 }, (_, i) => [-4.75 + (i % HEADER_COLS) * 0.5, TOP + 0.55, -7 + Math.floor(i / HEADER_COLS) * 0.5] as const);

export function PinHeader() {
  return (
    <group>
      <mesh position={[0, TOP + 0.13, -6.75]} material={epoxyMaterial}>
        <boxGeometry args={[10.1, 0.25, 1]} />
      </mesh>
      <Scatter positions={HEADER_PINS} material={goldMaterial} size={[0.07, 0.6, 0.07]} />
    </group>
  );
}

/* Decoupling capacitors in a ring around the FPGA and a few rows near the
 * memory and the power input, placed by a fixed rule so every render matches. */
const PASSIVES = [
  ...Array.from({ length: 24 }, (_, i) => {
    const side = Math.floor(i / 6);
    const k = (i % 6) - 2.5;
    const ring: ReadonlyArray<readonly [number, number]> = [
      [-3.5 + k * 0.9, 3.75],
      [-3.5 + k * 0.9, -3.75],
      [-7.25, k * 0.9],
      [0.25, k * 0.9],
    ];
    return [ring[side][0], TOP + 0.05, ring[side][1]] as const;
  }),
  ...Array.from({ length: 12 }, (_, i) => [2.4 + (i % 6) * 0.7, TOP + 0.05, i < 6 ? 2.6 : -2.6] as const),
  ...Array.from({ length: 8 }, (_, i) => [-9.6 + (i % 4) * 0.6, TOP + 0.05, i < 4 ? 4.6 : 5.4] as const),
];

export function Passives() {
  return <Scatter positions={PASSIVES} material={ceramic} size={[0.22, 0.1, 0.12]} />;
}

/** Radio in and out. The samples enter the board here. */
export function SmaConnectors() {
  return (
    <group>
      {[-7.5, -3].map((x) => (
        <group key={x} position={[x, TOP, 6.9]}>
          <mesh position={[0, 0.1, -0.3]} material={goldMaterial}>
            <boxGeometry args={[1.3, 0.2, 1.3]} />
          </mesh>
          <mesh position={[0, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]} material={goldMaterial}>
            <cylinderGeometry args={[0.42, 0.42, 1.6, 32]} />
          </mesh>
          <mesh position={[0, 0.55, -0.1]} rotation={[Math.PI / 2, 0, 0]} material={goldMaterial}>
            <cylinderGeometry args={[0.66, 0.66, 0.4, 6]} />
          </mesh>
          <mesh position={[0, 0.55, 0.8]} rotation={[Math.PI / 2, 0, 0]} material={epoxyMaterial}>
            <cylinderGeometry args={[0.28, 0.28, 0.02, 24]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const STATUS_X = [5.4, 6.2, 7, 7.8];

const ledMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(FINISH.ledOff),
  emissive: new THREE.Color(palette.rust),
  emissiveIntensity: 1.2,
  roughness: 0.3,
});

/** Barrel jack and USB on the left edge, the power LED, and the four status LEDs. */
export function PowerAndLeds() {
  return (
    <group>
      <RoundedBox args={[1.6, 1.1, 1]} radius={0.08} smoothness={2} position={[-11.2, TOP + 0.55, -3]} material={epoxyMaterial} />
      <mesh position={[-11.95, TOP + 0.6, -3]} rotation={[0, 0, Math.PI / 2]} material={metalMaterial}>
        <cylinderGeometry args={[0.28, 0.28, 0.1, 24]} />
      </mesh>
      <RoundedBox args={[1, 0.35, 0.8]} radius={0.04} smoothness={2} position={[-11.4, TOP + 0.18, 3]} material={metalMaterial} />
      <mesh position={[-10.2, TOP + 0.06, 3]} material={ledMaterial}>
        <boxGeometry args={[0.3, 0.12, 0.18]} />
      </mesh>
      {STATUS_X.map((x) => (
        <mesh key={x} position={[x, TOP + 0.06, -5.4]} material={ledMaterial}>
          <boxGeometry args={[0.3, 0.12, 0.18]} />
        </mesh>
      ))}
    </group>
  );
}

/** Two DDR packages with their leads down both long sides. */
export function Memory() {
  return (
    <group>
      {[3.2, 5.4].map((x) => (
        <group key={x} position={[x, TOP, 0]}>
          <RoundedBox args={[1.2, 0.2, 3]} radius={0.04} smoothness={2} position={[0, 0.12, 0]} material={epoxyMaterial} />
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.68, 0.03, 0]} material={metalMaterial}>
              <boxGeometry args={[0.16, 0.05, 2.7]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}
