import { RevealGroup } from "@/components/animations/Reveal";

export function NosotrosIntroSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-background-default)] px-4 py-14 sm:px-6 md:px-10 lg:px-16 lg:py-20">
      {/* Decorative ellipse blob */}
      <div className="deco-ellipse -left-[123px] top-[16px] hidden h-[700px] w-[700px] bg-[radial-gradient(circle,rgba(24,212,213,0.15),transparent)] lg:block" />

      <RevealGroup className="relative">
        <p className="ds-section-title w-full max-w-none text-pretty leading-[1.25] text-black sm:leading-[1.3]">
          SP Surf Coach nace como una extensión de una filosofía que entiende el surf como práctica, lenguaje y forma de
          crecimiento. Detrás está Sebastián Portocarrero, surfista con más de 15 años de experiencia y trayectoria
          competitiva, quien ha construido un enfoque de progresión basado en metodologías como MAP Técnica Surf y lo ha
          expandido a través de Surf Talks Podcast, llevándolo a un programa de coaching enfocado en desarrollar
          técnica, criterio y rendimiento real en el agua.
        </p>
      </RevealGroup>
    </section>
  );
}
