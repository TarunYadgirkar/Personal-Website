"use client";

import { useEffect, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "@/lib/palette";

/* The scenes are rendered off screen, then printed onto the canvas in the
 * page's own inks: an ordered dither in 2 px dots, or ASCII glyphs. Shadows
 * and soft edges come out as dot density instead of grey. */

export type Look = "dither" | "ascii";

/* Every ink the print may use, light to dark, then the accents. */
const INKS = [
  palette.paperPale,
  palette.line,
  palette.lineStrong,
  palette.inkMute,
  palette.inkSoft,
  palette.ink,
  palette.amber,
  palette.rust,
  palette.rustDeep,
] as const;

/* Glyphs from sparse to dense. Even the lightest part of a model prints a dot. */
const RAMP = " .:-=+*#%@";

/* Cell size in CSS pixels: a dither dot, or one ASCII character. */
const CELL: Record<Look, [number, number]> = { dither: [2, 2], ascii: [6, 10] };

/** A hex colour as its sRGB components, without three's linear conversion. */
function srgb(hex: string): THREE.Vector3 {
  const n = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

const VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAGMENT = /* glsl */ `
#define INK_COUNT ${INKS.length}
#define GLYPHS ${RAMP.length}.0
uniform sampler2D tScene;
uniform sampler2D tGlyphs;
uniform vec2 uResolution;
uniform vec2 uCell;
uniform vec3 uInks[INK_COUNT];

/* The renderer's neutral tone map and sRGB encode, applied here because the
 * scene was drawn to a linear target. */
vec3 neutral(vec3 color) {
  const float start = 0.76;
  float x = min(color.r, min(color.g, color.b));
  color -= x < 0.08 ? x - 6.25 * x * x : 0.04;
  float peak = max(color.r, max(color.g, color.b));
  if (peak < start) return color;
  float d = 1.0 - start;
  float newPeak = 1.0 - d * d / (peak + d - start);
  color *= newPeak / peak;
  float g = 1.0 - 1.0 / (0.15 * (peak - newPeak) + 1.0);
  return mix(color, vec3(newPeak), g);
}

vec3 encode(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(pow(c, vec3(1.0 / 2.4)) * 1.055 - 0.055, c * 12.92, step(c, vec3(0.0031308)));
}

/* 8x8 Bayer threshold in [0, 1), built from three 2x2 levels. */
float bayer2(vec2 p) {
  p = mod(floor(p), 2.0);
  return mod(2.0 * p.y + p.x * 3.0, 4.0) / 4.0;
}
float bayer8(vec2 p) {
  return bayer2(p) + bayer2(p / 2.0) / 4.0 + bayer2(p / 4.0) / 16.0;
}

/* Nearest and second nearest ink, and how far c sits from the first toward the second. */
vec3 printInk(vec3 c, float threshold) {
  int a = 0;
  int b = 1;
  float da = 1e9;
  float db = 1e9;
  for (int i = 0; i < INK_COUNT; i++) {
    vec3 e = c - uInks[i];
    float d = dot(e, e);
    if (d < da) { db = da; b = a; da = d; a = i; }
    else if (d < db) { db = d; b = i; }
  }
  vec3 pa = uInks[a];
  vec3 pb = uInks[b];
  vec3 ab = pb - pa;
  float t = clamp(dot(c - pa, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
  return t > threshold ? pb : pa;
}

vec4 sampleCell(vec2 cell) {
  vec2 origin = cell * uCell;
#ifdef ASCII
  vec4 s = vec4(0.0);
  s += texture2D(tScene, (origin + uCell * vec2(0.25, 0.25)) / uResolution);
  s += texture2D(tScene, (origin + uCell * vec2(0.75, 0.25)) / uResolution);
  s += texture2D(tScene, (origin + uCell * vec2(0.25, 0.75)) / uResolution);
  s += texture2D(tScene, (origin + uCell * vec2(0.75, 0.75)) / uResolution);
  return s / 4.0;
#else
  return texture2D(tScene, (origin + uCell * 0.5) / uResolution);
#endif
}

void main() {
  vec2 cell = floor(gl_FragCoord.xy / uCell);
  vec4 s = sampleCell(cell);
  if (s.a < 0.02) { gl_FragColor = vec4(0.0); return; }
  vec3 c = encode(neutral(s.rgb / s.a));
#ifdef ASCII
  float lum = dot(c, vec3(0.2126, 0.7152, 0.0722));
  // Coverage thins the glyph at edges and in shadows; dark paint thickens it.
  float density = s.a * (0.32 + 0.68 * (1.0 - lum));
  float index = clamp(floor(density * GLYPHS), 1.0, GLYPHS - 1.0);
  vec2 local = fract(gl_FragCoord.xy / uCell);
  float mask = texture2D(tGlyphs, vec2((index + local.x) / GLYPHS, local.y)).a;
  // Glyphs print one step darker than the surface they stand for, so a pale shell still reads.
  vec3 ink = printInk(c * 0.55, 0.5);
  gl_FragColor = vec4(ink, 1.0) * mask;
#else
  float threshold = bayer8(cell);
  if (s.a < threshold) { gl_FragColor = vec4(0.0); return; }
  gl_FragColor = vec4(printInk(c, threshold), 1.0);
#endif
}
`;

/** A strip of the ramp's glyphs, white on clear, one cell each, in the page's mono face. */
function glyphAtlas(onReady: () => void): THREE.CanvasTexture {
  const [w, h] = [40, 64];
  const canvas = document.createElement("canvas");
  canvas.width = w * RAMP.length;
  canvas.height = h;
  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "monospace";
  const font = `600 ${Math.round(h * 0.82)}px ${family}`;
  const draw = () => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = font;
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    [...RAMP].forEach((ch, i) => ctx.fillText(ch, w * (i + 0.5), h * 0.54));
    texture.needsUpdate = true;
    onReady();
  };
  draw();
  document.fonts.load(font).then(draw, () => undefined);
  return texture;
}

function makeMaterial(look: Look, glyphs: THREE.Texture | null): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    defines: look === "ascii" ? { ASCII: "" } : {},
    uniforms: {
      tScene: { value: null },
      tGlyphs: { value: glyphs },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uCell: { value: new THREE.Vector2(1, 1) },
      uInks: { value: INKS.map(srgb) },
    },
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
  });
}

