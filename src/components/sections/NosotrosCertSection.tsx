import Image from "next/image";
import { RevealGroup } from "@/components/animations/Reveal";

const MAP_CERT_IMAGE_SRC = `/photos/${encodeURIComponent("Diseño sin título (12).png")}`;

export function NosotrosCertSection() {
  return (
    <section className="bg-[var(--color-background-default)] px-4 py-6 sm:px-6 md:px-10 lg:px-16">
      <div>
        <RevealGroup className="flex flex-col gap-5 rounded-[24px] bg-white p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6 lg:rounded-[28px]">
          {/* Logo / cert image */}
          <div className="relative mx-auto size-[116px] shrink-0 overflow-hidden rounded-[14px] sm:mx-0 sm:size-[128px]">
            <Image
              src={MAP_CERT_IMAGE_SRC}
              alt="Certificación MAP Técnica"
              fill
              className="object-cover"
            />
          </div>

          {/* Text */}
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="ds-body-m font-bold text-black">Certificación MAP Técnica</p>
            <p className="ds-body-s mt-2 leading-[1.75] text-black/80">
              MAP es una metodología de entrenamiento de surf basada en la ciencia de la biomecánica, que analiza los
              movimientos que se emplean en el surf y lo convierte en un sistema claro, entrenable y repetible.
            </p>
            <p className="ds-body-s mt-2 leading-[1.75] text-black/80">
              Surfskate, sesiones en el mar y video análisis permiten identificar errores con precisión y corregirlos de
              forma consciente, acelerando el proceso de aprendizaje.
            </p>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
