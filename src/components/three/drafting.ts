import * as THREE from "three";

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
  color: new THREE.Color("#c5400a"),
  roughness: 0.6,
  metalness: 0,
});

export const rubberMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#3a3531"),
  roughness: 0.98,
  metalness: 0,
});

export const glassMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color("#1d1a16"),
  roughness: 0.15,
  metalness: 0.3,
});

export const INK = "#1d1a16";
export const INK_SOFT = "#4d4740";
