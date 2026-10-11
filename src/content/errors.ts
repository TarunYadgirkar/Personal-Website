/* Copy for the not-found and error pages. Kept apart from pages.ts because
 * the error pages are client components that ship with every page. */

export const notFoundPage = {
  title: "There is nothing at this address",
  metaTitle: "Page not found",
  description: "There is no page at this address on tarunyadgirkar.com.",
  lead: "The link may be old, or the page may have moved during the last rebuild of the site.",
} as const;

export const errorPage = {
  title: "Something on this page broke",
  lead: "The rest of the site still works. Reloading usually clears it.",
} as const;

/** Shown when the root layout itself fails, so it cannot use the site's styles. */
export const globalErrorPage = {
  title: "The site failed to load",
  body: "Something went wrong before the page could draw. You can try again, or email",
} as const;
