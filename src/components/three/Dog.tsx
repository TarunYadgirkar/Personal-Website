"use client";

import { Edges, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { INK, boneMaterial, glassMaterial, inkMaterial, rubberMaterial, rustMaterial, shadeMaterial } from "./drafting";

/* A quadruped in Unitree Go2 proportions, in centimetres. y is up, the
 * ground plane is y = 0, the dog faces +z. The body is 70 long over all,
 * 31 wide and 15 deep, carried at 40 to the top of the shell. `t` is a
 * looping phase in [0, 1): the dog stands in place and shifts its weight,
 * it does not walk. */

export const DOG_SIZE = { height: 48, targetY: 22 } as const;

const BODY_Y = 33;
const BODY_W = 31;
const BODY_H = 15;
const BODY_L = 62;
const THIGH = 21;
const CALF = 21;
const FOOT_R = 2.2;
const HIP_X = 13;
const HIP_Z = 22;

/* Standing solve. The hip pivot sits at y = 33 and the foot centre must
 * rest one foot radius off the floor, so the vertical drop from hip to
 * foot is 33 - 2.2 = 30.8. With the thigh angle a and the calf angle b
 * both measured from vertical, 21 cos a + 21 cos b = 30.8. Taking a = 0.8
 * gives cos b = 30.8/21 - cos 0.8 = 0.76996, so b = 0.692 and the knee
 * carries a + b = 1.492 rad of flex.
 *
 * Lifting a foot shortens the drop: at the full 1.5 cm lift the hip opens
 * to 0.62 and the same equation gives b = 0.950, so the knee flexes to
 * 1.570 rad. The hip does less and the knee does more, as asked. */
const DROP = BODY_Y - FOOT_R;
const HIP_STAND = 0.8;
const HIP_LIFTED = 0.62;
const LIFT_MAX = 1.5;

const SIDES: Array<1 | -1> = [1, -1];
const ENDS: Array<1 | -1> = [1, -1];

/** Ink outline. Flat parts show every crease; round parts only their rims. */
function Outline({ round = false }: { round?: boolean }) {
  return <Edges threshold={round ? 60 : 24} color={INK} lineWidth={1} />;
}

function legAngles(lift: number): { hip: number; knee: number } {
  const hip = THREE.MathUtils.lerp(HIP_STAND, HIP_LIFTED, lift);
  const drop = DROP - LIFT_MAX * lift;
  const calf = Math.acos((drop - THIGH * Math.cos(hip)) / CALF);
  return { hip, knee: hip + calf };
}

/** Diagonal pairs take turns: one pair unweights over the first half of the
 * loop, the other over the second. */
function liftAt(t: number, first: boolean): number {
  const p = first ? t : (t + 0.5) % 1;
  return THREE.MathUtils.smoothstep(p, 0, 0.16) - THREE.MathUtils.smoothstep(p, 0.34, 0.5);
}

function Torso() {
  return (
    <group position={[0, BODY_Y, 0]}>
      <RoundedBox args={[BODY_W, BODY_H, BODY_L]} radius={4} material={boneMaterial} castShadow>
        <Outline />
      </RoundedBox>
      <RoundedBox args={[24, 3, 50]} radius={2} position={[0, -BODY_H / 2 - 0.6, 0]} material={shadeMaterial} castShadow>
        <Outline />
      </RoundedBox>
    </group>
  );
}

/** Spine strip along the top: status light at the rear, carry handle forward. */
function BackPlate() {
  const y = BODY_Y + BODY_H / 2;
  return (
    <group>
      <RoundedBox args={[14, 1.2, 44]} radius={0.5} position={[0, y + 0.2, 0]} material={shadeMaterial}>
        <Outline />
      </RoundedBox>
      <mesh position={[0, y + 0.9, -18]} material={rustMaterial}>
        <boxGeometry args={[5, 0.5, 1.4]} />
      </mesh>
      {SIDES.map((s) => (
        <mesh key={s} position={[s * 4, y + 2.4, 14]} material={inkMaterial}>
          <cylinderGeometry args={[0.7, 0.7, 4, 12]} />
          <Outline round />
        </mesh>
      ))}
      <mesh position={[0, y + 4.2, 14]} rotation={[0, 0, Math.PI / 2]} material={inkMaterial}>
        <cylinderGeometry args={[0.7, 0.7, 9.4, 12]} />
        <Outline round />
      </mesh>
    </group>
  );
}

function Head() {
  return (
    <group position={[0, BODY_Y, 35]}>
      <RoundedBox args={[20, 11, 8]} radius={3} material={shadeMaterial} castShadow>
        <Outline />
      </RoundedBox>
      <mesh position={[0, 0.4, 3.7]} material={glassMaterial}>
        <boxGeometry args={[16, 4, 0.6]} />
      </mesh>
      {SIDES.map((s) => (
        <mesh key={s} position={[s * 4.6, 0.4, 3.2]} rotation={[Math.PI / 2, 0, 0]} material={inkMaterial}>
          <cylinderGeometry args={[1.2, 1.2, 0.5, 20]} />
        </mesh>
      ))}
      <mesh position={[0, 5, 2.2]} material={inkMaterial}>
        <sphereGeometry args={[2.4, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <Outline round />
      </mesh>
      <mesh position={[0, 5, 2.2]} material={rustMaterial}>
        <cylinderGeometry args={[2.5, 2.5, 0.5, 24]} />
      </mesh>
    </group>
  );
}

interface LegProps {
  side: 1 | -1;
  end: 1 | -1;
  lift: number;
}

/* The knees face the middle of the dog, as a Go2 stands: the front thighs
 * rake back to the knee and the rear thighs rake forward, so `end` flips
 * the sign of both joints. */
function Leg({ side, end, lift }: LegProps) {
  const { hip, knee } = legAngles(lift);
  return (
    <group position={[side * HIP_X, BODY_Y, end * HIP_Z]}>
      <mesh position={[side * 3.5, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={inkMaterial}>
        <cylinderGeometry args={[3.6, 3.6, 6, 24]} />
        <Outline round />
      </mesh>
      <group position={[side * 3, 0, 0]} rotation={[end * hip, 0, 0]}>
        <RoundedBox args={[5, THIGH, 7]} radius={1.8} position={[0, -THIGH / 2, 0]} material={boneMaterial} castShadow>
          <Outline />
        </RoundedBox>
        <group position={[0, -THIGH, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={inkMaterial}>
            <cylinderGeometry args={[3, 3, 5.4, 24]} />
            <Outline round />
          </mesh>
          <group rotation={[-end * knee, 0, 0]}>
            <RoundedBox args={[3.4, CALF, 4]} radius={1.4} position={[0, -CALF / 2, 0]} material={boneMaterial} castShadow>
              <Outline />
            </RoundedBox>
            <mesh position={[0, -CALF, 0]} material={rubberMaterial} castShadow>
              <sphereGeometry args={[FOOT_R, 20, 14]} />
              <Outline round />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

export function Dog({ t }: { t: number }) {
  // The bob only ever rides above the standing height, so no foot is pushed
  // through the floor by the weight shift.
  const bob = 0.3 + 0.3 * Math.sin(t * Math.PI * 2);
  return (
    <group position={[0, bob, 0]}>
      <Torso />
      <BackPlate />
      <Head />
      {SIDES.map((s) =>
        ENDS.map((e) => <Leg key={`${s}${e}`} side={s} end={e} lift={liftAt(t, s * e === -1)} />),
      )}
    </group>
  );
}
