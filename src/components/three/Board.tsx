"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Edges, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { INK, boneMaterial, inkMaterial, rubberMaterial, rustMaterial, shadeMaterial } from "./drafting";

/* The FPGA development board, in centimeters. y is up, the board lies on the
 * ground plane and tips up toward the viewer so the turntable camera sees the
 * top face. Samples arrive on the SMA connectors at the front, cross the
 * copper to the fabric, sweep the DSP tiles column by column, and leave on the
 * right toward the DDR chips.
 *
 * `t` is a looping phase in [0, 1) shared with the 2D pipeline diagram. */

export const BOARD_SIZE = { height: 22, targetY: 6 } as const;

const TILT = 0.44;
const BOARD_Y = 4.6;
const TOP = 0.08;

const FPGA_X = -3.5;
const FPGA_HALF = 3;
const TILE_COLS = 8;
const TILE_ROWS = 4;
const TILE_STEP = 0.55;
const TILE_Y = TOP + 0.46;

const HEADER_COLS = 20;
const HEADER_PINS = HEADER_COLS * 2;

const pcbMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#d9d2c3"),
  roughness: 0.9,
  metalness: 0,
});

const tileMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#c5400a"),
  emissive: new THREE.Color("#c5400a"),
  emissiveIntensity: 0,
  roughness: 0.6,
  metalness: 0,
});

const tileGeometry = new THREE.BoxGeometry(0.45, 0.08, 0.45);

/** Ink outline. Flat parts show every crease; round parts only their rims. */
function Outline({ round = false }: { round?: boolean }) {
  return <Edges threshold={round ? 60 : 24} color={INK} lineWidth={1} />;
}

const HOLES: Array<[number, number]> = [
  [-10.8, -6.8],
  [10.8, -6.8],
  [-10.8, 6.8],
  [10.8, 6.8],
];

function Pcb() {
  return (
    <group>
      <mesh material={pcbMaterial} receiveShadow castShadow>
        <boxGeometry args={[24, 0.16, 16]} />
        <Outline />
      </mesh>
      {HOLES.map(([x, z]) => (
        <mesh key={`${x}:${z}`} position={[x, 0, z]} material={inkMaterial}>
          <cylinderGeometry args={[0.3, 0.3, 0.24, 16]} />
        </mesh>
      ))}
      {HOLES.map(([x, z]) => (
        <mesh key={`foot${x}:${z}`} position={[x, -0.5, z]} material={rubberMaterial}>
          <cylinderGeometry args={[0.55, 0.55, 0.9, 14]} />
        </mesh>
      ))}
    </group>
  );
}

/* The band sweeps the eight columns between t = 0.45 and t = 0.55, so the
 * phase runs 40x and each column trails the last by half a unit. */
function tileIntensity(t: number, col: number): number {
  const band = 1 - Math.abs((t - 0.45) * 40 - col * 0.5) * 2;
  const base = t > 0.43 && t < 0.58 ? 0.15 : 0;
  return Math.max(base, Math.max(0, band));
}

function tilePosition(i: number): [number, number, number] {
  const col = i % TILE_COLS;
  const row = Math.floor(i / TILE_COLS);
  const x = FPGA_X - ((TILE_COLS - 1) * TILE_STEP) / 2 + col * TILE_STEP;
  const z = -((TILE_ROWS - 1) * TILE_STEP) / 2 + row * TILE_STEP;
  return [x, TILE_Y, z];
}

function DspTiles({ t }: { t: number }) {
  const materials = useMemo(() => Array.from({ length: TILE_COLS * TILE_ROWS }, () => tileMaterial.clone()), []);
  // three.js materials are mutated in place; the clones are made once, not per frame.
  materials.forEach((m, i) => {
    m.emissiveIntensity = tileIntensity(t, i % TILE_COLS);
  });
  return (
    <group>
      {materials.map((m, i) => (
        <mesh key={i} geometry={tileGeometry} material={m} position={tilePosition(i)} />
      ))}
    </group>
  );
}

function Fpga({ t }: { t: number }) {
  return (
    <group>
      <mesh position={[FPGA_X, TOP + 0.15, 0]} material={shadeMaterial} castShadow>
        <boxGeometry args={[FPGA_HALF * 2, 0.3, FPGA_HALF * 2]} />
        <Outline />
      </mesh>
      <mesh position={[FPGA_X, TOP + 0.36, 0]} material={boneMaterial} castShadow>
        <boxGeometry args={[5, 0.12, 5]} />
        <Outline />
      </mesh>
      <DspTiles t={t} />
    </group>
  );
}

