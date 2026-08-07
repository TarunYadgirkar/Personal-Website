"use client";

import { useRef } from "react";
import { FULL_MOTION, REDUCED_MOTION, gsap, useGSAP } from "@/lib/gsap";

const VB_W = 320;
const VB_H = 200;

const BASE = { x: 54, y: 170 };
const L1 = 66;
const L2 = 58;
const L3 = 22;
const REACH = L1 + L2 + L3;

const BENCH_Y = 170;
// How far ahead of the tool centre point the held part sits.
const GRIP_OFFSET = 8;

/**
 * The operation, as joint angles rather than as an animation.
 *
 * θ₁ is measured from the bench; θ₂ and θ₃ are relative to the link before them,
 * which is how a real arm is specified and how the readouts report it. The angles
 * were solved by inverse kinematics for three tool positions — the part on the
 * bench, a raised clearance pose, and the part on the ledge — then rounded to
 * whole degrees. They are not handles that were dragged until it looked close, so
 * changing one means re-solving, not nudging.
 *
 * The part is picked off the bench and set down on a ledge *above* it. LIFT sits
 * deliberately to the left of the ledge's near edge: the part rises past ledge
 * height at x≈154 while the ledge starts at x≈162, so it clears the corner
 * instead of passing through it.
 */
const KEYS = [
  { p: 0, t1: 100, t2: -140, t3: 30, jaw: 6, state: "HOME" },
  { p: 0.36, t1: 59, t2: -94, t3: 0, jaw: 6, state: "REACH" },
  { p: 0.48, t1: 59, t2: -94, t3: 0, jaw: 2, state: "GRIP" },
  { p: 0.68, t1: 80, t2: -72, t3: -28, jaw: 2, state: "LIFT" },
  { p: 0.92, t1: 62, t2: -55, t3: -32, jaw: 2, state: "PLACE" },
  { p: 1, t1: 62, t2: -55, t3: -32, jaw: 6, state: "CLEAR" },
] as const;

const GRIP_AT = 0.48;
const RELEASE_AT = 0.92;

const rad = (deg: number) => (deg * Math.PI) / 180;
const smoothstep = (t: number) => t * t * (3 - 2 * t);

type Pose = { t1: number; t2: number; t3: number; jaw: number; state: string };

function poseAt(p: number): Pose {
  const clamped = Math.min(1, Math.max(0, p));
  // i indexes the segment start, so its last valid value is KEYS.length - 2
  // (the segment running into the final key) — hence the < length - 1 bound.
  let i = 0;
  while (i < KEYS.length - 1 && clamped > KEYS[i + 1].p) i += 1;

  const a = KEYS[i];
  const b = KEYS[i + 1];
  const span = b.p - a.p;
  const local = span === 0 ? 0 : Math.min(1, Math.max(0, (clamped - a.p) / span));
  const t = smoothstep(local);

  return {
    t1: a.t1 + (b.t1 - a.t1) * t,
    t2: a.t2 + (b.t2 - a.t2) * t,
    t3: a.t3 + (b.t3 - a.t3) * t,
    jaw: a.jaw + (b.jaw - a.jaw) * t,
    // Flips at the midpoint of each segment, so the readout names the pose the
    // arm is closest to. Holding the entering label for the whole segment meant
    // the arm sat fully lifted while the panel still read GRIP.
    state: t < 0.5 ? a.state : b.state,
  };
}

function solve(pose: Pose) {
  const a1 = rad(pose.t1);
  const a2 = rad(pose.t1 + pose.t2);
  const a3deg = pose.t1 + pose.t2 + pose.t3;
  const a3 = rad(a3deg);

  const j1 = { x: BASE.x + L1 * Math.cos(a1), y: BASE.y - L1 * Math.sin(a1) };
  const j2 = { x: j1.x + L2 * Math.cos(a2), y: j1.y - L2 * Math.sin(a2) };
  const tcp = { x: j2.x + L3 * Math.cos(a3), y: j2.y - L3 * Math.sin(a3) };
  const part = {
    x: tcp.x + GRIP_OFFSET * Math.cos(a3),
    y: tcp.y - GRIP_OFFSET * Math.sin(a3),
  };

  return { j1, j2, tcp, part, a3deg };
}

