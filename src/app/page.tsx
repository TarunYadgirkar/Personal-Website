import { Builds } from "@/components/home/Builds";
import { Hero } from "@/components/home/Hero";
import { Now } from "@/components/home/Now";
import { ResearchTeaser } from "@/components/home/Research";
import { SelectedWork } from "@/components/home/Selected";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Now />
      <SelectedWork />
      <ResearchTeaser />
      <Builds />
    </>
  );
}
