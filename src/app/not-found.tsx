import type { Metadata } from "next";
import { Page } from "@/components/site/Page";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
  description: "There is no page at this address on tarunyadgirkar.com.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Page title="There is nothing at this address" lead="The link may be old, or the page may have moved during the last rebuild of the site.">
      <ButtonLink href="/">Back to the front page</ButtonLink>
    </Page>
  );
}
