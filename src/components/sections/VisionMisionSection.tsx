import Image from "next/image";

export function VisionMisionSection() {
  return (
    <section className="bg-[var(--color-background-default)] px-4 py-14 sm:px-6 md:px-10 lg:px-16 lg:py-20">
      <div className="container-site">
        {/* Divider line */}
        <div className="mb-14 h-px w-full bg-zinc-200" />

        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left — Visión */}
          <div>
            <p className="ds-label text-[var(--color-label-muted)] tracking-[2.73px]">
              VISIÓN
            </p>
            <p className="ds-display-title mt-4 text-black">
              Acompañar a cada surfista en su proceso de crecimiento, combinando técnica, conexión con el océano y confianza personal para que puedan surfear mejor, con más fluidez y disfrute.
            </p>
            <div className="relative mt-10 h-[280px] overflow-hidden rounded-[30px] sm:h-[360px]">
              <Image
                src="/photos/nosotros_vision.jpg"
                alt="Visión SP Surf Coach"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right — Misión (staggered down on desktop) */}
          <div className="lg:mt-[320px]">
            <p className="ds-label text-[var(--color-label-muted)] tracking-[2.73px]">
              MISIÓN
            </p>
            <p className="ds-display-title mt-4 text-black">
              Crear una comunidad de surfistas que evolucionen no solo en su nivel de surf, sino también en su relación con el mar, el cuerpo y la vida, a través de experiencias de coaching y viajes transformadores.
            </p>
            <div className="relative mt-10 h-[280px] overflow-hidden rounded-[40px] sm:h-[360px]">
              <Image
                src="/photos/nosotros_mision.jpg"
                alt="Misión SP Surf Coach"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
