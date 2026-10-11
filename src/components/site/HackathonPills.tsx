"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Trophy } from "@phosphor-icons/react/dist/ssr";
import { LinkRow } from "@/components/ui/LinkRow";
import { TextLink } from "@/components/ui/TextLink";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { cn } from "@/lib/cn";
import { hackathons, type Hackathon } from "@/content/work";

const PANEL_ID = "hackathon-panel";

function Notes({ h }: { h: Hackathon }) {
  const rows: readonly [string, React.ReactNode][] = [
    ["Problem", h.problem],
    ["Built", h.built],
    ["Runs on", h.stack.join(", ")],
    ["Outcome", h.outcome],
  ];
  return (
    <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-[max-content_1fr]">
      {rows.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-base font-semibold text-ink-mute">{k}</dt>
          <dd className="text-base leading-relaxed">{v}</dd>
        </div>
      ))}
      {h.event && (
        <>
          <dt className="text-base font-semibold text-ink-mute">Where</dt>
          <dd className="text-base leading-relaxed">
            <TextLink href={h.event.href}>{h.event.label}</TextLink>
            <span className="text-ink-mute">, {h.event.detail}</span>
          </dd>
        </>
      )}
    </dl>
  );
}

function Panel({ h }: { h: Hackathon }) {
  return (
    <div className="rounded-2xl bg-paper-pale p-5 shadow-card sm:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-2xl">{h.title}</h3>
        <span className="figures text-sm text-ink-mute">{h.when}</span>
      </div>
      <p className="mt-2 text-lg text-ink">{h.oneLiner}</p>
      <div className="mt-5">
        <Notes h={h} />
      </div>
      <LinkRow links={h.links} className="mt-5" />
    </div>
  );
}

function Pill({ h, open, onToggle }: { h: Hackathon; open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={PANEL_ID}
      onClick={onToggle}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-base font-semibold text-ink transition-[background-color,box-shadow,scale] duration-150 active:scale-[0.96]",
        open ? "bg-paper-pale shadow-card" : "bg-ink/8 hover:bg-ink/12",
      )}
    >
      {h.title}
      {h.placed && (
        <>
          <Trophy size={16} weight="fill" className="text-rust" aria-hidden="true" />
          <span className="sr-only">, {h.placed}</span>
        </>
      )}
    </button>
  );
}

/** Hackathon builds as pills; choosing one opens its full notes below the row. */
export function HackathonPills() {
  const reduced = useReducedMotion();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const open = hackathons.find((h) => h.slug === openSlug);
  return (
    <div>
      <ul className="flex flex-wrap gap-2">
        {hackathons.map((h) => (
          <li key={h.slug}>
            <Pill h={h} open={h.slug === openSlug} onToggle={() => setOpenSlug(h.slug === openSlug ? null : h.slug)} />
          </li>
        ))}
      </ul>
      <div id={PANEL_ID}>
        <AnimatePresence mode="wait" initial={false}>
          {open && (
            <motion.div
              key={open.slug}
              className="mt-5"
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            >
              <Panel h={open} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
