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
              Las clases individuales permiten un trabajo totalmente personalizado, ideal para quienes buscan progresar rápido, corregir detalles técnicos y enfocarse en objetivos específicos. Las clases grupales, en cambio, combinan aprendizaje, motivación y comunidad, manteniendo siempre un ratio reducido para asegurar atención real de nuestros coaches.
            </p>
          </div>
        </RevealGroup>
    </section>
  );
}
