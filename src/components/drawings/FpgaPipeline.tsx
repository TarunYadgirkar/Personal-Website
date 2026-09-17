"use client";

import { useReducedMotion } from "motion/react";

/* The research pipeline as a block diagram: a model trained in PyTorch or
 * TensorFlow is quantized to fixed point, ported to the FPGA fabric, and
 * runs channel estimation and signal processing on live samples. A sample
 * travels the path; inside the fabric a pipeline wave crosses the DSP tiles. */

const INK = "#1d1a16";
const SOFT = "#7a7266";
const RUST = "#c5400a";
const PAPER = "#faf8f3";

const W = 960;
const H = 300;
const Y = 150;

const STAGES = [
  { x: 24, w: 196, title: "Train", body: ["PyTorch or TensorFlow,", "32-bit float"] },
  { x: 270, w: 196, title: "Quantize", body: ["Fixed-point weights", "and activations"] },
  { x: 516, w: 224, title: "FPGA fabric", body: ["Pipelined DSP slices", "and block RAM"] },
  { x: 790, w: 150, title: "Output", body: ["Channel estimate,", "filtered signal"] },
];

const TILES = 5 * 3;

function Stage({ x, w, title, body, compact }: (typeof STAGES)[number] & { compact: boolean }) {
  return (
    <g>
      <rect x={x} y={Y - 62} width={w} height={124} rx={10} fill={PAPER} stroke={INK} strokeWidth={compact ? 3 : 1.5} />
      {!compact && (
        <>
          <text x={x + 16} y={Y - 34} fill={INK} fontSize={18} fontWeight={600} fontFamily="var(--font-heading)">
            {title}
          </text>
          <text x={x + 16} y={Y + 30} fill={SOFT} fontSize={13} fontFamily="var(--font-sans)">
            <tspan x={x + 16}>{body[0]}</tspan>
            <tspan x={x + 16} dy={17}>{body[1]}</tspan>
          </text>
        </>
      )}
    </g>
  );
}

/** The DSP tile grid inside the fabric block, with the pipeline wave. */
function Fabric({ animate, compact }: { animate: boolean; compact: boolean }) {
  const x0 = 532;
  const y0 = compact ? Y - 30 : Y - 22;
  return (
    <g>
      {Array.from({ length: TILES }, (_, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        const x = x0 + col * 38;
        const y = y0 + row * 16;
        return (
          <rect key={i} x={x} y={y} width={30} height={compact ? 14 : 10} rx={2} fill="none" stroke={INK} strokeWidth={compact ? 2 : 1}>
            {animate && (
              <animate attributeName="fill" values={`${PAPER};${RUST};${PAPER}`} keyTimes="0;0.5;1" dur="2.4s" begin={`${col * 0.18}s`} repeatCount="indefinite" />
            )}
          </rect>
        );
      })}
    </g>
  );
}

function Arrow({ from, to, compact }: { from: number; to: number; compact: boolean }) {
  return (
    <g stroke={INK} strokeWidth={compact ? 3 : 1.5} fill="none">
      <line x1={from} y1={Y} x2={to - 8} y2={Y} />
      <path d={`M ${to - 8} ${Y - 5} L ${to} ${Y} L ${to - 8} ${Y + 5}`} />
    </g>
  );
}

/** A sample that leaves the model as a float and arrives as a fixed-point word. */
function Sample({ animate, compact }: { animate: boolean; compact: boolean }) {
  if (!animate) return null;
  return (
    <g>
      <circle r={compact ? 9 : 6} fill={RUST}>
        <animateMotion dur="4.8s" repeatCount="indefinite" path={`M 220 ${Y} L 270 ${Y} M 466 ${Y} L 516 ${Y} M 740 ${Y} L 790 ${Y}`} keyPoints="0;0.33;0.33;0.66;0.66;1" keyTimes="0;0.33;0.34;0.66;0.67;1" calcMode="linear" />
      </circle>
    </g>
  );
}

/** `compact` drops the labels and thickens the strokes for a thumbnail. */
export function FpgaPipeline({ className, compact = false }: { className?: string; compact?: boolean }) {
  const reduced = useReducedMotion() ?? false;
  const animate = !reduced;
  const viewBox = compact ? `0 60 ${W} 180` : `0 0 ${W} ${H}`;
  return (
    <svg viewBox={viewBox} className={className} role="img" aria-label="Block diagram: a model is trained in PyTorch or TensorFlow, quantized to fixed point, ported to pipelined DSP slices on the FPGA, and outputs channel estimates and filtered signal.">
      {STAGES.map((s) => (
        <Stage key={s.title} {...s} compact={compact} />
      ))}
      <Fabric animate={animate} compact={compact} />
      <Arrow from={220} to={270} compact={compact} />
      <Arrow from={466} to={516} compact={compact} />
      <Arrow from={740} to={790} compact={compact} />
      <Sample animate={animate} compact={compact} />
      {!compact && (
        <>
          <g stroke={SOFT} strokeWidth={1.2} fill="none" strokeDasharray="4 4">
            <path d={`M 630 ${Y + 100} L 630 ${Y + 62}`} />
          </g>
          <text x={640} y={Y + 96} fill={SOFT} fontSize={13} fontFamily="var(--font-sans)">
            Samples from the radio front end
          </text>
        </>
      )}
    </svg>
  );
}
