import { balance } from "@/content/balance";

/* The BALANCE control loop as a left-to-right block diagram, drawn from the
 * same data the patent page reads. Each column is a stage; the accent marks
 * the compute stage where the mode decision happens. */

const INK = "#1d1a16";
const SOFT = "#6f675b";
const RUST = "#c5400a";
const PAPER = "#faf8f3";

const COL_W = 168;
const GAP = 40;
const NODE_H = 44;
const W = balance.signalPath.length * (COL_W + GAP) - GAP;

function columnHeight(nodes: number) {
  return nodes * NODE_H + (nodes - 1) * 10;
}

const H = 60 + Math.max(...balance.signalPath.map((s) => columnHeight(s.nodes.length))) + 20;

function nodeMid(j: number): number {
  return 44 + j * (NODE_H + 10) + NODE_H / 2;
}

/** Every node in a column feeds a vertical bus, and the bus feeds every node in the next column. */
function Bus({ x, from, to }: { x: number; from: number; to: number }) {
  const bx = x + COL_W + GAP / 2;
  const top = nodeMid(0);
  const bottom = Math.max(nodeMid(from - 1), nodeMid(to - 1));
  return (
    <g stroke={INK} strokeWidth={1.2} fill="none">
      <line x1={bx} y1={top} x2={bx} y2={bottom} />
      {Array.from({ length: from }, (_, j) => (
        <line key={`in${j}`} x1={x + COL_W} y1={nodeMid(j)} x2={bx} y2={nodeMid(j)} />
      ))}
      {Array.from({ length: to }, (_, j) => (
        <g key={`out${j}`}>
          <line x1={bx} y1={nodeMid(j)} x2={x + COL_W + GAP - 8} y2={nodeMid(j)} />
          <path d={`M ${x + COL_W + GAP - 8} ${nodeMid(j) - 5} L ${x + COL_W + GAP} ${nodeMid(j)} L ${x + COL_W + GAP - 8} ${nodeMid(j) + 5}`} />
        </g>
      ))}
    </g>
  );
}

export function SignalPath() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full min-w-[640px]" role="img" aria-label="Signal path: LiDAR, sonar and cameras feed on-board compute for mapping and planning, then mode arbitration, then the wheeled base or robotic-leg assist.">
      {balance.signalPath.map((stage, i) => {
        const x = i * (COL_W + GAP);
        const accent = stage.nodes.some((n) => "isAccent" in n && n.isAccent);
        return (
          <g key={stage.kick}>
            <text x={x} y={22} fill={SOFT} fontSize={13} fontFamily="var(--font-sans)">
              {stage.kick}
            </text>
            {stage.nodes.map((n, j) => {
              const y = 44 + j * (NODE_H + 10);
              return (
                <g key={n.title}>
                  <rect x={x} y={y} width={COL_W} height={NODE_H} rx={7} fill={PAPER} stroke={accent ? RUST : INK} strokeWidth={accent ? 2 : 1.2} />
                  <text x={x + 12} y={y + 18} fill={INK} fontSize={13} fontWeight={600} fontFamily="var(--font-sans)">
                    {n.title}
                  </text>
                  <text x={x + 12} y={y + 34} fill={SOFT} fontSize={11} fontFamily="var(--font-sans)">
                    {n.sub.join(", ")}
                  </text>
                </g>
              );
            })}
            {i < balance.signalPath.length - 1 && <Bus x={x} from={stage.nodes.length} to={balance.signalPath[i + 1].nodes.length} />}
          </g>
        );
      })}
    </svg>
  );
}
