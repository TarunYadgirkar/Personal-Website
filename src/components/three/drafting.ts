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

/** Lets the browser restore a lost WebGL context, then asks for a frame so the canvas is not left blank. */
export function keepContextRestorable(gl: { domElement: HTMLCanvasElement }, redraw: () => void): void {
  gl.domElement.addEventListener("webglcontextlost", (e) => e.preventDefault(), false);
  gl.domElement.addEventListener("webglcontextrestored", () => redraw(), false);
}

/** True when the page cannot tell what is on screen, so scenes should assume they are. */
export const NO_OBSERVER = typeof window !== "undefined" && typeof IntersectionObserver === "undefined";

export const INK = "#1d1a16";
