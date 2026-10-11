import * as THREE from "three";
import { palette } from "@/lib/palette";

/* The finishes shared by every model, lit like a product shot: a satin
 * painted shell, dark anodised joints, brushed metal, rubber and the rust
 * accent. Materials are built once and shared. */

/** Material colours that are not page colours; the page ones come from the palette. */
export const FINISH = {
  shell: "#ece7dd",
  shellShade: "#d6cfc2",
  graphite: "#3d3935",
  rubber: "#2a2724",
  aluminium: "#c9c6c0",
  gold: "#d9a441",
  soldermask: "#0f3322",
  trace: "#1b4a30",
  silkscreen: "#ece7dd",
  epoxy: "#1f1d1b",
  ceramic: "#b5a07c",
  ledOff: "#f0d9c8",
  substrate: "#3a3426",
} as const;

/** Satin painted shell, the body colour of every device. */
export const boneMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(FINISH.shell),
  roughness: 0.42,
  clearcoat: 0.6,
  clearcoatRoughness: 0.28,
});

/** A darker shell for covers and secondary housings. */
export const shadeMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(FINISH.shellShade),
  roughness: 0.55,
  clearcoat: 0.3,
  clearcoatRoughness: 0.4,
});

/** Dark anodised aluminium for joints and actuators. */
export const inkMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(FINISH.graphite),
  roughness: 0.36,
  metalness: 0.5,
  clearcoat: 0.4,
  clearcoatRoughness: 0.3,
});

export const rustMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(palette.rust),
  roughness: 0.38,
  clearcoat: 0.7,
  clearcoatRoughness: 0.2,
});

export const rubberMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(FINISH.rubber),
  roughness: 0.85,
});

/** Brushed aluminium for flanges, axles and fasteners. */
export const metalMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(FINISH.aluminium),
  roughness: 0.28,
  metalness: 1,
});

/** Gold plating on connectors and pads. */
export const goldMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(FINISH.gold),
  roughness: 0.25,
  metalness: 1,
});

/** Camera and sensor glass: near black and mirror smooth. */
export const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(palette.ink),
  roughness: 0.05,
  metalness: 0.2,
  clearcoat: 1,
  clearcoatRoughness: 0.03,
});

/** Left and right, for parts drawn once per side and mirrored in x. */
export type Side = 1 | -1;
export const SIDES: readonly Side[] = [1, -1];
