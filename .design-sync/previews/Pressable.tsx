import { Pressable } from "tarun-yadgirkar-site";

export const PressableButton = () => (
  <Pressable>
    <a
      href="mailto:tyadgirkar@gmail.com"
      style={{
        display: "inline-block",
        border: "1px solid rgba(231,234,242,0.24)",
        padding: "10px 18px",
        fontFamily: "var(--font-plex-mono), monospace",
        fontSize: "13px",
        color: "var(--color-accent, #e2a264)",
      }}
    >
      Get in touch
    </a>
  </Pressable>
);

export const PressableTag = () => (
  <Pressable>
    <span
      style={{
        display: "inline-block",
        border: "1px solid rgba(231,234,242,0.24)",
        padding: "4px 10px",
        fontFamily: "var(--font-plex-mono), monospace",
        fontSize: "12px",
      }}
    >
      Scales to 0.97 while pressed
    </span>
  </Pressable>
);
