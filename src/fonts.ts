import localFont from "next/font/local";

/* Three faces, all self-hosted, latin subset. Schibsted Grotesk carries the
 * headings, Hanken Grotesk the reading text, Geist Mono the figures that
 * have to line up in a column (dimensions, part numbers, bit widths). */

export const schibsted = localFont({
  src: "./fonts/schibsted.woff2",
  variable: "--font-schibsted",
  weight: "400 900",
  display: "swap",
});

export const hanken = localFont({
  src: "./fonts/hanken.woff2",
  variable: "--font-hanken",
  weight: "400 800",
  display: "swap",
});

export const geistMono = localFont({
  src: "./fonts/geistmono.woff2",
  variable: "--font-geist-mono",
  weight: "400 600",
  display: "swap",
});

export const fontClassName = `${schibsted.variable} ${hanken.variable} ${geistMono.variable}`;
