import { ArrowDown, ArrowRight } from "lucide-react";
import { StatusTag } from "@/components/ui";

type Node = { title: string; sub: string[]; accent?: boolean };
type Column = { kick: string; nodes: Node[] };

const COLUMNS: readonly Column[] = [
  {
    kick: "Input · sensing",
    nodes: [
      { title: "LiDAR", sub: ["depth · ranging"] },
      { title: "Sonar", sub: ["near-field"] },
      { title: "360° cameras", sub: ["visual field"] },
    ],
  },
  {
    kick: "Perception · compute",
    nodes: [
      {
        title: "On-board compute",
        sub: ["Real-time mapping", "Terrain classification", "Gait & path planning"],
        accent: true,
      },
    ],
  },
  {
    kick: "Control",
    nodes: [
      {
        title: "Mode arbitration",
        sub: ["Structural support", "Shock isolation"],
      },
    ],
  },
  {
    kick: "Output · locomotion",
    nodes: [
      { title: "Wheeled base", sub: ["flat ground"] },
      { title: "Robotic-leg assist", sub: ["stairs · uneven terrain"] },
    ],
  },
];

function DiagramNode({ node }: { node: Node }) {
  return (
    <div
      className={`rounded-sm border p-4 ${
        node.accent ? "border-accent/40 bg-accent-dim" : "border-line-strong bg-surface"
      }`}
    >
      <p className={`text-[15px] font-medium ${node.accent ? "text-accent" : "text-fg"}`}>
        {node.title}
      </p>
      <p className="mt-2 font-mono text-[12px] leading-relaxed text-fg-muted">
        {node.sub.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </div>
  );
}

export function BalanceDiagram() {
  return (
    <div className="rounded-sm border border-line bg-bg p-6 sm:p-8">
      <div className="flex flex-col items-stretch gap-3 lg:flex-row">
        {COLUMNS.map((col, i) => (
          <div key={col.kick} className="contents">
            {i > 0 && (
              <span aria-hidden="true" className="self-center text-accent">
                <ArrowRight className="hidden size-4 lg:block" strokeWidth={1.75} />
                <ArrowDown className="size-4 lg:hidden" strokeWidth={1.75} />
              </span>
            )}
            <div className="flex flex-1 flex-col">
              <p className="mb-2 font-mono text-[12px] text-fg-faint">
                {col.kick}
              </p>
              <div className="flex flex-1 flex-col justify-center gap-2.5">
                {col.nodes.map((node) => (
                  <DiagramNode key={node.title} node={node} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-line pt-4">
        <StatusTag>Provisional patent · No. 63/743,085</StatusTag>
        <p className="font-mono text-[11.5px] text-fg-faint">
          Published · Youth Innovation Journal, Fall 2025
        </p>
      </div>
    </div>
  );
}
