"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const BOX = 460;
const HALF = BOX / 2;
const DEG = Math.PI / 180;

type Segment = { l1: number; l2: number; scale: number; opacity: number; hasRing: boolean };

const SEGMENTS: readonly Segment[] = [
  { l1: 111, l2: 100, scale: 0.78, opacity: 0.85, hasRing: false },
  { l1: 96, l2: 106, scale: 0.85, opacity: 0.65, hasRing: true },
  { l1: 82, l2: 78, scale: 0.7, opacity: 0.5, hasRing: false },
  { l1: 111, l2: 100, scale: 1, opacity: 0.85, hasRing: false },
];

type ArmSpec = {
  side: "left" | "right";
  topPercent: number;
  segment: number;
  restDeg: number;
  coneDeg: number;
  bend: 1 | -1;
  tau: number;
  wanderDeg: number;
  wanderPeriod: number;
  wanderPhase: number;
};

const ARMS: readonly ArmSpec[] = [
  { side: "left", topPercent: 22, segment: 0, restDeg: 8, coneDeg: 52, bend: 1, tau: 0.28, wanderDeg: 7, wanderPeriod: 7, wanderPhase: 0 },
  { side: "left", topPercent: 50, segment: 1, restDeg: -4, coneDeg: 52, bend: -1, tau: 0.32, wanderDeg: 8, wanderPeriod: 9, wanderPhase: 2 },
  { side: "left", topPercent: 78, segment: 2, restDeg: 18, coneDeg: 48, bend: 1, tau: 0.26, wanderDeg: 6, wanderPeriod: 6, wanderPhase: 4 },
  { side: "right", topPercent: 14, segment: 3, restDeg: 180, coneDeg: 34, bend: -1, tau: 0.6, wanderDeg: 4, wanderPeriod: 11, wanderPhase: 1 },
];

type Pose = { ex: number; ey: number; wx: number; wy: number };

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const shortestDelta = (from: number, to: number) =>
  Math.atan2(Math.sin(to - from), Math.cos(to - from));

function solve(spec: ArmSpec, seg: Segment, tx: number, ty: number): Pose {
  const restRad = spec.restDeg * DEG;
  const coneRad = spec.coneDeg * DEG;
  const phi = restRad + clamp(shortestDelta(restRad, Math.atan2(ty, tx)), -coneRad, coneRad);
  const reach = seg.l1 + seg.l2;
  const dist = clamp(Math.hypot(tx, ty), Math.abs(seg.l1 - seg.l2) + 6, reach - 4);
  const wx = Math.cos(phi) * dist;
  const wy = Math.sin(phi) * dist;
  const cosShoulder = clamp((seg.l1 * seg.l1 + dist * dist - seg.l2 * seg.l2) / (2 * seg.l1 * dist), -1, 1);
  const shoulder = phi + spec.bend * Math.acos(cosShoulder);
  return { ex: Math.cos(shoulder) * seg.l1, ey: Math.sin(shoulder) * seg.l1, wx, wy };
}

function restPose(spec: ArmSpec, seg: Segment): Pose {
  const r = (seg.l1 + seg.l2) * 0.88;
  return solve(spec, seg, Math.cos(spec.restDeg * DEG) * r, Math.sin(spec.restDeg * DEG) * r);
}

function useMousePosition(isEnabled: boolean) {
  const ref = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!isEnabled) return;
    const onMove = (event: MouseEvent) => {
      ref.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [isEnabled]);

  return ref;
}

