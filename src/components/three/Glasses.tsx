"use client";

import { useEffect, useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { palette } from "@/lib/palette";
import { glassMaterial, metalMaterial, rustMaterial, SIDES, type Side } from "./drafting";

/* VANTAGE, in centimeters. y is up, the front of the glasses faces +z. They
 * are set down on a table at y = 0, resting on the bottom of the front and
 * on the ear tips, with the temples running back toward -z.
 *
 * `t` is a looping phase in [0, 1). Three AR panels project out of the
 * lenses into the room in front, hold, and retract. */

export const GLASSES_SIZE = { height: 26, targetY: 9 } as const;

/** Polished black acetate. */
const frameMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(palette.ink),
  roughness: 0.32,
  clearcoat: 1,
  clearcoatRoughness: 0.06,
});

/** Lightly smoked lens glass: mostly clear, catching the studio cards. */
const lensMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(palette.ink),
  roughness: 0.04,
  clearcoat: 1,
  clearcoatRoughness: 0.02,
  transparent: true,
  opacity: 0.3,
});

/** A projected window: a frosted pane that gives off a little light of its own. */
const panelMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(palette.paperPale),
  emissive: new THREE.Color(palette.paperPale),
  emissiveIntensity: 0.25,
  roughness: 0.2,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
  transparent: true,
  opacity: 0.75,
});

/* What is drawn on the panels is light, not matter, so it is flagged
 * transparent: that keeps it out of the shadows. */
const textMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(palette.inkMute), transparent: true });
const imageMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(palette.line), transparent: true });
const accentMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(palette.rust), transparent: true });

const LENS_HW = 2.6;
const LENS_HH = 2;
const LENS_X = 3.6;
const FRAME_HW = LENS_X + LENS_HW + 0.6;
const FRAME_HH = LENS_HH + 0.6;
const FRAME_DEPTH = 0.5;
const BEVEL = 0.12;
/** The front stands on its bottom edge, bevel included. */
const FRAME_Y = FRAME_HH + BEVEL;
const CORNER = 1.5;
const NOTCH_W = 1.1;
const NOTCH_H = 1.5;

const TEMPLE_LEN = 14;
const TEMPLE_X = FRAME_HW - 0.3;
const TEMPLE_Y = FRAME_Y + 1.2;
/* Tipped down so the ear end, 0.4 below the temple's centre line, rests on the table. */
const TEMPLE_PITCH = -Math.asin((TEMPLE_Y - 0.4) / TEMPLE_LEN);
/** The wearer faces +z, so their right hand is toward -x. */
const RIGHT = -1;

/** The wraparound: the frame falls away in z the further out it runs. */
function wrapZ(x: number): number {
  return -0.03 * x * x;
}

/** The front's outline: a rounded rectangle with a notch for the nose. */
function frontShape(): THREE.Shape {
  const w = FRAME_HW;
  const h = FRAME_HH;
  const r = CORNER;
  const s = new THREE.Shape();
  s.moveTo(-w + r, -h);
  s.lineTo(-NOTCH_W, -h);
  s.bezierCurveTo(-NOTCH_W * 0.5, -h, -0.6, -h + NOTCH_H, 0, -h + NOTCH_H);
  s.bezierCurveTo(0.6, -h + NOTCH_H, NOTCH_W * 0.5, -h, NOTCH_W, -h);
  s.lineTo(w - r, -h);
  s.quadraticCurveTo(w, -h, w, -h + r);
  s.lineTo(w, h - r);
  s.quadraticCurveTo(w, h, w - r, h);
  s.lineTo(-w + r, h);
  s.quadraticCurveTo(-w, h, -w, h - r);
  s.lineTo(-w, -h + r);
  s.quadraticCurveTo(-w, -h, -w + r, -h);
  s.holes = SIDES.map((side) => new THREE.Path(lensOutline(side * LENS_X, 1)));
  return s;
}

/** A lens as a superellipse, rounder than a rectangle and squarer than an oval. */
function lensOutline(cx: number, grow: number): THREE.Vector2[] {
  return Array.from({ length: 64 }, (_, i) => {
    const a = (i / 64) * Math.PI * 2;
    const c = Math.cos(a);
    const s = Math.sin(a);
    return new THREE.Vector2(cx + LENS_HW * grow * Math.sign(c) * Math.sqrt(Math.abs(c)), LENS_HH * grow * Math.sign(s) * Math.sqrt(Math.abs(s)));
  });
}

