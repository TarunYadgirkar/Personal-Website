/* The @theme colours from globals.css, for the places a CSS variable cannot
 * reach: three.js materials, SMIL keyframes, the Open Graph image (Satori),
 * the viewport theme colour and the root error page. Keep in step with
 * globals.css; everything that can use a Tailwind class or var() should. */
export const palette = {
  paper: "#f4f1ea",
  paperPale: "#faf8f3",
  line: "#d9d2c3",
  ink: "#1d1a16",
  inkMute: "#6f675b",
  rust: "#c5400a",
} as const;
