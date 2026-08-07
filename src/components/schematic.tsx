import { ArrowDown, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { SchematicMotion } from "@/components/schematic-motion";

export type SchematicNode = { title: string; sub: readonly string[]; isAccent?: boolean };
export type SchematicColumn = { kick: string; nodes: readonly SchematicNode[] };

function DiagramNode({ node }: { node: SchematicNode }) {
  return (
    <div
      data-schematic-node
      className={`rounded-sm border p-4 ${
        node.isAccent ? "border-accent/40 bg-accent-dim" : "border-line-strong bg-surface"
      }`}
    >
      <p className={`text-[15px] font-medium ${node.isAccent ? "text-accent" : "text-fg"}`}>
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

/**
 * The site's signal-path diagram: a left-to-right pipeline of stages that
 * stacks vertically below `lg`. Originally written for the BALANCE patent page
 * and generalised here so any page can draw one from data.
 *
 * Two details are load-bearing and should survive future edits:
 * - `className="contents"` dissolves the per-column wrapper so the arrow and
 *   the column are siblings in the same flex context.
 * - the frame is `bg-bg` while nodes are `bg-surface`, inverting the usual
 *   card-on-page relationship so nodes read as raised out of the drawing.
 */
export function Schematic({
  columns,
  footer,
  animate = false,
}: {
  columns: readonly SchematicColumn[];
  footer?: ReactNode;
  /**
   * Assemble the diagram stage by stage on scroll. Off by default so /patent —
   * which has been pixel-diffed against `main` twice — keeps rendering as a
   * plain server component with markup identical to before.
   */
  animate?: boolean;
}) {
  const frame = (
    <div className="rounded-sm border border-line bg-bg p-6 sm:p-8">
      <div className="flex flex-col items-stretch gap-3 lg:flex-row">
        {columns.map((col, i) => (
          <div key={col.kick} className="contents">
            {i > 0 && (
              <span data-schematic-arrow aria-hidden="true" className="self-center text-accent">
                <ArrowRight className="hidden size-4 lg:block" strokeWidth={1.75} />
                <ArrowDown className="size-4 lg:hidden" strokeWidth={1.75} />
              </span>
            )}
            <div className="flex flex-1 flex-col">
              <p className="mb-2 font-mono text-[12px] text-fg-faint">{col.kick}</p>
              <div className="flex flex-1 flex-col justify-center gap-2.5">
                {col.nodes.map((node) => (
                  <DiagramNode key={node.title} node={node} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {footer && (
        <div className="mt-7 flex flex-wrap items-center gap-3 border-t border-line pt-4">
          {footer}
        </div>
      )}
    </div>
  );

  return animate ? <SchematicMotion>{frame}</SchematicMotion> : frame;
}
