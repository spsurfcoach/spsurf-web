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
          <p className="ds-display-title text-black">
            Combinamos técnica, análisis y mentalidad para que progreses de forma real y sostenible. Cada surfista entrena con un enfoque personalizado que integra práctica en el agua, videoanálisis, entrenamiento físico y ejercicios mentales para ganar confianza y fluidez.
          </p>
          <p className="ds-display-title text-black">
            El objetivo: que entiendas el mar, tu cuerpo y tu mente para surfear con propósito.
          </p>
        </div>
      </RevealGroup>
    </section>
  );
}
