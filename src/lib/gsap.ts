"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Registered exactly once, here, and every consumer imports from this module
// rather than from "gsap" directly. Importing a plugin without registering it
// is GSAP's classic silent failure — the tween no-ops instead of throwing, and
// a bundler is free to drop the "unused" import entirely.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin);

/**
 * Media queries for `gsap.matchMedia()`. Every animated component in this repo
 * must register BOTH: the reduce branch is not optional, and it has to paint the
 * finished frame rather than skip the animation. The global reduced-motion clamp
 * in globals.css only reaches CSS animations and transitions — a GSAP tween left
 * parked at `drawSVG: "0%"` would simply render an invisible diagram.
 */
export const FULL_MOTION = "(prefers-reduced-motion: no-preference)";
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** Cursor effects are dead weight on touch — pair with the queries above. */
export const FINE_POINTER = "(pointer: fine)";

export { gsap, useGSAP, ScrollTrigger, SplitText, DrawSVGPlugin };
