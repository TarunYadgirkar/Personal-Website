"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Props = { className?: string };
type DrawFn = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

const TWO_PI = Math.PI * 2;
const DESKTOP_COUNT = 900;
const NARROW_COUNT = 450;
const NARROW_BREAKPOINT = 640;
const MAX_DPR = 2;
const BRIGHT_FRACTION = 0.16;
const ALPHA_MIN = 0.5;
const ALPHA_RANGE = 0.35;
const SPRING = 0.012;
const DAMPING = 0.86;
const REPEL_RADIUS = 90;
const REPEL_STRENGTH = 2.5;
const AUTO_MIN_MS = 6000;
const AUTO_MAX_MS = 9000;
const AUTO_SWEEP_MS = 1500;

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
  // A flat plateau bridges the sine and box segments so the handoff reads
  // as a deliberate pause rather than an instant corner.
  const transition = (x1 - x0) * 0.07;
  const sineEnd = splitX - transition / 2;
  const boxStart = splitX + transition / 2;
  // 2.25 cycles lands the sine exactly on a peak (mid - amp) at sineEnd, so
  // it hands off to the plateau/box wave's first level with no vertical jump.
  const sinePeriod = (sineEnd - x0) / 2.25;
  ctx.strokeStyle = "#fff";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(2, h * 0.11);
  ctx.beginPath();
  const steps = 120;
  for (let i = 0; i <= steps; i++) {
    const x = x0 + ((sineEnd - x0) * i) / steps;
    const y = mid - amp * Math.sin(((x - x0) / sinePeriod) * TWO_PI);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  // The sine ends within float epsilon of mid - amp (see above); snapping to
  // the exact constant keeps the box alternation's equality check exact.
  let level = mid - amp;
  ctx.lineTo(boxStart, level);
  const cells = 6;
  const cw = (x1 - boxStart) / cells;
  let cx = boxStart;
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
    let w = 0;
    let h = 0;
    let dpr = 1;
    let n = 0;
    let rgb = "154,82,15";
    let rgbBright = "126,65,10";
    let mouseX: number | null = null;
    let mouseY: number | null = null;
    let ghost: { x: number; y: number } | null = null;
    let ghostStart = 0;
    let nextAutoAt = 0;
    let sweepDir = 1;

    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let hx = new Float32Array(0);
    let hy = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let ba = new Float32Array(0);
    let jp = new Float32Array(0);
    let jf = new Float32Array(0);
    let ja = new Float32Array(0);
    let rx = new Float32Array(0);
    let ry = new Float32Array(0);
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
      vx = new Float32Array(n);
      vy = new Float32Array(n);
      ba = new Float32Array(n);
      jp = new Float32Array(n);
      jf = new Float32Array(n);
      ja = new Float32Array(n);
      rx = new Float32Array(n);
      ry = new Float32Array(n);
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

    const applyHome = (target: Float32Array) => {
      for (let i = 0; i < n; i++) {
        hx[i] = target[i * 2];
        hy[i] = target[i * 2 + 1];
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
        nn === n
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
      const target = sampleTargets(drawWaveform, n);
      buildParticles();
      applyHome(target);
      return true;
    };

    const drawPass = (brightPass: boolean) => {
      ctx.fillStyle = brightPass ? `rgb(${rgbBright})` : `rgb(${rgb})`;
      const r = brightPass ? 1.5 : 1.05;
      for (let i = 0; i < n; i++) {
        if ((bright[i] === 1) !== brightPass) continue;
        ctx.globalAlpha = ba[i];
        ctx.beginPath();
        ctx.arc(rx[i], ry[i], r, 0, TWO_PI);
        ctx.fill();
      }
    };

    const render = (now: number) => {
      if (nextAutoAt === 0) nextAutoAt = now + 3500;

      let effX: number | null = null;
      let effY: number | null = null;
      if (mouseX !== null && mouseY !== null) {
        ghost = null;
        nextAutoAt = now + AUTO_MAX_MS;
        effX = mouseX;
        effY = mouseY;
      } else {
        if (ghost === null && now >= nextAutoAt) {
          sweepDir *= -1;
          ghostStart = now;
          ghost = { x: sweepDir === 1 ? -REPEL_RADIUS : w + REPEL_RADIUS, y: h / 2 };
        }
        if (ghost !== null) {
          const t = (now - ghostStart) / AUTO_SWEEP_MS;
          if (t >= 1) {
            ghost = null;
            nextAutoAt = now + AUTO_MIN_MS + Math.random() * (AUTO_MAX_MS - AUTO_MIN_MS);
          } else {
            const te = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
            const start = sweepDir === 1 ? -REPEL_RADIUS : w + REPEL_RADIUS;
            const end = sweepDir === 1 ? w + REPEL_RADIUS : -REPEL_RADIUS;
            ghost = { x: start + (end - start) * te, y: h / 2 + Math.sin(t * Math.PI) * 6 };
          }
        }
        if (ghost !== null) {
          effX = ghost.x;
          effY = ghost.y;
        }
      }

      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < n; i++) {
        let ax = (hx[i] - px[i]) * SPRING;
        let ay = (hy[i] - py[i]) * SPRING;
        if (effX !== null && effY !== null) {
          const dx = px[i] - effX;
          const dy = py[i] - effY;
          const dist = Math.hypot(dx, dy);
          if (dist > 0 && dist < REPEL_RADIUS) {
            const push = 1 - dist / REPEL_RADIUS;
            ax += (dx / dist) * push * REPEL_STRENGTH;
            ay += (dy / dist) * push * REPEL_STRENGTH;
          }
        }
        vx[i] = (vx[i] + ax) * DAMPING;
        vy[i] = (vy[i] + ay) * DAMPING;
        px[i] += vx[i];
        py[i] += vy[i];
        rx[i] = px[i] + Math.sin(now * jf[i] + jp[i]) * ja[i];
        ry[i] = py[i] + Math.cos(now * jf[i] + jp[i] * 1.3) * ja[i];
      }
      drawPass(false);
      drawPass(true);
      ctx.globalAlpha = 1;
    };

    const frame = (now: number) => {
      render(now);
      raf = requestAnimationFrame(frame);
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < n; i++) {
        rx[i] = hx[i];
        ry[i] = hy[i];
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
        raf = requestAnimationFrame(frame);
      } else if (!run && running) {
        running = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < -REPEL_RADIUS || y < -REPEL_RADIUS || x > rect.width + REPEL_RADIUS || y > rect.height + REPEL_RADIUS) {
        mouseX = null;
        mouseY = null;
        return;
      }
      mouseX = x;
      mouseY = y;
    };

    const onPointerLeave = () => {
      mouseX = null;
      mouseY = null;
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

    if (!reduced) {
      sync();
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerleave", onPointerLeave, { passive: true });
      window.addEventListener("mouseout", onPointerLeave, { passive: true });
    }

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("mouseout", onPointerLeave);
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
