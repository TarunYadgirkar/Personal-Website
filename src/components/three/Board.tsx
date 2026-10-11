"use client";

import { useEffect, useLayoutEffect, useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { palette } from "@/lib/palette";
import { FINISH, inkMaterial, metalMaterial } from "./drafting";
import { Memory, Passives, Pcb, PinHeader, PowerAndLeds, Silkscreen, SmaConnectors, TOP, Traces } from "./BoardParts";

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

const FPGA_X = -3.5;
const TILE_COLS = 8;
const TILE_ROWS = 4;
const TILE_STEP = 0.55;
const TILE_Y = TOP + 0.42;

/** The FPGA's package substrate, under its metal lid. */
const substrateMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color(FINISH.substrate), roughness: 0.6 });

const tileMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(palette.rust),
  emissive: new THREE.Color(palette.rust),
  emissiveIntensity: 0,
  roughness: 0.5,
});

/** The sample in flight glows, so it reads against the dark board. */
const wordMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(palette.rust),
  emissive: new THREE.Color(palette.rust),
  emissiveIntensity: 0.9,
  roughness: 0.4,
});

const tileGeometry = new THREE.BoxGeometry(0.45, 0.06, 0.45);

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
  // Every row in a column lights together, so one material per column is enough.
  const columns = useMemo(() => Array.from({ length: TILE_COLS }, () => tileMaterial.clone()), []);
  useLayoutEffect(() => {
    columns.forEach((m, col) => {
      m.emissiveIntensity = tileIntensity(t, col);
    });
  }, [columns, t]);
  useEffect(() => () => columns.forEach((m) => m.dispose()), [columns]);
  return (
    <group>
      {Array.from({ length: TILE_COLS * TILE_ROWS }, (_, i) => (
        <mesh key={i} geometry={tileGeometry} material={columns[i % TILE_COLS]} position={tilePosition(i)} />
      ))}
    </group>
  );
}

/** Substrate, lid, and the fabric drawn on the lid as a grid of DSP tiles. */
function Fpga({ t }: { t: number }) {
  return (
    <group>
      <mesh position={[FPGA_X, TOP + 0.1, 0]} material={substrateMaterial}>
        <boxGeometry args={[6, 0.2, 6]} />
      </mesh>
      <RoundedBox args={[5, 0.18, 5]} radius={0.05} smoothness={2} position={[FPGA_X, TOP + 0.29, 0]} material={metalMaterial} />
      <mesh position={[FPGA_X, TOP + 0.385, 0]} material={inkMaterial}>
        <boxGeometry args={[4.7, 0.02, 2.6]} />
      </mesh>
      <DspTiles t={t} />
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
    <RoundedBox args={[0.4, 0.2, 0.4]} radius={0.06} smoothness={2} position={[x, TOP + 0.14, z]} material={wordMaterial} />
  );
}

export function Board({ t }: { t: number }) {
  return (
    <group position={[0, BOARD_Y, 0]} rotation={[TILT, 0, 0]}>
      <Pcb />
      <Traces />
      <Silkscreen />
      <Passives />
      <Fpga t={t} />
      <Memory />
      <SmaConnectors />
      <PinHeader />
      <PowerAndLeds />
      <SampleWord t={t} />
    </group>
  );
}
