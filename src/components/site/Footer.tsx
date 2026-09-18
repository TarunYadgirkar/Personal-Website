import { site } from "@/content/site";
import { CopyEmail } from "./CopyEmail";

const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-heading text-2xl font-semibold">Say hello</p>
          <p className="mt-2 max-w-md text-base text-ink-soft">
            Write to me about research, internships and anything worth building together. Email is the fastest way to reach me.
          </p>
          <div className="mt-4">
            <CopyEmail email={site.email} />
          </div>
        </div>
        <nav aria-label="Elsewhere" className="flex flex-wrap gap-x-6 gap-y-2 text-base font-semibold">
          <a href={site.links.github} className="rounded underline-offset-4 hover:underline">
            GitHub
          </a>
          <a href={site.links.linkedin} className="rounded underline-offset-4 hover:underline">
            LinkedIn
          </a>
          <a href={site.links.x} className="rounded underline-offset-4 hover:underline">
            X
          </a>
        </nav>
      </div>
      <p className="mx-auto max-w-6xl px-5 pb-8 text-sm text-ink-mute sm:px-8">
        {site.location}. &copy; {year} {site.name}.
      </p>
    </footer>
  );
}
