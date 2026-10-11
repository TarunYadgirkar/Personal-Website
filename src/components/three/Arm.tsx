"use client";

import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { boneMaterial, inkMaterial, metalMaterial, rubberMaterial, rustMaterial, shadeMaterial, SIDES } from "./drafting";

/* A six-axis industrial arm with a parallel-jaw gripper, in centimeters.
 * y is up, the ground plane is y = 0, the front of the cell is +z. The arm
 * picks a 5 cm block off a plate in front of it and sets it on a second
 * plate to its right. `t` is a looping phase in [0, 1).
 *
 * Each link runs along its own +y, and joints 2, 3 and 5 pitch about x, so
 * a pitch of 0 stands the link straight up and a positive pitch tips it
 * toward +z. */

export const ARM_SIZE = { height: 78, targetY: 34 } as const;

const COLUMN_TOP = 14.5;
const SHOULDER_Y = 20;
const UPPER = 34;
const FORE = 30;
/* The part is a 5 cm machined block. Both plates are the same height, so it
 * is set down exactly as high as it was picked up. */
const PART_W = 5;
const PLATE_H = 1;
/* The jaws end 1.5 cm short of the tool point, so at the reach pose they
 * clear the plate the part sits on. */
const JAW_END = 12.5;
const JAW_LEN = 5.3;

const GAP_OPEN = 8.5;
const GAP_SHUT = PART_W;

const HOLD_FROM = 0.38;
/* Distance from the joint-5 pivot to the held part's centre: the pivot is
 * 14 above the floor at the reach pose and the part's centre is a plate and
 * half a block up, so it neither jumps nor drops at the hand-off. */
const HELD_Y = 14 - PLATE_H - PART_W / 2;
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
 *   r 37.97, y 0.01. The joint-5 pivot then sits at y 13.99 with the tool
 *   pointing down, so a part held HELD_Y below it lands on the plate.
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

const PICK_POS: [number, number, number] = [0, PLATE_H + PART_W / 2, 38];
const PLACE_POS: [number, number, number] = [32.94, PLATE_H + PART_W / 2, 18.96];

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

const BOLTS = [0, 1, 2, 3];

/** Floor flange, bolts and the fixed pedestal up to the yaw joint. */
function Base() {
  return (
    <group>
      <mesh position={[0, 0.75, 0]} material={metalMaterial}>
        <cylinderGeometry args={[13, 13.4, 1.5, 64]} />
      </mesh>
      {BOLTS.map((i) => {
        const a = Math.PI / 4 + (i * Math.PI) / 2;
        return (
          <mesh key={i} position={[Math.sin(a) * 11, 1.8, Math.cos(a) * 11]} material={inkMaterial}>
            <cylinderGeometry args={[0.9, 0.9, 0.6, 6]} />
          </mesh>
        );
      })}
      <mesh position={[0, 7.5, 0]} material={boneMaterial}>
        <cylinderGeometry args={[8.2, 9, 12, 64]} />
      </mesh>
      <mesh position={[0, COLUMN_TOP - 0.6, 0]} material={inkMaterial}>
        <cylinderGeometry args={[8.3, 8.3, 1.2, 64]} />
      </mesh>
    </group>
  );
}

/** A joint housing lying across the arm: a shell drum with dark end caps, and an optional rust cap on one end. */
function Housing({ radius, width, cap = false }: { radius: number; width: number; cap?: boolean }) {
  return (
    <group rotation={[0, 0, Math.PI / 2]}>
      <mesh material={boneMaterial}>
        <cylinderGeometry args={[radius, radius, width, 48]} />
      </mesh>
      {SIDES.map((s) => (
        <mesh key={s} position={[0, (s * width) / 2, 0]} material={inkMaterial}>
          <cylinderGeometry args={[radius * 0.86, radius * 0.86, 0.6, 48]} />
        </mesh>
      ))}
      {cap && (
        <mesh position={[0, width / 2 + 0.35, 0]} material={rustMaterial}>
          <cylinderGeometry args={[radius * 0.5, radius * 0.5, 0.4, 32]} />
        </mesh>
      )}
    </group>
  );
}

