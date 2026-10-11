"use client";

import { globalErrorPage } from "@/content/errors";
import { site } from "@/content/site";
import { palette } from "@/lib/palette";

/** Last resort when the root layout itself fails; it has to render its own html and body, without the site's CSS. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: palette.paper, color: palette.ink, padding: "3rem 1.5rem" }}>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>{globalErrorPage.title}</h1>
        <p style={{ maxWidth: "36rem", lineHeight: 1.6 }}>
          {globalErrorPage.body} {site.email}.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{ padding: "0.75rem 1.25rem", borderRadius: "999px", border: 0, background: palette.ink, color: palette.paperPale, fontWeight: 600 }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
