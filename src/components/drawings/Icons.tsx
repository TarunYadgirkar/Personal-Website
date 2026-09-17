/* Small inked drawings, one per project, each showing the mechanism rather
 * than a symbol for it. All share a 240 by 160 canvas and the ink/rust pair. */

const INK = "#1d1a16";
const RUST = "#c5400a";
const SOFT = "#b9b0a0";

const frame = { viewBox: "0 0 240 160", fill: "none", stroke: INK, strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/** Glasses with three windows docked on a wall behind them. */
export function GlassesDrawing({ className }: { className?: string }) {
  return (
    <svg {...frame} className={className} aria-hidden="true">
      <g stroke={SOFT}>
        <rect x={22} y={22} width={64} height={40} rx={3} />
        <rect x={96} y={16} width={48} height={32} rx={3} />
        <rect x={160} y={26} width={58} height={38} rx={3} />
      </g>
      <g stroke={RUST}>
        <line x1={30} y1={34} x2={70} y2={34} />
        <line x1={30} y1={42} x2={60} y2={42} />
        <line x1={168} y1={38} x2={200} y2={38} />
        <line x1={168} y1={46} x2={190} y2={46} />
      </g>
      <path d="M 44 108 h 60 a 10 10 0 0 1 10 10 v 12 a 10 10 0 0 1 -10 10 h -52 a 10 10 0 0 1 -10 -10 v -12 a 10 10 0 0 1 10 -10 z" />
      <path d="M 136 108 h 60 a 10 10 0 0 1 10 10 v 12 a 10 10 0 0 1 -10 10 h -52 a 10 10 0 0 1 -10 -10 v -12 a 10 10 0 0 1 10 -10 z" />
      <path d="M 114 118 q 6 -6 12 0" />
      <path d="M 34 112 l -16 4 M 206 112 l 16 4" />
    </svg>
  );
}

/** A robot head with two display eyes and the speaker grille. */
export function HeadDrawing({ className }: { className?: string }) {
  return (
    <svg {...frame} className={className} aria-hidden="true">
      <path d="M 70 30 h 100 a 22 22 0 0 1 22 22 v 60 a 22 22 0 0 1 -22 22 h -100 a 22 22 0 0 1 -22 -22 v -60 a 22 22 0 0 1 22 -22 z" />
      <rect x={72} y={54} width={36} height={26} rx={5} />
      <rect x={132} y={54} width={36} height={26} rx={5} />
      <g stroke={RUST}>
        <path d="M 80 68 q 10 -8 20 0" />
        <path d="M 140 68 q 10 -8 20 0" />
      </g>
      <g stroke={SOFT}>
        <line x1={96} y1={104} x2={144} y2={104} />
        <line x1={100} y1={110} x2={140} y2={110} />
        <line x1={104} y1={116} x2={136} y2={116} />
      </g>
      <line x1={120} y1={134} x2={120} y2={150} />
      <line x1={100} y1={150} x2={140} y2={150} />
      <circle cx={192} cy={44} r={5} />
      <line x1={192} y1={49} x2={192} y2={30} stroke={SOFT} />
    </svg>
  );
}

/** Before/after test pairs: the middle pair is the one that proves the fix. */
export function GateDrawing({ className }: { className?: string }) {
  const rows = [
    { y: 40, before: "fail", after: "pass", key: true },
    { y: 76, before: "pass", after: "pass", key: false },
    { y: 112, before: "fail", after: "fail", key: false },
  ];
  return (
    <svg {...frame} className={className} aria-hidden="true">
      <line x1={120} y1={20} x2={120} y2={140} stroke={SOFT} strokeDasharray="3 4" />
      {rows.map((r) => (
        <g key={r.y}>
          <rect x={44} y={r.y} width={56} height={22} rx={5} stroke={r.key ? RUST : INK} />
          <rect x={140} y={r.y} width={56} height={22} rx={5} stroke={r.key ? RUST : INK} />
          {r.before === "fail" ? <path d={`M 66 ${r.y + 6} l 12 10 M 78 ${r.y + 6} l -12 10`} /> : <path d={`M 64 ${r.y + 11} l 5 5 l 10 -10`} />}
          {r.after === "fail" ? <path d={`M 162 ${r.y + 6} l 12 10 M 174 ${r.y + 6} l -12 10`} /> : <path d={`M 160 ${r.y + 11} l 5 5 l 10 -10`} />}
        </g>
      ))}
      <path d="M 104 51 h 30" stroke={RUST} />
      <path d="M 128 46 l 6 5 l -6 5" stroke={RUST} />
    </svg>
  );
}

/** A trunk with a branch that returns one merged line. */
export function TreeDrawing({ className }: { className?: string }) {
  return (
    <svg {...frame} className={className} aria-hidden="true">
      <line x1={80} y1={20} x2={80} y2={140} strokeWidth={2.4} />
      {[36, 60, 84, 108, 132].map((y) => (
        <line key={y} x1={80} y1={y} x2={100} y2={y} stroke={SOFT} />
      ))}
      <path d="M 80 60 q 40 0 60 -24" />
      <path d="M 140 36 q 30 0 40 -12 M 140 36 q 24 8 30 24" stroke={SOFT} />
      <path d="M 140 36 q 20 40 -50 66" stroke={RUST} />
      <path d="M 96 96 l -8 6 l 9 4" stroke={RUST} />
      <circle cx={140} cy={36} r={4} fill={INK} stroke="none" />
    </svg>
  );
}
