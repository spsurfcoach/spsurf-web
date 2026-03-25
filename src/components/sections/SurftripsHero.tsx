import Image from "next/image";
import { Reveal } from "@/components/animations/Reveal";

export function SurftripsHero() {
  return (
    <section className="pt-0">
      <div className="relative min-h-[100svh] overflow-hidden">
        <Image src="/photos/surftrips/surftrips_hero.jpg" alt="Surftrips" fill className="object-cover" priority />
        <div className="hero-overlay-gradient absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="px-4 pb-8 text-white sm:px-6 sm:pb-12 md:px-10 lg:px-16 lg:pb-16">
            <Reveal className="max-w-[58rem]" start="top 92%" y={24}>
              <h1 className="ds-h1 leading-[1.15]">Surftrips</h1>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