interface PrintPass {
  render: (gl: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) => void;
  dispose: () => void;
}

/** The off-screen target, the full-screen quad that prints it, and the draw that ties them. */
function createPass(look: Look, glyphs: THREE.Texture | null): PrintPass {
  const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
  const material = makeMaterial(look, glyphs);
  material.uniforms.tScene.value = target.texture;
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  quad.frustumCulled = false;
  const quadScene = new THREE.Scene().add(quad);
  const quadCamera = new THREE.Camera();
  const buffer = new THREE.Vector2();
  const [cw, ch] = CELL[look];
  return {
    render(gl, scene, camera) {
      gl.getDrawingBufferSize(buffer);
      target.setSize(buffer.x, buffer.y);
      material.uniforms.uResolution.value.copy(buffer);
      material.uniforms.uCell.value.set(cw, ch).multiplyScalar(gl.getPixelRatio());
      gl.setRenderTarget(target);
      gl.clear();
      gl.render(scene, camera);
      gl.setRenderTarget(null);
      gl.render(quadScene, quadCamera);
    },
    dispose() {
      target.dispose();
      material.dispose();
      quad.geometry.dispose();
      glyphs?.dispose();
    },
  };
}

/** Takes over drawing for the canvas it sits in: the scene goes to a linear
 * target, then one full-screen pass prints it in `look`. */
export function Print({ look }: { look: Look }) {
  const invalidate = useThree((s) => s.invalidate);
  const pass = useMemo(() => createPass(look, look === "ascii" ? glyphAtlas(invalidate) : null), [look, invalidate]);
  useEffect(() => () => pass.dispose(), [pass]);
  useFrame(({ gl, scene, camera }) => pass.render(gl, scene, camera), 1);
  return null;
}
