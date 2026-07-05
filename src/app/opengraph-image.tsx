import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.positioning}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0b0e15",
          color: "#e7eaf2",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#e2a264",
          }}
        >
          {site.subline}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 72,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          {site.name}
        </div>
        <div style={{ marginTop: 18, fontSize: 34, color: "#98a1b3" }}>
          {site.positioning}
        </div>
        <div
          style={{
            marginTop: 64,
            height: 2,
            width: 480,
            background: "#e2a264",
            opacity: 0.55,
          }}
        />
      </div>
    ),
    size,
  );
}
