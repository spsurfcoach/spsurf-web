import Image from "next/image";
import { Reveal, RevealGroup } from "@/components/animations/Reveal";

export function BrandStatement() {
  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-6 md:px-10 md:py-16 lg:px-16">
      {/* Decorative gradient ellipses */}
      <div className="deco-ellipse -left-[123px] top-[16px] h-[700px] w-[700px] bg-[radial-gradient(circle,rgba(24,212,213,0.15),transparent)] hidden lg:block" />
      <div className="deco-ellipse left-[586px] top-[304px] h-[700px] w-[700px] bg-[radial-gradient(circle,rgba(24,212,213,0.1),transparent)] hidden lg:block" />
      <div className="deco-ellipse left-[1038px] top-[310px] h-[700px] w-[700px] bg-[radial-gradient(circle,rgba(24,212,213,0.1),transparent)] hidden lg:block" />

      <div className="relative grid gap-10 lg:grid-cols-[1fr_456px] lg:items-start">
        <RevealGroup>
          <p className="ds-label leading-[1.85] text-[var(--color-label-muted)]">SP SURF COACH</p>
          <p className="ds-h2 ds-section-lead-gap max-w-[724px] leading-[1.5] tracking-[-0.04em] lg:leading-[56px]">
            SP Surf Coach es un espacio para surfistas que quieren mejorar realmente junto a una comunidad.
          </p>
          <p className="ds-body-m ds-section-lead-gap max-w-[724px] text-[var(--color-text-default)]">
            Trabajamos con una metodología basada en técnica, lectura de mar y conexión con tu propio cuerpo. El
            objetivo es simple: que avances con confianza y consistencia, sesión tras sesión.
          </p>
          <p className="ds-body-m mt-5 max-w-[724px] text-[var(--color-text-default)]">
            Más allá de las clases, en SP se viven experiencias. SurfCamps diseñados para entrenar, compartir
            procesos y conectar con personas que están en el mismo camino que tú.
          </p>
          <button className="ds-btn ds-btn-primary ds-btn-lg mt-8">Conoce más</button>
        </RevealGroup>
        <Reveal>
          <div className="relative h-[420px] overflow-hidden rounded-[24px] sm:h-[470px] lg:h-[707px] lg:rounded-[40px]">
            <Image src="/photos/home1.jpg" alt="SP Surf Coach team" fill className="object-cover" />
            <div className="absolute inset-0 rounded-[24px] bg-[rgba(0,17,22,0.4)] lg:rounded-[40px]" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
