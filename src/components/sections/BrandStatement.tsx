import Image from "next/image";

export function BrandStatement() {
  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-6 md:px-10 md:py-16 lg:px-16">
      {/* Decorative gradient ellipses */}
      <div className="deco-ellipse -left-[123px] top-[16px] h-[700px] w-[700px] bg-[radial-gradient(circle,rgba(24,212,213,0.15),transparent)] hidden lg:block" />
      <div className="deco-ellipse left-[586px] top-[304px] h-[700px] w-[700px] bg-[radial-gradient(circle,rgba(24,212,213,0.1),transparent)] hidden lg:block" />
      <div className="deco-ellipse left-[1038px] top-[310px] h-[700px] w-[700px] bg-[radial-gradient(circle,rgba(24,212,213,0.1),transparent)] hidden lg:block" />

      <div className="relative grid gap-10 lg:grid-cols-[1fr_456px] lg:items-start">
        <div>
          <p className="ds-label text-[var(--color-label-muted)]">SP SURF COACH</p>
          <p className="ds-h2 mt-4 max-w-[724px] leading-[1.75] tracking-[-0.04em] lg:leading-[56px]">
            SP es un espacio para surfistas que quieren mejorar de verdad. Con una metodología clara, técnica, lectura de mar y correcciones precisas, avanzas con confianza y con guía constante.
          </p>
          <p className="ds-h2 mt-6 max-w-[724px] leading-[1.75] tracking-[-0.04em] lg:leading-[56px]">
            Además de las clases, aquí vives experiencias: surftrips pensados para entrenar, surfear mejor y compartir el proceso con gente que está en la misma energía que tú.
          </p>
          <button className="ds-btn ds-btn-primary ds-btn-lg mt-8">Conoce más</button>
        </div>
        <div className="relative h-[420px] overflow-hidden rounded-[24px] sm:h-[470px] lg:h-[707px] lg:rounded-[40px]">
          <Image src="/photos/home1.jpg" alt="SP Surf Coach team" fill className="object-cover" />
          <div className="absolute inset-0 rounded-[24px] bg-[rgba(0,17,22,0.4)] lg:rounded-[40px]" />
          {/* Play button */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90">
              <svg className="ml-1 h-6 w-6 text-[var(--color-primary-900)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
