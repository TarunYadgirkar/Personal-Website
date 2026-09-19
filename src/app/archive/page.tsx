import type { Metadata } from "next";
import { Page } from "@/components/site/Page";
import { TextLink } from "@/components/ui/TextLink";
import { archive } from "@/content/archive";

export const metadata: Metadata = {
  title: "Archive",
  description: "Earlier work, kept for the record: competitive robotics, science fair builds, teaching, and the rest.",
};

export default function ArchivePage() {
  return (
    <Page title="Archive" lead="This is earlier work, kept for the record. Most of it is from high school, and some of it explains where the rest came from.">
      <table className="w-full border-collapse text-left text-base">
        <thead>
          <tr className="border-b border-line-strong text-sm text-ink-mute">
            <th scope="col" className="w-20 py-2 pr-4 font-semibold sm:w-28">When</th>
            <th scope="col" className="py-2 pr-4 font-semibold">What</th>
            <th scope="col" className="hidden w-36 py-2 font-semibold sm:table-cell">Kind</th>
          </tr>
        </thead>
        <tbody>
          {archive.map((a) => (
            <tr key={a.title} className="border-b border-line align-top">
              <td className="figures py-4 pr-4 text-sm text-ink-mute">{a.years ?? ""}</td>
              <td className="py-4 pr-4">
                <p className="font-semibold">{a.href ? <TextLink href={a.href}>{a.title}</TextLink> : a.title}</p>
                <p className="mt-1 max-w-2xl text-ink-soft">{a.detail}</p>
                <p className="mt-1 text-sm text-ink-mute sm:hidden">{a.type}</p>
              </td>
              <td className="hidden py-4 text-ink-mute sm:table-cell">{a.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Page>
  );
}
