"use client";

import { Page } from "@/components/site/Page";
import { Button, ButtonLink } from "@/components/ui/Button";
import { errorPage } from "@/content/errors";

/** Keeps the nav, footer and a way forward on screen when a page throws. */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <Page title={errorPage.title} lead={errorPage.lead}>
      <div className="flex flex-wrap gap-3">
        <Button onClick={reset}>Try again</Button>
        <ButtonLink href="/" variant="quiet">
          Back to the front page
        </ButtonLink>
      </div>
    </Page>
  );
}
