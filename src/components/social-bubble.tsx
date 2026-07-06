"use client";

import { GithubLogo, LinkedinLogo, MoonIcon, SunIcon, XLogo } from "@phosphor-icons/react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { site } from "@/content/site";

const iconClass = "size-[18px] text-fg-muted transition-colors duration-150";

const LINKS = [
  { icon: GithubLogo, href: site.links.github, label: "GitHub" },
  { icon: XLogo, href: site.links.x, label: "X" },
  { icon: LinkedinLogo, href: site.links.linkedin, label: "LinkedIn" },
] as const;

const subscribeNoop = () => () => {};

export function SocialBubble() {
  const { resolvedTheme, setTheme } = useTheme();
  // Hydration gate without setState-in-effect: false on the server
  // snapshot, true on the client — next-themes needs a mounted check
  // before resolvedTheme is trustworthy.
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

  if (!mounted) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex items-center gap-4 rounded-full border border-line-strong bg-surface/90 px-5 py-3 shadow-lg backdrop-blur-sm">
      {LINKS.map(({ icon: Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
        >
          <Icon weight="regular" className={`${iconClass} hover:text-accent`} />
        </a>
      ))}
      <span aria-hidden="true" className="h-5 w-px bg-line-strong" />
      <button
        type="button"
        onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
        aria-label="Toggle color theme"
      >
        {resolvedTheme === "light" ? (
          <MoonIcon weight="regular" className={`${iconClass} hover:text-accent`} />
        ) : (
          <SunIcon weight="regular" className={`${iconClass} hover:text-accent`} />
        )}
      </button>
    </div>
  );
}
