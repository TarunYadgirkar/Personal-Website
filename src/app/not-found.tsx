import type { Metadata } from "next";
import { Page } from "@/components/site/Page";
import { ButtonLink } from "@/components/ui/Button";
import { notFoundPage } from "@/content/errors";

export const metadata: Metadata = {
  title: notFoundPage.metaTitle,
  description: notFoundPage.description,
  robots: { index: false },
};

export default function NotFound() {
  return (
    <Page title={notFoundPage.title} lead={notFoundPage.lead}>
      <ButtonLink href="/">Back to the front page</ButtonLink>
    </Page>
  );
}
