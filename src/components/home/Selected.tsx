"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { FpgaPipeline } from "@/components/drawings/FpgaPipeline";
import { GateDrawing, GlassesDrawing, HeadDrawing, TreeDrawing } from "@/components/drawings/Icons";
import { TextLink } from "@/components/ui/TextLink";
import { selected, type DrawingKind, type Selected as Item } from "@/content/selected";

const BalanceScene = dynamic(() => import("@/components/three/BalanceScene").then((m) => m.BalanceScene), {
  ssr: false,
});

function Drawing({ kind }: { kind: DrawingKind }) {
  const cls = "h-full w-full";
  switch (kind) {
    case "fpga":
      return <FpgaPipeline className={cls} compact />;
    case "balance":
      return <BalanceScene view="side" stride={0.15} fit={0.95} className="absolute inset-0" />;
    case "glasses":
      return <GlassesDrawing className={cls} />;
    case "head":
      return <HeadDrawing className={cls} />;
    case "gate":
      return <GateDrawing className={cls} />;
    case "tree":
      return <TreeDrawing className={cls} />;
  }
}

function Row({ item }: { item: Item }) {
  const external = item.href.startsWith("http");
  const Title = external ? "a" : Link;
  return (
    <li className="grid gap-5 py-10 first:pt-0 md:grid-cols-[260px_1fr] md:gap-10">
      <div className="bg-grid relative aspect-[3/2] overflow-hidden rounded-2xl bg-paper-pale shadow-card md:aspect-auto md:min-h-[190px]">
        <div className="absolute inset-3">
          <Drawing kind={item.drawing} />
        </div>
      </div>
      <div className="max-w-2xl">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h3 className="text-2xl sm:text-3xl">
            <Title href={item.href} className="inline-flex items-center gap-2 rounded hover:underline underline-offset-4">
              {item.title}
              <ArrowRight size={20} weight="bold" className="text-ink-mute" aria-hidden="true" />
            </Title>
          </h3>
          <span className="figures text-sm text-ink-mute">{item.period}</span>
        </div>
        <p className="mt-3 text-base leading-relaxed text-ink sm:text-lg">{item.what}</p>
        <p className="mt-3 text-base leading-relaxed text-ink-soft">{item.detail}</p>
        <p className="mt-3 text-base text-ink-soft">{item.standing}</p>
        {item.links && (
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-base">
            {item.links.map((l) => (
              <TextLink key={l.href} href={l.href}>
                {l.label}
              </TextLink>
            ))}
          </p>
        )}
      </div>
    </li>
  );
}

export function SelectedWork() {
  return (
    <section id="work" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="text-4xl sm:text-5xl">Selected work</h2>
        <TextLink href="/work">All work</TextLink>
      </div>
      <ol className="mt-10 divide-y divide-line">
        {selected.map((item) => (
          <Row key={item.slug} item={item} />
        ))}
      </ol>
    </section>
  );
}
