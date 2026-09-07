import type { Metadata } from "next";
import { site } from "@/content/site";
import { privacy } from "@/content/privacy";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What this site collects, and what it does not.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-28 pt-20">
      <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-5xl">Privacy</h1>
      <p className="mt-3 font-mono text-[12px] text-fg-faint">
        {site.url.replace("https://", "")} · updated {privacy.updated}
      </p>
      <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-fg-muted">
        {privacy.intro}
      </p>

      <dl className="mt-12 max-w-3xl border-t border-line">
        {privacy.sections.map((section) => (
          <div
            key={section.title}
            className="grid gap-2 border-b border-line py-6 sm:grid-cols-[200px_1fr] sm:gap-8"
          >
            <dt className="font-mono text-[12px] text-fg-faint">{section.title}</dt>
            <dd className="text-[15px] leading-relaxed text-fg-muted">{section.body}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
