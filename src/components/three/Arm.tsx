"use client";

import { Edges, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { INK, boneMaterial, inkMaterial, rubberMaterial, rustMaterial, shadeMaterial } from "./drafting";

/* A six-axis industrial arm with a parallel-jaw gripper, in centimeters.
 * y is up, the ground plane is y = 0, the front of the cell is +z. The arm
 * picks a 2 cm cube off the floor in front of it and sets it down to its
 * right. `t` is a looping phase in [0, 1).
 *
 * Each link runs along its own +y, and joints 2, 3 and 5 pitch about x, so
 * a pitch of 0 stands the link straight up and a positive pitch tips it
 * toward +z. */

export const ARM_SIZE = { height: 78, targetY: 34 } as const;

const COLUMN_TOP = 14.5;
const SHOULDER_Y = 20;
const UPPER = 34;
const FORE = 30;
/* The part is a chip package: 4 cm square, lidded, with a pin-1 mark. It is
 * picked off a pad and set into a tray. */
const PART_W = 4;
const PART_H = 0.9;
const PAD_H = 0.4;
const TRAY_H = 0.6;

const GAP_OPEN = 8;
const GAP_SHUT = PART_W;
const SIDES: Array<1 | -1> = [1, -1];

const HOLD_FROM = 0.38;
const HOLD_TO = 0.7;

/* Keyframe arithmetic. The wrist is 14 cm from the joint-5 pivot to the
 * fingertip and points straight down at every keyframe, so the two-link
 * solve for (r, y) measured from the shoulder at y = 20 is:
 *   r = 34 sin a + 30 sin b,  y - 20 + 14 = 34 cos a + 30 cos b
 * with a the upper-arm angle, b the forearm angle, both from vertical.
 *
 * reach, fingertip at (r 38, y 0): d = |(38, -6)| = 38.47,
 *   cos(b - a) = (d^2 - 34^2 - 30^2) / (2*34*30) = -0.2824 -> b - a = 1.857,
 *   a = atan2(38, -6) - acos((d^2 + 34^2 - 30^2) / (2*d*34)) = 1.727 - 0.845,
 *   so a = 0.882, b = 2.739, joint 5 = pi - b = 0.402. That lands the tip at
 *   r 37.97, y 0.01, and the cube centre one centimetre higher at (0, 1, 38).
 * lift, fingertip at (r 30, y 26): b - a = 1.951, a = 0.983 - 0.884 = 0.099,
 *   b = 2.050, joint 5 = 1.092 -> tip at r 29.98, y 25.99.
 * place: the place point (x 33, z 19) is 38.08 from the column, within a
 *   millimetre of the reach radius, so it is the reach pose swung by
 *   atan2(33, 19) = 1.0486 rad, putting the tip at (32.9, 0.0, 18.9).
 * Joint 4 stays at 0 in every keyframe, which keeps the three pitches in one
 * plane and the arithmetic above honest; joint 6 carries the wrist roll,
 * and rolling about the tool axis cannot move the fingertip. */
const PLACE_YAW = 1.0486;
const REACH = [0, 0.882, 1.857, 0, 0.402, 0];
const LIFT = [PLACE_YAW, 0.099, 1.951, 0, 1.092, 0.5];
const PLACE = [PLACE_YAW, 0.882, 1.857, 0, 0.402, 0];

const PICK_POS: [number, number, number] = [0, PAD_H + PART_H / 2, 38];
const PLACE_POS: [number, number, number] = [32.94, TRAY_H + PART_H / 2, 18.96];

interface Segment {
  t0: number;
  t1: number;
  a: number[];
  b: number[];
}

const SEGMENTS: Segment[] = [
  { t0: 0, t1: 0.38, a: REACH, b: REACH },
  { t0: 0.38, t1: 0.54, a: REACH, b: LIFT },
  { t0: 0.54, t1: 0.7, a: LIFT, b: PLACE },
  { t0: 0.7, t1: 0.78, a: PLACE, b: PLACE },
  { t0: 0.78, t1: 1, a: PLACE, b: REACH },
];
const LAST = SEGMENTS[SEGMENTS.length - 1];

/** Closing runs to 1 over the grip window, opening subtracts it back out. */
function gapAt(t: number): number {
  const shut = THREE.MathUtils.smoothstep(t, 0.3, 0.38) - THREE.MathUtils.smoothstep(t, 0.7, 0.78);
  return THREE.MathUtils.lerp(GAP_OPEN, GAP_SHUT, shut);
}

function poseAt(t: number): { joints: number[]; gap: number; holding: boolean } {
  const seg = SEGMENTS.find((s) => t < s.t1) ?? LAST;
  const k = THREE.MathUtils.smoothstep(t, seg.t0, seg.t1);
  return {
    joints: seg.a.map((v, i) => THREE.MathUtils.lerp(v, seg.b[i], k)),
    gap: gapAt(t),
    holding: t >= HOLD_FROM && t < HOLD_TO,
  };
}

/** Ink outline. Flat parts show every crease; round parts only their rims. */
function Outline({ round = false }: { round?: boolean }) {
  return <Edges threshold={round ? 60 : 24} color={INK} lineWidth={1} />;
}

const BOLTS = [0, 1, 2, 3];

function Base() {
  return (
    <group>
      <mesh position={[0, 1.25, 0]} material={boneMaterial} receiveShadow castShadow>
        <cylinderGeometry args={[14, 14, 2.5, 48]} />
        <Outline round />
      </mesh>
      {BOLTS.map((i) => {
        const a = Math.PI / 4 + (i * Math.PI) / 2;
        return (
          <mesh key={i} position={[Math.sin(a) * 11.5, 2.7, Math.cos(a) * 11.5]} material={inkMaterial}>
            <cylinderGeometry args={[1.3, 1.3, 0.9, 6]} />
            <Outline round />
          </mesh>
        );
      })}
      <mesh position={[0, 8.5, 0]} material={boneMaterial} castShadow>
        <cylinderGeometry args={[9, 9, 12, 36]} />
        <Outline round />
      </mesh>
    </group>
  );
}

/** A pitch axle lying on its side, with an optional rust end cap. */
function PitchJoint({ radius, width, cap = false }: { radius: number; width: number; cap?: boolean }) {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh material={inkMaterial}>
        <cylinderGeometry args={[radius, radius, width, 24]} />
        <Outline round />
      </mesh>
      {cap && (
        <mesh position={[0, width / 2 + 0.3, 0]} material={rustMaterial}>
          <cylinderGeometry args={[radius * 0.62, radius * 0.62, 0.8, 20]} />
        </mesh>
      )}
    </group>
  );
}