// Where the part starts and where it ends up, both derived from the same
// kinematics as the arm, so the bench and the ledge are drawn around the solved
// poses rather than the poses being nudged to match hand-placed furniture.
const PART_START = solve(poseAt(GRIP_AT)).part;
const PART_END = solve(poseAt(RELEASE_AT)).part;
const PART_HALF = 6;

// The ledge the part is set down on — above where it was picked up.
const LEDGE = {
  top: PART_END.y + PART_HALF,
  from: PART_END.x - 8,
  to: PART_END.x + 22,
  post: PART_END.x + 18,
};
const LIFT_HEIGHT = Math.round(PART_START.y - PART_END.y);

// The dashed envelope: the outer limit the tool can reach, drawn between the
// angles the arm actually works through.
const envelope = (() => {
  const from = { x: BASE.x + REACH * Math.cos(rad(15)), y: BASE.y - REACH * Math.sin(rad(15)) };
  const to = { x: BASE.x + REACH * Math.cos(rad(95)), y: BASE.y - REACH * Math.sin(rad(95)) };
  return `M${from.x.toFixed(1)},${from.y.toFixed(1)} A${REACH},${REACH} 0 0,0 ${to.x.toFixed(1)},${to.y.toFixed(1)}`;
})();

const fmtAngle = (v: number) =>
  `${v < 0 ? "−" : "+"}${Math.abs(Math.round(v)).toString().padStart(3, "0")}°`;

const MONO = { fontFamily: "var(--font-plex-mono), ui-monospace, monospace" };
const READOUT_X = 232;
const VALUE_X = 308;

/**
 * A three-link planar arm, drawn as an orthographic plate and posed by scroll.
 *
 * This is deliberately not the old `cursor-arms.tsx`: nothing tracks the cursor,
 * there is no inverse-kinematics solver chasing a moving target, and no React
 * state is touched per frame. Scroll progress selects a pose, forward kinematics
 * solves it, and one update writes the handful of SVG attributes that changed —
 * so the whole thing is deterministic and reversible, and scrubbing back up
 * returns the part to the table.
 *
 * Shares its ScrollTrigger with `SystemRule`, which is the point: the arm moves
 * as the trace reaches `actuate`.
 */
