"use client";

/** Last resort when the root layout itself fails; it has to render its own html and body. */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#f4f1ea", color: "#1d1a16", padding: "3rem 1.5rem" }}>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>The site failed to load</h1>
        <p style={{ maxWidth: "36rem", lineHeight: 1.6 }}>
          Something went wrong before the page could draw. You can try again, or email tarun_yadgirkar@berkeley.edu.
        </p>
        <button type="button" onClick={reset} style={{ padding: "0.75rem 1.25rem", borderRadius: "999px", border: 0, background: "#1d1a16", color: "#faf8f3", fontWeight: 600 }}>
          Try again
        </button>
      </body>
    </html>
  );
}
