"use client";

import dynamic from "next/dynamic";
import type { ThumbModel, View } from "@/components/three/BalanceScene";

const BalanceScene = dynamic(() => import("@/components/three/BalanceScene").then((m) => m.BalanceScene), {
  ssr: false,
});

/** The only client-side piece of a Selected work row: a lazily loaded drawn model. */
export function Thumbnail({ model, view = "turn" }: { model: ThumbModel; view?: View }) {
  return <BalanceScene model={model} view={view} stride={0.15} fit={0.95} className="absolute inset-0" />;
}
