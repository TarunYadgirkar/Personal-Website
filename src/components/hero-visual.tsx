import Image from "next/image";

export function HeroVisual() {
  return (
    <div
      className="relative h-52 w-full overflow-hidden bg-[#050607] sm:h-72"
      aria-hidden="true"
    >
      <Image
        src="/visuals/robot-arm.jpg"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 1024px, 100vw"
        className="object-cover object-[54%_42%] opacity-85 saturate-[0.9]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#0a0d10_0%,rgba(10,13,16,0.18)_34%,rgba(10,13,16,0)_66%,#0a0d10_100%)]" />
    </div>
  );
}
