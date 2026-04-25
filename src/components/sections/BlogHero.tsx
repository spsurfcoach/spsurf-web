import Image from "next/image";
import { RevealGroup } from "@/components/animations/Reveal";

const BLOG_HERO_SRC = `/photos/${encodeURIComponent("DSC_1605 2.jpg")}`;

export function BlogHero() {
  return (
    <section className="pt-0">
      <div className="relative min-h-[100svh] overflow-hidden">
        <Image
          src={BLOG_HERO_SRC}
          alt="Blog — SP Surf Coach"
          fill
          className="object-cover"
          priority
        />
        <div className="hero-overlay-gradient absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="px-4 pb-8 text-white sm:px-6 sm:pb-12 md:px-10 lg:px-16 lg:pb-16">
            <RevealGroup className="max-w-[58rem]" start="top 92%" stagger={0.1} y={24}>
              <h1 className="ds-h1 leading-[1.15]">Blog</h1>
              <p className="ds-body-s mt-4 max-w-[50rem] leading-relaxed text-white/90 lg:mt-6">
                Ideas, técnica y relatos publicados en nuestro Substack. Lee los últimos posts aquí y
                abre el artículo completo cuando quieras.
              </p>
            </RevealGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
