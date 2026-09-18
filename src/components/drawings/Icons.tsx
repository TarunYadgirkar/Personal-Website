/* Small inked drawings, one per project, each showing the mechanism rather
 * than a symbol for it. All share a 240 by 160 canvas and the ink/rust pair. */

const INK = "#1d1a16";
const RUST = "#c5400a";
const MUTED = "#6f675b";

const frame = { viewBox: "0 0 240 160", fill: "none", stroke: INK, strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

type Mark = "fail" | "pass" | "flaky";

/* Five before/after sandbox runs. Only the first counts: it failed before the change and passes after. */
const GATE_ROWS: readonly { y: number; before: Mark; after: Mark; tone: string }[] = [
  { y: 26, before: "fail", after: "pass", tone: RUST },
  { y: 50, before: "pass", after: "pass", tone: INK },
  { y: 74, before: "fail", after: "fail", tone: INK },
  { y: 98, before: "pass", after: "pass", tone: INK },
  { y: 122, before: "fail", after: "flaky", tone: MUTED },
];

function MarkGlyph({ x, y, mark }: { x: number; y: number; mark: Mark }) {
  if (mark === "fail") return <path d={`M ${x + 6} ${y + 4} l 10 10 M ${x + 16} ${y + 4} l -10 10`} />;
  if (mark === "pass") return <path d={`M ${x + 6} ${y + 9} l 4 5 l 7 -9`} />;
  return <circle cx={x + 11} cy={y + 9} r={5} />;
}

function TestRow({ y, before, after, tone }: (typeof GATE_ROWS)[number]) {
  return (
    <g stroke={tone}>
      <rect x={84} y={y} width={22} height={18} rx={4} />
      <rect x={118} y={y} width={22} height={18} rx={4} />
      <line x1={106} y1={y + 9} x2={118} y2={y + 9} />
      <MarkGlyph x={84} y={y} mark={before} />
      <MarkGlyph x={118} y={y} mark={after} />
    </g>
  );
}

/** A PR's claim goes through five sandboxed before/after runs; the gate meter counts only the run that failed before and passes after. */
export function GateDrawing({ className }: { className?: string }) {
  return (
    <svg {...frame} className={className} aria-hidden="true">
      <path d="M 18 48 H 44 L 54 58 V 100 A 4 4 0 0 1 50 104 H 18 A 4 4 0 0 1 14 100 V 52 A 4 4 0 0 1 18 48 Z" />
      <path d="M 44 48 V 58 H 54" stroke={MUTED} />
      <g stroke={MUTED}>
        <line x1={21} y1={70} x2={47} y2={70} />
        <line x1={21} y1={86} x2={47} y2={86} />
        <line x1={21} y1={94} x2={39} y2={94} />
      </g>
      <line x1={21} y1={78} x2={43} y2={78} stroke={RUST} strokeWidth={2} />
      <path d="M 54 76 H 72 M 67 72 l 5 4 l -5 4" />
      <rect x={76} y={18} width={76} height={128} rx={8} stroke={MUTED} strokeWidth={1.2} strokeDasharray="3 5" />
      {GATE_ROWS.map((row) => (
        <TestRow key={row.y} {...row} />
      ))}
      <rect x={196} y={24} width={18} height={116} rx={9} strokeWidth={2} />
      <rect x={199} y={119} width={12} height={18} rx={6} fill={RUST} stroke="none" />
      <path d="M 190 119 l -9 -5 v 10 z" fill={RUST} stroke={RUST} />
    </svg>
  );
}

const TRUNK_CARDS = [
  { y: 16, x: 46, w: 46 },
  { y: 34, x: 54, w: 34 },
  { y: 52, x: 46, w: 46 },
  { y: 80, x: 54, w: 34 },
  { y: 98, x: 46, w: 46 },
];

const BRANCH_CARDS = [
  { y: 32, x: 174, w: 48 },
  { y: 52, x: 182, w: 40 },
];

function Card({ x, y, w, h = 14, tone = INK }: { x: number; y: number; w: number; h?: number; tone?: string }) {
  return <rect x={x} y={y} width={w} height={h} rx={4} stroke={tone} />;
}

/** A chat trunk forks once: the branch carries a compiled brief, works on,
 *  and merges one distilled line back while the rest of it is dropped. */
export function TreeDrawing({ className }: { className?: string }) {
  return (
    <svg {...frame} className={className} aria-hidden="true">
      <line x1={40} y1={14} x2={40} y2={140} strokeWidth={2.4} />
      {TRUNK_CARDS.map((c) => (
        <Card key={c.y} {...c} />
      ))}
      <path d="M 40 74 C 80 74 96 70 104 52" />
      <rect x={104} y={34} width={52} height={34} rx={5} strokeWidth={2} />
      <g stroke={MUTED}>
        <line x1={112} y1={44} x2={142} y2={44} />
        <line x1={112} y1={51} x2={136} y2={51} />
        <line x1={112} y1={58} x2={146} y2={58} />
      </g>
      <path d="M 144 34 H 156 V 46" stroke={RUST} strokeWidth={2} />
      <path d="M 156 51 H 170 M 170 39 V 61 M 170 39 H 174 M 170 59 H 182" />
      {BRANCH_CARDS.map((c) => (
        <Card key={c.y} {...c} />
      ))}
      <g stroke={MUTED} strokeWidth={1.2} strokeDasharray="3 5">
        <path d="M 206 66 V 96" />
        <rect x={188} y={96} width={38} height={12} rx={4} />
      </g>
      <g stroke={RUST}>
        <path d="M 186 66 C 184 106 150 128 90 125" />
        <path d="M 98 120 L 90 125 L 98 130" />
        <rect x={46} y={120} width={40} height={9} rx={3} />
      </g>
    </svg>
  );
}