function Turret() {
  return (
    <mesh position={[0, 2.75, 0]} material={shadeMaterial} castShadow>
      <cylinderGeometry args={[8, 8, 5.5, 36]} />
      <Outline round />
    </mesh>
  );
}

function UpperArm() {
  return (
    <group>
      <RoundedBox args={[7, UPPER, 9]} radius={1.8} position={[0, UPPER / 2, 0]} material={boneMaterial} castShadow>
        <Outline />
      </RoundedBox>
      {/* Cable conduit down the back of the link. */}
      <RoundedBox args={[4, UPPER - 9, 2.6]} radius={0.9} position={[0, UPPER / 2, -5.4]} material={shadeMaterial}>
        <Outline />
      </RoundedBox>
    </group>
  );
}

function Forearm() {
  return (
    <group>
      <RoundedBox args={[5.6, FORE, 7]} radius={1.5} position={[0, FORE / 2, 0]} material={boneMaterial} castShadow>
        <Outline />
      </RoundedBox>
      <mesh position={[0, FORE - 6, 3.6]} rotation={[Math.PI / 2, 0, 0]} material={rustMaterial}>
        <cylinderGeometry args={[0.8, 0.8, 0.6, 16]} />
      </mesh>
    </group>
  );
}

function Part({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  const lid = PART_W * 0.72;
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh material={shadeMaterial} castShadow>
        <boxGeometry args={[PART_W, PART_H * 0.45, PART_W]} />
        <Outline />
      </mesh>
      <mesh position={[0, PART_H * 0.36, 0]} material={boneMaterial} castShadow>
        <boxGeometry args={[lid, PART_H * 0.5, lid]} />
        <Outline />
      </mesh>
      <mesh position={[-lid / 2 + 0.45, PART_H * 0.62, lid / 2 - 0.45]} rotation={[-Math.PI / 2, 0, 0]} material={rustMaterial}>
        <circleGeometry args={[0.22, 12]} />
      </mesh>
      {/* Two rows of leads on the sides the jaws do not touch. */}
      {SIDES.map((s) => (
        <mesh key={s} position={[0, -PART_H * 0.2, s * (PART_W / 2 + 0.25)]} material={inkMaterial}>
          <boxGeometry args={[PART_W * 0.8, 0.12, 0.5]} />
        </mesh>
      ))}
    </group>
  );
}

