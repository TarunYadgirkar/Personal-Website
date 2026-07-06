import type { MetadataRoute } from "next";
import { navLinks, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return navLinks.map(({ href }) => {
    const path = href === "/" ? "" : href;
    return {
      url: `${site.url}${path}`,
      changeFrequency: "monthly",
      priority: path === "" ? 1 : 0.7,
    };
  });
}