function Memory() {
  return (
    <group>
      {[3.2, 5.4].map((x) => (
        <RoundedBox key={x} args={[1.2, 0.2, 3]} radius={0.06} smoothness={2} position={[x, TOP + 0.1, 0]} material={inkMaterial} castShadow>
          <Outline />
        </RoundedBox>
      ))}
    </group>
  );
}

/** Radio in and out. The samples enter the board here. */
function SmaConnectors() {
  return (
    <group>
      {[-7.5, -3].map((x) => (
        <group key={x} position={[x, TOP + 0.45, 6.6]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} material={inkMaterial} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 1.2, 20]} />
            <Outline round />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.75]} material={boneMaterial}>
            <cylinderGeometry args={[0.7, 0.7, 0.36, 6]} />
            <Outline />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function PinHeader() {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new THREE.Matrix4();
    for (let i = 0; i < HEADER_PINS; i++) {
      const col = i % HEADER_COLS;
      const row = Math.floor(i / HEADER_COLS);
      m.setPosition(-4.75 + col * 0.5, TOP + 0.4, -7 + row * 0.5);
      mesh.setMatrixAt(i, m);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, HEADER_PINS]} material={inkMaterial}>
      <cylinderGeometry args={[0.06, 0.06, 0.8, 8]} />
    </instancedMesh>
  );
}

const STATUS_X = [5.4, 6.2, 7, 7.8];

function PowerAndLeds() {
  return (
    <group>
      <RoundedBox args={[0.9, 0.3, 0.7]} radius={0.08} smoothness={2} position={[-11.4, TOP + 0.15, 3]} material={shadeMaterial}>
        <Outline />
      </RoundedBox>
      <mesh position={[-11.3, TOP + 0.45, -3]} rotation={[0, 0, Math.PI / 2]} material={inkMaterial} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 1.2, 18]} />
        <Outline round />
      </mesh>
      <mesh position={[-10.2, TOP + 0.06, 3]} material={rustMaterial}>
        <boxGeometry args={[0.32, 0.12, 0.2]} />
      </mesh>
      {STATUS_X.map((x) => (
        <mesh key={x} position={[x, TOP + 0.06, -6]} material={rustMaterial}>
          <boxGeometry args={[0.3, 0.12, 0.18]} />
        </mesh>
      ))}
    </group>
  );
}

const TRACE_Y = TOP + 0.02;

/** Two copper runs from the SMA connectors to the package edge, one bend each. */
function Traces() {
  return (
    <group>
      <mesh position={[-7.5, TRACE_Y, 5]} material={boneMaterial}>
        <boxGeometry args={[0.12, 0.02, 4]} />
      </mesh>
      <mesh position={[-6.25, TRACE_Y, 3]} material={boneMaterial}>
        <boxGeometry args={[2.5, 0.02, 0.12]} />
      </mesh>
      <mesh position={[-2.5, TRACE_Y, 6]} material={boneMaterial}>
        <boxGeometry args={[1, 0.02, 0.12]} />
      </mesh>
      <mesh position={[-2, TRACE_Y, 4.5]} material={boneMaterial}>
        <boxGeometry args={[0.12, 0.02, 3]} />
      </mesh>
    </group>
  );
}

type Point = readonly [number, number];

const INBOUND: readonly Point[] = [
  [-7.5, 7],
  [-7.5, 3],
  [-5, 3],
];

const OUTBOUND: readonly Point[] = [
  [-0.5, 0],
  [3.2, 0],
];

function pointOnPath(path: readonly Point[], u: number): Point {
  const segments = path.length - 1;
  const scaled = THREE.MathUtils.clamp(u, 0, 0.9999) * segments;
  const index = Math.floor(scaled);
  const f = scaled - index;
  const a = path[index];
  const b = path[index + 1];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
}

/** The sample word: in from the radio, then the result out to memory. */
function SampleWord({ t }: { t: number }) {
  const leg = t < 0.45 ? { path: INBOUND, u: t / 0.45 } : null;
  const out = t >= 0.55 && t < 0.85 ? { path: OUTBOUND, u: (t - 0.55) / 0.3 } : null;
  const active = leg ?? out;
  if (!active) return null;
  const [x, z] = pointOnPath(active.path, active.u);
  return (
    <mesh position={[x, TOP + 0.24, z]} material={rustMaterial} castShadow>
      <boxGeometry args={[0.35, 0.35, 0.35]} />
    </mesh>
  );
}

export function Board({ t }: { t: number }) {
  return (
    <group position={[0, BOARD_Y, 0]} rotation={[TILT, 0, 0]}>
      <Pcb />
      <Traces />
      <Fpga t={t} />
      <Memory />
      <SmaConnectors />
      <PinHeader />
      <PowerAndLeds />
      <SampleWord t={t} />
    </group>
  );
}
