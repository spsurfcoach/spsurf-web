import Image from "next/image";
import { Reveal, RevealGroup } from "@/components/animations/Reveal";

export function SurftripsForMeSection() {
  return (
    <section className="bg-[var(--color-background-default)] px-4 py-14 sm:px-6 md:px-10 lg:px-16 lg:py-20">
      <div className="grid gap-10 lg:grid-cols-[1fr_min(480px,46vw)] lg:items-start lg:gap-12">
        <RevealGroup>
          <p className="ds-label text-[var(--color-label-muted)] tracking-[2.73px]">
            COMO SABER SI ESTOS SURFCAMPS SON PARA MI
          </p>
          <div className="mt-6 max-w-[659px] space-y-6">
            <p className="ds-h2 tracking-[-0.04em] text-black leading-[1.53]">
              Estos Surfcamps son para ti si buscas mejorar tu surfing viviendo una experiencia única y real, con guía
              constante, un enfoque claro en tu progreso, conexionarme real con el deporte y recuerdos que duraran
              toda la vida.
            </p>
            <p className="ds-h2 tracking-[-0.04em] text-black leading-[1.53]">
              Si te motiva viajar, entrenar, compartir en comunidad y conectar con el mar, entonces si: este
              Surfcamp es para ti
            </p>
          </div>
        </RevealGroup>
        <Reveal>
          <div className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[24px] sm:max-w-2xl lg:mx-0 lg:ml-auto lg:max-w-none lg:rounded-[40px]">
            <Image src="/photos/DSC_7944%20(1).jpg" alt="Surfcamp SP Surf Coach" fill className="object-cover" sizes="(min-width: 1024px) 46vw, (min-width: 640px) 42rem, 100vw" />
            <div className="absolute inset-0 rounded-[24px] bg-[rgba(0,17,22,0.28)] lg:rounded-[40px]" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
