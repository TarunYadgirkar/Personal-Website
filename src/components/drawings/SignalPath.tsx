import { balance } from "@/content/balance";

/* The BALANCE control loop as a left-to-right block diagram, drawn from the
 * same data the patent page reads. Each column is a stage; the accent marks
 * the compute stage where the mode decision happens. */

const INK = "#1d1a16";
const SOFT = "#7a7266";
const RUST = "#c5400a";
const PAPER = "#faf8f3";

const COL_W = 168;
const GAP = 40;
const NODE_H = 30;
const W = balance.signalPath.length * (COL_W + GAP) - GAP;

function columnHeight(nodes: number) {
  return nodes * NODE_H + (nodes - 1) * 10;
}

const H = 60 + Math.max(...balance.signalPath.map((s) => columnHeight(s.nodes.length))) + 20;

export function SignalPath() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Signal path: LiDAR, sonar and cameras feed on-board compute for mapping and planning, then mode arbitration, then the wheeled base or robotic-leg assist.">
      {balance.signalPath.map((stage, i) => {
        const x = i * (COL_W + GAP);
        const accent = stage.nodes.some((n) => "isAccent" in n && n.isAccent);
        return (
          <g key={stage.kick}>
            <text x={x} y={22} fill={SOFT} fontSize={13} fontFamily="var(--font-sans)">
              {stage.kick.replace(" · ", ", ")}
            </text>
            {stage.nodes.map((n, j) => {
              const y = 44 + j * (NODE_H + 10);
              return (
                <g key={n.title}>
                  <rect x={x} y={y} width={COL_W} height={NODE_H} rx={7} fill={PAPER} stroke={accent ? RUST : INK} strokeWidth={accent ? 2 : 1.2} />
                  <text x={x + 12} y={y + 19} fill={INK} fontSize={13} fontWeight={600} fontFamily="var(--font-sans)">
                    {n.title}
                  </text>
                </g>
              );
            })}
            {i < balance.signalPath.length - 1 && (
              <g stroke={INK} strokeWidth={1.2} fill="none">
                <line x1={x + COL_W} y1={59} x2={x + COL_W + GAP - 8} y2={59} />
                <path d={`M ${x + COL_W + GAP - 8} 54 L ${x + COL_W + GAP} 59 L ${x + COL_W + GAP - 8} 64`} />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