export function KinematicRig({
  className,
  trigger,
  start = "center center",
  end = "+=70%",
}: {
  className?: string;
  /** CSS selector for a shared scroll trigger. Defaults to this element. */
  trigger?: string;
  start?: string;
  end?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const host = root.current;
      if (!host) return;

      const q = <T extends Element>(sel: string) => host.querySelector<T>(sel);

      const links = q<SVGPathElement>("[data-links]");
      const wrist = q<SVGPathElement>("[data-wrist]");
      const jointA = q<SVGCircleElement>("[data-joint-a]");
      const jointB = q<SVGCircleElement>("[data-joint-b]");
      const arc = q<SVGPathElement>("[data-theta-arc]");
      const tool = q<SVGGElement>("[data-tool]");
      const jawUpper = q<SVGPathElement>("[data-jaw-upper]");
      const jawLower = q<SVGPathElement>("[data-jaw-lower]");
      const contact = q<SVGCircleElement>("[data-contact]");
      const part = q<SVGGElement>("[data-part]");
      const out1 = q<SVGTextElement>("[data-out-t1]");
      const out2 = q<SVGTextElement>("[data-out-t2]");
      const out3 = q<SVGTextElement>("[data-out-t3]");
      const outTcp = q<SVGTextElement>("[data-out-tcp]");
      const outState = q<SVGTextElement>("[data-out-state]");

      if (!links || !wrist || !jointA || !jointB || !tool || !part) return;

      const render = (p: number) => {
        const pose = poseAt(p);
        const { j1, j2, tcp, part: held, a3deg } = solve(pose);

        links.setAttribute(
          "d",
          `M${BASE.x},${BASE.y} L${j1.x.toFixed(2)},${j1.y.toFixed(2)} L${j2.x.toFixed(2)},${j2.y.toFixed(2)}`,
        );
        wrist.setAttribute(
          "d",
          `M${j2.x.toFixed(2)},${j2.y.toFixed(2)} L${tcp.x.toFixed(2)},${tcp.y.toFixed(2)}`,
        );
        jointA.setAttribute("cx", j1.x.toFixed(2));
        jointA.setAttribute("cy", j1.y.toFixed(2));
        jointB.setAttribute("cx", j2.x.toFixed(2));
        jointB.setAttribute("cy", j2.y.toFixed(2));

        if (arc) {
          const end = {
            x: BASE.x + 24 * Math.cos(rad(pose.t1)),
            y: BASE.y - 24 * Math.sin(rad(pose.t1)),
          };
          arc.setAttribute(
            "d",
            `M${BASE.x + 24},${BASE.y} A24,24 0 0,0 ${end.x.toFixed(2)},${end.y.toFixed(2)}`,
          );
        }

        // SVG rotation is clockwise-positive because y points down, so the
        // mathematical angle is negated here rather than throughout the solver.
        tool.setAttribute(
          "transform",
          `translate(${tcp.x.toFixed(2)},${tcp.y.toFixed(2)}) rotate(${(-a3deg).toFixed(2)})`,
        );
        jawUpper?.setAttribute("transform", `translate(0,${(-pose.jaw).toFixed(2)})`);
        jawLower?.setAttribute("transform", `translate(0,${pose.jaw.toFixed(2)})`);

        const holding = p >= GRIP_AT && p <= RELEASE_AT;
        contact?.setAttribute("opacity", holding ? "1" : "0");

        const at = holding ? held : p < GRIP_AT ? PART_START : PART_END;
        part.setAttribute("transform", `translate(${at.x.toFixed(2)},${at.y.toFixed(2)})`);

        if (out1) out1.textContent = fmtAngle(pose.t1);
        if (out2) out2.textContent = fmtAngle(pose.t2);
        if (out3) out3.textContent = fmtAngle(pose.t3);
        if (outTcp) {
          outTcp.textContent = `${Math.round(tcp.x)},${Math.round(tcp.y)}`;
        }
        if (outState) outState.textContent = pose.state;
      };

      // Resolved off `document`, not left as a selector string: useGSAP's scope
      // makes GSAP look selectors up *inside* this component's root, and the
      // shared trigger is an ancestor. A miss there fails silently — the trigger
      // just resolves to the top of the document and the arm reads as already
      // finished before the plate is even on screen.
      const triggerEl = (trigger ? document.querySelector(trigger) : null) ?? host;

      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION, () => {
        const proxy = { p: 0 };
        render(0);

        const tween = gsap.to(proxy, {
          p: 1,
          ease: "none",
          scrollTrigger: { trigger: triggerEl, start, end, scrub: 0.6 },
          onUpdate: () => render(proxy.p),
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      mm.add(REDUCED_MOTION, () => {
        // The completed operation: part placed, arm settled, readouts populated.
        render(1);
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [trigger, start, end] },
  );

  return (
    <div ref={root} className={className} aria-hidden="true">
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} fill="none" className="h-full w-full">
        {/* ---- static drawing furniture ---- */}

        <path
          d={envelope}
          stroke="var(--color-line-strong)"
          strokeWidth="1"
          strokeDasharray="3 5"
          vectorEffect="non-scaling-stroke"
        />

        <line
          x1="24"
          y1={BENCH_Y}
          x2="212"
          y2={BENCH_Y}
          stroke="var(--color-line-strong)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        {/* hatched pedestal */}
        <path
          d="M42,170 L66,170 L62,184 L46,184 Z"
          stroke="var(--color-line-strong)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        {[0, 1, 2, 3].map((i) => (
          <line
            key={i}
            x1={44 + i * 5}
            y1={184}
            x2={50 + i * 5}
            y2={170}
            stroke="var(--color-line)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* where the part is picked up from — it sits on the bench */}
        <rect
          x={PART_START.x - PART_HALF - 1}
          y={PART_START.y - PART_HALF - 1}
          width={PART_HALF * 2 + 2}
          height={PART_HALF * 2 + 2}
          stroke="var(--color-line)"
          strokeWidth="1"
          strokeDasharray="2 3"
          vectorEffect="non-scaling-stroke"
        />

        {/* the raised ledge it is set down on, with its support post */}
        <line
          x1={LEDGE.from}
          y1={LEDGE.top}
          x2={LEDGE.to}
          y2={LEDGE.top}
          stroke="var(--color-line-strong)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1={LEDGE.post}
          y1={LEDGE.top}
          x2={LEDGE.post}
          y2={BENCH_Y}
          stroke="var(--color-line)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        {/* target outline on the ledge */}
        <rect
          x={PART_END.x - PART_HALF - 1}
          y={PART_END.y - PART_HALF - 1}
          width={PART_HALF * 2 + 2}
          height={PART_HALF * 2 + 2}
          stroke="var(--color-line-strong)"
          strokeWidth="1"
          strokeDasharray="2 3"
          vectorEffect="non-scaling-stroke"
        />

        {/* vertical dimension: how far the part is raised */}
        <g stroke="var(--color-line-strong)" strokeWidth="1" vectorEffect="non-scaling-stroke">
          <line x1="204" y1={PART_END.y} x2="204" y2={PART_START.y} />
          <line x1="200" y1={PART_END.y} x2="208" y2={PART_END.y} />
          <line x1="200" y1={PART_START.y} x2="208" y2={PART_START.y} />
        </g>
        <text
          x="204"
          y={PART_END.y - 6}
          textAnchor="middle"
          fill="var(--color-fg-faint)"
          fontSize="9"
          style={MONO}
        >
          ↑{LIFT_HEIGHT}
        </text>

        <line
          x1="218"
          y1="16"
          x2="218"
          y2={VB_H - 16}
          stroke="var(--color-line)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />

        {/* ---- readouts ---- */}
        <g fill="var(--color-fg-faint)" fontSize="10" style={MONO}>
          <text x={READOUT_X} y="34">
            θ1
          </text>
          <text x={READOUT_X} y="52">
            θ2
          </text>
          <text x={READOUT_X} y="70">
            θ3
          </text>
          <text x={READOUT_X} y="88">
            tcp
          </text>
          <text x={READOUT_X} y="112">
            state
          </text>
        </g>
        <g fill="var(--color-fg-muted)" fontSize="10" textAnchor="end" style={MONO}>
          <text data-out-t1 x={VALUE_X} y="34" />
          <text data-out-t2 x={VALUE_X} y="52" />
          <text data-out-t3 x={VALUE_X} y="70" />
          <text data-out-tcp x={VALUE_X} y="88" />
        </g>
        <line
          x1={READOUT_X}
          y1="98"
          x2={VALUE_X}
          y2="98"
          stroke="var(--color-line)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
        <text
          data-out-state
          x={VALUE_X}
          y="112"
          textAnchor="end"
          fill="var(--color-accent)"
          fontSize="10"
          style={MONO}
        />

        {/* ---- the part ---- */}
        <g data-part>
          <rect
            x="-6"
            y="-6"
            width="12"
            height="12"
            stroke="var(--color-fg-muted)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {/* ---- the arm ---- */}
        <path data-theta-arc stroke="var(--color-line-strong)" strokeWidth="1" strokeDasharray="2 3" vectorEffect="non-scaling-stroke" />
        <path
          data-links
          stroke="var(--color-fg-muted)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          data-wrist
          stroke="var(--color-fg-muted)"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx={BASE.x}
          cy={BASE.y}
          r="4"
          fill="var(--color-bg)"
          stroke="var(--color-fg-muted)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          data-joint-a
          r="3.5"
          fill="var(--color-bg)"
          stroke="var(--color-fg-muted)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          data-joint-b
          r="3"
          fill="var(--color-bg)"
          stroke="var(--color-fg-muted)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />

        {/* parallel-jaw gripper, in tool-local coordinates */}
        <g data-tool>
          <line
            x1="0"
            y1="-7"
            x2="0"
            y2="7"
            stroke="var(--color-fg-muted)"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            data-jaw-upper
            d="M0,0 L11,0 L11,3"
            stroke="var(--color-fg-muted)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          <path
            data-jaw-lower
            d="M0,0 L11,0 L11,-3"
            stroke="var(--color-fg-muted)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
          {/* the one rationed accent in this drawing: contact confirmed */}
          <circle data-contact cx="13" cy="0" r="2.5" fill="var(--color-accent)" opacity="0" />
        </g>
      </svg>
    </div>
  );
}
