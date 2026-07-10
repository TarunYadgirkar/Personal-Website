"use client";

import { GithubLogo, LinkedinLogo, MoonIcon, SunIcon, XLogo } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { socialLinks } from "@/content/site";

const magnetic = {
  whileHover: { scale: 1.18, y: -2 },
  whileTap: { scale: 0.94 },
  transition: { type: "spring", stiffness: 400, damping: 20 },
} as const;

const iconClass = "size-[18px] text-fg-muted transition-colors duration-150";

const SOCIAL_ICONS: Record<string, typeof GithubLogo> = {
  GitHub: GithubLogo,
  X: XLogo,
  LinkedIn: LinkedinLogo,
};

const subscribeNoop = () => () => {};

export function SocialBubble() {
  const { resolvedTheme, setTheme } = useTheme();
  // Hydration gate without setState-in-effect: false on the server
  // snapshot, true on the client — next-themes needs a mounted check
  // before resolvedTheme is trustworthy.
  const isMounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  if (!isMounted) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-4 rounded-full border border-line-strong bg-surface/90 px-5 py-3 shadow-lg backdrop-blur-sm">
      {socialLinks.map(({ label, href }) => {
        const Icon = SOCIAL_ICONS[label];
        return (
          <motion.a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            title={label}
            {...magnetic}
          >
            <Icon weight="regular" className={`${iconClass} hover:text-accent`} />
          </motion.a>
        );
      })}
      <span aria-hidden="true" className="h-5 w-px bg-line-strong" />
      <motion.button
        type="button"
        onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
        aria-label="Toggle color theme"
        {...magnetic}
      >
        {resolvedTheme === "light" ? (
          <MoonIcon weight="regular" className={`${iconClass} hover:text-accent`} />
        ) : (
          <SunIcon weight="regular" className={`${iconClass} hover:text-accent`} />
        )}
      </motion.button>
    </div>
  );
}
