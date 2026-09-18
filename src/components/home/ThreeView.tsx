"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { cn } from "@/lib/cn";

const BalanceScene = dynamic(() => import("@/components/three/BalanceScene").then((m) => m.BalanceScene), {
  ssr: false,
});

const VIEWS = [
  { id: "front", label: "Front" },
  { id: "side", label: "Side" },
  { id: "top", label: "Top" },
] as const;

/** The device in three orthographic views, with a switch between rolling and stepping. */
export function ThreeView() {
  const [stepping, setStepping] = useState(false);
  const stride = stepping ? 1 : 0.1;
  return (
    <figure className="mb-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {VIEWS.map((v) => (
          <div key={v.id} className="bg-grid relative aspect-[4/5] overflow-hidden rounded-2xl bg-paper-pale shadow-card">
            <BalanceScene view={v.id} stride={stride} fit={0.92} className="absolute inset-0" />
            <span className="absolute left-3 top-2 text-sm text-ink-mute">{v.label}</span>
          </div>
        ))}
      </div>
      <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-ink-mute">
        <span>The drawing follows the provisional patent. The wheels carry flat ground, and the powered feet swing down for stairs.</span>
        <span className="inline-flex rounded-full bg-ink/8 p-1" role="group" aria-label="Pose">
          {[
            { on: false, label: "Rolling" },
            { on: true, label: "Stepping" },
          ].map((o) => (
            <button
              key={o.label}
              type="button"
              aria-pressed={stepping === o.on}
              onClick={() => setStepping(o.on)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-semibold text-ink transition-colors duration-150",
                stepping === o.on && "bg-paper-pale shadow-card",
              )}
            >
              {o.label}
            </button>
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
