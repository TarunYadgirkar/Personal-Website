import { Builds } from "@/components/home/Builds";
import { Hero } from "@/components/home/Hero";
import { Now } from "@/components/home/Now";
import { SelectedWork } from "@/components/home/Selected";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Now />
      <SelectedWork />
      <Builds />
    </>
  );
}
