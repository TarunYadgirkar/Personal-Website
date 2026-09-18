import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { fontClassName } from "@/fonts";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { site } from "@/content/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { title: site.name, description: site.description, type: "website", url: site.url },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#f4f1ea", viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontClassName}>
      <body>
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper-pale"
        >
          Skip to content
        </a>
        <Nav />
        <main id="content">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
