"use client";

import { Page } from "@/components/site/Page";
import { ButtonLink } from "@/components/ui/Button";

/** Keeps the nav, footer and a way forward on screen when a page throws. */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Page title="Something on this page broke" lead="The rest of the site still works. Reloading usually clears it.">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-base font-semibold text-paper-pale hover:bg-ink-soft"
        >
          Try again
        </button>
        <ButtonLink href="/" variant="quiet">
          Back to the front page
        </ButtonLink>
      </div>
    </Page>
  );
}
