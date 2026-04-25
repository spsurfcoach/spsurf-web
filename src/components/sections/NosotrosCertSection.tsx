import Image from "next/image";
import { RevealGroup } from "@/components/animations/Reveal";

const MAP_CERT_IMAGE_SRC = `/photos/${encodeURIComponent("Diseño sin título (12).png")}`;

export function NosotrosCertSection() {
  return (
    <section className="bg-[var(--color-background-default)] px-4 py-6 sm:px-6 md:px-10 lg:px-16">
        <RevealGroup className="flex flex-col gap-8 rounded-[30px] bg-white p-8 lg:flex-row lg:items-start lg:p-12">
          {/* Logo / cert image */}
          <div className="relative size-[160px] shrink-0 overflow-hidden rounded-[16px] lg:size-[204px]">
            <Image
              src={MAP_CERT_IMAGE_SRC}
              alt="Certificación MAP Técnica"
              fill
              className="object-cover"
            />
          </div>

          {/* Text */}
          <div className="flex-1">
            <p className="ds-body-s font-bold text-black">Certificación MAP Técnica</p>
            <p className="ds-body-s mt-3 leading-[1.8] text-black/80">
              MAP es una metodología de entrenamiento de surf basada en la ciencia de la biomecánica, que analiza los
              movimientos que se emplean en el surf y lo convierte en un sistema claro, entrenable y repetible.
            </p>
            <p className="ds-body-s mt-3 leading-[1.8] text-black/80">
              A través de entrenamiento en tierra, surfskate, sesiones en el mar y video análisis, permite identificar
              errores con precisión y corregirlos de forma consciente, acelerando el proceso de aprendizaje.
            </p>
          </div>
        </RevealGroup>
    </section>
  );
}