function Arm({
  spec,
  seg,
  pose,
  pivotRef,
}: {
  spec: ArmSpec;
  seg: Segment;
  pose: Pose;
  pivotRef: React.Ref<HTMLDivElement>;
}) {
  const { ex, ey, wx, wy } = pose;
  const { scale, opacity, hasRing } = seg;

  const fx = wx - ex;
  const fy = wy - ey;
  const fl = Math.hypot(fx, fy) || 1;
  const ux = fx / fl;
  const uy = fy / fl;
  const px = -uy;
  const py = ux;
  const JW = 11;
  const FL = 20;
  const HOOK = 6;
  const aBx = wx + px * JW;
  const aBy = wy + py * JW;
  const bBx = wx - px * JW;
  const bBy = wy - py * JW;
  const aTx = aBx + ux * FL;
  const aTy = aBy + uy * FL;
  const bTx = bBx + ux * FL;
  const bTy = bBy + uy * FL;

  return (
    <div
      ref={pivotRef}
      aria-hidden="true"
      className="pointer-events-none fixed -z-10 hidden -translate-y-1/2 lg:block"
      style={{
        width: BOX,
        height: BOX,
        top: `${spec.topPercent}%`,
        [spec.side]: -HALF,
      }}
    >
      <svg viewBox={`${-HALF} ${-HALF} ${BOX} ${BOX}`} width={BOX} height={BOX} fill="none">
        <g transform={`scale(${scale})`}>
          {hasRing && (
            <circle
              cx="0"
              cy="0"
              r="22"
              stroke="var(--color-accent)"
              strokeOpacity={opacity * 0.4}
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
          )}
          <path
            d={`M0,0 L${ex},${ey}`}
            stroke="var(--color-accent)"
            strokeOpacity={opacity}
            strokeWidth={16}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={`M${ex},${ey} L${wx},${wy}`}
            stroke="var(--color-accent)"
            strokeOpacity={opacity}
            strokeWidth={11}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={`M0,0 L${ex},${ey} L${wx},${wy}`}
            stroke="var(--color-accent-bright)"
            strokeOpacity={opacity * 0.5}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={`M${aBx},${aBy} L${bBx},${bBy}`}
            stroke="var(--color-accent)"
            strokeOpacity={opacity}
            strokeWidth={5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={`M${aBx},${aBy} L${aTx},${aTy} L${aTx - px * HOOK},${aTy - py * HOOK}`}
            stroke="var(--color-accent)"
            strokeOpacity={opacity}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={`M${bBx},${bBy} L${bTx},${bTy} L${bTx + px * HOOK},${bTy + py * HOOK}`}
            stroke="var(--color-accent)"
            strokeOpacity={opacity}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx="0" cy="0" r="14" fill="var(--color-accent)" fillOpacity={opacity} />
          <circle cx="0" cy="0" r="6" fill="var(--color-bg)" fillOpacity={opacity} />
          <circle cx={ex} cy={ey} r="9" fill="var(--color-accent)" fillOpacity={opacity} />
          <circle cx={ex} cy={ey} r="3.5" fill="var(--color-bg)" fillOpacity={opacity} />
          <circle cx={wx} cy={wy} r="6" fill="var(--color-accent)" fillOpacity={opacity} />
          <circle cx={wx} cy={wy} r="2.5" fill="var(--color-bg)" fillOpacity={opacity} />
        </g>
      </svg>
    </div>
  );
}

export function CursorArms() {
  const reduced = useReducedMotion();
  const mouseRef = useMousePosition(!reduced);
  const pivotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const current = useRef<Pose[]>(ARMS.map((spec) => restPose(spec, SEGMENTS[spec.segment])));
  const [poses, setPoses] = useState<Pose[]>(() =>
    ARMS.map((spec) => restPose(spec, SEGMENTS[spec.segment])),
  );

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const next = ARMS.map((spec, i) => {
        const seg = SEGMENTS[spec.segment];
        const pivotEl = pivotRefs.current[i];
        const mouse = mouseRef.current;

        let tx: number;
        let ty: number;
        if (mouse && pivotEl) {
          const rect = pivotEl.getBoundingClientRect();
          tx = (mouse.x - (rect.left + HALF)) / seg.scale;
          ty = (mouse.y - (rect.top + HALF)) / seg.scale;
        } else {
          const r = (seg.l1 + seg.l2) * 0.88;
          tx = Math.cos(spec.restDeg * DEG) * r;
          ty = Math.sin(spec.restDeg * DEG) * r;
        }

        const wa = spec.wanderDeg * DEG * Math.sin(now / 1000 / spec.wanderPeriod + spec.wanderPhase);
        const ca = Math.cos(wa);
        const sa = Math.sin(wa);
        const target = solve(spec, seg, tx * ca - ty * sa, tx * sa + ty * ca);

        const k = 1 - Math.exp(-dt / spec.tau);
        const prev = current.current[i];
        const eased: Pose = {
          ex: prev.ex + (target.ex - prev.ex) * k,
          ey: prev.ey + (target.ey - prev.ey) * k,
          wx: prev.wx + (target.wx - prev.wx) * k,
          wy: prev.wy + (target.wy - prev.wy) * k,
        };
        current.current[i] = eased;
        return eased;
      });

      setPoses(next);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, mouseRef]);

  if (reduced) return null;

  return (
    <>
      {ARMS.map((spec, i) => (
        <Arm
          key={i}
          spec={spec}
          seg={SEGMENTS[spec.segment]}
          pose={poses[i]}
          pivotRef={(el) => {
            pivotRefs.current[i] = el;
          }}
        />
      ))}
    </>
  );
}
