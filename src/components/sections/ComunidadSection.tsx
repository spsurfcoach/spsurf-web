import { Reveal, RevealGroup } from "@/components/animations/Reveal";
import { CarouselShell } from "@/components/sections/CarouselShell";
import { ResponsiveMediaFrame } from "@/components/sections/ResponsiveMediaFrame";
import { surftripsSpFamilyPhotos } from "@/lib/content";

export function ComunidadSection() {
  return (
    <section className="overflow-hidden px-4 py-10 sm:px-6 md:px-10 lg:px-16">
      <RevealGroup>
        <p className="ds-label text-[var(--color-label-muted)]">NUESTRA COMUNIDAD</p>
        <h2 className="ds-display-title mt-3">Se parte de la SP Family</h2>
      </RevealGroup>

      <Reveal className="mt-6">
        <CarouselShell
          ariaLabel="Carrusel de comunidad"
          darkControls={false}
          slideClassName="basis-[82%] sm:basis-[52%] lg:basis-[38%]"
          slides={surftripsSpFamilyPhotos.map((img) => (
            <ResponsiveMediaFrame
              key={img.alt}
              src={img.src}
              alt={img.alt}
              ratioClassName="aspect-[4/3] lg:aspect-[574/372]"
            />
          ))}
        />
      </Reveal>
    </section>
  );
}
