import type { MetadataRoute } from "next";
import { navLinks, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [{ url: site.url, lastModified: now }, ...navLinks.map((l) => ({ url: `${site.url}${l.href}`, lastModified: now }))];
}