/** The pad the part starts on and the tray it is set into. */
function Stations() {
  return (
    <group>
      <mesh position={[PICK_POS[0], PAD_H / 2, PICK_POS[2]]} material={shadeMaterial} receiveShadow>
        <boxGeometry args={[6, PAD_H, 6]} />
        <Outline />
      </mesh>
      <group position={[PLACE_POS[0], 0, PLACE_POS[2]]} rotation={[0, PLACE_YAW, 0]}>
        <mesh position={[0, TRAY_H / 2, 0]} material={boneMaterial} receiveShadow>
          <boxGeometry args={[7, TRAY_H, 7]} />
          <Outline />
        </mesh>
        {SIDES.map((s) => (
          <mesh key={s} position={[s * 3.2, TRAY_H + 0.3, 0]} material={boneMaterial}>
            <boxGeometry args={[0.6, 0.6, 7]} />
            <Outline />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** The jaws clear `gap` between their inner faces, so the 4 cm part is held
 * at the closed gap and cleared at the open one. */
function Gripper({ gap }: { gap: number }) {
  return (
    <group>
      <RoundedBox args={[7.4, 5, 6]} radius={1.1} position={[0, 6.1, 0]} material={shadeMaterial} castShadow>
        <Outline />
      </RoundedBox>
      {SIDES.map((s) => (
        <RoundedBox
          key={s}
          args={[1.8, 7, 4]}
          radius={0.5}
          position={[s * (gap / 2 + 0.9), 10.5, 0]}
          material={rubberMaterial}
          castShadow
        >
          <Outline />
        </RoundedBox>
      ))}
    </group>
  );
}

interface WristProps {
  roll: number;
  pitch: number;
  flange: number;
  gap: number;
  holding: boolean;
}

function Wrist({ roll, pitch, flange, gap, holding }: WristProps) {
  return (
    <group position={[0, FORE, 0]} rotation={[0, roll, 0]}>
      <mesh position={[0, -2.5, 0]} material={boneMaterial} castShadow>
        <cylinderGeometry args={[3, 3, 5, 24]} />
        <Outline round />
      </mesh>
      <group rotation={[pitch, 0, 0]}>
        <PitchJoint radius={2.6} width={4.6} />
        <group rotation={[0, flange, 0]}>
          <mesh position={[0, 3, 0]} material={boneMaterial}>
            <cylinderGeometry args={[3.2, 3.2, 1.2, 24]} />
            <Outline round />
          </mesh>
          <Gripper gap={gap} />
          {holding && <Part position={[0, 12 + PART_H / 2, 0]} />}
        </group>
      </group>
    </group>
  );
}

/** The cube while it is on the floor: at the pick point until it is grasped,
 * at the place point once it has been let go. */
function LoosePart({ t }: { t: number }) {
  if (t >= HOLD_FROM && t < HOLD_TO) return null;
  const placed = t >= HOLD_TO;
  return <Part position={placed ? PLACE_POS : PICK_POS} rotation={placed ? PLACE_YAW : 0} />;
}

export function Arm({ t }: { t: number }) {
  const { joints, gap, holding } = poseAt(t);
  const [yaw, shoulder, elbow, roll, pitch, flange] = joints;
  return (
    <group>
      <Base />
      <Stations />
      <LoosePart t={t} />
      <group position={[0, COLUMN_TOP, 0]} rotation={[0, yaw, 0]}>
        <Turret />
        <group position={[0, SHOULDER_Y - COLUMN_TOP, 0]} rotation={[shoulder, 0, 0]}>
          <PitchJoint radius={4.2} width={7.4} cap />
          <UpperArm />
          <group position={[0, UPPER, 0]} rotation={[elbow, 0, 0]}>
            <PitchJoint radius={3.6} width={6.2} />
            <Forearm />
            <Wrist roll={roll} pitch={pitch} flange={flange} gap={gap} holding={holding} />
          </group>
        </group>
      </group>
    </group>
  );
}
