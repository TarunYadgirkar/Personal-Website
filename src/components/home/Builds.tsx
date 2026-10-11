import { HackathonPills } from "@/components/site/HackathonPills";
import { buildsTitle } from "@/content/home";

export function Builds() {
  return (
    <section id="builds" className="mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-24">
      <h2 className="text-4xl sm:text-5xl">{buildsTitle}</h2>
      <div className="mt-6 border-t border-line pt-8">
        <HackathonPills />
      </div>
    </section>
  );
}
