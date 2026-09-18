"use client";

import { ArrowDown, EnvelopeSimple } from "@phosphor-icons/react";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/content/site";
import { HeroCarousel } from "./HeroCarousel";

export function Hero() {
  return (
    <section className="bg-grid border-b border-line">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-10 pt-12 sm:px-8 md:grid-cols-[1.05fr_1fr] md:items-center md:gap-10 md:pb-16 md:pt-16">
        <div>
          <h1 className="text-[2.6rem] leading-[1.02] sm:text-6xl md:text-[4.25rem]">I build intelligent systems where hardware meets AI.</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft md:text-xl">
            I work on machine learning that runs on FPGAs, a hybrid mobility device with a provisional patent, and AR
            glasses with their own operating system. I study applied mathematics at UC Berkeley and spend the rest of the
            week building.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#work">
              <ArrowDown size={18} weight="bold" aria-hidden="true" /> Selected work
            </ButtonLink>
            <ButtonLink href={`mailto:${site.email}`} variant="quiet">
              <EnvelopeSimple size={18} weight="bold" aria-hidden="true" /> Email me
            </ButtonLink>
          </div>
        </div>

        <HeroCarousel />
      </div>
    </section>
  );
}
