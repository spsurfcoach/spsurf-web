import Image from "next/image";
import { Reveal, RevealGroup } from "@/components/animations/Reveal";

export function BrandStatement() {
  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-6 md:px-10 md:py-16 lg:px-16">
      {/* Decorative gradient ellipses */}
      <div className="deco-ellipse -left-[123px] top-[16px] h-[700px] w-[700px] bg-[radial-gradient(circle,rgba(24,212,213,0.15),transparent)] hidden lg:block" />
      <div className="deco-ellipse left-[586px] top-[304px] h-[700px] w-[700px] bg-[radial-gradient(circle,rgba(24,212,213,0.1),transparent)] hidden lg:block" />
      <div className="deco-ellipse left-[1038px] top-[310px] h-[700px] w-[700px] bg-[radial-gradient(circle,rgba(24,212,213,0.1),transparent)] hidden lg:block" />

      <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:gap-12 lg:items-center xl:gap-16">
        <RevealGroup>
          <p className="ds-label leading-[1.85] text-[var(--color-label-muted)]">SP SURF COACH</p>
          <p className="ds-h2 ds-section-lead-gap max-w-[724px] leading-[1.5] tracking-[-0.04em] lg:leading-[56px]">
            SP Surf Coach es un espacio para surfistas que quieren mejorar de verdad junto a una comunidad.
          </p>
          <p className="ds-body-m ds-section-lead-gap max-w-[724px] text-[var(--color-text-default)]">
            Más allá de solo tomar clases, se trata de compartir procesos, entrenar con intención y avanzar con personas
            que están en el mismo camino.
          </p>
          <p className="ds-body-m mt-5 max-w-[724px] text-[var(--color-text-default)]">
            Trabajamos con una metodología basada en técnica, lectura de mar y conexión con tu cuerpo.
          </p>
          <p className="ds-body-m mt-5 max-w-[724px] text-[var(--color-text-default)]">
            El objetivo es claro: progresar con consistencia, sesión tras sesión, y llevar ese proceso más allá de las
            olas a través de experiencias como nuestros SurfCamps y Sesiones.
          </p>
          <button className="ds-btn ds-btn-primary ds-btn-lg mt-8">Conoce más</button>
        </RevealGroup>
        <Reveal>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] sm:aspect-[3/2] lg:aspect-[2/1] lg:rounded-[40px]">
            <Image src="/photos/DSC_4360.jpg" alt="Comunidad y sesiones SP Surf Coach" fill className="object-cover" />
            <div className="absolute inset-0 rounded-[24px] bg-[rgba(0,17,22,0.4)] lg:rounded-[40px]" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
