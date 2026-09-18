import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = site.headline;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#f4f1ea";
const INK = "#1d1a16";
const INK_MUTE = "#7a7266";
const RUST = "#c5400a";
const GRID = "rgba(29, 26, 22, 0.07)";

/* Satori reads TrueType, not woff2, so the heading face ships once more as a
 * static 600 instance just for this image. */
async function headingFont(): Promise<Buffer> {
  return readFile(join(process.cwd(), "src/fonts/schibsted-600.ttf"));
}

export default async function Image() {
  const schibsted = await headingFont();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: PAPER,
          backgroundImage: `linear-gradient(to right, ${GRID} 2px, transparent 2px), linear-gradient(to bottom, ${GRID} 2px, transparent 2px)`,
          backgroundSize: "48px 48px",
          color: INK,
          fontFamily: "Schibsted Grotesk",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34 }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: RUST }} />
          {site.name}
        </div>
        <div style={{ display: "flex", fontSize: 72, lineHeight: 1.05, letterSpacing: 0, maxWidth: 1000 }}>
          {site.headline}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: INK_MUTE }}>tarunyadgirkar.com</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Schibsted Grotesk", data: schibsted, weight: 600, style: "normal" }] },
  );
}
