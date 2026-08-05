import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-28 pt-20">
      <p className="font-mono text-[12px] text-fg-faint">404</p>
      <h1 className="mt-4 text-3xl font-medium tracking-tight sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-fg-muted">
        This route doesn&apos;t exist or has moved. The current work lives on
        the homepage.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-10 items-center rounded-sm border border-line-strong px-5 text-sm text-fg transition-colors duration-150 hover:border-accent hover:text-accent"
      >
        Back to home
      </Link>
    </div>
  );
}
