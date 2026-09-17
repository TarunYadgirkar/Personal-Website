"use client";

import { useMemo } from "react";
import { Edges, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { INK, boneMaterial, glassMaterial, inkMaterial, rubberMaterial, rustMaterial, shadeMaterial } from "./drafting";

/* BALANCE, in centimeters. y is up, the user faces +z. The device stands
 * on the ground plane y = 0. The frame wraps the hips at about 95 cm; each
 * side carries a leg unit that ends in a wheel, with a powered foot that
 * swings down for stairs and rough ground.
 *
 * `stride` (0 to 1) moves the device from rolling (wheels down, feet up)
 * to stepping (feet planted, wheels lifted). */

export const HIP_Y = 92;
const HIP_RX = 21;
const HIP_RZ = 17;
const TUBE = 2.1;
const SIDES: Array<1 | -1> = [1, -1];

/** The hip ring, open at the back so the user can step in. */
function hipCurve(): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  const start = Math.PI * 0.62;
  const end = Math.PI * 2.38;
  const n = 40;
  for (let i = 0; i <= n; i++) {
    const a = start + ((end - start) * i) / n;
    pts.push(new THREE.Vector3(Math.sin(a) * HIP_RX, HIP_Y, Math.cos(a) * HIP_RZ));
  }
  return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.4);
}

/** Ink outline. Flat parts show every crease; round parts only their rims. */
function Outline({ round = false }: { round?: boolean }) {
  return <Edges threshold={round ? 60 : 24} color={INK} lineWidth={1} />;
}

function HipFrame() {
  const geometry = useMemo(() => new THREE.TubeGeometry(hipCurve(), 80, TUBE, 14, false), []);
  return (
    <group>
      <mesh geometry={geometry} material={boneMaterial} castShadow />
      {/* Padded pads inside the ring at the hips. */}
      {SIDES.map((s) => (
        <RoundedBox key={s} args={[3.2, 9, 14]} radius={1.2} position={[s * (HIP_RX - 3.4), HIP_Y, 1]} material={rubberMaterial}>
          <Outline />
        </RoundedBox>
      ))}
      {/* Battery and controller pack at the back. */}
      <RoundedBox args={[18, 8, 6]} radius={1.4} position={[0, HIP_Y - 1, -HIP_RZ - 2]} material={shadeMaterial} castShadow>
        <Outline />
      </RoundedBox>
      <mesh position={[0, HIP_Y - 1, -HIP_RZ - 5.2]} material={rustMaterial}>
        <boxGeometry args={[8, 1.2, 0.6]} />
      </mesh>
    </group>
  );
}

/** LiDAR puck and stereo cameras on the front of the ring. */
function SensorHead() {
  const z = HIP_RZ + 1.5;
  return (
    <group position={[0, HIP_Y, z]}>
      <RoundedBox args={[12, 5, 5]} radius={1} position={[0, 0, 0]} material={boneMaterial} castShadow>
        <Outline />
      </RoundedBox>
      <mesh position={[0, 4.4, -0.5]} material={inkMaterial}>
        <cylinderGeometry args={[3.2, 3.2, 3.6, 28]} />
        <Outline round />
      </mesh>
      <mesh position={[0, 4.4, -0.5]} material={rustMaterial}>
        <cylinderGeometry args={[3.3, 3.3, 0.6, 28]} />
      </mesh>
      {SIDES.map((s) => (
        <mesh key={s} position={[s * 3.6, -0.3, 2.6]} rotation={[Math.PI / 2, 0, 0]} material={glassMaterial}>
          <cylinderGeometry args={[1.1, 1.1, 0.5, 20]} />
        </mesh>
      ))}
      {/* Sonar transducers low on the housing. */}
      {SIDES.map((s) => (
        <mesh key={`sonar${s}`} position={[s * 1.4, -1.6, 2.6]} rotation={[Math.PI / 2, 0, 0]} material={inkMaterial}>
          <cylinderGeometry args={[0.6, 0.6, 0.4, 12]} />
        </mesh>
      ))}
    </group>
  );
}

interface LegProps {
  side: 1 | -1;
  stride: number;
}

const THIGH = 42;
const SHANK = 37;
const WHEEL_R = 11;

