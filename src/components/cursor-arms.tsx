"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const BOX = 460;
const HALF = BOX / 2;

type Geometry = {
  elbow: [number, number];
  wrist: [number, number];
  clawA: [number, number];
  clawB: [number, number];
  scale: number;
  opacity: number;
  showRing: boolean;
};

const GEOMETRY: readonly Geometry[] = [
  {
    elbow: [110, 17],
    wrist: [198, -31],
    clawA: [235, -58],
    clawB: [222, -4],
    scale: 0.78,
    opacity: 0.85,
    showRing: false,
  },
  {
    elbow: [90, -34],
    wrist: [188, 6],
    clawA: [222, -18],
    clawB: [206, 34],
    scale: 0.85,
    opacity: 0.65,
    showRing: true,
  },
  {
    elbow: [72, 40],
    wrist: [140, 78],
    clawA: [176, 60],
    clawB: [158, 104],
    scale: 0.7,
    opacity: 0.5,
    showRing: false,
  },
  {
    elbow: [110, 17],
    wrist: [198, -31],
    clawA: [235, -58],
    clawB: [222, -4],
    scale: 1,
    opacity: 0.85,
    showRing: false,
  },
];

type ArmSpec = {
  side: "left" | "right";
  topPercent: number;
  geometry: number;
  restAngle: number;
  tau: number;
  clamp?: [number, number];
  wanderAmplitude: number;
  wanderPeriod: number;
  wanderPhase: number;
};

const ARMS: readonly ArmSpec[] = [
  { side: "left", topPercent: 22, geometry: 0, restAngle: 0, tau: 0.35, wanderAmplitude: 10, wanderPeriod: 7, wanderPhase: 0 },
  { side: "left", topPercent: 50, geometry: 1, restAngle: 0, tau: 0.4, wanderAmplitude: 12, wanderPeriod: 9, wanderPhase: 2 },
  { side: "left", topPercent: 78, geometry: 2, restAngle: 0, tau: 0.3, wanderAmplitude: 8, wanderPeriod: 6, wanderPhase: 4 },
  {
    side: "right",
    topPercent: 14,
    geometry: 3,
    restAngle: 180,
    tau: 0.9,
    clamp: [150, 210],
    wanderAmplitude: 5,
    wanderPeriod: 11,
    wanderPhase: 1,
  },
];

function useMousePosition(enabled: boolean) {
  const ref = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (event: MouseEvent) => {
      ref.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled]);

  return ref;
}

function unwrap(previous: number, raw: number) {
  const delta = ((raw - previous + 180) % 360 + 360) % 360 - 180;
  return previous + delta;
}

function clampAround(angle: number, rest: number, range: [number, number]) {
  const [min, max] = range;
  const relative = unwrap(rest, angle);
  return Math.min(max, Math.max(min, relative));
}

function Arm({
  spec,
  pivotRef,
  angle,
}: {
  spec: ArmSpec;
  pivotRef: React.Ref<HTMLDivElement>;
  angle: number;
}) {
  const geo = GEOMETRY[spec.geometry];
  const { elbow, wrist, clawA, clawB, scale, opacity, showRing } = geo;

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
        <g transform={`rotate(${angle}) scale(${scale})`}>
          {showRing && (
            <circle
              cx="0"
              cy="0"
              r="16"
              stroke="var(--color-accent)"
              strokeOpacity={opacity * 0.55}
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
          )}
          <path
            d={`M0,0 L${elbow[0]},${elbow[1]} L${wrist[0]},${wrist[1]}`}
            stroke="var(--color-accent)"
            strokeOpacity={opacity}
            strokeWidth={4}
            strokeLinecap="square"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={`M${wrist[0]},${wrist[1]} L${clawA[0]},${clawA[1]} M${wrist[0]},${wrist[1]} L${clawB[0]},${clawB[1]}`}
            stroke="var(--color-accent)"
            strokeOpacity={opacity}
            strokeWidth={3.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <circle cx="0" cy="0" r="6" fill="var(--color-accent)" fillOpacity={opacity} />
          <circle cx={elbow[0]} cy={elbow[1]} r="5" fill="var(--color-accent)" fillOpacity={opacity} />
          <circle cx={wrist[0]} cy={wrist[1]} r="5" fill="var(--color-accent)" fillOpacity={opacity} />
        </g>
      </svg>
    </div>
  );
}

export function CursorArms() {
  const reduced = useReducedMotion();
  const mouseRef = useMousePosition(!reduced);
  const pivotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentAngles = useRef<number[]>(ARMS.map((a) => a.restAngle));
  const [angles, setAngles] = useState<number[]>(ARMS.map((a) => a.restAngle));

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const next = ARMS.map((spec, i) => {
        const pivotEl = pivotRefs.current[i];
        const mouse = mouseRef.current;
        let target = currentAngles.current[i];

        if (mouse && pivotEl) {
          const rect = pivotEl.getBoundingClientRect();
          const pivotX = rect.left + HALF;
          const pivotY = rect.top + HALF;
          const raw = (Math.atan2(mouse.y - pivotY, mouse.x - pivotX) * 180) / Math.PI;
          target = spec.clamp
            ? clampAround(raw, spec.restAngle, spec.clamp)
            : unwrap(currentAngles.current[i], raw);
        }

        const wander =
          spec.wanderAmplitude * Math.sin(now / 1000 / spec.wanderPeriod + spec.wanderPhase);
        const smoothing = 1 - Math.exp(-dt / spec.tau);
        const eased = currentAngles.current[i] + (target - currentAngles.current[i]) * smoothing;
        currentAngles.current[i] = eased;
        return eased + wander;
      });

      setAngles(next);
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
          angle={angles[i]}
          pivotRef={(el) => {
            pivotRefs.current[i] = el;
          }}
        />
      ))}
    </>
  );
}
