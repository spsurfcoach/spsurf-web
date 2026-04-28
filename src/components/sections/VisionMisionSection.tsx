import Image from "next/image";
import { Reveal, RevealGroup } from "@/components/animations/Reveal";

export function VisionMisionSection() {
  return (
    <section className="bg-[var(--color-background-default)] px-4 py-14 sm:px-6 md:px-10 lg:px-16 lg:py-20">
      {/* Divider line */}
      <Reveal className="mb-14">
        <div className="h-px w-full bg-zinc-200" />
      </Reveal>

      <div className="flex flex-col gap-12 lg:gap-16">
        {/* Misión — text left, image right */}
        <RevealGroup className="flex flex-col gap-6 md:flex-row-reverse md:items-center md:gap-10 lg:gap-16">
          <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-[24px] md:w-[40%] lg:rounded-[32px]">
            <Image
              src="/photos/nosotros_mision.jpg"
              alt="Misión SP Surf Coach"
              fill
              className="object-cover"
            />
          </div>
          <div className="md:w-1/2">
            <p className="ds-label text-[var(--color-label-muted)] tracking-[2.73px]">MISIÓN</p>
            <p className="ds-display-title mt-4 text-black">
              Crear una comunidad de surfistas que evolucionen no solo en su nivel de surf, sino también en su relación con el mar, el cuerpo y la vida, a través de experiencias de coaching y viajes transformadores.
            </p>
          </div>
        </RevealGroup>

        {/* Visión — image left, text right */}
        <RevealGroup className="flex flex-col gap-6 md:flex-row md:items-center md:gap-10 lg:gap-16">
          <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-[24px] md:w-[40%] lg:rounded-[32px]">
            <Image
              src="/photos/DSC_4433.jpg"
              alt="Visión SP Surf Coach"
              fill
              className="object-cover"
            />
          </div>
          <div className="md:w-1/2">
            <p className="ds-label text-[var(--color-label-muted)] tracking-[2.73px]">VISIÓN</p>
            <p className="ds-display-title mt-4 text-black">
              Acompañar a cada surfista en su proceso de crecimiento, combinando técnica, conexión con el océano y confianza personal para que puedan surfear mejor, con más fluidez y disfrute.
            </p>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
