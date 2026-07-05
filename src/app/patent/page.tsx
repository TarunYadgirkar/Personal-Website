import type { Metadata } from "next";
import { Eyebrow, ExternalLink, SectionHeading, StatusTag } from "@/components/ui";
import { balance } from "@/content/balance";

export const metadata: Metadata = {
  title: "Provisional Patent — BALANCE",
  description:
    "BALANCE: a hybrid legged-and-wheeled assistive mobility device. Filed as provisional patent No. 63/743,085; a related article was published in the Youth Innovation Journal (Fall 2025).",
};

export default function PatentPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-28 pt-20">
      <Eyebrow>Provisional patent</Eyebrow>
      <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-5xl">
        {balance.name}
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg-muted">
        {balance.expansion}
      </p>
      <div className="mt-5">
        <StatusTag>{balance.status}</StatusTag>
      </div>

      <section className="mt-20" aria-labelledby="problem">
        <SectionHeading id="problem" eyebrow="Why" title="The problem" />
        <p className="max-w-3xl text-[16px] leading-relaxed text-fg-muted">
          {balance.problem}
        </p>
      </section>

      <section className="mt-20" aria-labelledby="concept">
        <SectionHeading id="concept" eyebrow="Concept" title="Between aids and exoskeletons" />
        <p className="max-w-3xl text-[16px] leading-relaxed text-fg-muted">
          {balance.concept}
        </p>
      </section>

      <section className="mt-20" aria-labelledby="system">
        <SectionHeading id="system" eyebrow="System" title="Two subsystems" />
        <div className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2">
          {balance.systems.map((s) => (
            <div key={s.name} className="bg-surface p-7 sm:p-8">
              <h3 className="font-mono text-[13px] text-accent">{s.name}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-fg-muted">
                {s.detail}
              </p>
            </div>
          ))}
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {balance.features.map((f) => (
            <li
              key={f}
              className="border-l border-line-strong pl-4 text-[14px] leading-relaxed text-fg-muted"
            >
              {f}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20" aria-labelledby="status">
        <SectionHeading id="status" eyebrow="Status" title="Where it stands" />
        <p className="max-w-3xl text-[16px] leading-relaxed text-fg-muted">
          {balance.statusDetail}
        </p>
        <div className="mt-6 flex flex-wrap gap-6">
          {balance.links.map((link) => (
            <ExternalLink key={link.href} href={link.href}>
              {link.label}
            </ExternalLink>
          ))}
        </div>
      </section>
    </div>
  );
}
