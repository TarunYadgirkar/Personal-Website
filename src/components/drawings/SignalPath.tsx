import { balance } from "@/content/balance";

/* The BALANCE control loop as a left-to-right block diagram, drawn from the
 * same data the patent page reads. Each column is a stage; the accent marks
 * the compute stage where the mode decision happens. Every node in a column
 * feeds a vertical bus, and the bus feeds every node in the next column. */

const INK = "#1d1a16";
const SOFT = "#6f675b";
const RUST = "#c5400a";
const PAPER = "#faf8f3";

const COL_W = 196;
const GAP = 44;
const TOP = 44;
const ROW_GAP = 10;
const LINE = 13;
const HEAD = 24;

type Node = (typeof balance.signalPath)[number]["nodes"][number];

interface Laid {
  node: Node;
  y: number;
  h: number;
}

/** Stack a column's nodes, each tall enough for its title and sub lines. */
function layout(nodes: readonly Node[]): Laid[] {
  let y = TOP;
  return nodes.map((node) => {
    const h = HEAD + node.sub.length * LINE + 6;
    const laid = { node, y, h };
    y += h + ROW_GAP;
    return laid;
  });
}

const COLUMNS = balance.signalPath.map((stage) => ({ kick: stage.kick, nodes: layout(stage.nodes) }));
const W = COLUMNS.length * (COL_W + GAP) - GAP;
const H = Math.max(...COLUMNS.map((c) => c.nodes.at(-1)!.y + c.nodes.at(-1)!.h)) + 16;

const mid = (l: Laid) => l.y + l.h / 2;

function Bus({ x, from, to }: { x: number; from: Laid[]; to: Laid[] }) {
  const bx = x + COL_W + GAP / 2;
  const mids = [...from, ...to].map(mid);
  return (
    <g stroke={INK} strokeWidth={1.2} fill="none">
      <line x1={bx} y1={Math.min(...mids)} x2={bx} y2={Math.max(...mids)} />
      {from.map((l) => (
        <line key={l.node.title} x1={x + COL_W} y1={mid(l)} x2={bx} y2={mid(l)} />
      ))}
      {to.map((l) => (
        <g key={l.node.title}>
          <line x1={bx} y1={mid(l)} x2={x + COL_W + GAP - 8} y2={mid(l)} />
          <path d={`M ${x + COL_W + GAP - 8} ${mid(l) - 5} L ${x + COL_W + GAP} ${mid(l)} L ${x + COL_W + GAP - 8} ${mid(l) + 5}`} />
        </g>
      ))}
    </g>
  );
}

function Box({ x, laid, accent }: { x: number; laid: Laid; accent: boolean }) {
  const { node, y, h } = laid;
  return (
    <g>
      <rect x={x} y={y} width={COL_W} height={h} rx={7} fill={PAPER} stroke={accent ? RUST : INK} strokeWidth={accent ? 2 : 1.2} />
      <text x={x + 12} y={y + 17} fill={INK} fontSize={13} fontWeight={600} fontFamily="var(--font-sans)">
        {node.title}
      </text>
      <text x={x + 12} y={y + 17} fill={SOFT} fontSize={11} fontFamily="var(--font-sans)">
        {node.sub.map((line, k) => (
          <tspan key={line} x={x + 12} dy={k === 0 ? 14 : LINE}>
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}

export function SignalPath() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full min-w-[640px]"
      role="img"
      aria-label="Signal path: LiDAR, sonar and cameras feed on-board compute for mapping and planning, then mode arbitration, then the wheeled base or robotic-leg assist."
    >
      {COLUMNS.map((col, i) => {
        const x = i * (COL_W + GAP);
        const accent = col.nodes.some((l) => "isAccent" in l.node && l.node.isAccent);
        return (
          <g key={col.kick}>
            <text x={x} y={22} fill={SOFT} fontSize={13} fontFamily="var(--font-sans)">
              {col.kick}
            </text>
            {col.nodes.map((l) => (
              <Box key={l.node.title} x={x} laid={l} accent={accent} />
            ))}
            {i < COLUMNS.length - 1 && <Bus x={x} from={col.nodes} to={COLUMNS[i + 1].nodes} />}
          </g>
        );
      })}
    </svg>
  );
}
