"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { SignalTrace } from "@/components/signal-trace";
import { site } from "@/content/site";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <SignalTrace className="h-16 w-full sm:h-20" />,
});

// Spline scene renders only when a scene URL is configured and the visitor
// hasn't asked for reduced motion; otherwise the signal trace stands in.
export function HeroVisual() {
  const reduced = useReducedMotion();

  if (!site.splineSceneUrl || reduced) {
    return <SignalTrace className="h-16 w-full sm:h-20" />;
  }

  return (
    <div className="h-56 w-full sm:h-72" aria-hidden="true">
      <Spline scene={site.splineSceneUrl} />
    </div>
  );
}
