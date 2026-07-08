"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Props = { className?: string };
type Phase = "form" | "hold" | "scatter";
type DrawFn = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

const TWO_PI = Math.PI * 2;
const DESKTOP_COUNT = 900;
const NARROW_COUNT = 450;
const NARROW_BREAKPOINT = 640;
const MAX_DPR = 2;
const BRIGHT_FRACTION = 0.16;
const FORM_MS = 1500;
const HOLD_MS = 2500;
const SCATTER_MS = 900;
const FORM_EASE = 0.09;
const SCATTER_EASE = 0.05;
const ALPHA_MIN = 0.5;
const ALPHA_RANGE = 0.35;

function parseRgb(value: string, fallback: string): string {
  const v = value.trim();
  if (v.startsWith("#")) {
    let hex = v.slice(1);
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    const int = parseInt(hex, 16);
    if (Number.isNaN(int)) return fallback;
    return `${(int >> 16) & 255},${(int >> 8) & 255},${int & 255}`;
  }
  const m = v.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  return m ? `${m[1]},${m[2]},${m[3]}` : fallback;
}

const drawWaveform: DrawFn = (ctx, w, h) => {
  const mid = h / 2;
  const amp = h * 0.3;
  const x0 = w * 0.05;
  const x1 = w - x0;
  const splitX = x0 + (x1 - x0) * 0.5;
  const sinePeriod = (splitX - x0) / 2.6;
  ctx.strokeStyle = "#fff";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(2, h * 0.11);
  ctx.beginPath();
  const steps = 120;
  for (let i = 0; i <= steps; i++) {
    const x = x0 + ((splitX - x0) * i) / steps;
    const y = mid - amp * Math.sin(((x - x0) / sinePeriod) * TWO_PI);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  let level = mid - amp;
  ctx.lineTo(splitX, level);
  const cells = 6;
  const cw = (x1 - splitX) / cells;
  let cx = splitX;
  for (let c = 0; c < cells; c++) {
    const nx = cx + cw;
    ctx.lineTo(nx, level);
    const next = level === mid - amp ? mid + amp : mid - amp;
    ctx.lineTo(nx, next);
    level = next;
    cx = nx;
  }
  ctx.stroke();
};

const NODES: readonly [number, number][] = [
  [0.1, 0.55], [0.24, 0.25], [0.3, 0.78], [0.45, 0.5], [0.58, 0.22],
  [0.62, 0.75], [0.76, 0.45], [0.88, 0.68], [0.9, 0.3],
];
const EDGES: readonly [number, number][] = [
  [0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5], [4, 6], [5, 6], [6, 7], [6, 8], [4, 8],
];

const drawNodes: DrawFn = (ctx, w, h) => {
  const pad = Math.min(w, h) * 0.12;
  const px = (n: number) => pad + n * (w - 2 * pad);
  const py = (n: number) => pad + n * (h - 2 * pad);
  ctx.strokeStyle = "#fff";
  ctx.lineCap = "round";
  ctx.lineWidth = Math.max(1.2, h * 0.03);
  for (const [a, b] of EDGES) {
    ctx.beginPath();
    ctx.moveTo(px(NODES[a][0]), py(NODES[a][1]));
    ctx.lineTo(px(NODES[b][0]), py(NODES[b][1]));
    ctx.stroke();
  }
  ctx.fillStyle = "#fff";
  NODES.forEach((node, i) => {
    ctx.beginPath();
    ctx.arc(px(node[0]), py(node[1]), h * (0.09 + (i % 3) * 0.02), 0, TWO_PI);
    ctx.fill();
  });
};

const drawArm: DrawFn = (ctx, w, h) => {
  const px = (n: number) => n * w;
  const py = (n: number) => n * h;
  const base: [number, number] = [0.12, 0.82];
  const shoulder: [number, number] = [0.16, 0.55];
  const elbow: [number, number] = [0.42, 0.3];
  const wrist: [number, number] = [0.66, 0.62];
  const bx = px(base[0]);
  const by = py(base[1]);
  ctx.fillStyle = "#fff";
  ctx.fillRect(bx - w * 0.03, by, w * 0.06, h - by - h * 0.04);
  ctx.fillRect(bx - w * 0.05, h - h * 0.1, w * 0.1, h * 0.05);
  ctx.strokeStyle = "#fff";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(3, h * 0.13);
  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.lineTo(px(shoulder[0]), py(shoulder[1]));
  ctx.lineTo(px(elbow[0]), py(elbow[1]));
  ctx.lineTo(px(wrist[0]), py(wrist[1]));
  ctx.stroke();
  for (const j of [shoulder, elbow, wrist]) {
    ctx.beginPath();
    ctx.arc(px(j[0]), py(j[1]), Math.max(3, h * 0.09), 0, TWO_PI);
    ctx.fill();
  }
  const gx = px(wrist[0]);
  const gy = py(wrist[1]);
  const dx = px(wrist[0]) - px(elbow[0]);
  const dy = py(wrist[1]) - py(elbow[1]);
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  const gl = h * 0.22;
  const spread = h * 0.14;
  ctx.lineWidth = Math.max(2, h * 0.07);
  ctx.beginPath();
  ctx.moveTo(gx, gy);
  ctx.lineTo(gx + ux * gl * 0.4 + nx * spread, gy + uy * gl * 0.4 + ny * spread);
  ctx.lineTo(gx + ux * gl + nx * spread, gy + uy * gl + ny * spread);
  ctx.moveTo(gx, gy);
  ctx.lineTo(gx + ux * gl * 0.4 - nx * spread, gy + uy * gl * 0.4 - ny * spread);
  ctx.lineTo(gx + ux * gl - nx * spread, gy + uy * gl - ny * spread);
  ctx.stroke();
};

const SHAPES: readonly DrawFn[] = [drawWaveform, drawNodes, drawArm];

export function ParticleField({ className }: Props) {
  const prefersReduced = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const off = document.createElement("canvas");
    const octx = off.getContext("2d", { willReadFrequently: true });
    if (!octx) return;

    const reduced = prefersReduced === true;

    let raf = 0;
    let running = false;
    let visible = true;
    let pauseTs = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let n = 0;
    let shapes: Float32Array[] = [];
    let shapeIndex = 0;
    let phase: Phase = "form";
    let phaseStart = 0;
    let rgb = "154,82,15";
    let rgbBright = "126,65,10";

    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let hx = new Float32Array(0);
    let hy = new Float32Array(0);
    let sx = new Float32Array(0);
    let sy = new Float32Array(0);
    let ba = new Float32Array(0);
    let jp = new Float32Array(0);
    let jf = new Float32Array(0);
    let ja = new Float32Array(0);
    let rx = new Float32Array(0);
    let ry = new Float32Array(0);
    let ra = new Float32Array(0);
    let bright = new Uint8Array(0);

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      rgb = parseRgb(cs.getPropertyValue("--accent"), "154,82,15");
      rgbBright = parseRgb(cs.getPropertyValue("--accent-bright"), "126,65,10");
    };

    const sampleTargets = (drawFn: DrawFn, count: number): Float32Array => {
      const ow = Math.max(1, Math.min(Math.round(w), 2000));
      const oh = Math.max(1, Math.min(Math.round(h), 600));
      off.width = ow;
      off.height = oh;
      octx.clearRect(0, 0, ow, oh);
      drawFn(octx, ow, oh);
      const data = octx.getImageData(0, 0, ow, oh).data;
      const xs: number[] = [];
      const ys: number[] = [];
      for (let y = 0; y < oh; y++) {
        const row = y * ow;
        for (let x = 0; x < ow; x++) {
          if (data[(row + x) * 4 + 3] > 128) {
            xs.push(x);
            ys.push(y);
          }
        }
      }
      const out = new Float32Array(count * 2);
      const m = xs.length;
      if (m === 0) {
        for (let i = 0; i < count; i++) {
          out[i * 2] = Math.random() * w;
          out[i * 2 + 1] = Math.random() * h;
        }
        return out;
      }
      const scaleX = w / ow;
      const scaleY = h / oh;
      const idx = new Uint32Array(m);
      for (let i = 0; i < m; i++) idx[i] = i;
      const pick = Math.min(count, m);
      for (let i = 0; i < pick; i++) {
        const j = i + ((Math.random() * (m - i)) | 0);
        const t = idx[i];
        idx[i] = idx[j];
        idx[j] = t;
        out[i * 2] = xs[idx[i]] * scaleX;
        out[i * 2 + 1] = ys[idx[i]] * scaleY;
      }
      for (let i = pick; i < count; i++) {
        const src = idx[i % pick];
        out[i * 2] = xs[src] * scaleX + (Math.random() - 0.5) * 2;
        out[i * 2 + 1] = ys[src] * scaleY + (Math.random() - 0.5) * 2;
      }
      return out;
    };

    const buildParticles = () => {
      px = new Float32Array(n);
      py = new Float32Array(n);
      hx = new Float32Array(n);
      hy = new Float32Array(n);
      sx = new Float32Array(n);
      sy = new Float32Array(n);
      ba = new Float32Array(n);
      jp = new Float32Array(n);
      jf = new Float32Array(n);
      ja = new Float32Array(n);
      rx = new Float32Array(n);
      ry = new Float32Array(n);
      ra = new Float32Array(n);
      bright = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        px[i] = Math.random() * w;
        py[i] = Math.random() * h;
        ba[i] = ALPHA_MIN + Math.random() * ALPHA_RANGE;
        bright[i] = Math.random() < BRIGHT_FRACTION ? 1 : 0;
        jp[i] = Math.random() * TWO_PI;
        jf[i] = 0.001 + Math.random() * 0.002;
        ja[i] = 0.4 + Math.random() * 0.5;
      }
    };

    const assignHome = (index: number) => {
      const s = shapes[index];
      for (let i = 0; i < n; i++) {
        hx[i] = s[i * 2];
        hy[i] = s[i * 2 + 1];
      }
    };

    const computeScatter = () => {
      const cx = w / 2;
      const cy = h / 2;
      const diag = Math.hypot(w, h);
      for (let i = 0; i < n; i++) {
        const a = Math.random() * TWO_PI;
        const rr = (0.25 + Math.random() * 0.45) * diag;
        sx[i] = cx + Math.cos(a) * rr;
        sy[i] = cy + Math.sin(a) * rr;
      }
    };

    const setup = (): boolean => {
      const rect = canvas.getBoundingClientRect();
      const nw = rect.width;
      const nh = rect.height;
      if (nw < 1 || nh < 1) return false;
      const ndpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const nn = nw < NARROW_BREAKPOINT ? NARROW_COUNT : DESKTOP_COUNT;
      if (
        Math.round(nw) === Math.round(w) &&
        Math.round(nh) === Math.round(h) &&
        ndpr === dpr &&
        nn === n &&
        shapes.length === SHAPES.length
      ) {
        return false;
      }
      w = nw;
      h = nh;
      dpr = ndpr;
      n = nn;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readColors();
      shapes = SHAPES.map((fn) => sampleTargets(fn, n));
      buildParticles();
      shapeIndex = 0;
      assignHome(0);
      phase = "form";
      phaseStart = performance.now();
      return true;
    };

    const drawPass = (brightPass: boolean) => {
      ctx.fillStyle = brightPass ? `rgb(${rgbBright})` : `rgb(${rgb})`;
      const r = brightPass ? 1.5 : 1.05;
      for (let i = 0; i < n; i++) {
        if ((bright[i] === 1) !== brightPass) continue;
        const a = ra[i];
        if (a <= 0.02) continue;
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.arc(rx[i], ry[i], r, 0, TWO_PI);
        ctx.fill();
      }
    };

    const advance = (now: number) => {
      const elapsed = now - phaseStart;
      if (phase === "form" && elapsed >= FORM_MS) {
        phase = "hold";
        phaseStart = now;
      } else if (phase === "hold" && elapsed >= HOLD_MS) {
        phase = "scatter";
        phaseStart = now;
        computeScatter();
      } else if (phase === "scatter" && elapsed >= SCATTER_MS) {
        shapeIndex = (shapeIndex + 1) % shapes.length;
        assignHome(shapeIndex);
        phase = "form";
        phaseStart = now;
      }
    };

    const render = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      const scatter = phase === "scatter";
      const dur = phase === "form" ? FORM_MS : phase === "hold" ? HOLD_MS : SCATTER_MS;
      const p = Math.min(1, (now - phaseStart) / dur);
      let sa: number;
      if (phase === "form") sa = 0.25 + 0.75 * (1 - (1 - p) * (1 - p));
      else if (phase === "hold") sa = 1;
      else sa = 1 - 0.75 * (p * p);
      const ease = scatter ? SCATTER_EASE : FORM_EASE;
      for (let i = 0; i < n; i++) {
        const tx = scatter ? sx[i] : hx[i];
        const ty = scatter ? sy[i] : hy[i];
        const x = px[i] + (tx - px[i]) * ease;
        const y = py[i] + (ty - py[i]) * ease;
        px[i] = x;
        py[i] = y;
        rx[i] = x + Math.sin(now * jf[i] + jp[i]) * ja[i];
        ry[i] = y + Math.cos(now * jf[i] + jp[i] * 1.3) * ja[i];
        ra[i] = ba[i] * sa;
      }
      drawPass(false);
      drawPass(true);
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      advance(now);
      render(now);
      raf = requestAnimationFrame(frame);
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < n; i++) {
        rx[i] = hx[i];
        ry[i] = hy[i];
        ra[i] = ba[i];
      }
      drawPass(false);
      drawPass(true);
      ctx.globalAlpha = 1;
    };

    const sync = () => {
      if (reduced) return;
      const run = visible && !document.hidden;
      if (run && !running) {
        running = true;
        if (pauseTs) phaseStart += performance.now() - pauseTs;
        pauseTs = 0;
        raf = requestAnimationFrame(frame);
      } else if (!run && running) {
        running = false;
        pauseTs = performance.now();
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const ready = setup();
    if (reduced) {
      if (ready) drawStatic();
    }

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting);
        sync();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(() => {
      const changed = setup();
      if (!changed) return;
      if (reduced) drawStatic();
      else sync();
    });
    ro.observe(canvas);

    if (!reduced) sync();

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [prefersReduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={["block w-full", className].filter(Boolean).join(" ")}
    />
  );
}
