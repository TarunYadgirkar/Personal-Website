import { MotionProvider, Reveal } from "tarun-yadgirkar-site";

export const AppWrapper = () => (
  <MotionProvider>
    <Reveal>
      <p style={{ maxWidth: "52ch", margin: 0, lineHeight: 1.6 }}>
        App-level wrapper: sets framer-motion&apos;s MotionConfig to
        reducedMotion=&quot;user&quot; so every animation inside honors the
        OS-level reduced-motion preference. Renders children unchanged.
      </p>
    </Reveal>
  </MotionProvider>
);
