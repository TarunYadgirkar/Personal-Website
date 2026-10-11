"use client";

import dynamic from "next/dynamic";

/* The scenes load in the browser only, after the page itself, so three.js
 * never blocks the first paint. Server components can render these directly. */

export const HeroScene = dynamic(() => import("./HeroScene").then((m) => m.HeroScene), { ssr: false });

export const ModelScene = dynamic(() => import("./ModelScene").then((m) => m.ModelScene), { ssr: false });
