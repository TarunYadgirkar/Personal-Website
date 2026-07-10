"use client";

import { MotionGlobalConfig } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

// Standalone equivalent of the app's <body> styling (globals.css + next/font
// vars on <html>) for contexts outside the Next runtime — preview cards and
// designs built with the exported component library.
const ROOT_STYLE = {
  "--font-schibsted": '"Schibsted Grotesk", "Schibsted Grotesk Fallback"',
  "--font-plex-mono": '"IBM Plex Mono", "IBM Plex Mono Fallback"',
  background: "var(--color-bg, #0b0e15)",
  color: "var(--color-fg, #e7eaf2)",
  fontFamily: 'var(--font-schibsted, "Schibsted Grotesk"), system-ui, sans-serif',
  WebkitFontSmoothing: "antialiased",
  minHeight: "100%",
  padding: "20px",
} as CSSProperties;

export function PageRoot({
  children,
  isStaticMotion = false,
}: {
  children: ReactNode;
  // Jump every framer-motion animation to its final state — for static
  // rendering contexts (screenshots, preview cards). Leave off in real UIs.
  isStaticMotion?: boolean;
}) {
  // Must flip before children mount, so it can't live in an effect.
  // eslint-disable-next-line react-hooks/immutability
  if (isStaticMotion) MotionGlobalConfig.skipAnimations = true;
  return <div style={ROOT_STYLE}>{children}</div>;
}
