import { RevealGroup } from "@/components/animations/Reveal";

export function NosotrosIntroSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-background-default)] px-4 py-14 sm:px-6 md:px-10 lg:px-16 lg:py-20">
      {/* Decorative ellipse blob */}
      <div className="deco-ellipse -left-[123px] top-[16px] hidden h-[700px] w-[700px] bg-[radial-gradient(circle,rgba(24,212,213,0.15),transparent)] lg:block" />

      <RevealGroup className="relative">
        {/* Kicker */}
        <p className="ds-label text-[var(--color-label-muted)] tracking-[2.73px]">
          QUIEN ES SP SURF COACH
        </p>

        {/* Editorial text */}
        <div className="mt-6 max-w-[1312px] space-y-6">
          <p className="ds-section-title text-black">
            SP nace también como extensión de una filosofía personal: entender el surf no solo como deporte, sino
            como práctica, lenguaje y forma de crecimiento.
          </p>
          <p className="ds-section-title text-black">
            Detrás del proyecto está Sebastián Portocarrero, surfista con más de 15 años en el agua, experiencia
            competitiva, reconocido por su trayectoria en la escena local y su enfoque en progresión, su búsqueda por
            entender el rendimiento lo llevó a profundizar en metodologías como MAP Técnica Surf y a expandir esa visión
            a través de Surf Talks Podcast, conversando con los mayores referentes del surf latinoamericano.
          </p>
          <p className="ds-section-title text-black">
            SP Surf Coach reúne esa experiencia en un programa de coaching enfocado en desarrollar técnica, criterio y
            progresión real en el agua.
          </p>
        </div>
      </RevealGroup>
    </section>
  );
}
