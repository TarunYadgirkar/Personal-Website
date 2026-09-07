import type { MetadataRoute } from "next";
import { navLinks, site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = navLinks.map(({ href }) => {
    const path = href === "/" ? "" : href;
    return {
      url: `${site.url}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    };
  });
  return [
    ...pages,
    { url: `${site.url}/privacy`, changeFrequency: "yearly" as const, priority: 0.2 },
  ];
}