/** Bends a flat geometry into the wrap, carrying its normals with it so the shading follows the curve. */
function wrapGeometry(geometry: THREE.BufferGeometry): THREE.BufferGeometry {
  const pos = geometry.getAttribute("position");
  const nrm = geometry.getAttribute("normal");
  const n = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    pos.setZ(i, pos.getZ(i) + wrapZ(x));
    n.fromBufferAttribute(nrm, i);
    // The bend z += f(x) turns normals by the inverse transpose: nx -= f'(x) nz.
    n.x -= -0.06 * x * n.z;
    n.normalize();
    nrm.setXYZ(i, n.x, n.y, n.z);
  }
  pos.needsUpdate = true;
  nrm.needsUpdate = true;
  return geometry;
}

function frontGeometry(): THREE.BufferGeometry {
  const g = new THREE.ExtrudeGeometry(frontShape(), {
    depth: FRAME_DEPTH,
    bevelEnabled: true,
    bevelThickness: BEVEL,
    bevelSize: 0.1,
    bevelSegments: 4,
    curveSegments: 24,
  });
  g.translate(0, 0, -FRAME_DEPTH / 2);
  return wrapGeometry(g);
}

function lensGeometry(side: Side): THREE.BufferGeometry {
  const g = new THREE.ExtrudeGeometry(new THREE.Shape(lensOutline(side * LENS_X, 1.03)), { depth: 0.1, bevelEnabled: false });
  g.translate(0, 0, -0.05);
  return wrapGeometry(g);
}

/** The temple seen from the side: a deep housing for the electronics that tapers to a rounded ear end. */
function templeGeometry(): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(0, 0.85);
  s.lineTo(6, 0.85);
  s.bezierCurveTo(7.5, 0.85, 8, 0.45, 9.5, 0.42);
  s.lineTo(13.4, 0.36);
  s.quadraticCurveTo(TEMPLE_LEN, 0.36, TEMPLE_LEN, -0.04);
  s.quadraticCurveTo(TEMPLE_LEN, -0.44, 13.4, -0.44);
  s.lineTo(9.5, -0.42);
  s.bezierCurveTo(8, -0.45, 7.5, -0.85, 6, -0.85);
  s.lineTo(0, -0.85);
  s.lineTo(0, 0.85);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.5, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.1, bevelSegments: 3, curveSegments: 16 });
  // The profile is drawn running +x; turn it to run back along -z with its thickness across x.
  g.rotateY(Math.PI / 2);
  g.translate(-0.25, 0, 0);
  return g;
}

function useGeometries() {
  const geoms = useMemo(
    () => ({ front: frontGeometry(), lenses: SIDES.map(lensGeometry), temple: templeGeometry() }),
    [],
  );
  useEffect(
    () => () => {
      geoms.front.dispose();
      geoms.temple.dispose();
      geoms.lenses.forEach((g) => g.dispose());
    },
    [geoms],
  );
  return geoms;
}

const FRONT_Z = FRAME_DEPTH / 2 + BEVEL;