/** A round link from its joint to the next, with a dark band where it leaves the housing. */
function Link({ radius, length }: { radius: number; length: number }) {
  return (
    <group>
      <mesh position={[0, length / 2, 0]} material={boneMaterial}>
        <cylinderGeometry args={[radius, radius, length, 40]} />
      </mesh>
      <mesh position={[0, radius + 1.6, 0]} material={inkMaterial}>
        <cylinderGeometry args={[radius + 0.08, radius + 0.08, 0.5, 40]} />
      </mesh>
    </group>
  );
}

function Turret() {
  return (
    <mesh position={[0, 2.5, 0]} material={boneMaterial}>
      <cylinderGeometry args={[7.6, 8, 5, 64]} />
    </mesh>
  );
}

function Part({ position, rotation = 0 }: { position: [number, number, number]; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <RoundedBox args={[PART_W, PART_W, PART_W]} radius={0.35} smoothness={3} material={rustMaterial} />
      <mesh position={[0, PART_W / 2, 0]} material={metalMaterial}>
        <cylinderGeometry args={[1.1, 1.1, 0.12, 32]} />
      </mesh>
    </group>
  );
}

/** The plate the part is picked from and the plate it is set on. */
function Stations() {
  return (
    <group>
      <RoundedBox args={[10, PLATE_H, 10]} radius={0.3} smoothness={3} position={[PICK_POS[0], PLATE_H / 2, PICK_POS[2]]} material={shadeMaterial} />
      <group position={[PLACE_POS[0], 0, PLACE_POS[2]]} rotation={[0, PLACE_YAW, 0]}>
        <RoundedBox args={[10, PLATE_H, 10]} radius={0.3} smoothness={3} position={[0, PLATE_H / 2, 0]} material={shadeMaterial} />
        {SIDES.map((s) => (
          <mesh key={s} position={[s * 4.2, PLATE_H + 0.02, 0]} material={inkMaterial}>
            <boxGeometry args={[0.5, 0.04, 8.4]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Parallel jaws that clear `gap` between their inner faces: the 5 cm part is held at the closed gap. */
function Gripper({ gap }: { gap: number }) {
  return (
    <group>
      <mesh position={[0, 3.6, 0]} material={metalMaterial}>
        <cylinderGeometry args={[3, 3, 1, 40]} />
      </mesh>
      <RoundedBox args={[12, 3, 5]} radius={0.6} smoothness={3} position={[0, 5.6, 0]} material={inkMaterial} />
      {SIDES.map((s) => (
        <group key={s} position={[s * (gap / 2 + 0.8), JAW_END - JAW_LEN / 2, 0]}>
          <RoundedBox args={[1.6, JAW_LEN, 3.6]} radius={0.3} smoothness={3} material={metalMaterial} />
          <mesh position={[-s * 0.85, -0.6, 0]} material={rubberMaterial}>
            <boxGeometry args={[0.1, JAW_LEN - 1.6, 3]} />
          </mesh>
        </group>
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
      <mesh position={[0, -3.4, 0]} material={inkMaterial}>
        <cylinderGeometry args={[3, 3, 1.6, 40]} />
      </mesh>
      <group rotation={[pitch, 0, 0]}>
        <Housing radius={3.2} width={6.2} />
        <group rotation={[0, flange, 0]}>
          <Gripper gap={gap} />
          {holding && <Part position={[0, HELD_Y, 0]} />}
        </group>
      </group>
    </group>
  );
}

/** The part while it rests on a plate: at the pick plate until it is grasped,
 * on the place plate once it has been let go. */
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
          <Housing radius={5} width={10} cap />
          <Link radius={3.6} length={UPPER} />
          <group position={[0, UPPER, 0]} rotation={[elbow, 0, 0]}>
            <Housing radius={4.2} width={8.4} />
            <Link radius={2.9} length={FORE - 3.4} />
            <Wrist roll={roll} pitch={pitch} flange={flange} gap={gap} holding={holding} />
          </group>
        </group>
      </group>
    </group>
  );
}