/** One leg unit: thigh, knee, shank, wheel at the end, and a powered foot. */
function Leg({ side, stride }: LegProps) {
  const x = side * (HIP_RX + 1.5);
  const thighAngle = THREE.MathUtils.lerp(0.06, 0.32, stride);
  const kneeAngle = THREE.MathUtils.lerp(-0.1, -0.7, stride);
  // Rolling: the foot folds up behind the shank. Stepping: it swings down and plants.
  const footAngle = THREE.MathUtils.lerp(-2.3, 0.12, stride);
  return (
    <group position={[x, HIP_Y - 2, 0]}>
      {/* Hip joint. */}
      <mesh rotation={[0, 0, Math.PI / 2]} material={inkMaterial}>
        <cylinderGeometry args={[3.6, 3.6, 5.4, 24]} />
        <Outline round />
      </mesh>
      <group rotation={[thighAngle, 0, 0]}>
        <RoundedBox args={[5, THIGH, 7.5]} radius={1.6} position={[0, -THIGH / 2, 0]} material={boneMaterial} castShadow>
          <Outline />
        </RoundedBox>
        {/* Knee. */}
        <group position={[0, -THIGH, 0]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={inkMaterial}>
            <cylinderGeometry args={[3.2, 3.2, 6.2, 24]} />
            <Outline round />
          </mesh>
          <group rotation={[kneeAngle, 0, 0]}>
            <RoundedBox args={[4.4, SHANK, 6.5]} radius={1.4} position={[0, -SHANK / 2, 0]} material={boneMaterial} castShadow>
              <Outline />
            </RoundedBox>
            {/* Knee actuator: a piston from the thigh down the back of the shank. */}
            <group position={[0, -SHANK * 0.28, -5.2]} rotation={[0.22, 0, 0]}>
              <mesh material={inkMaterial}>
                <cylinderGeometry args={[1.5, 1.5, 16, 16]} />
                <Outline round />
              </mesh>
              <mesh position={[0, 11, 0]} material={boneMaterial}>
                <cylinderGeometry args={[0.8, 0.8, 8, 12]} />
              </mesh>
            </group>
            {/* Wheel on the outside of the shank end. */}
            <group position={[side * 4.8, -SHANK + 1, 0]}>
              <mesh rotation={[0, 0, Math.PI / 2]} material={rubberMaterial} castShadow>
                <cylinderGeometry args={[WHEEL_R, WHEEL_R, 4.4, 48]} />
                <Outline round />
              </mesh>
              <mesh rotation={[0, 0, Math.PI / 2]} position={[side * 0.2, 0, 0]} material={boneMaterial}>
                <cylinderGeometry args={[6.4, 6.4, 5, 32]} />
                <Outline round />
              </mesh>
              <mesh rotation={[0, 0, Math.PI / 2]} position={[side * 0.4, 0, 0]} material={rustMaterial}>
                <cylinderGeometry args={[1.4, 1.4, 4.8, 16]} />
              </mesh>
            </group>
            {/* Powered foot: swings down from the shank end for stairs. */}
            <group position={[0, -SHANK + 1, 0]} rotation={[footAngle, 0, 0]}>
              <RoundedBox args={[3.4, 14, 4]} radius={1} position={[0, -7, 0]} material={shadeMaterial}>
                <Outline />
              </RoundedBox>
              <RoundedBox args={[8, 2, 12]} radius={0.8} position={[0, -14.4, 2]} material={rubberMaterial}>
                <Outline />
              </RoundedBox>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

/** A handle the user can hold, from the ring forward and up. */
function Handles() {
  return (
    <group>
      {SIDES.map((s) => (
        <group key={s} position={[s * 14, HIP_Y + 1, HIP_RZ - 6]}>
          <mesh rotation={[Math.PI / 2 - 0.5, 0, 0]} position={[0, 3, 3]} material={boneMaterial}>
            <cylinderGeometry args={[1.2, 1.2, 12, 14]} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 5.8, 8]} material={rubberMaterial}>
            <cylinderGeometry args={[1.5, 1.5, 9, 14]} />
            <Outline round />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function Balance({ stride }: { stride: number }) {
  return (
    <group>
      <HipFrame />
      <SensorHead />
      <Handles />
      {SIDES.map((s) => (
        <Leg key={s} side={s} stride={stride} />
      ))}
    </group>
  );
}
