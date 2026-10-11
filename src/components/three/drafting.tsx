import { Edges } from "@react-three/drei";
import * as THREE from "three";
import { palette } from "@/lib/palette";

/* The drawing style shared by every model: flat bone surfaces with a dark
 * ink outline, the way a technical illustration is inked. Materials are
 * built once and shared. */

export const boneMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#f7f4ec"),
  roughness: 0.92,
  metalness: 0,
  flatShading: false,
});

export const shadeMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#e4ded0"),
  roughness: 0.95,
  metalness: 0,
});

export const inkMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#2a2622"),
  roughness: 0.7,
  metalness: 0.05,
});

export const rustMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(palette.rust),
  roughness: 0.6,
  metalness: 0,
});

export const rubberMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#3a3531"),
  roughness: 0.98,
  metalness: 0,
});

export const glassMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(palette.ink),
  roughness: 0.15,
  metalness: 0.3,
});

/** Ink outline. Flat parts show every crease; round parts only their rims. */
export function Outline({ round = false }: { round?: boolean }) {
  return <Edges threshold={round ? 60 : 24} color={palette.ink} lineWidth={1} />;
}

/** Left and right, for parts drawn once per side and mirrored in x. */
export type Side = 1 | -1;
export const SIDES: readonly Side[] = [1, -1];
