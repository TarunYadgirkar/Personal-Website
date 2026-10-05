"use client";

import { useState } from "react";
import { ModelScene } from "@/components/three/lazy";
import { SegmentButton, SegmentGroup } from "@/components/ui/Segmented";

const VIEWS = [
  { id: "front", label: "Front" },
  { id: "side", label: "Side" },
  { id: "top", label: "Top" },
] as const;

const POSES = [
  { stepping: false, label: "Rolling" },
  { stepping: true, label: "Stepping" },
] as const;

/** The device in three orthographic views, with a switch between rolling and stepping. */
export function ThreeView({ captions }: { captions: { rolling: string; stepping: string } }) {
  const [stepping, setStepping] = useState(false);
  const stride = stepping ? 1 : 0.1;
  return (
    <figure className="mb-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {VIEWS.map((v) => (
          <div key={v.id} className="bg-grid relative aspect-[4/5] overflow-hidden rounded-2xl bg-paper-pale shadow-card">
            <ModelScene view={v.id} stride={stride} fit={0.92} className="absolute inset-0" />
            <span className="absolute left-3 top-2 text-sm text-ink-mute">{v.label}</span>
          </div>
        ))}
      </div>
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-ink-mute">
        <span>{stepping ? captions.stepping : captions.rolling}</span>
        <SegmentGroup aria-label="Pose">
          {POSES.map((p) => (
            <SegmentButton key={p.label} selected={stepping === p.stepping} aria-pressed={stepping === p.stepping} onClick={() => setStepping(p.stepping)}>
              {p.label}
            </SegmentButton>
          ))}
        </SegmentGroup>
      </figcaption>
    </figure>
  );
}