/** LiDAR on the bridge and the two hand-watching cameras either side of the nose. */
function Sensors() {
  return (
    <group position={[0, FRAME_Y, FRONT_Z]}>
      <mesh position={[0, 1.55, 0]} rotation={[Math.PI / 2, 0, 0]} material={rustMaterial}>
        <cylinderGeometry args={[0.5, 0.5, 0.08, 32]} />
      </mesh>
      <mesh position={[0, 1.55, 0.05]} rotation={[Math.PI / 2, 0, 0]} material={glassMaterial}>
        <cylinderGeometry args={[0.36, 0.36, 0.08, 32]} />
      </mesh>
      {SIDES.map((s) => (
        <mesh key={s} position={[s * 0.6, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} material={glassMaterial}>
          <cylinderGeometry args={[0.22, 0.22, 0.08, 24]} />
        </mesh>
      ))}
    </group>
  );
}

/** Slider strip on the outer face and the status light on the inner one. */
function TempleControls({ side }: { side: Side }) {
  return (
    <group>
      <RoundedBox args={[0.08, 0.36, 3]} radius={0.03} smoothness={2} position={[side * 0.37, 0.15, -3.2]} material={metalMaterial} />
      <mesh position={[side * 0.4, 0.15, -2.3]} material={rustMaterial}>
        <boxGeometry args={[0.06, 0.3, 0.5]} />
      </mesh>
      <mesh position={[-side * 0.37, 0.4, -1.4]} material={rustMaterial}>
        <boxGeometry args={[0.06, 0.18, 0.18]} />
      </mesh>
    </group>
  );
}

function Temple({ side, geometry }: { side: Side; geometry: THREE.BufferGeometry }) {
  return (
    <group position={[side * TEMPLE_X, TEMPLE_Y, wrapZ(TEMPLE_X) - 0.35]} rotation={[TEMPLE_PITCH, -side * 0.04, 0]}>
      <mesh geometry={geometry} material={frameMaterial} />
      <mesh position={[0, 0, 0.1]} material={metalMaterial}>
        <cylinderGeometry args={[0.2, 0.2, 1.5, 16]} />
      </mesh>
      {side === RIGHT && <TempleControls side={side} />}
    </group>
  );
}

interface PanelSpec {
  id: string;
  w: number;
  h: number;
  lines: number;
  image: boolean;
  rest: readonly [number, number, number];
  from: readonly [number, number, number];
  appear: readonly [number, number];
}

const PANELS: readonly PanelSpec[] = [
  { id: "wide", w: 11, h: 6, lines: 3, image: true, rest: [0, 10, 12], from: [0, FRAME_Y, 0.4], appear: [0.05, 0.3] },
  { id: "tall", w: 5, h: 7, lines: 4, image: false, rest: [-8.6, 13.5, 9], from: [-LENS_X, FRAME_Y, 0.4], appear: [0.15, 0.4] },
  { id: "card", w: 4, h: 3, lines: 2, image: false, rest: [8, 14.5, 7], from: [LENS_X, FRAME_Y, 0.4], appear: [0.25, 0.45] },
];

const LINE_SHARE = [0.9, 0.62, 0.74, 0.5];
const FACE_Z = 0.09;

/** Out over the panel's own window, held, then retracted with the others. */
function reveal(t: number, appear: readonly [number, number]): number {
  const out = THREE.MathUtils.smoothstep(t, appear[0], appear[1]);
  return out * (1 - THREE.MathUtils.smoothstep(t, 0.8, 0.95));
}

/** Lines of text down the left; the wide panel also carries a picture on its right half. */
function PanelContent({ w, h, lines, image }: { w: number; h: number; lines: number; image: boolean }) {
  const textW = image ? w * 0.48 : w - 1;
  const top = h / 2 - 0.6;
  return (
    <group position={[0, 0, FACE_Z]}>
      <RoundedBox args={[1, 0.36, 0.02]} radius={0.08} smoothness={2} position={[-w / 2 + 1, top, 0]} material={accentMaterial} />
      {Array.from({ length: lines }, (_, i) => {
        const width = (textW - 0.2) * LINE_SHARE[i % LINE_SHARE.length];
        return (
          <mesh key={i} position={[-w / 2 + 0.5 + width / 2, top - 1 - i * 0.7, 0]} material={textMaterial}>
            <boxGeometry args={[width, 0.2, 0.02]} />
          </mesh>
        );
      })}
      {image && (
        <RoundedBox args={[w * 0.4, h - 1.4, 0.02]} radius={0.2} smoothness={2} position={[w / 2 - 0.5 - w * 0.2, -0.2, 0]} material={imageMaterial} />
      )}
    </group>
  );
}

function ArPanel({ spec, t }: { spec: PanelSpec; t: number }) {
  const eased = reveal(t, spec.appear);
  if (eased <= 0.002) return null;
  const pos = new THREE.Vector3(...spec.from).lerp(new THREE.Vector3(...spec.rest), eased);
  // Panels face out along the wearer's eyeline, toed in slightly toward the centre.
  const toe = -0.18 * Math.sign(spec.rest[0]);
  return (
    <group position={pos} rotation={[0, toe, 0]} scale={eased}>
      <RoundedBox args={[spec.w, spec.h, 0.12]} radius={0.4} smoothness={4} material={panelMaterial} />
      {/* A projected window shows through from behind, mirrored. */}
      {[1, -1].map((face) => (
        <group key={face} scale={[1, 1, face]}>
          <PanelContent w={spec.w} h={spec.h} lines={spec.lines} image={spec.image} />
        </group>
      ))}
    </group>
  );
}

export function Glasses({ t }: { t: number }) {
  const geoms = useGeometries();
  return (
    <group>
      <group position={[0, FRAME_Y, 0]}>
        <mesh geometry={geoms.front} material={frameMaterial} />
        {geoms.lenses.map((g, i) => (
          <mesh key={SIDES[i]} geometry={g} material={lensMaterial} />
        ))}
      </group>
      <Sensors />
      {SIDES.map((s) => (
        <Temple key={s} side={s} geometry={geoms.temple} />
      ))}
      {PANELS.map((spec) => (
        <ArPanel key={spec.id} spec={spec} t={t} />
      ))}
    </group>
  );
}
